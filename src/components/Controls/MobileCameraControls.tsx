// src/components/Controls/MobileCameraControls.tsx
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MobileCameraControlsProps {
  movementRef: React.MutableRefObject<{ x: number; y: number }>;
  lookRef: React.MutableRefObject<{ x: number; y: number }>;
  useDeviceOrientation?: boolean;
}

export function MobileCameraControls({ 
  movementRef, 
  lookRef,
  useDeviceOrientation = false 
}: MobileCameraControlsProps) {
  const { camera } = useThree();
  const moveSpeed = useRef(0.15);
  const rotationSpeed = useRef(0.05);
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ')); // YXZ order ist wichtig für FPS-Style
  const initialY = useRef(1.7); // Konstante Höhe

  useFrame(() => {
    if (!useDeviceOrientation) {
      // Look/Rotation
      if (lookRef.current) {
        // Horizontale Rotation (um globale Y-Achse)
        euler.current.y -= lookRef.current.x * rotationSpeed.current;
        
        // Vertikale Rotation (um lokale X-Achse)
        euler.current.x = THREE.MathUtils.clamp(
          euler.current.x - lookRef.current.y * rotationSpeed.current,
          -Math.PI / 2.5, // Begrenzt den Blick nach oben
          Math.PI / 2.5  // Begrenzt den Blick nach unten
        );
        
        // Keine Z-Rotation (verhindert Rollen)
        euler.current.z = 0;
        
        // Anwenden der Rotation
        camera.quaternion.setFromEuler(euler.current);
      }
    }

    // Movement
    if (movementRef.current) {
      // Bewegungsrichtung basierend auf Kameraausrichtung
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(camera.quaternion);
      forward.y = 0; // Horizontale Bewegung
      forward.normalize();

      const right = new THREE.Vector3(1, 0, 0);
      right.applyQuaternion(camera.quaternion);
      right.y = 0; // Horizontale Bewegung
      right.normalize();

      const moveVector = new THREE.Vector3();
      moveVector
        .addScaledVector(forward, -movementRef.current.y * moveSpeed.current)
        .addScaledVector(right, movementRef.current.x * moveSpeed.current);

      // Bewegung anwenden
      camera.position.add(moveVector);
      
      // Konstante Höhe beibehalten
      camera.position.y = initialY.current;
    }
  });

  // Reset camera rotation when unmounting
  useEffect(() => {
    return () => {
      if (camera) {
        camera.rotation.set(0, 0, 0);
        camera.position.y = initialY.current;
      }
    };
  }, [camera]);

  return null;
}