import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader'

type Props = {
  file: File
  width?: number
  height?: number
  background?: string
}

export default function ModelPreview({
  file,
  width = 200,
  height = 200,
  background = 'transparent',
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!file || !mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setClearColor(background, background === 'transparent' ? 0 : 1)

    mountRef.current.innerHTML = ''
    mountRef.current.appendChild(renderer.domElement)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(1, 1, 1).normalize()
    scene.add(light)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = false

    const reader = new FileReader()
    let mesh: THREE.Object3D

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer

      let loader: STLLoader | ThreeMFLoader
      if (file.name.toLowerCase().endsWith('.stl')) {
        loader = new STLLoader()
        const geometry = loader.parse(arrayBuffer)
        const material = new THREE.MeshStandardMaterial({
          color: 0x0077be,
          flatShading: true,
        })
        mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
      } else if (file.name.toLowerCase().endsWith('.3mf')) {
        loader = new ThreeMFLoader()
        mesh = loader.parse(arrayBuffer)
        scene.add(mesh)
      } else {
        console.error('Unsupported file type')
        setLoading(false)
        return
      }

      const box = new THREE.Box3().setFromObject(mesh)
      const size = new THREE.Vector3()
      box.getSize(size)
      const maxDim = Math.max(size.x, size.y, size.z)
      camera.position.z = maxDim * 2
      camera.lookAt(0, 0, 0)

      setLoading(false)

      const animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }
      animate()
    }

    reader.readAsArrayBuffer(file)

    return () => {
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
      controls.dispose()
      if (mesh) {
        scene.remove(mesh)
        mesh.traverse((child) => {
          if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose()
          if ((child as THREE.Mesh).material) {
            const mat = (child as THREE.Mesh).material
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
            else mat.dispose()
          }
        })
      }
    }
  }, [file, width, height, background])

  return (
    <div
      ref={mountRef}
      style={{ width, height, position: 'relative' }}
      className="mx-auto border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/50 rounded-lg">
          <svg
            className="animate-spin h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}
    </div>
  )
}