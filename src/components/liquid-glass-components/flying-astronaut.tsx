import { Canvas, extend } from "@react-three/fiber"
import LiquidGlass from "../liquid-glass/liquid-glass"
import { Html, OrbitControls, VideoTexture } from "@react-three/drei"
import { geometry } from "maath"
import { Color } from "three"
import { useState } from "react"
import { Perf } from "r3f-perf"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function FlyingAstronaut() {
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)

  return (
    <div className="h-dvh w-dvw flex items-center justify-center relative">
      <Canvas camera={{ position: [0, 0, 2] }}>
        {/* <Perf /> */}
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
          damping={0.65}
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
        />

        <Html className="pointer-events-none">
          <div
            onClick={() => setActive(!active)}
            className={`pointer-events-none ${
              active
                ? "h-60 -translate-y-4 rounded-[48px] w-81 -translate-x-40.5 duration-300"
                : "h-17.5 translate-y-37.5 w-81 -translate-x-40.5 rounded-full duration-50"
            }  flex items-center ${
              active && hover ? "px-2 py-4" : "p-4"
            } text-3xl transition-all flex-col relative`}
          >
            <div
              className={`flex justify-between items-center w-full transition-all ${
                active ? "py-1" : "p-0"
              } ${hover && !active ? "scale-110" : ""} duration-300`}
            >
              <div className="flex flex-col items-start">
                <p
                  className={`${
                    active
                      ? "text-2xl -translate-y-2 -translate-x-2"
                      : "text-xl"
                  } pl-1 transition-all`}
                >
                  Voao Canyon
                </p>
                <p
                  className={`${
                    active
                      ? "opacity-100 translate-y-6.5 delay-200 duration-200"
                      : "opacity-0 translate-y-8 duration-1"
                  } absolute text-sm font-bold transition-all -translate-x-0.5`}
                >
                  Mostly cloudy
                </p>
                <p
                  className={`${
                    active
                      ? "opacity-100 translate-y-12 delay-250 duration-200"
                      : "opacity-0 translate-y-13 duration-1"
                  } absolute text-sm font-bold transition-all -translate-x-0.5`}
                >
                  L:12° H:21°
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p
                  className={`${
                    active ? "text-6xl translate-x-2" : "text-3xl duration-20"
                  } transition-all`}
                >
                  18°
                </p>
              </div>
            </div>
          </div>
        </Html>
      </Canvas>
    </div>
  )
}
