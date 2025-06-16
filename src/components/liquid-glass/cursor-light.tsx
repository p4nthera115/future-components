import { useControls } from "leva"
import { useEffect, useRef, useState } from "react"
import { Color, DirectionalLight } from "three"

export default function CursorLight() {
  const lightRef = useRef<DirectionalLight>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { radius, intensity, distance, decay, lightColor } = useControls(
    "Cursor Light",
    {
      radius: { value: 2, min: 0.5, max: 5, step: 0.1 },
      intensity: { value: 2000, min: 100, max: 10000, step: 100 },
      distance: { value: 10, min: 1, max: 20, step: 0.5 },
      decay: { value: 1, min: 0, max: 5, step: 0.1 },
      lightColor: { value: "#ffffff" },
    }
  )

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Calculate circular position based on mouse
  const angle = Math.atan2(mousePosition.y, mousePosition.x)
  const circularX = Math.cos(angle) * radius
  const circularY = Math.sin(angle) * radius

  return (
    <pointLight
      ref={lightRef}
      intensity={intensity}
      position={[circularX, circularY, 0.1]}
      color={new Color(lightColor)}
      distance={distance}
      decay={decay}
    />
  )
}
