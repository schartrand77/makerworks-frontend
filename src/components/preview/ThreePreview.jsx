
import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

const Model = ({ file }) => {
  const geometry = useLoader(STLLoader, URL.createObjectURL(file))
  const meshRef = useRef()

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} scale={0.02}>
      <meshStandardMaterial color="#ccc" metalness={0.3} roughness={0.6} />
    </mesh>
  )
}

export default function ThreePreview({ file }) {
  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-white/10 bg-white/10 mt-4">
      <Canvas>
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <PerspectiveCamera makeDefault position={[0, 0, 4]} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
        <Model file={file} />
      </Canvas>
    </div>
  )
}
