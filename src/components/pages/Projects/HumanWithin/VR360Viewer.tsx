// src/components/pages/Projects/HumanWithin/VR360Viewer.tsx
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VR360ViewerProps {
 isOverUnder?: boolean;
}

export default function VR360Viewer({ isOverUnder = true }: VR360ViewerProps) {
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

 useEffect(() => {
   console.log('Loading image from:', '/Images/HW_360_VR_COLOR_CHECK_LOW.jpg');
   
   const textureLoader = new THREE.TextureLoader();
   const texture = textureLoader.load(
     'src/components/Images/HW_360_VR_COLOR_CHECK_LOW.jpg',
     (tex) => {
       console.log('Texture loaded successfully');
       if (isOverUnder) {
         tex.repeat.set(1, 0.5);
         tex.offset.set(0, 0);
       }
       tex.colorSpace = THREE.SRGBColorSpace;
     },
     undefined,
     (error) => console.error('Error loading texture:', error)
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
     if (keyStates.current.ArrowLeft) {
       rotationTarget.current.y += 0.02;
     }
     if (keyStates.current.ArrowRight) {
       rotationTarget.current.y -= 0.02;
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

     sphereRef.current.rotation.x += 
       (rotationTarget.current.x - sphereRef.current.rotation.x) * 0.1;
     sphereRef.current.rotation.y += 
       (rotationTarget.current.y - sphereRef.current.rotation.y) * 0.1;
   }
 });

 return (
   <div style={{ width: '100%', height: '100vh' }}>
     <Canvas camera={{ fov: 75, position: [0, 0, 0.1] }}>
       <ambientLight intensity={1} />
       <mesh ref={sphereRef}>
         <sphereGeometry args={[500, 60, 40]} />
         <meshBasicMaterial side={THREE.BackSide} />
       </mesh>
     </Canvas>
   </div>
 );
}