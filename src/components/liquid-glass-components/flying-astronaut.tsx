import { Canvas, extend } from "@react-three/fiber"
import LiquidGlass from "../liquid-glass/liquid-glass"
import { Html, OrbitControls, VideoTexture } from "@react-three/drei"
import { geometry } from "maath"
import { Color } from "three"
import { useState } from "react"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function FlyingAstronaut() {
  const [active, setActive] = useState(false)
  return (
    <div className="h-dvh w-dvw flex items-center justify-center relative">
      <Canvas camera={{ position: [0, 0, 2] }}>
        {/* <OrbitControls /> */}
        <pointLight
          intensity={active ? 100 : 2000}
          decay={4}
          position={[-1, 3, 0]}
          color={new Color(1.0, 1.0, 1.0)}
        />
        <pointLight
          intensity={active ? 10 : 1000}
          decay={4}
          position={[2, -1.5, 0]}
          color={new Color(1.0, 1.0, 1.0)}
        />
        {/* Video */}
        <mesh position={[0, 0, -0.12]}>
          <roundedPlaneGeometry args={[2, 2.5, 0.3]} />
          <VideoTexture src="/flying-astronaut.mp4">
            {(texture) => <meshBasicMaterial map={texture} />}
          </VideoTexture>
        </mesh>
        <LiquidGlass
          width={1.4}
          height={0.3}
          position={[0, -0.8, 0]}
          active={active}
          onClick={() => setActive(!active)}
          color={active ? new Color(3, 3, 3) : new Color(2, 2, 2)}
          whileActive={{
            width: 1.5,
            height: 1,
            y: -0.45,
          }}
          whileHover={
            active
              ? {
                  width: 1.55,
                }
              : {
                  scale: 1.1,
                }
          }
          roughness={active ? 0.2 : 0}
          damping={0.7}
        />

        <Html>
          <div
            onClick={() => setActive(!active)}
            className={`pointer-events-none ${
              active
                ? "h-60 -translate-y-4 rounded-[48px] w-81 -translate-x-40.5"
                : "h-17.5 translate-y-37.5 w-81 -translate-x-40.5 rounded-full"
            }  flex justify-between items-center p-4 text-3xl transition-all `}
          >
            <p className="text-xl pl-1">Voao Canyon</p>
            <p
              className={`${
                active ? "text-5xl" : "text-3xl"
              } transition-all duration-100`}
            >
              18°
            </p>
          </div>
        </Html>
      </Canvas>
    </div>
  )
}
