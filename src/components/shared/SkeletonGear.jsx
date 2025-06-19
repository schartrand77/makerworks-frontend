import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Gear() {
  const meshRef = useRef()

  // Simple cylinder-based gear stand-in
  const teeth = 20
  const radius = 0.8
  const height = 0.3
  const gearGeometry = new THREE.CylinderGeometry(radius, radius, height, teeth)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.x = Math.PI / 6
    }
  })

  return (
    <mesh ref={meshRef} geometry={gearGeometry}>
      <meshStandardMaterial color="#999" metalness={0.6} roughness={0.4} />
    </mesh>
  )
}

export default function SkeletonGear() {
  return (
    <Canvas camera={{ position: [2, 2, 2] }} className="w-full h-full">
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} intensity={0.6} />
      <Gear />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
    </Canvas>
  )
}