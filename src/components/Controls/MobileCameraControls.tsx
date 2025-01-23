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
  const speedRef = useRef(0.15);
  const rotationSpeedRef = useRef(0.05);

  useFrame(() => {
    // Handle Movement
    if (movementRef.current) {
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(camera.quaternion);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3(1, 0, 0);
      right.applyQuaternion(camera.quaternion);
      right.y = 0;
      right.normalize();

      const moveVector = new THREE.Vector3();
      moveVector
        .addScaledVector(forward, -movementRef.current.y * speedRef.current)
        .addScaledVector(right, movementRef.current.x * speedRef.current);

      camera.position.add(moveVector);
    }

    // Handle Look/Rotation only if not using device orientation
    if (!useDeviceOrientation && lookRef.current) {
      camera.rotation.y -= lookRef.current.x * rotationSpeedRef.current;
      
      const newRotationX = camera.rotation.x - lookRef.current.y * rotationSpeedRef.current;
      camera.rotation.x = THREE.MathUtils.clamp(
        newRotationX,
        -Math.PI / 2.5,
        Math.PI / 2.5
      );
    }
  });

  useEffect(() => {
    return () => {
      if (camera) {
        camera.rotation.set(0, 0, 0);
      }
    };
  }, [camera]);

  return null;
}