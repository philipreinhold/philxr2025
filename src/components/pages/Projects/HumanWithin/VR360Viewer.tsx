// src/components/pages/Projects/HumanWithin/VR360Viewer.tsx
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VR360ViewerProps {
  imageUrl: string;
  isOverUnder?: boolean;
  controls?: {
    movement: { x: number, y: number };
    look: { x: number, y: number };
  };
}

export default function VR360Viewer({ 
  imageUrl, 
  isOverUnder = true,
  controls 
}: VR360ViewerProps) {
  const { camera } = useThree();
  const sphereRef = useRef<THREE.Mesh>(null);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (texture) => {
      if (isOverUnder) {
        texture.repeat.set(1, 0.5);
        texture.offset.set(0, 0.5);
      }
      // SRGB Farbraum setzen
      texture.colorSpace = THREE.SRGBColorSpace;
      
      if (sphereRef.current) {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide
        });
        sphereRef.current.material = material;
      }
    });
  }, [imageUrl, isOverUnder]);

  // Frame-Update für Controls
  useFrame(() => {
    if (!sphereRef.current || !controls) return;

    // Movement Controls (Rotation basierend auf Bewegung)
    rotationRef.current.y += controls.movement.x * 0.03;
    rotationRef.current.x = THREE.MathUtils.clamp(
      rotationRef.current.x + controls.movement.y * 0.03,
      -Math.PI / 2,
      Math.PI / 2
    );

    // Look Controls (direkte Rotation)
    if (controls.look) {
      rotationRef.current.y += controls.look.x * 0.03;
      rotationRef.current.x = THREE.MathUtils.clamp(
        rotationRef.current.x + controls.look.y * 0.03,
        -Math.PI / 2,
        Math.PI / 2
      );
    }

    // Apply rotations with smooth damping
    sphereRef.current.rotation.x += (rotationRef.current.x - sphereRef.current.rotation.x) * 0.1;
    sphereRef.current.rotation.y += (rotationRef.current.y - sphereRef.current.rotation.y) * 0.1;
    sphereRef.current.rotation.z += (0 - sphereRef.current.rotation.z) * 0.1;
  });

  return (
    <mesh ref={sphereRef} rotation={[0, 0, 0]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial side={THREE.BackSide} />
    </mesh>
  );
}