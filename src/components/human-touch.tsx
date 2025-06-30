import { Canvas, extend } from "@react-three/fiber"
import LiquidGlass from "./liquid-glass/liquid-glass"
import { OrbitControls, VideoTexture } from "@react-three/drei"
import { geometry } from "maath"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function HumanTouch() {
  return (
    <div className="h-dvh w-dvw border flex items-center justify-center relative">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <OrbitControls />
        <mesh position={[0, 0, -0.1]}>
          <roundedPlaneGeometry args={[2, 2, 0.2]} />
          <VideoTexture src="/human-touch.mp4">
            {(texture) => <meshBasicMaterial map={texture} />}
          </VideoTexture>
        </mesh>

        <LiquidGlass />
      </Canvas>
    </div>
  )
}
