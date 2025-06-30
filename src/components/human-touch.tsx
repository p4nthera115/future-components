import { Canvas, extend } from "@react-three/fiber"
import LiquidGlass from "./liquid-glass/liquid-glass"
import { OrbitControls, VideoTexture } from "@react-three/drei"
import { geometry } from "maath"
import { useState } from "react"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function HumanTouch() {
  const [active, setActive] = useState(false)
  return (
    <div className="h-dvh w-dvw flex items-center justify-center relative">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <OrbitControls />

        {/* Video */}
        <mesh position={[0, 0, -0.12]}>
          <roundedPlaneGeometry args={[2, 2, 0.3]} />
          <VideoTexture src="/human-touch.mp4">
            {(texture) => <meshBasicMaterial map={texture} />}
          </VideoTexture>
        </mesh>

        <LiquidGlass
          height={0.2}
          width={0.2}
          borderRadius={active ? 0.1 : 1}
          position={[0.69, 0.69, 0]}
          active={active}
          onClick={() => setActive(!active)}
          whileActive={{
            y: 0,
            x: 0,
            width: 1.3,
            height: 1.3,
          }}
          whileHover={
            active
              ? {
                  width: 1.5,
                  height: 1.5,
                }
              : { scale: 1.1 }
          }
          damping={0.65}
        />
      </Canvas>
    </div>
  )
}
