import { Canvas, extend } from "@react-three/fiber"
import LiquidGlass from "./liquid-glass/liquid-glass"
import { OrbitControls, VideoTexture } from "@react-three/drei"
import { geometry } from "maath"
import { useState } from "react"
import { Color } from "three"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function HumanTouch() {
  const [active, setActive] = useState(false)
  return (
    <div className="h-dvh w-dvw flex items-center justify-center relative">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <OrbitControls />

        <pointLight
          intensity={2000}
          decay={4}
          position={[-1, 3, 0]}
          color={new Color(1.0, 1.0, 1.0)}
        />
        <pointLight
          intensity={1000}
          decay={4}
          position={[2, -1.5, 0]}
          color={new Color(1.0, 1.0, 1.0)}
        />

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
          color={active ? new Color(1, 1, 1) : new Color(2, 2, 2)}
          roughness={0.1}
        />
      </Canvas>
    </div>
  )
}
