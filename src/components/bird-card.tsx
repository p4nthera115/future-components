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

  // const materialProps = useControls("transmission", {
  //   thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
  //   roughness: { value: 0, min: 0, max: 1, step: 0.1 },
  //   transmission: { value: 1, min: 0, max: 1, step: 0.1 },
  //   ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
  //   chromaticAberration: { value: 0.02, min: 0, max: 1 },
  //   backside: { value: true },
  // })

  return (
    <div className="w-full h-full">
      <Leva />
      <Canvas className="border" camera={{ position: [0, 0, 10] }}>
        <OrbitControls />
        <directionalLight intensity={2} position={[0, 2, 3]} />
        <Environment preset="city" />

        <Text
          position={[0, 0, -0]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          hello world!
        </Text>

        <mesh ref={planeRef} position={[0, 0, 0.2]}>
          <ExtrudedPlane />
          {/* <MeshTransmissionMaterial
            {...materialProps}
            background={new THREE.Color(1, 1, 1)}
          /> */}
        </mesh>
      </Canvas>
    </div>
  )
}

function ExtrudedPlane() {
  // We'll define a 2D shape, in this case, a square.
  // useMemo is used to ensure the shape is created only once.
  const shape = useMemo(() => {
    // Define the 2D path for a 1x1 square centered at (0,0)
    const s = new THREE.Shape()
    s.moveTo(-0.5, -0.5)
    s.lineTo(0.5, -0.5)
    s.lineTo(0.5, 0.5)
    s.lineTo(-0.5, 0.5)
    s.closePath() // This closes the loop to form a complete shape
    return s
  }, [])
  const extrudeControls = useControls("extrude", {
    steps: { value: 2, min: 1, max: 10, step: 1 },
    depth: { value: 0, min: 0, max: 1, step: 0.01 },
    bevelEnabled: { value: true, type: LevaInputs.BOOLEAN },
    bevelThickness: { value: 0.02, min: 0, max: 1, step: 0.01 },
    bevelSize: { value: 0.04, min: 0, max: 1, step: 0.01 },
    bevelOffset: { value: 0, min: 0, max: 1, step: 0.01 },
    bevelSegments: { value: 57, min: 1, max: 100, step: 1 },
  })

  const materialProps = useControls("transmission", {
    thickness: { value: 0.35, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.02, min: 0, max: 1 },
    backside: { value: true },
  })

  // These are the settings for the extrusion.
  // useMemo ensures these settings are also created only once.
  const extrudeSettings = useMemo(
    () => ({
      steps: extrudeControls.steps,
      depth: extrudeControls.depth,
      bevelEnabled: extrudeControls.bevelEnabled,
      bevelThickness: extrudeControls.bevelThickness,
      bevelSize: extrudeControls.bevelSize,
      bevelSegments: extrudeControls.bevelSegments,
    }),
    [extrudeControls]
  )

  return (
    // We create a mesh to hold our geometry and material.
    // We rotate it by -90 degrees on the X-axis to lay it flat like a floor.
    <mesh receiveShadow castShadow>
      {/* This is the core of the example.
        <extrudeGeometry> takes the shape and the settings as arguments.
        react-three-fiber automatically converts this to new THREE.ExtrudeGeometry(...)
      */}
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <MeshTransmissionMaterial
        {...materialProps}
        background={new THREE.Color(1, 1, 1)}
      />
    </mesh>
  )
}
