import { MeshTransmissionMaterial } from "@react-three/drei"
import { LevaInputs, useControls } from "leva"
import { useMemo } from "react"
import * as THREE from "three"

interface LiquidGlassProps {
  height: number
  width: number
  borderRadius: number
  position: [number, number, number]
  transmission?: number
  roughness?: number
  ior?: number
  chromaticAberration?: number
  color?: THREE.Color
  backside?: boolean
}

export default function LiquidGlass({
  height,
  width,
  borderRadius,
  position,
  transmission = 1,
  roughness = 0,
  ior = 1.2, // controls edge distortion
  chromaticAberration = 0,
  color = new THREE.Color(1, 1, 1),
  backside = true,
}: LiquidGlassProps) {
  // const geomControls = useControls("geometry", {
  //   width: { value: width, min: 0.1, max: 5, step: 0.1 },
  //   height: { value: height, min: 0.1, max: 5, step: 0.1 },
  //   borderRadius: { value: borderRadius, min: 0, max: 0.5, step: 0.01 },
  // })

  const extrudeControls = useControls("extrude", {
    steps: { value: 2, min: 1, max: 10, step: 1 },
    depth: { value: 0, min: 0, max: 1, step: 0.01 },
    bevelEnabled: { value: true, type: LevaInputs.BOOLEAN },
    bevelThickness: { value: 0.02, min: 0, max: 1, step: 0.01 },
    bevelSize: { value: 0.02, min: 0, max: 1, step: 0.01 },
    bevelOffset: { value: 0, min: 0, max: 1, step: 0.01 },
    bevelSegments: { value: 57, min: 1, max: 100, step: 1 },
  })

  const materialProps = useControls("transmission", {
    thickness: { value: 0.35, min: 0, max: 3, step: 0.05 },
    // roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    // transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    // ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
    // chromaticAberration: { value: 0.02, min: 0, max: 1 },
    // backside: { value: true },
  })

  const shape = useMemo(() => {
    const x = -width / 2
    const y = -height / 2
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
  }, [])

  const extrudeSettings = useMemo(
    () => ({
      ...extrudeControls,
    }),
    [extrudeControls]
  )

  return (
    <mesh receiveShadow castShadow position={position}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <MeshTransmissionMaterial
        {...materialProps}
        background={color}
        transmission={transmission}
        roughness={roughness}
        ior={ior}
        chromaticAberration={chromaticAberration}
        backside={backside}
      />
    </mesh>
  )
}
