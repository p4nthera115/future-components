import { Environment, OrbitControls, Text } from "@react-three/drei"
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
      <Canvas camera={{ position: [0, 0, 2] }}>
        <color attach="background" args={[1, 1, 1]} />
        <OrbitControls
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={2.9}
          minAzimuthAngle={0}
          maxAzimuthAngle={0}
        />
        <CursorLight />

        {/* <Image url="./apple-drone.png" /> */}
        <Text
          font="./fonts/Geist/Geist-VariableFont_wght.ttf"
          position={[0, 0.75, -0.02]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          liquid
        </Text>
        <Text
          font="./fonts/Geist/Geist-VariableFont_wght.ttf"
          position={[0, 0, -0.02]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          liquid
        </Text>
        <Text
          font="./fonts/Geist/Geist-VariableFont_wght.ttf"
          position={[0, -0.75, -0.02]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          liquid
        </Text>

        {/* <LiquidGlass
          height={0.5}
          width={1}
          borderRadius={1}
          position={[0, 0, 0.1]}
          ior={1.3} // this controls the edge distortion
          backside={true}
          roughness={0}
        /> */}

        <LiquidGlass
          color={new Color(3, 3, 3)}
          height={0.3}
          width={0.8}
          borderRadius={0.5}
          position={[0, 0.75, 0.1]}
          ior={1.3}
          backside={true}
          roughness={0.2}
          animate={{
            hover: {
              onPointerEnter: {
                scale: 1.5,
                position: [0, 0, 0],
              },
              onPointerLeave: {
                scale: 1,
                position: [0, 0, 0],
              },
            },
            click: {
              onPointerDown: {
                scale: 0.7,
                position: [0, 0, 0],
              },
              onPointerUp: {
                scale: 1.5,
                position: [0, 0, 0],
              },
            },
          }}
          springStrength={10}
          damping={0.6}
        />

        <LiquidGlass
          height={0.5}
          width={1}
          borderRadius={1}
          position={[0, 0.0, 0.1]}
          ior={1.4}
          backside={false}
          roughness={0}
          color={new Color(0, 3, 3)}
          animate={{
            hover: {
              onPointerEnter: {
                scale: 1.1,
                position: [0, 0, 0.015],
              },
              onPointerLeave: {
                scale: 1,
                position: [0, 0, 0],
              },
              callback: () => console.log("Hovered!"),
            },
            click: {
              onPointerDown: {
                scale: 0.9,
                position: [0, 0, -0.03],
              },
              onPointerUp: {
                scale: 1.3,
                position: [0, 0, 0.0],
              },
              callback: () => console.log("Clicked!"),
            },
          }}
          springStrength={15}
          damping={0.8}
        />

        <LiquidGlass
          height={0.4}
          width={0.6}
          borderRadius={0.1}
          position={[-0.37, -0.75, 0.1]}
          ior={1.3}
          backside={false}
          roughness={0}
          animate={{
            hover: {
              onPointerEnter: {
                scale: 1.05,
                position: [0, 0, 0],
              },
              onPointerLeave: {
                scale: 1,
                position: [0, 0, 0],
              },
            },
            click: {
              onPointerDown: {
                scale: 0.98,
                position: [0, 0, 0],
              },
            },
          }}
          springStrength={22}
          damping={0.7}
          chromaticAberration={0.2}
          color={new Color(2, 2, 2)}
        />
        <LiquidGlass
          height={0.4}
          width={0.6}
          borderRadius={0.1}
          position={[0.37, -0.75, 0.1]}
          ior={1.3}
          backside={false}
          roughness={0}
          animate={{
            hover: {
              onPointerEnter: {
                scale: 1.05,
                position: [0, 0, 0],
              },
              onPointerLeave: {
                scale: 1,
                position: [0, 0, 0],
              },
            },
            click: {
              onPointerDown: {
                scale: 0.98,
                position: [0, 0, 0],
              },
            },
          }}
          springStrength={22}
          damping={0.7}
          chromaticAberration={0.1}
          color={new Color(2, 2, 2)}
        />

        {/* <mesh receiveShadow position={[0, 0, -0.1]}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial color={"#fff"} />
        </mesh> */}
      </Canvas>
    </div>
  )
}
