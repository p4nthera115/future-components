import { Environment, OrbitControls, Image } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Leva } from "leva"
import LiquidGlass from "./liquid-glass"
import { Color } from "three"

export default function BirdCard() {
  return (
    <div className="w-full h-dvh">
      <Leva collapsed />
      <Canvas className="border" camera={{ position: [0, 0, 2] }}>
        <OrbitControls enableZoom={false} />
        <directionalLight intensity={2} position={[0, 2, 3]} />
        <Environment preset="city" />

        <Image url="./apple-drone.png" />

        <LiquidGlass
          height={2}
          width={1.25}
          borderRadius={0.2}
          position={[0, 0, 0.2]}
          transmission={1}
          roughness={0}
          ior={1.2}
          chromaticAberration={0.1}
          color={new Color(1, 1, 1)}
        />
      </Canvas>
    </div>
  )
}
