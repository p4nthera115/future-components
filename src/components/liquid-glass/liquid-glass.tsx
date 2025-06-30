import { MeshTransmissionMaterial } from "@react-three/drei"
import { useMemo, useRef, useState, useEffect, useCallback } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

// * TYPES
interface LiquidGlassProps {
  width?: number
  height?: number
  borderRadius?: number
  borderSmoothness?: number
  position?: [number, number, number]

  transmission?: number
  roughness?: number
  ior?: number
  chromaticAberration?: number
  anisotropicBlur?: number
  blur?: number
  color?: string | THREE.Color
  thickness?: number
  wireframe?: boolean

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
  width?: number
  height?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  opacity?: number
}

const DEFAULT_PROPS = {
  width: 1,
  height: 1,
  borderRadius: 0.2,
  borderSmoothness: 30,
  position: [0, 0, 0] as [number, number, number],
  transmission: 1,
  roughness: 0,
  ior: 2.5,
  chromaticAberration: 0,
  anisotropicBlur: 0,
  blur: 1000,
  color: new THREE.Color(2, 2, 2),
  thickness: 0.35,
  wireframe: false,
  springStrength: 15,
  damping: 0.8,
  animationThreshold: 0.001,
  extrudeSettings: {
    depth: 0,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.05,
    bevelSegments: 57,
  },
}

const DEFAULT_ANIMATIONS = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 },
  whileActive: { scale: 1.1 },
  whileDisabled: { scale: 0.9, opacity: 0.5 },
}

function parseColor(color: string | THREE.Color): THREE.Color {
  if (color instanceof THREE.Color) return color
  return new THREE.Color(color)
}

// Improved rounded rectangle shape using the mathematical approach from the BufferGeometry code
function createRoundedRectangleShape(
  width: number,
  height: number,
  radius: number,
  smoothness: number
): THREE.Shape {
  // Clamp radius to prevent overlapping corners
  const maxRadius = Math.min(width / 2, height / 2)
  const r = Math.min(radius, maxRadius)

  // Helper constants (adapted from the BufferGeometry approach)
  const wi = width / 2 - r // inner width
  const hi = height / 2 - r // inner height
  const w2 = width / 2 // half width
  const h2 = height / 2 // half height

  const shape = new THREE.Shape()

  // Start from bottom-left corner of the inner rectangle
  shape.moveTo(-wi, -h2)

  // Bottom edge
  shape.lineTo(wi, -h2)

  // Bottom-right corner arc
  if (r > 0) {
    const centerX = wi
    const centerY = -hi
    // Arc from bottom to right (270° to 360°/0°)
    shape.absarc(centerX, centerY, r, -Math.PI / 2, 0, false)
  }

  // Right edge
  shape.lineTo(w2, hi)

  // Top-right corner arc
  if (r > 0) {
    const centerX = wi
    const centerY = hi
    // Arc from right to top (0° to 90°)
    shape.absarc(centerX, centerY, r, 0, Math.PI / 2, false)
  }

  // Top edge
  shape.lineTo(-wi, h2)

  // Top-left corner arc
  if (r > 0) {
    const centerX = -wi
    const centerY = hi
    // Arc from top to left (90° to 180°)
    shape.absarc(centerX, centerY, r, Math.PI / 2, Math.PI, false)
  }

  // Left edge
  shape.lineTo(-w2, -hi)

  // Bottom-left corner arc
  if (r > 0) {
    const centerX = -wi
    const centerY = -hi
    // Arc from left to bottom (180° to 270°)
    shape.absarc(centerX, centerY, r, Math.PI, (3 * Math.PI) / 2, false)
  }

  return shape
}

export default function LiquidGlass({
  width = DEFAULT_PROPS.width,
  height = DEFAULT_PROPS.height,
  borderRadius = DEFAULT_PROPS.borderRadius,
  borderSmoothness = DEFAULT_PROPS.borderSmoothness,
  position = DEFAULT_PROPS.position,

  transmission = DEFAULT_PROPS.transmission,
  roughness = DEFAULT_PROPS.roughness,
  ior = DEFAULT_PROPS.ior,
  chromaticAberration = DEFAULT_PROPS.chromaticAberration,
  anisotropicBlur = DEFAULT_PROPS.anisotropicBlur,
  blur = DEFAULT_PROPS.blur,
  color = DEFAULT_PROPS.color,
  thickness = DEFAULT_PROPS.thickness,
  wireframe = DEFAULT_PROPS.wireframe,

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

  // Enhanced animation state with width/height instead of scale
  const animationState = useRef({
    // Current values
    currentWidth: width,
    currentHeight: height,
    currentScaleZ: 1,
    currentPosition: [...position] as [number, number, number],
    currentRotation: [0, 0, 0] as [number, number, number],
    currentOpacity: 1,

    // Target values
    targetWidth: width,
    targetHeight: height,
    targetScaleZ: 1,
    targetPosition: [...position] as [number, number, number],
    targetRotation: [0, 0, 0] as [number, number, number],
    targetOpacity: 1,

    // Velocities for spring physics
    widthVelocity: 0,
    heightVelocity: 0,
    scaleZVelocity: 0,
    positionVelocity: [0, 0, 0] as [number, number, number],
    rotationVelocity: [0, 0, 0] as [number, number, number],
    opacityVelocity: 0,

    // Base values for calculations
    basePosition: [...position] as [number, number, number],
    baseWidth: width,
    baseHeight: height,
  })

  // Track if geometry needs to be updated
  const [geometryUpdateFlag, setGeometryUpdateFlag] = useState(0)

  // * GEOMETRY - Create shape for extrusion with dynamic dimensions
  const shape = useMemo(() => {
    const currentWidth = animationState.current?.currentWidth || width
    const currentHeight = animationState.current?.currentHeight || height

    return createRoundedRectangleShape(
      currentWidth,
      currentHeight,
      borderRadius,
      borderSmoothness
    )
  }, [width, height, borderRadius, borderSmoothness, geometryUpdateFlag])

  // Merge animations with proper priority
  const mergeAnimations = useCallback(
    (...animations: (AnimationValues | undefined)[]): AnimationValues => {
      const merged: AnimationValues = {}
      animations.filter(Boolean).forEach((animation) => {
        Object.assign(merged, animation)
      })
      return merged
    },
    []
  )

  // Get current animation based on state with proper layering
  const getCurrentAnimation = useCallback((): AnimationValues => {
    let baseAnimation: AnimationValues = {}

    if (active) {
      baseAnimation = whileActive || DEFAULT_ANIMATIONS.whileActive
    }

    if (disabled) {
      return mergeAnimations(
        baseAnimation,
        whileDisabled || DEFAULT_ANIMATIONS.whileDisabled
      )
    }

    if (isPressed) {
      return mergeAnimations(
        baseAnimation,
        whileTap || DEFAULT_ANIMATIONS.whileTap
      )
    }

    if (isHovered) {
      return mergeAnimations(
        baseAnimation,
        whileHover || DEFAULT_ANIMATIONS.whileHover
      )
    }

    return baseAnimation
  }, [
    disabled,
    isPressed,
    isHovered,
    active,
    whileDisabled,
    whileTap,
    whileHover,
    whileActive,
    mergeAnimations,
  ])

  // Apply animation targets with width/height instead of scale
  const applyAnimation = useCallback((animation: AnimationValues) => {
    const state = animationState.current

    let targetWidth = state.baseWidth
    let targetHeight = state.baseHeight
    let scaleZ = 1

    if (animation.width !== undefined) {
      targetWidth = animation.width
    }
    if (animation.height !== undefined) {
      targetHeight = animation.height
    }

    if (animation.scale !== undefined) {
      targetWidth = state.baseWidth * animation.scale
      targetHeight = state.baseHeight * animation.scale
      scaleZ = animation.scale
    }

    if (animation.scaleX !== undefined) {
      targetWidth = state.baseWidth * animation.scaleX
    }
    if (animation.scaleY !== undefined) {
      targetHeight = state.baseHeight * animation.scaleY
    }
    if (animation.scaleZ !== undefined) {
      scaleZ = animation.scaleZ
    }

    state.targetWidth = targetWidth
    state.targetHeight = targetHeight
    state.targetScaleZ = scaleZ

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
    animationState.current.basePosition = [...position]
    animationState.current.baseWidth = width
    animationState.current.baseHeight = height

    const currentAnimation = getCurrentAnimation()
    applyAnimation(currentAnimation)
  }, [getCurrentAnimation, applyAnimation, position, width, height])

  // Enhanced spring animation frame loop with geometry updates
  useFrame((_, delta) => {
    if (!meshRef.current) return

    const state = animationState.current
    let geometryNeedsUpdate = false

    // Spring physics for width
    const widthDisplacement = state.targetWidth - state.currentWidth
    const widthSpringForce = widthDisplacement * springStrength
    state.widthVelocity =
      (state.widthVelocity + widthSpringForce * delta) * damping
    state.currentWidth += state.widthVelocity * delta * 50

    // Spring physics for height
    const heightDisplacement = state.targetHeight - state.currentHeight
    const heightSpringForce = heightDisplacement * springStrength
    state.heightVelocity =
      (state.heightVelocity + heightSpringForce * delta) * damping
    state.currentHeight += state.heightVelocity * delta * 50

    // Spring physics for Z scale
    const scaleZDisplacement = state.targetScaleZ - state.currentScaleZ
    const scaleZSpringForce = scaleZDisplacement * springStrength
    state.scaleZVelocity =
      (state.scaleZVelocity + scaleZSpringForce * delta) * damping
    state.currentScaleZ += state.scaleZVelocity * delta * 50

    // Check if geometry needs updating
    if (
      Math.abs(widthDisplacement) > animationThreshold ||
      Math.abs(heightDisplacement) > animationThreshold
    ) {
      geometryNeedsUpdate = true
    }

    // Stop small movements for dimensions
    if (
      Math.abs(widthDisplacement) < animationThreshold &&
      Math.abs(state.widthVelocity) < animationThreshold
    ) {
      state.currentWidth = state.targetWidth
      state.widthVelocity = 0
    }
    if (
      Math.abs(heightDisplacement) < animationThreshold &&
      Math.abs(state.heightVelocity) < animationThreshold
    ) {
      state.currentHeight = state.targetHeight
      state.heightVelocity = 0
    }
    if (
      Math.abs(scaleZDisplacement) < animationThreshold &&
      Math.abs(state.scaleZVelocity) < animationThreshold
    ) {
      state.currentScaleZ = state.targetScaleZ
      state.scaleZVelocity = 0
    }

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

    // Apply transformations - only scaleZ, position, and rotation
    meshRef.current.scale.set(1, 1, state.currentScaleZ)
    meshRef.current.position.set(...state.currentPosition)
    meshRef.current.rotation.set(...state.currentRotation)

    if (meshRef.current.material && "opacity" in meshRef.current.material) {
      meshRef.current.material.opacity = state.currentOpacity
      meshRef.current.material.transparent = state.currentOpacity < 1
    }

    // Trigger geometry update if needed
    if (geometryNeedsUpdate) {
      setGeometryUpdateFlag((prev) => prev + 1)
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
        wireframe={wireframe}
        color={parseColor(color)}
        anisotropicBlur={anisotropicBlur}
        resolution={blur}
      />
    </mesh>
  )
}
