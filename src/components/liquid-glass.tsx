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
  ior = 1.2, // controls edge distortion
  chromaticAberration = 0,
  color = new THREE.Color(1, 1, 1),
  backside = true,
  animate,
}: LiquidGlassProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  // Animation state
  const animationState = useRef({
    targetScale: 1,
    currentScale: 1,
    velocity: 0,
    isAnimating: false,
    isPressed: false,
  })

  // Elastic spring animation using useFrame
  useFrame((state, delta) => {
    if (!meshRef.current) return

    const { targetScale, currentScale, velocity } = animationState.current

    // Spring physics parameters
    const springStrength = 15 // How strong the spring force is
    const damping = 0.7 // How much to dampen the oscillation
    const threshold = 0.001 // When to stop animating

    // Calculate spring force
    const displacement = targetScale - currentScale
    const springForce = displacement * springStrength

    // Update velocity with spring force and damping
    animationState.current.velocity = (velocity + springForce * delta) * damping

    // Update current scale
    animationState.current.currentScale =
      currentScale + animationState.current.velocity * delta * 50

    // Debug logging
    console.log("Animation state:", {
      targetScale,
      currentScale: animationState.current.currentScale,
      velocity: animationState.current.velocity,
      displacement,
      springForce,
    })

    // Check if we should stop animating
    if (
      Math.abs(displacement) < threshold &&
      Math.abs(animationState.current.velocity) < threshold
    ) {
      animationState.current.currentScale = targetScale
      animationState.current.velocity = 0
      animationState.current.isAnimating = false
      console.log("Animation stopped")
    }

    // Apply the scale to the mesh
    meshRef.current.scale.setScalar(animationState.current.currentScale)
    console.log("Applied scale:", meshRef.current.scale.x)
  })

  const handlePointerEnter = () => {
    console.log("Pointer entered - setting target scale to 1.2")
    setHovered(true)
    if (!animationState.current.isPressed) {
      animationState.current.targetScale = 1.2
      animationState.current.isAnimating = true
    }
  }

  const handlePointerLeave = () => {
    console.log("Pointer left - setting target scale to 1")
    setHovered(false)
    if (!animationState.current.isPressed) {
      animationState.current.targetScale = 1
      animationState.current.isAnimating = true
    }
  }

  const handlePointerDown = () => {
    console.log("Pointer down - setting target scale to 1.0")
    animationState.current.isPressed = true
    animationState.current.targetScale = 1.1
    animationState.current.isAnimating = true
  }

  const handlePointerUp = () => {
    console.log("Pointer up - restoring scale")
    animationState.current.isPressed = false
    // Return to hover state if still hovering, otherwise return to normal
    animationState.current.targetScale = hovered ? 1.2 : 1
    animationState.current.isAnimating = true
  }

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

    // Number of segments for each rounded corner
    const cornerSegments = 30

    const s = new THREE.Shape()

    // Helper function to create segmented quadratic curve
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

        // Quadratic Bezier formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
        const px = invT2 * startX + 2 * invT * t * controlX + t2 * endX
        const py = invT2 * startY + 2 * invT * t * controlY + t2 * endY

        if (i === 0) {
          s.lineTo(px, py)
        } else {
          s.lineTo(px, py)
        }
      }
    }

    // Start position
    s.moveTo(x, y + r)

    // Left edge
    s.lineTo(x, y + height - r)

    // Top-left corner
    addSegmentedQuadraticCurve(
      x,
      y + height - r, // start point
      x,
      y + height, // control point
      x + r,
      y + height // end point
    )

    // Top edge
    s.lineTo(x + width - r, y + height)

    // Top-right corner
    addSegmentedQuadraticCurve(
      x + width - r,
      y + height, // start point
      x + width,
      y + height, // control point
      x + width,
      y + height - r // end point
    )

    // Right edge
    s.lineTo(x + width, y + r)

    // Bottom-right corner
    addSegmentedQuadraticCurve(
      x + width,
      y + r, // start point
      x + width,
      y, // control point
      x + width - r,
      y // end point
    )

    // Bottom edge
    s.lineTo(x + r, y)

    // Bottom-left corner
    addSegmentedQuadraticCurve(
      x + r,
      y, // start point
      x,
      y, // control point
      x,
      y + r // end point
    )

    s.closePath()

    return s
  }, [width, height, borderRadius])

  const extrudeSettings = useMemo(
    () => ({
      ...extrudeControls,
    }),
    [extrudeControls]
  )

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
