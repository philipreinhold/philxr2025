// src/components/backgrounds/UnifiedVR360.tsx
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface UnifiedVR360Props {
  imageUrl: string;
  controls: {
    movement: { x: number; y: number };
    look: { x: number; y: number };
  };
  useDeviceOrientation?: boolean;
}

export function UnifiedVR360({ 
  imageUrl, 
  controls,
  useDeviceOrientation = false 
}: UnifiedVR360Props) {
  const { camera } = useThree();
  const sphereRef = useRef<THREE.Mesh>(null);
  const currentRotation = useRef({ x: 0, y: Math.PI, z: 0 });
  const targetRotation = useRef({ x: 0, y: Math.PI, z: 0 });

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      
      if (sphereRef.current) {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide
        });
        sphereRef.current.material = material;
      }
    });

    // Initial camera setup
    camera.rotation.order = 'YXZ';
    camera.position.set(0, 1.7, 0);
  }, [imageUrl, camera]);

  useFrame(() => {
    if (!controls || useDeviceOrientation) return;

    // Update target rotation based on controls
    targetRotation.current.y -= controls.movement.x * 0.05;
    targetRotation.current.x = THREE.MathUtils.clamp(
      targetRotation.current.x - controls.movement.y * 0.05,
      -Math.PI / 2.5,
      Math.PI / 2.5
    );

    // Apply look controls
    targetRotation.current.y -= controls.look.x * 0.05;
    targetRotation.current.x = THREE.MathUtils.clamp(
      targetRotation.current.x - controls.look.y * 0.05,
      -Math.PI / 2.5,
      Math.PI / 2.5
    );

    // Smooth interpolation of camera rotation
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.1;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.1;

    // Apply rotations to camera
    if (camera) {
      camera.rotation.x = currentRotation.current.x;
      camera.rotation.y = currentRotation.current.y;
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial side={THREE.BackSide} />
    </mesh>
  );
}