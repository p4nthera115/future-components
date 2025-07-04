import { Canvas, extend } from "@react-three/fiber"
import LiquidGlass from "../liquid-glass/liquid-glass"
import { Html, VideoTexture } from "@react-three/drei"
import { geometry } from "maath"
import { Color } from "three"
import { useState } from "react"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function Jellyfish() {
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)

  return (
    <div className="h-dvh w-dvw flex items-center justify-center relative">
      <Canvas camera={{ position: [0, 0, 2] }}>
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
          {/* @ts-ignore */}
          <roundedPlaneGeometry args={[2.5, 2.5, 0]} />
          <VideoTexture src="/dogan-jellyfish.mp4">
            {(texture) => <meshBasicMaterial map={texture} />}
          </VideoTexture>
        </mesh>

        <LiquidGlass
          width={1.4}
          height={0.3}
          position={[0.2, -0.8, 0]}
          active={active}
          onClick={() => setActive(!active)}
          // color={active ? new Color(3, 3, 3) : new Color(2.2, 2.2, 2.2)}
        />
        <LiquidGlass
          width={0.3}
          height={0.3}
          borderRadius={1}
          position={[-0.85, -0.8, 0]}
          active={active}
          onClick={() => setActive(!active)}
          // color={active ? new Color(3, 3, 3) : new Color(2.2, 2.2, 2.2)}
        />
      </Canvas>
    </div>
  )
}
