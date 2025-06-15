import { MeshTransmissionMaterial } from "@react-three/drei"
import { LevaInputs, useControls } from "leva"
import { useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

interface LiquidGlassProps {
  height: number
  width: number
  borderRadius: number
  position: [number, number, number]
  transmission?: number
  roughness?: number
  ior?: number
  chromaticAberration?: number
  color?: THREE.Color
  backside?: boolean
  animate?: AnimateProps
}

interface AnimateProps {
  click?: () => void
  hover?: () => void
  position?: () => void
  scale?: () => void
  height?: () => void
  width?: () => void
}

export default function LiquidGlass({
  height,
  width,
  borderRadius,
  position,
  transmission = 1,
  roughness = 0,
  ior = 1.2,
  chromaticAberration = 0,
  color = new THREE.Color(1, 1, 1),
  backside = true,
  animate,
}: LiquidGlassProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  const extrudeControls = useControls("extrude", {
    steps: { value: 2, min: 1, max: 10, step: 1 },
    depth: { value: 0, min: 0, max: 1, step: 0.01 },
    bevelEnabled: { value: true, type: LevaInputs.BOOLEAN },
    bevelThickness: { value: 0.02, min: 0, max: 1, step: 0.01 },
    bevelSize: { value: 0.02, min: 0, max: 1, step: 0.01 },
    bevelOffset: { value: 0, min: 0, max: 1, step: 0.01 },
    bevelSegments: { value: 57, min: 1, max: 100, step: 1 },
  })

  const materialProps = useControls("transmission", {
    thickness: { value: 0.35, min: 0, max: 3, step: 0.05 },
  })

  const shape = useMemo(() => {
    const x = -width / 2
    const y = -height / 2
    const r = Math.min(borderRadius, width / 2, height / 2)

    const cornerSegments = 30

    const s = new THREE.Shape()

    const addSegmentedQuadraticCurve = (
      startX: number,
      startY: number,
      controlX: number,
      controlY: number,
      endX: number,
      endY: number
    ) => {
      for (let i = 0; i <= cornerSegments; i++) {
        const t = i / cornerSegments
        const t2 = t * t
        const invT = 1 - t
        const invT2 = invT * invT

        const px = invT2 * startX + 2 * invT * t * controlX + t2 * endX
        const py = invT2 * startY + 2 * invT * t * controlY + t2 * endY

        if (i === 0) {
          s.lineTo(px, py)
        } else {
          s.lineTo(px, py)
        }
      }
    }

    s.moveTo(x, y + r)
    s.lineTo(x, y + height - r)

    addSegmentedQuadraticCurve(
      x,
      y + height - r,
      x,
      y + height,
      x + r,
      y + height
    )

    s.lineTo(x + width - r, y + height)

    addSegmentedQuadraticCurve(
      x + width - r,
      y + height,
      x + width,
      y + height,
      x + width,
      y + height - r
    )

    s.lineTo(x + width, y + r)

    addSegmentedQuadraticCurve(x + width, y + r, x + width, y, x + width - r, y)

    s.lineTo(x + r, y)

    addSegmentedQuadraticCurve(x + r, y, x, y, x, y + r)

    s.closePath()

    return s
  }, [width, height, borderRadius])

  const extrudeSettings = useMemo(
    () => ({
      ...extrudeControls,
    }),
    [extrudeControls]
  )

  // Fixed animation state with separate velocities
  const animationState = useRef({
    targetScale: 1,
    currentScale: 1,
    scaleVelocity: 0,
    targetPosition: [position[0], position[1], position[2]] as [
      number,
      number,
      number
    ],
    currentPosition: [position[0], position[1], position[2]] as [
      number,
      number,
      number
    ],
    positionVelocity: [0, 0, 0] as [number, number, number],
    isPressed: false,
  })

  // Fixed spring animation
  useFrame((state, delta) => {
    if (!meshRef.current) return

    const state_ = animationState.current

    // Spring physics parameters
    const springStrength = 15
    const damping = 0.7
    const threshold = 0.001

    // Calculate forces for scale
    const scaleDisplacement = state_.targetScale - state_.currentScale
    const scaleSpringForce = scaleDisplacement * springStrength

    // Calculate forces for position (X, Y, Z)
    const positionDisplacement = [
      state_.targetPosition[0] - state_.currentPosition[0],
      state_.targetPosition[1] - state_.currentPosition[1],
      state_.targetPosition[2] - state_.currentPosition[2],
    ]
    const positionSpringForce = positionDisplacement.map(
      (d) => d * springStrength
    )

    // Update velocities separately
    state_.scaleVelocity =
      (state_.scaleVelocity + scaleSpringForce * delta) * damping

    // Update position velocity for each axis
    for (let i = 0; i < 3; i++) {
      state_.positionVelocity[i] =
        (state_.positionVelocity[i] + positionSpringForce[i] * delta) * damping
    }

    // Update current values
    state_.currentScale += state_.scaleVelocity * delta * 50

    // Update position for each axis
    for (let i = 0; i < 3; i++) {
      state_.currentPosition[i] += state_.positionVelocity[i] * delta * 50
    }

    // Check if animations should stop
    const scaleAnimating =
      Math.abs(scaleDisplacement) > threshold ||
      Math.abs(state_.scaleVelocity) > threshold
    const positionAnimating = positionDisplacement.some(
      (d, i) =>
        Math.abs(d) > threshold ||
        Math.abs(state_.positionVelocity[i]) > threshold
    )

    // Stop animations when they reach threshold
    if (!scaleAnimating) {
      state_.currentScale = state_.targetScale
      state_.scaleVelocity = 0
    }

    if (!positionAnimating) {
      state_.currentPosition = [...state_.targetPosition]
      state_.positionVelocity = [0, 0, 0]
    }

    // Apply transformations
    meshRef.current.scale.setScalar(state_.currentScale)
    meshRef.current.position.set(
      state_.currentPosition[0],
      state_.currentPosition[1],
      state_.currentPosition[2]
    )

    // Only log when actually animating (optional - remove if you don't want any logs)
    if (scaleAnimating || positionAnimating) {
      console.log("Animating:", {
        scale: state_.currentScale.toFixed(3),
        position: state_.currentPosition.map((p) => p.toFixed(3)),
      })
    }
  })

  const handlePointerEnter = () => {
    setHovered(true)
    if (!animationState.current.isPressed) {
      animationState.current.targetScale = 1.2
    }
  }

  const handlePointerLeave = () => {
    setHovered(false)
    if (!animationState.current.isPressed) {
      animationState.current.targetScale = 1
    }
  }

  const handlePointerDown = () => {
    animationState.current.isPressed = true
    animationState.current.targetPosition = [0, 0, 0]
  }

  const handlePointerUp = () => {
    animationState.current.isPressed = false
    animationState.current.targetPosition = [0, 0, 0.1]
  }

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      receiveShadow
      castShadow
      position={position}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <MeshTransmissionMaterial
        {...materialProps}
        background={color}
        transmission={transmission}
        roughness={roughness}
        ior={ior}
        chromaticAberration={chromaticAberration}
        backside={backside}
      />
    </mesh>
  )
}
