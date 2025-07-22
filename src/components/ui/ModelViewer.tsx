import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ModelViewerProps {
  src?: string;               // glb/stl
  fallbackSrc?: string;       // fallback glb/stl
  previewImage?: string;      // .png/.jpg web-friendly preview
  color?: string;
}

export default function ModelViewer({
  src,
  fallbackSrc,
  previewImage,
  color = '#999999',
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    if (previewImage) {
      setLoading(false);
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    camera.position.set(0, 0, 200);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const node = containerRef.current;

    renderer.setSize(node.clientWidth, node.clientHeight);
    renderer.setClearColor(0x000000, 0);
    node.appendChild(renderer.domElement);

    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1).normalize();
    scene.add(light1);

    const light2 = new THREE.AmbientLight(0x888888);
    scene.add(light2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    let frameId: number;
    let mounted = true;

    const animate = () => {
      if (!mounted) return;
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    const cleanup = () => {
      mounted = false;
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };

    const checkURLExists = async (url: string): Promise<boolean> => {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        return res.ok;
      } catch {
        return false;
      }
    };

    const checkAndLoad = async () => {
      setLoading(true);
      try {
        const urlToLoad = src || fallbackSrc;
        if (!urlToLoad) throw new Error("No model URL provided.");

        const exists = await checkURLExists(urlToLoad);
        if (!exists) {
          throw new Error("Model file not found on server.");
        }

        if (urlToLoad.endsWith('.glb')) {
          loadGLB(urlToLoad);
        } else if (urlToLoad.endsWith('.stl')) {
          loadSTL(urlToLoad);
        } else {
          throw new Error("Unsupported model format.");
        }
      } catch (err) {
        console.error('[ModelViewer]', err);
        setError((err as Error).message);
        setLoading(false);
      }
    };

    const loadGLB = (url: string) => {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          if (!mounted) return;
          scene.add(gltf.scene);
          setLoading(false);
          animate();
        },
        undefined,
        (err) => {
          console.error('[ModelViewer] Failed to load GLB', err);
          setError("Failed to load GLB.");
          setLoading(false);
        }
      );
    };

    const loadSTL = (url: string) => {
      const loader = new STLLoader();
      loader.load(
        url,
        (geometry) => {
          if (!mounted) return;
          try {
            const material = new THREE.MeshPhongMaterial({
              color,
              specular: 0x111111,
              shininess: 200,
            });
            const mesh = new THREE.Mesh(geometry, material);
            geometry.center();
            scene.add(mesh);
            setLoading(false);
            animate();
          } catch (err) {
            console.error('[ModelViewer] STL error', err);
            setError("Failed to render STL.");
            setLoading(false);
          }
        },
        undefined,
        (err) => {
          console.error('[ModelViewer] Failed to load STL', err);
          setError("Failed to load STL.");
          setLoading(false);
        }
      );
    };

    checkAndLoad();

    return cleanup;
  }, [src, fallbackSrc, previewImage, color]);

  return (
    <div
      ref={containerRef}
      className="w-full h-64 rounded-xl overflow-hidden bg-black/10 flex items-center justify-center relative"
    >
      {previewImage ? (
        <img
          src={previewImage}
          alt="Model preview"
          className="object-contain w-full h-full"
        />
      ) : (
        <>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur text-white text-sm">
              Loading…
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center text-sm text-red-600 dark:text-red-400 bg-black/20 backdrop-blur">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
