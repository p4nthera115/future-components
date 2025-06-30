import { OrbitControls, Text } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Leva } from "leva"
import LiquidGlass from "./liquid-glass"
import { Color } from "three"
import CursorLight from "./cursor-light"

export default function LiquidGlassTesting() {
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

        {/* <LiquidGlass
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
        /> */}

        <LiquidGlass
          height={0.5}
          width={1}
          borderRadius={1}
          position={[0, 0.0, 0.1]}
          ior={1.4}
          backside={false}
          roughness={1.1}
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

        {/* <LiquidGlass
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
        /> */}

        {/* <mesh receiveShadow position={[0, 0, -0.1]}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial color={"#fff"} />
        </mesh> */}
      </Canvas>
    </div>
  )
}
