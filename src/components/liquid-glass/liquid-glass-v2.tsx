import { MeshTransmissionMaterial } from "@react-three/drei"
import { useMemo, useRef, useState, useEffect, useCallback } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

// * TYPES
interface LiquidGlassProps {
  width?: number
  height?: number
  borderRadius?: number
  position?: [number, number, number]

  transmission?: number
  roughness?: number
  ior?: number
  chromaticAberration?: number
  color?: string | THREE.Color
  thickness?: number

  whileHover?: AnimationValues
  whileTap?: AnimationValues
  whileActive?: AnimationValues
  whileDisabled?: AnimationValues

  active?: boolean
  disabled?: boolean

  onClick?: () => void
  onToggle?: (active: boolean) => void
  onHoverStart?: () => void
  onHoverEnd?: () => void
  onTapStart?: () => void
  onTapEnd?: () => void

  // Spring animation settings
  springStrength?: number
  damping?: number
  animationThreshold?: number

  extrudeSettings?: {
    depth?: number
    bevelEnabled?: boolean
    bevelThickness?: number
    bevelSize?: number
    bevelSegments?: number
  }

  "aria-label"?: string
  tabIndex?: number
}

interface AnimationValues {
  x?: number
  y?: number
  z?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  scaleZ?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  opacity?: number
}

const DEFAULT_PROPS = {
  width: 1,
  height: 1,
  borderRadius: 0.05,
  position: [0, 0, 0] as [number, number, number],
  transmission: 1,
  roughness: 0,
  ior: 1.3,
  chromaticAberration: 0,
  color: new THREE.Color(1, 1, 1),
  thickness: 0.35,
  springStrength: 15,
  damping: 0.7,
  animationThreshold: 0.001,
  extrudeSettings: {
    depth: 0,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.02,
    bevelSegments: 80,
  },
}

const DEFAULT_ANIMATIONS = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  whileActive: { scale: 1.1 },
  whileDisabled: { scale: 0.9, opacity: 0.5 },
}

function parseColor(color: string | THREE.Color): THREE.Color {
  if (color instanceof THREE.Color) return color
  return new THREE.Color(color)
}

export default function LiquidGlassV2({
  width = DEFAULT_PROPS.width,
  height = DEFAULT_PROPS.height,
  borderRadius = DEFAULT_PROPS.borderRadius,
  position = DEFAULT_PROPS.position,

  transmission = DEFAULT_PROPS.transmission,
  roughness = DEFAULT_PROPS.roughness,
  ior = DEFAULT_PROPS.ior,
  chromaticAberration = DEFAULT_PROPS.chromaticAberration,
  color = DEFAULT_PROPS.color,
  thickness = DEFAULT_PROPS.thickness,

  whileHover,
  whileTap,
  whileActive,
  whileDisabled,

  active = false,
  disabled = false,

  onClick,
  onToggle,
  onHoverStart,
  onHoverEnd,
  onTapStart,
  onTapEnd,

  springStrength = DEFAULT_PROPS.springStrength,
  damping = DEFAULT_PROPS.damping,
  animationThreshold = DEFAULT_PROPS.animationThreshold,

  extrudeSettings = DEFAULT_PROPS.extrudeSettings,

  "aria-label": ariaLabel,
  tabIndex = 0,
}: LiquidGlassProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // Simplified animation state using spring physics from v1
  const animationState = useRef({
    // Current values
    currentScale: 1,
    currentPosition: [...position] as [number, number, number],
    currentRotation: [0, 0, 0] as [number, number, number],
    currentOpacity: 1,

    // Target values
    targetScale: 1,
    targetPosition: [...position] as [number, number, number],
    targetRotation: [0, 0, 0] as [number, number, number],
    targetOpacity: 1,

    // Velocities for spring physics
    scaleVelocity: 0,
    positionVelocity: [0, 0, 0] as [number, number, number],
    rotationVelocity: [0, 0, 0] as [number, number, number],
    opacityVelocity: 0,

    // Base position for relative animations
    basePosition: [...position] as [number, number, number],
  })

  // * GEOMETRY (same as before)
  const shape = useMemo(() => {
    const x = -width / 2
    const y = -height / 2
    const r = Math.min(borderRadius, width / 2, height / 2)

    const cornerSegments = 50
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

  // Get current animation based on state
  const getCurrentAnimation = useCallback((): AnimationValues => {
    if (disabled) {
      return whileDisabled || DEFAULT_ANIMATIONS.whileDisabled
    }
    if (isPressed) {
      return whileTap || DEFAULT_ANIMATIONS.whileTap
    }
    if (isHovered) {
      return whileHover || DEFAULT_ANIMATIONS.whileHover
    }
    if (active) {
      return whileActive || DEFAULT_ANIMATIONS.whileActive
    }
    return {}
  }, [
    disabled,
    isPressed,
    isHovered,
    active,
    whileDisabled,
    whileTap,
    whileHover,
    whileActive,
  ])

  // Apply animation targets
  const applyAnimation = useCallback((animation: AnimationValues) => {
    const state = animationState.current

    // Set targets
    state.targetScale = animation.scale ?? 1
    state.targetPosition = [
      animation.x ?? state.basePosition[0],
      animation.y ?? state.basePosition[1],
      animation.z ?? state.basePosition[2],
    ]
    state.targetRotation = [
      animation.rotateX ?? 0,
      animation.rotateY ?? 0,
      animation.rotateZ ?? 0,
    ]
    state.targetOpacity = animation.opacity ?? 1
  }, [])

  // Update animation when state changes
  useEffect(() => {
    const currentAnimation = getCurrentAnimation()
    applyAnimation(currentAnimation)
  }, [getCurrentAnimation, applyAnimation])

  // Spring animation frame loop (simplified from v1)
  useFrame((_, delta) => {
    if (!meshRef.current) return

    const state = animationState.current

    // Spring physics for scale
    const scaleDisplacement = state.targetScale - state.currentScale
    const scaleSpringForce = scaleDisplacement * springStrength
    state.scaleVelocity =
      (state.scaleVelocity + scaleSpringForce * delta) * damping
    state.currentScale += state.scaleVelocity * delta * 50

    // Spring physics for position
    for (let i = 0; i < 3; i++) {
      const positionDisplacement =
        state.targetPosition[i] - state.currentPosition[i]
      const positionSpringForce = positionDisplacement * springStrength
      state.positionVelocity[i] =
        (state.positionVelocity[i] + positionSpringForce * delta) * damping
      state.currentPosition[i] += state.positionVelocity[i] * delta * 50
    }

    // Spring physics for rotation
    for (let i = 0; i < 3; i++) {
      const rotationDisplacement =
        state.targetRotation[i] - state.currentRotation[i]
      const rotationSpringForce = rotationDisplacement * springStrength
      state.rotationVelocity[i] =
        (state.rotationVelocity[i] + rotationSpringForce * delta) * damping
      state.currentRotation[i] += state.rotationVelocity[i] * delta * 50
    }

    // Spring physics for opacity
    const opacityDisplacement = state.targetOpacity - state.currentOpacity
    const opacitySpringForce = opacityDisplacement * springStrength
    state.opacityVelocity =
      (state.opacityVelocity + opacitySpringForce * delta) * damping
    state.currentOpacity += state.opacityVelocity * delta * 50

    // Stop small movements
    if (
      Math.abs(scaleDisplacement) < animationThreshold &&
      Math.abs(state.scaleVelocity) < animationThreshold
    ) {
      state.currentScale = state.targetScale
      state.scaleVelocity = 0
    }

    // Apply transformations
    meshRef.current.scale.setScalar(state.currentScale)
    meshRef.current.position.set(...state.currentPosition)
    meshRef.current.rotation.set(...state.currentRotation)

    if (meshRef.current.material && "opacity" in meshRef.current.material) {
      meshRef.current.material.opacity = state.currentOpacity
      meshRef.current.material.transparent = state.currentOpacity < 1
    }
  })

  // * EVENT HANDLERS
  const handlePointerEnter = useCallback(() => {
    if (disabled) return
    setIsHovered(true)
    onHoverStart?.()
  }, [disabled, onHoverStart])

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false)
    onHoverEnd?.()
  }, [onHoverEnd])

  const handlePointerDown = useCallback(() => {
    if (disabled) return
    setIsPressed(true)
    onTapStart?.()
  }, [disabled, onTapStart])

  const handlePointerUp = useCallback(() => {
    if (disabled) return
    setIsPressed(false)
    onTapEnd?.()

    if (onClick) {
      onClick()
    }

    if (onToggle) {
      onToggle(!active)
    }
  }, [disabled, onTapEnd, onClick, onToggle, active])

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      aria-label={ariaLabel}
      receiveShadow
      castShadow
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <MeshTransmissionMaterial
        transmission={transmission}
        roughness={roughness}
        ior={ior}
        chromaticAberration={chromaticAberration}
        thickness={thickness}
        background={parseColor(color)}
      />
    </mesh>
  )
}
