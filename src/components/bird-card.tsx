import { Environment, OrbitControls, Image, Text } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Leva } from "leva"
import LiquidGlass from "./liquid-glass"
import { Color, DirectionalLight } from "three"
import { useRef, useState, useEffect } from "react"
import { useControls } from "leva"

function CursorLight() {
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

export default function BirdCard() {
  return (
    <div className="w-full h-dvh">
      <Leva collapsed />
      <Canvas className="border" camera={{ position: [0, 0, 2] }}>
        <OrbitControls />
        <Environment preset="city" />
        <CursorLight />
        <Image url="./apple-drone.png" />

        {/* <Text
          position={[0, 0, -0]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          hello
        </Text> */}

        <mesh position={[0, 0, 0.2]}>
          <LiquidGlass
            height={0.5}
            width={1}
            borderRadius={0.2}
            position={[0, 0, 0.1]}
            ior={1.2} // this controls the edge distortion
            backside={true}
            roughness={0.1}
          />
        </mesh>
      </Canvas>
    </div>
  )
}
