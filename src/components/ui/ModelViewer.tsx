import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

interface ModelViewerProps {
  src: string
  color?: string // e.g., "#FF0000" or "red"
}

export default function ModelViewer({ src, color = '#999999' }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Setup scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000)
    camera.position.set(0, 0, 200)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0) // transparent bg
    containerRef.current.appendChild(renderer.domElement)

    const light1 = new THREE.DirectionalLight(0xffffff, 1)
    light1.position.set(1, 1, 1).normalize()
    scene.add(light1)

    const light2 = new THREE.AmbientLight(0x888888)
    scene.add(light2)

    const loader = new STLLoader()
    let mesh: THREE.Mesh | null = null

    loader.load(
      src,
      (geometry) => {
        const material = new THREE.MeshStandardMaterial({ color })
        mesh = new THREE.Mesh(geometry, material)
        mesh.rotation.x = -0.5 * Math.PI
        scene.add(mesh)

        const animate = () => {
          if (mesh) {
            mesh.rotation.z += 0.01
          }
          renderer.render(scene, camera)
          requestAnimationFrame(animate)
        }
        animate()
      },
      undefined,
      (err) => {
        console.error('[ModelViewer] Failed to load model:', err)
      }
    )

    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [src, color])

  return (
    <div
      ref={containerRef}
      className="w-full h-64 rounded-xl overflow-hidden bg-black/10"
    />
  )
}