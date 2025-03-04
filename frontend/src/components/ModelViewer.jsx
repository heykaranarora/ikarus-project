import { useEffect, useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"

const RotatingModel = ({ model, isUserInteracting }) => {
  const ref = useRef()

  useFrame(() => {
    if (ref.current && !isUserInteracting.current) {
      ref.current.rotation.y += 0.01
      ref.current.rotation.x += 0.002
    }
  })

  return <primitive object={model} ref={ref} />
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full w-full">
    <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-blue-400 font-medium">Loading 3D Model...</p>
  </div>
)

const ModelViewer = ({ url, name, description }) => {
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isUserInteracting = useRef(false)
  const containerRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setModel(null)

    if (!url) {
      setError("Invalid model URL")
      setLoading(false)
      return
    }

    const loader = new GLTFLoader()

    // Determine if URL is online (starts with http or https)
    const isOnlineURL = url.startsWith("http") || url.startsWith("https")

    loader.load(
      isOnlineURL ? url : `http://localhost:5000${url}`, // Load online URL directly
      (gltf) => {
        try {
          const scene = gltf.scene

          // Auto-scale model
          const box = new THREE.Box3().setFromObject(scene)
          const size = box.getSize(new THREE.Vector3()).length()
          const scaleFactor = 3 / size
          scene.scale.setScalar(scaleFactor)

          // Center model
          const center = box.getCenter(new THREE.Vector3())
          scene.position.sub(center)

          // Apply material adjustments
          scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
              if (child.material) {
                child.material.roughness = 0.7
                child.material.metalness = 0.3
              }
            }
          })

          setModel(scene)
          setLoading(false)
        } catch (err) {
          console.error("Error processing model:", err)
          setError("Failed to process the 3D model")
          setLoading(false)
        }
      },
      null,
      (err) => {
        console.error("Error loading model:", err)
        setError("Failed to load the 3D model")
        setLoading(false)
      },
    )
  }, [url])

  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    if (model) {
      const timer = setTimeout(() => setShowHint(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [model])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-xl overflow-hidden shadow-xl bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700"
    >
      {loading && <LoadingSpinner />}
      {error && (
        <div className="flex items-center justify-center h-full w-full bg-red-900/20">
          <div className="bg-red-800/40 p-4 rounded-lg text-white text-center">
            <p className="text-lg font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {model && (
        <>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} shadows className="w-full h-full">
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <directionalLight position={[-5, 5, 5]} intensity={0.5} />
            <directionalLight position={[0, -5, 0]} intensity={0.2} />

            <RotatingModel model={model} isUserInteracting={isUserInteracting} />

            <Environment preset="studio" />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.5}
              onStart={() => {
                isUserInteracting.current = true
                setShowHint(false)
              }}
              onEnd={() => {
                isUserInteracting.current = false
              }}
            />
          </Canvas>

          {showHint && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm animate-pulse">
                Click and drag to rotate
              </div>
            </div>
          )}
        </>
      )}

      {name && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h3 className="text-lg font-bold">{name}</h3>
          {description && <p className="text-sm opacity-80">{description}</p>}
        </div>
      )}

      <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white/70">
        3D Viewer
      </div>
    </div>
  )
}

export default ModelViewer
