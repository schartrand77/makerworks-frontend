// src/components/Preview/ModelViewer.jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { useLoader } from '@react-three/fiber'

export default function ModelViewer({ url }) {
  const geometry = useLoader(STLLoader, url)
  return (
    <Canvas style={{ height: 400 }}>
      <Stage environment="city">
        <mesh geometry={geometry}>
          <meshStandardMaterial color="orange" />
        </mesh>
      </Stage>
      <OrbitControls />
    </Canvas>
  )
}