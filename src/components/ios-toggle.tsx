import { Image, OrbitControls, Svg } from "@react-three/drei"
import LiquidGlassV2 from "./liquid-glass/liquid-glass-v2"
import { Canvas, extend } from "@react-three/fiber"
import { geometry } from "maath"
import { useState } from "react"
import { Color } from "three"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function IosToggle() {
  const [active, setActive] = useState(false)
  console.log(active)
  return (
    <div className="h-dvh w-full">
      <Canvas camera={{ position: [0, 0, 0.5] }}>
        <OrbitControls
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={2.7}
          minAzimuthAngle={0}
          maxAzimuthAngle={0}
        />

        <Svg
          src="/bg.svg"
          scale={0.0022}
          position={[-0.74, 0.14, -0.015]}
          castShadow
          renderOrder={1}
        />
        <Svg
          src="/green1.svg"
          scale={0.002}
          position={[-0.145, 0.068, -0.0101]}
        />
        <Svg
          src="/toggle.svg"
          scale={0.0019}
          position={active ? [-0.032, 0.0573, -0.016] : [-0.032, 0.0573, 0.01]}
          onPointerDown={() => setActive(true)}
          onPointerUp={() => setActive(false)}
        />
        <Image
          url="/shadow.png"
          transparent
          zoom={0.3}
          scale={1.5}
          position={[-0.26, -0.05, -0.12]}
          opacity={0.2}
        />

        <group>
          {/* LEFT */}
          <pointLight
            intensity={4000}
            decay={4}
            position={[-0.5, 0, 0]}
            color={new Color(1.0, 1.0, 1.0)}
          />
          <pointLight
            intensity={4000}
            decay={4}
            position={[-0.5, 0.2, 0]}
            color={new Color(1.0, 1.0, 1.0)}
          />
          <pointLight
            intensity={4000}
            decay={4}
            position={[-0.5, -0.2, 0]}
            color={new Color(1.0, 1.0, 1.0)}
          />
          {/* RIGHT */}
          <pointLight
            intensity={4000}
            decay={4}
            position={[0.5, -0.1, 0]}
            color={new Color(1.0, 1.0, 1.0)}
          />
          <pointLight
            intensity={4000}
            decay={4}
            position={[0.5, -0.3, 0]}
            color={new Color(1.0, 1.0, 1.0)}
          />
        </group>
        <LiquidGlassV2
          height={!active ? 0 : 0.16}
          width={!active ? 0 : 0.24}
          borderRadius={1}
          position={active ? [0.04, 0, 0.05] : [0.04, 0, -0.1]}
          ior={1.2}
          active={active}
          whileHover={{
            scale: 1.1,
          }}
          damping={!active ? 0.6 : 0.7}
        />
      </Canvas>
    </div>
  )
}
