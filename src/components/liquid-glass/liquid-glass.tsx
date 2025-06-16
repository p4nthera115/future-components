import { MeshTransmissionMaterial } from "@react-three/drei"
import { LevaInputs, useControls } from "leva"
import { useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

// Enhanced animation configuration types
interface AnimationConfig {
  scale?: number
  position?: [number, number, number]
  duration?: number
  easing?: "spring" | "linear" | "ease-in" | "ease-out"
  springStrength?: number
  damping?: number
}

interface AnimateProps {
  click?: {
    onPointerDown?: AnimationConfig
    onPointerUp?: AnimationConfig
    callback?: () => void
  }
  hover?: {
    onPointerEnter?: AnimationConfig
    onPointerLeave?: AnimationConfig
    callback?: () => void
  }
  // For future use - continuous animations
  position?: {
    enabled?: boolean
    path?: [number, number, number][]
    speed?: number
    loop?: boolean
  }
  scale?: {
    enabled?: boolean
    min?: number
    max?: number
    speed?: number
  }
}

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
  // Animation global settings
  springStrength?: number
  damping?: number
  animationThreshold?: number
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
  springStrength = 15,
  damping = 0.7,
  animationThreshold = 0.001,
}: LiquidGlassProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  // * GEOMETRY
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

  const extrudeControls = useControls("extrude", {
    steps: { value: 2, min: 1, max: 10, step: 1 },
    depth: { value: 0, min: 0, max: 1, step: 0.01 },
    bevelEnabled: { value: true, type: LevaInputs.BOOLEAN },
    bevelThickness: { value: 0.02, min: 0, max: 1, step: 0.01 },
    bevelSize: { value: 0.04, min: 0, max: 1, step: 0.01 },
    bevelOffset: { value: 0, min: 0, max: 1, step: 0.01 },
    bevelSegments: { value: 57, min: 1, max: 100, step: 1 },
  })

  const extrudeSettings = useMemo(
    () => ({ ...extrudeControls }),
    [extrudeControls]
  )

  // * MATERIAL
  const materialProps = useControls("transmission", {
    thickness: { value: 0.35, min: 0, max: 3, step: 0.05 },
  })

  // * ANIMATIONS
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
    basePosition: [position[0], position[1], position[2]] as [
      number,
      number,
      number
    ], // Store original position
    isPressed: false,
    isHovered: false,
  })

  // Helper function to apply animation config
  const applyAnimationConfig = (
    config: AnimationConfig,
    baseScale: number = 1,
    basePos?: [number, number, number]
  ) => {
    const state = animationState.current

    if (config.scale !== undefined) {
      state.targetScale = config.scale
    }

    if (config.position !== undefined) {
      // Apply position relative to base position
      const base = basePos || state.basePosition
      state.targetPosition = [
        base[0] + config.position[0],
        base[1] + config.position[1],
        base[2] + config.position[2],
      ]
    }
  }

  // Enhanced spring animation with configurable parameters
  useFrame((state, delta) => {
    if (!meshRef.current) return

    const state_ = animationState.current

    // Use props or default values
    const currentSpringStrength = springStrength
    const currentDamping = damping
    const threshold = animationThreshold

    // Calculate forces for scale
    const scaleDisplacement = state_.targetScale - state_.currentScale
    const scaleSpringForce = scaleDisplacement * currentSpringStrength

    // Calculate forces for position (X, Y, Z)
    const positionDisplacement = [
      state_.targetPosition[0] - state_.currentPosition[0],
      state_.targetPosition[1] - state_.currentPosition[1],
      state_.targetPosition[2] - state_.currentPosition[2],
    ]
    const positionSpringForce = positionDisplacement.map(
      (d) => d * currentSpringStrength
    )

    // Update velocities separately
    state_.scaleVelocity =
      (state_.scaleVelocity + scaleSpringForce * delta) * currentDamping

    // Update position velocity for each axis
    for (let i = 0; i < 3; i++) {
      state_.positionVelocity[i] =
        (state_.positionVelocity[i] + positionSpringForce[i] * delta) *
        currentDamping
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
  })

  // Enhanced event handlers with configurable animations
  const handlePointerEnter = () => {
    setHovered(true)
    animationState.current.isHovered = true

    if (!animationState.current.isPressed) {
      if (animate?.hover?.onPointerEnter) {
        applyAnimationConfig(animate.hover.onPointerEnter)
      } else {
        // Default hover animation
        animationState.current.targetScale = 1.2
      }

      // Execute callback if provided
      animate?.hover?.callback?.()
    }
  }

  const handlePointerLeave = () => {
    setHovered(false)
    animationState.current.isHovered = false

    if (!animationState.current.isPressed) {
      if (animate?.hover?.onPointerLeave) {
        applyAnimationConfig(animate.hover.onPointerLeave)
      } else {
        // Default return to normal
        animationState.current.targetScale = 1
        animationState.current.targetPosition = [
          ...animationState.current.basePosition,
        ]
      }
    }
  }

  const handlePointerDown = () => {
    animationState.current.isPressed = true

    if (animate?.click?.onPointerDown) {
      applyAnimationConfig(animate.click.onPointerDown)
    } else {
      // Default press animation
      animationState.current.targetPosition[2] = position[2] - 0.1
    }

    // Execute callback if provided
    animate?.click?.callback?.()
  }

  const handlePointerUp = () => {
    animationState.current.isPressed = false

    if (animate?.click?.onPointerUp) {
      applyAnimationConfig(animate.click.onPointerUp)
    } else {
      // Default return animation
      if (animationState.current.isHovered && animate?.hover?.onPointerEnter) {
        // Return to hover state
        applyAnimationConfig(animate.hover.onPointerEnter)
      } else if (animationState.current.isHovered) {
        // Default hover state
        animationState.current.targetScale = 1.2
        animationState.current.targetPosition = [
          ...animationState.current.basePosition,
        ]
      } else {
        // Return to normal
        animationState.current.targetScale = 1
        animationState.current.targetPosition = [
          ...animationState.current.basePosition,
        ]
      }
    }
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
