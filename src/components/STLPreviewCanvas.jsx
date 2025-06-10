import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function STLPreviewCanvas({ url }) {
  const containerRef = useRef()
  const rendererRef = useRef()
  const hovered = useRef(false)

  useEffect(() => {
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 70)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.2

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2)
    scene.add(light)

    const loader = new STLLoader()
    loader.load(url, (geometry) => {
      const material = new THREE.MeshStandardMaterial({ color: 0x8888ff })
      const mesh = new THREE.Mesh(geometry, material)
      geometry.center()
      scene.add(mesh)
    })

    let animId
    const animate = () => {
      if (hovered.current) controls.update()
      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      renderer.dispose()
      containerRef.current.innerHTML = ''
    }
  }, [url])

  return (
    <div
      ref={containerRef}
      className="w-full h-48 rounded overflow-hidden bg-transparent"
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
    />
  )
}