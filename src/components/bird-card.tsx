import { Image, OrbitControls, Svg, Text } from "@react-three/drei"
import LiquidGlass from "./liquid-glass/liquid-glass"
import LiquidGlassV2 from "./liquid-glass/liquid-glass-v2"
import { Canvas, extend } from "@react-three/fiber"
import { geometry } from "maath"
import { useState } from "react"
import CursorLight from "./liquid-glass/cursor-light"
import { Color } from "three"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function BirdCard() {
  const [active, setActive] = useState(false)
  console.log(active)
  return (
    <div className="h-dvh w-full">
      <Canvas camera={{ position: [0, 0, 1.5] }}>
        <OrbitControls />
        <Svg src="/bg.svg" scale={0.0022} position={[-0.75, 0.14, -0.015]} />
        <Svg src="/green1.svg" scale={0.002} position={[-0.145, 0.068, 0]} />
        <Svg
          src="/toggle.svg"
          scale={0.002}
          position={[-0.034, 0.06, 0.0002]}
        />
        {/* <CursorLight /> */}
        <pointLight
          intensity={4000}
          decay={4}
          position={[-0.5, 0, 0.1]}
          color={new Color(1.0, 1.0, 1.0)}
        />
        <pointLight
          intensity={4000}
          decay={4}
          position={[-0.5, 0.2, 0.1]}
          color={new Color(1.0, 1.0, 1.0)}
        />

        <pointLight
          intensity={4000}
          decay={4}
          position={[-0.5, -0.2, 0.1]}
          color={new Color(1.0, 1.0, 1.0)}
        />
        <pointLight
          intensity={4000}
          decay={4}
          position={[0.5, -0.1, 0.1]}
          color={new Color(1.0, 1.0, 1.0)}
        />
        <pointLight
          intensity={4000}
          decay={4}
          position={[0.5, -0.3, 0.1]}
          color={new Color(1.0, 1.0, 1.0)}
        />
        {/* <Image
          url="/sony-glass-walkman-0xInk_.jpeg"
          position={[0, 0, 0]}
          // scale={0.5}
          zoom={1}
          receiveShadow
        >
          <roundedPlaneGeometry args={[1, 1.5, 0.1]} />
        </Image> */}
        {/* <LiquidGlass
          height={0.5}
          width={0.02}
          borderRadius={0.1}
          position={[0.17, 0.17, 0.04]}
          ior={1.2}
          animate={{
            click: {
              onPointerDown: {
                position: [0, 0, 0.01],
              },
              onPointerUp: {
                position: [0, 0, 0.04],
              },
              callback() {
                setActive(!active)
              },
            },
            hover: {
              onPointerEnter: {
                scale: 1.2,
              },
              onPointerLeave: {
                scale: 1.0,
              },
            },
          }}
        /> */}
        {/* <LiquidGlassV2
          height={0.2}
          width={0.8}
          position={[0, -0.55, 0.03]}
          borderRadius={active ? 0.06 : 0.3}
          borderSmoothness={100}
          onClick={() => setActive(!active)}
          active={active}
          whileActive={{
            height: 0.6,
            width: 0.8,
            y: -0.35,
          }}
          whileHover={active ? { height: 0.65, width: 0.85 } : { scale: 1.05 }}
          ior={1.5}
          roughness={active ? 0.5 : 0}
        /> */}
        <LiquidGlassV2
          height={0.16}
          width={0.24}
          borderRadius={1}
          borderSmoothness={100}
          position={[0.04, 0, 0.05]}
          ior={1.2}
        />
        {/* <Text
          font="./fonts/Geist/Geist-VariableFont_wght.ttf"
          position={[0, -0.6, -0.02]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          liquid
        </Text> */}
        {/* <LiquidGlass /> */}
      </Canvas>
    </div>
  )
}
