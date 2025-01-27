// src/components/pages/Projects/ProjectThumbnail.tsx
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function ProjectThumbnail({ imageUrl }: { imageUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    })
    renderer.setSize(320, 180)

    const geometry = new THREE.SphereGeometry(500, 60, 40)
    const textureLoader = new THREE.TextureLoader()
    
    textureLoader.load(imageUrl, (texture) => {
      texture.repeat.set(1, 0.5)
      texture.offset.set(0, 0.5)
      
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
      })
      const sphere = new THREE.Mesh(geometry, material)
      scene.add(sphere)

      camera.position.z = 0.1
      
      let animationId: number
      function animate() {
        animationId = requestAnimationFrame(animate)
        sphere.rotation.y += 0.005
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        cancelAnimationFrame(animationId)
        renderer.dispose()
      }
    })
  }, [imageUrl])

  return (
    <div className="w-full aspect-video relative">
      <canvas ref={canvasRef} className="w-full h-full rounded-t-lg" />
    </div>
  )
}