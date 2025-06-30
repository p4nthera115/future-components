import {
  Image,
  OrbitControls,
  Svg,
  Text,
  Html,
  GradientTexture,
} from "@react-three/drei"
import LiquidGlassV2 from "./liquid-glass/liquid-glass-v2"
import { Canvas, extend } from "@react-three/fiber"
import { geometry } from "maath"
import { useState } from "react"
import { Color } from "three"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function IBot() {
  const [active, setActive] = useState(false)
  console.log(active)
  return (
    <div className="h-dvh w-dvw border flex items-center justify-center relative">
      <Canvas camera={{ position: [0, 0, 1.5] }}>
        <OrbitControls enableZoom={false} />
        <pointLight
          intensity={200}
          decay={4}
          position={[-1.5, -0, 0]}
          color={new Color(1.0, 1.0, 1.0)}
        />
        <pointLight
          intensity={200}
          decay={4}
          position={[1.5, -1.5, 0]}
          color={new Color(1.0, 1.0, 1.0)}
        />

        <Image
          url="/apple-bot.jpeg"
          position={[0, 0, 0]}
          // scale={0.5}
          zoom={0.8}
          receiveShadow
          castShadow
        >
          <roundedPlaneGeometry args={[0.91, 1, 0.12]} />
        </Image>
        <mesh position={[0, 0, -0.1]}>
          <roundedPlaneGeometry args={[0.985, 1.082, 0.135]} />
          <meshBasicMaterial color={[0.8, 0.8, 0.8]}>
            <GradientTexture
              stops={[0, 1]}
              colors={["#fff", "#fff"]}
              size={1000}
            />
          </meshBasicMaterial>
        </mesh>
        <LiquidGlassV2
          height={0.15}
          width={0.15}
          position={[-0.315, -0.36, 0.03]}
          borderRadius={active ? 0.06 : 0.3}
          borderSmoothness={100}
          // onClick={() => setActive(!active)}
          // active={active}
          // whileActive={{
          //   height: 0.6,
          //   width: 0.8,
          //   y: -0.35,
          // }}
          whileHover={active ? { height: 0.65, width: 0.85 } : { scale: 1.2 }}
          ior={1.5}
          color={new Color(3, 3, 3)}
          // blur={300}
          roughness={0.2}
        />
        <LiquidGlassV2
          height={0.15}
          width={0.15}
          position={[0.315, -0.36, 0.03]}
          borderRadius={active ? 0.06 : 0.3}
          borderSmoothness={100}
          // onClick={() => setActive(!active)}
          // active={active}
          // whileActive={{
          //   height: 0.6,
          //   width: 0.8,
          //   y: -0.35,
          // }}
          whileHover={active ? { height: 0.65, width: 0.85 } : { scale: 1.2 }}
          ior={1.5}
          color={new Color(3, 3, 3)}
          // blur={300}
          roughness={0.2}
        />
        {/* <Html
          position={[0, 0, 0]}
          className="w-screen text-3xl text-white -translate-x-20.5 top-38.5 pointer-events-none"
        >
          <div
            className={`${
              active ? "opacity-0 blur-[5px]" : "opacity-100 blur-none"
            } transition-all`}
          >
            <p className="">get your iBot</p>
          </div>
        </Html> */}
      </Canvas>
    </div>
  )
}
