import { Image, OrbitControls, Text } from "@react-three/drei"
import LiquidGlass from "./liquid-glass/liquid-glass"
import LiquidGlassV2 from "./liquid-glass/liquid-glass-v2"
import { Canvas, extend } from "@react-three/fiber"
import { easing, geometry } from "maath"
import { useState } from "react"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function BirdCard() {
  const [active, setActive] = useState(false)
  console.log(active)
  return (
    <div className="h-dvh w-full ">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <OrbitControls />
        <Image
          url="/bird.jpeg"
          position={[0, 0, 0]}
          scale={0.5}
          zoom={0.6}
        ></Image>
        {/* <LiquidGlass
          height={0.02}
          width={0.02}
          borderRadius={0.9}
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
        <LiquidGlassV2
          height={0.2}
          width={0.2}
          position={[0, 0, 0.04]}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
