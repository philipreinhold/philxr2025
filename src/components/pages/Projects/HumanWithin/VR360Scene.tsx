// src/components/pages/Projects/HumanWithin/VR360Scene.tsx
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VR360SceneProps {
 controls: { x: number; y: number };
 isOverUnder?: boolean;
}

export default function VR360Scene({ controls, isOverUnder = true }: VR360SceneProps) {
 const sphereRef = useRef<THREE.Mesh>(null);
 const keyStates = useRef({
   ArrowLeft: false,
   ArrowRight: false,
   ArrowUp: false,
   ArrowDown: false,
 });

 const rotationTarget = useRef({
   x: 0,
   y: Math.PI - Math.PI / 2.57,
   z: 0,
 });
 const autoRotateSpeed = 0.0001;

 useEffect(() => {
   const textureLoader = new THREE.TextureLoader();
   const texture = textureLoader.load(
     '/Images/HW_360_VR_COLOR_CHECK_LOW.jpg',
     (tex) => {
       if (isOverUnder) {
         tex.repeat.set(1, 0.5);
         tex.offset.set(0, 0);
       }
       tex.colorSpace = THREE.SRGBColorSpace;
     }
   );

   if (sphereRef.current) {
     sphereRef.current.material = new THREE.MeshBasicMaterial({
       map: texture,
       side: THREE.BackSide,
     });
   }

   const handleKeyDown = (e: KeyboardEvent) => {
     if (e.key in keyStates.current) {
       keyStates.current[e.key as keyof typeof keyStates.current] = true;
     }
   };

   const handleKeyUp = (e: KeyboardEvent) => {
     if (e.key in keyStates.current) {
       keyStates.current[e.key as keyof typeof keyStates.current] = false;
     }
   };

   window.addEventListener('keydown', handleKeyDown);
   window.addEventListener('keyup', handleKeyUp);

   return () => {
     texture.dispose();
     window.removeEventListener('keydown', handleKeyDown);
     window.removeEventListener('keyup', handleKeyUp);
   };
 }, [isOverUnder]);

 useFrame(() => {
   if (sphereRef.current) {
     const { rotation } = sphereRef.current;

     // Auto-rotation
     rotationTarget.current.y += autoRotateSpeed;

     // Keyboard controls
     if (keyStates.current.ArrowLeft) {
       rotationTarget.current.y += 0.02;
       rotationTarget.current.z = 0.1;
     }
     if (keyStates.current.ArrowRight) {
       rotationTarget.current.y -= 0.02;
       rotationTarget.current.z = -0.1;
     }
     if (keyStates.current.ArrowUp) {
       rotationTarget.current.x = Math.min(
         rotationTarget.current.x + 0.02,
         Math.PI / 4
       );
     }
     if (keyStates.current.ArrowDown) {
       rotationTarget.current.x = Math.max(
         rotationTarget.current.x - 0.02,
         -Math.PI / 4
       );
     }

     // Joystick controls
     rotationTarget.current.y += controls.x * 0.05;
     rotationTarget.current.x = THREE.MathUtils.clamp(
       rotationTarget.current.x + controls.y * 0.05,
       -Math.PI / 4,
       Math.PI / 4
     );

     // Return to neutral position
     if (!keyStates.current.ArrowLeft && !keyStates.current.ArrowRight && 
         Math.abs(controls.x) < 0.01) {
       rotationTarget.current.y += (Math.PI - Math.PI / 2.57 - rotationTarget.current.y) * 0.02;
       rotationTarget.current.z += (0 - rotationTarget.current.z) * 0.05;
     }
     if (!keyStates.current.ArrowUp && !keyStates.current.ArrowDown && 
         Math.abs(controls.y) < 0.01) {
       rotationTarget.current.x += (0 - rotationTarget.current.x) * 0.02;
     }

     // Smooth rotation
     rotation.x += (rotationTarget.current.x - rotation.x) * 0.1;
     rotation.y += (rotationTarget.current.y - rotation.y) * 0.1;
     rotation.z += (rotationTarget.current.z - rotation.z) * 0.1;
   }
 });

 return (
   <mesh ref={sphereRef}>
     <sphereGeometry args={[500, 60, 40]} />
     <meshBasicMaterial side={THREE.BackSide} />
   </mesh>
 );
}