import {
  Environment,
  MeshTransmissionMaterial,
  OrbitControls,
  Text,
} from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Leva, LevaInputs, useControls } from "leva"
import { useMemo, useRef } from "react"
import * as THREE from "three"

export default function BirdCard() {
  const planeRef = useRef<THREE.Mesh>(null)

  return (
    <div className="w-full h-full">
      <Leva collapsed />
      <Canvas className="border" camera={{ position: [0, 0, 2] }}>
        <OrbitControls />
        <directionalLight intensity={2} position={[0, 2, 3]} />
        <Environment preset="city" />

        <Text
          position={[0, 0, -0.1]}
          fontSize={0.25}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          hello world!
        </Text>

        <mesh ref={planeRef} position={[0, 0, 0.2]}>
          {/* No props needed here, everything is handled by leva */}
          <ExtrudedPlane />
        </mesh>
      </Canvas>
    </div>
  )
}

function ExtrudedPlane() {
  // NEW: Grouped geometry controls together, including borderRadius
  const geomControls = useControls("geometry", {
    width: { value: 1.5, min: 0.1, max: 5, step: 0.1 },
    height: { value: 1, min: 0.1, max: 5, step: 0.1 },
    borderRadius: { value: 0.2, min: 0, max: 0.5, step: 0.01 },
  })

  const extrudeControls = useControls("extrude", {
    steps: { value: 2, min: 1, max: 10, step: 1 },
    depth: { value: 0.1, min: 0, max: 1, step: 0.01 },
    bevelEnabled: { value: true, type: LevaInputs.BOOLEAN },
    bevelThickness: { value: 0.02, min: 0, max: 1, step: 0.01 },
    bevelSize: { value: 0.02, min: 0, max: 1, step: 0.01 },
    bevelOffset: { value: 0, min: 0, max: 1, step: 0.01 },
    bevelSegments: { value: 8, min: 1, max: 100, step: 1 },
  })

  const materialProps = useControls("transmission", {
    thickness: { value: 0.35, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.02, min: 0, max: 1 },
    backside: { value: true },
  })

  // UPDATED: This logic now creates a rounded rectangle shape
  const shape = useMemo(() => {
    const { width, height, borderRadius } = geomControls
    const x = -width / 2
    const y = -height / 2
    // Clamp the radius to be no larger than half the width or height
    const r = Math.min(borderRadius, width / 2, height / 2)

    const s = new THREE.Shape()

    s.moveTo(x, y + r)
    s.lineTo(x, y + height - r)
    s.quadraticCurveTo(x, y + height, x + r, y + height)
    s.lineTo(x + width - r, y + height)
    s.quadraticCurveTo(x + width, y + height, x + width, y + height - r)
    s.lineTo(x + width, y + r)
    s.quadraticCurveTo(x + width, y, x + width - r, y)
    s.lineTo(x + r, y)
    s.quadraticCurveTo(x, y, x, y + r)
    s.closePath()

    return s
  }, [geomControls]) // The shape now updates when any geometry control changes

  const extrudeSettings = useMemo(
    () => ({
      ...extrudeControls,
    }),
    [extrudeControls]
  )

  return (
    <mesh receiveShadow castShadow>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <MeshTransmissionMaterial
        {...materialProps}
        background={new THREE.Color(1, 1, 1)}
      />
    </mesh>
  )
}
