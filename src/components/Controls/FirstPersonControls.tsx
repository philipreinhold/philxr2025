import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ControlsProps } from '../../types/controls';

export const FirstPersonControls = ({ 
  movementRef, 
  onLock, 
  onUnlock 
}: ControlsProps) => {
  const { camera } = useThree();
  const isLockedRef = useRef(false);
  const speedRef = useRef(0.15);

  useEffect(() => {
    const handlePointerLockChange = () => {
      const isLocked = document.pointerLockElement === document.body;
      isLockedRef.current = isLocked;
      if (isLocked) {
        onLock?.();
      } else {
        onUnlock?.();
      }
    };

    const handlePointerLockError = (error: any) => {
      console.warn('Pointer Lock Error:', error);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', handlePointerLockError);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('pointerlockerror', handlePointerLockError);
    };
  }, [onLock, onUnlock]);

  useFrame(() => {
    if (!isLockedRef.current || !movementRef.current) return;

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
  });

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isLockedRef.current) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      // Rotate camera based on mouse movement
      camera.rotation.y -= movementX * 0.002;
      camera.rotation.x = THREE.MathUtils.clamp(
        camera.rotation.x - movementY * 0.002,
        -Math.PI / 2,
        Math.PI / 2
      );
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera]);

  return null;
};