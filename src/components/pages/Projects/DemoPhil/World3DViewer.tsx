// src/components/pages/Projects/DemoPhil/World3DViewer.tsx
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { DualJoystickUI } from '../../../Controls/DualJoystickUI'

export function World3DViewer() {
 const { scene } = useThree()
 const movementRef = useRef({ x: 0, y: 0 })
 const lookRef = useRef({ x: 0, y: 0 })

 useFrame(({ camera }) => {
   const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
   const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)

   forward.y = 0
   right.y = 0

   camera.position.addScaledVector(forward, -movementRef.current.y * 0.1)
   camera.position.addScaledVector(right, movementRef.current.x * 0.1)

   camera.rotation.y += lookRef.current.x * 0.05
 })

 return (
   <>
     {/* Demo World Elements */}
     <ambientLight intensity={0.5} />
     <pointLight position={[10, 10, 10]} />
     <mesh position={[0, 0, -5]}>
       <boxGeometry />
       <meshStandardMaterial color="orange" />
     </mesh>

     <DualJoystickUI
       onMove={(movement) => { movementRef.current = movement }}
       onLook={(rotation) => { lookRef.current = rotation }}
     />
   </>
 )
}