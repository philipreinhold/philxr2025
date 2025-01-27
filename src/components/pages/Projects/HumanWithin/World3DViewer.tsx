// src/components/pages/Projects/HumanWithin/VR360Viewer.tsx
import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface VR360ViewerProps {
  imageUrl: string;
  isOverUnder?: boolean;
}

export function VR360Viewer({ imageUrl, isOverUnder = true }: VR360ViewerProps) {
  const { camera } = useThree()
  const sphereRef = useRef<THREE.Mesh>(null)
  const lookRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(imageUrl, (texture) => {
      if (isOverUnder) {
        texture.repeat.set(1, 0.5)
        texture.offset.set(0, 0.5)
      }
      
      if (sphereRef.current) {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide
        })
        sphereRef.current.material = material
      }
    })
  }, [imageUrl, isOverUnder])

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += lookRef.current.x * 0.05
      
      const newRotX = sphereRef.current.rotation.x + lookRef.current.y * 0.05
      sphereRef.current.rotation.x = THREE.MathUtils.clamp(
        newRotX, -Math.PI / 2.5, Math.PI / 2.5
      )
    }
  })

  return (
    <mesh ref={sphereRef} rotation={[0, 0, 0]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial side={THREE.BackSide} />
    </mesh>
  )
}