// src/components/pages/Projects/GaussianSplat/SplatViewer.tsx
import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DualJoystickUI } from '../../../Controls/DualJoystickUI'

interface SplatViewerProps {
 url: string;
}

export function SplatViewer({ url }: SplatViewerProps) {
 const { scene } = useThree()
 const splatRef = useRef<THREE.Points>(null)
 const movementRef = useRef({ x: 0, y: 0 })
 const lookRef = useRef({ x: 0, y: 0 })

 useEffect(() => {
   // PLY loader implementation here
   // This would need a specific PLY loader for Gaussian Splats
 }, [url])

 useFrame(({ camera }) => {
   if (splatRef.current) {
     const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
     const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)

     camera.position.addScaledVector(forward, -movementRef.current.y * 0.1)
     camera.position.addScaledVector(right, movementRef.current.x * 0.1)

     camera.rotation.y += lookRef.current.x * 0.05
   }
 })

 return (
   <>
     <points ref={splatRef}>
       <pointsMaterial size={0.01} />
     </points>

     <DualJoystickUI
       onMove={(movement) => { movementRef.current = movement }}
       onLook={(rotation) => { lookRef.current = rotation }}
     />
   </>
 )
}