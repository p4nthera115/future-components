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
  whileFocus?: AnimationValues

  active?: boolean
  disabled?: boolean
  focused?: boolean

  variants?: Variants
  initial?: string
  animate?: string
  exit?: string

  onClick?: () => void
  onToggle?: () => void
  onHoverStart?: () => void
  onHoverEnd?: () => void
  onTapStart?: () => void
  onTapEnd?: () => void
  onAnimationComplete?: (variant?: string) => void

  transition?: TransitionConfig

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
  transition?: TransitionConfig
}

interface TransitionConfig {
  duration?: number
  delay?: number
  ease?: EasingFunction

  stiffness?: number
  damping?: number
  mass?: number

  bounceStiffness?: number
  bounceDamping?: number
}

type EasingFunction =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "spring"
  | "bounce"

interface Variants {
  [key: string]: AnimationValues
}

const DEFAULT_PROPS = {
  width: 1,
  height: 1,
  borderRadius: 0.1,
  position: [0, 0, 0] as [number, number, number],
  transmission: 1,
  roughness: 0,
  ior: 1.3,
  chromaticAberration: 0,
  color: new THREE.Color(1, 1, 1),
  thickness: 0.35,
  transition: {
    duration: 0.2,
    ease: "ease-out" as EasingFunction,
    stiffness: 300,
    damping: 20,
    mass: 1,
  } as TransitionConfig,
  extrudeSettings: {
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.02,
    bevelSegments: 8,
  },
}

const DEFAULT_ANIMATIONS = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  whileActive: { scale: 1.1 },
  whileDisabled: { scale: 0.9, opacity: 0.5 },
}

const easingFunctions = {
  linear: (t: number) => t,
  ease: (t: number) => t * t * (3 - 2 * t),
  "ease-in": (t: number) => t * t,
  "ease-out": (t: number) => t * (2 - t),
  "ease-in-out": (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  spring: (t: number) => 1 - Math.cos(t * Math.PI * 0.5),
  bounce: (t: number) => {
    if (t < 1 / 2.75) return 7.5625 * t * t
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
  },
}

function parseColor(color: string | THREE.Color): THREE.Color {
  if (color instanceof THREE.Color) return color
  return new THREE.Color(color)
}

function mergeTransitions(
  global?: TransitionConfig,
  local?: TransitionConfig
): TransitionConfig {
  return { ...DEFAULT_PROPS.transition, ...global, ...local }
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
  whileFocus,

  active = false,
  disabled = false,
  focused = false,

  variants,
  initial = "idle",
  animate,
  exit,

  onClick,
  onToggle,
  onHoverStart,
  onHoverEnd,
  onTapStart,
  onTapEnd,
  onAnimationComplete,

  transition: globalTransition = DEFAULT_PROPS.transition,

  extrudeSettings = DEFAULT_PROPS.extrudeSettings,

  "aria-label": ariaLabel,
  tabIndex = 0,
}: LiquidGlassProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isFocused, setIsFocused] = useState(focused)

  const animationState = useRef({
    current: {
      x: position[0],
      y: position[1],
      z: position[2],
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      opacity: 1,
    },
    target: {
      x: position[0],
      y: position[1],
      z: position[2],
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      opacity: 1,
    },
    velocity: {
      x: 0,
      y: 0,
      z: 0,
      scale: 0,
      scaleX: 0,
      scaleY: 0,
      scaleZ: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      opacity: 0,
    },
    activeTransition: mergeTransitions(globalTransition),
    animationProgress: 0,
    animatingTo: initial,
  })

  // * GEOMETRY
  const shape = useMemo(() => {
    const x = -width / 2
    const y = -height / 2
    const r = Math.min(
      (borderRadius * Math.min(width, height)) / 2,
      width / 2,
      height / 2
    )

    const shape = new THREE.Shape()

    shape.moveTo(x, y + r)
    shape.lineTo(x, y + height - r)
    shape.quadraticCurveTo(x, y + height, x + r, y + height)
    shape.lineTo(x + width - r, y + height)
    shape.quadraticCurveTo(x + width, y + height, x + width, y + height - r)
    shape.lineTo(x + width, y + r)
    shape.quadraticCurveTo(x + width, y, x + width - r, y)
    shape.lineTo(x + r, y)
    shape.quadraticCurveTo(x, y, x, y + r)

    return shape
  }, [width, height, borderRadius])

  // * ANIMATIONS
  const getCurrentAnimation = useCallback((): AnimationValues => {
    // Priority order: disabled > pressed > hovered > active > focused > default

    if (disabled && (whileDisabled || variants?.disabled)) {
      return (
        whileDisabled || variants?.disabled || DEFAULT_ANIMATIONS.whileDisabled
      )
    }

    if (isPressed && (whileTap || variants?.tap)) {
      return whileTap || variants?.tap || DEFAULT_ANIMATIONS.whileTap
    }

    if (isHovered && (whileHover || variants?.hovered)) {
      return whileHover || variants?.hovered || DEFAULT_ANIMATIONS.whileHover
    }

    if (active && (whileActive || variants?.active)) {
      return whileActive || variants?.active || DEFAULT_ANIMATIONS.whileActive
    }

    if (isFocused && (whileFocus || variants?.focus)) {
      return whileFocus || variants?.focus || {}
    }

    // specified variants
    if (animate && variants?.[animate]) {
      return variants[animate]
    }

    // default variants state
    if (variants?.[initial]) {
      return variants[initial]
    }

    return {}
  }, [
    disabled,
    isPressed,
    isHovered,
    active,
    isFocused,
    animate,
    variants,
    whileDisabled,
    whileTap,
    whileActive,
    whileFocus,
    whileHover,
  ])

  const applyAnimation = useCallback(
    (animation: AnimationValues) => {
      const state = animationState.current
      const basePos = position

      // set default state
      state.target.x = animation.x !== undefined ? animation.x : basePos[0]
      state.target.y = animation.y !== undefined ? animation.y : basePos[1]
      state.target.z = animation.z !== undefined ? animation.z : basePos[2]
      state.target.scale = animation.scale !== undefined ? animation.scale : 1
      state.target.scaleX =
        animation.scaleX !== undefined ? animation.scaleX : animation.scale || 1
      state.target.scaleY =
        animation.scaleY !== undefined ? animation.scaleY : animation.scale || 1
      state.target.scaleZ =
        animation.scaleZ !== undefined ? animation.scaleZ : animation.scale || 1
      state.target.rotateX = animation.rotateX || 0
      state.target.rotateY = animation.rotateY || 0
      state.target.rotateZ = animation.rotateZ || 0
      state.target.opacity =
        animation.opacity !== undefined ? animation.opacity : 1

      state.activeTransition = mergeTransitions(
        globalTransition,
        animation.transition
      )
      state.animationProgress = 0
    },
    [position, globalTransition]
  )

  // update animation on state change
  useEffect(() => {
    const currentAnimation = getCurrentAnimation()
    applyAnimation(currentAnimation)
  }, [getCurrentAnimation, applyAnimation])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    const state = animationState.current
    const transition = state.activeTransition

    const progressDelta = delta / (transition.duration || 0.2)
    state.animationProgress = Math.min(
      state.animationProgress + progressDelta,
      1
    )

    const easingFn = easingFunctions[transition.ease || "ease-out"]
    const easedProgress = easingFn(state.animationProgress)

    Object.keys(state.current).forEach((key) => {
      const currentVal = state.current[key as keyof typeof state.current]
      const targetVal = state.target[key as keyof typeof state.target]

      if (transition.ease === "spring") {
        const stiffness = transition.stiffness || 300
        const damping = transition.damping || 20
        const mass = transition.mass || 1

        const force = (targetVal - currentVal) * stiffness
        state.velocity[key as keyof typeof state.velocity] =
          state.velocity[key as keyof typeof state.velocity] +
          (force / mass) * delta * (1 - damping * delta)

        state.current[key as keyof typeof state.current] +=
          state.velocity[key as keyof typeof state.velocity] * delta
      } else {
        state.current[key as keyof typeof state.current] =
          currentVal + (targetVal - currentVal) * easedProgress
      }
    })

    meshRef.current.position.set(
      state.current.x,
      state.current.y,
      state.current.z
    )
    meshRef.current.scale.set(
      state.current.scaleX,
      state.current.scaleY,
      state.current.scaleZ
    )
    meshRef.current.rotation.set(
      state.current.rotateX,
      state.current.rotateY,
      state.current.rotateZ
    )

    if (meshRef.current.material && "opacity" in meshRef.current.material) {
      meshRef.current.material.opacity = state.current.opacity
      meshRef.current.material.transparent = state.current.opacity < 1
    }

    if (state.animationProgress >= 1 && onAnimationComplete) {
      onAnimationComplete(state.animatingTo)
    }
  })

  // * EVENT HANDLERS

  const handlePointerEnter = useCallback(() => {
    if (disabled) return
    setIsHovered(true)
    onHoverStart?.()
  }, [disabled, onHoverStart])

  return <div>LiquidGlassV2</div>
}
