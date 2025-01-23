import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface MobileControlsProps {
  enabled: boolean;
  moveSpeed?: number;
}

export function MobileControls({ enabled, moveSpeed = 0.05 }: MobileControlsProps) {
  const { camera } = useThree();
  const initialOrientation = useRef<DeviceOrientationEvent | null>(null);
  const movement = useRef(new THREE.Vector3());
  
  useEffect(() => {
    if (!enabled) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!event.beta || !event.gamma) return;

      if (!initialOrientation.current) {
        initialOrientation.current = event;
        return;
      }

      // Calculate rotation differences from initial position
      const deltaGamma = THREE.MathUtils.degToRad((event.gamma || 0) - (initialOrientation.current.gamma || 0));
      const deltaBeta = THREE.MathUtils.degToRad((event.beta || 0) - (initialOrientation.current.beta || 0));

      // Apply horizontal rotation (looking left/right)
      camera.rotation.y = -deltaGamma;
      
      // Apply vertical rotation (looking up/down) with limits
      camera.rotation.x = THREE.MathUtils.clamp(
        -deltaBeta,
        -Math.PI / 3, // Look up limit
        Math.PI / 3   // Look down limit
      );
    };

    const handleMotion = (event: DeviceMotionEvent) => {
      if (!event.accelerationIncludingGravity) return;

      const acc = event.accelerationIncludingGravity;
      const tiltThreshold = 3;

      // Forward/backward movement based on phone tilt
      if (acc.z) {
        movement.current.z = THREE.MathUtils.clamp(
          (acc.z - tiltThreshold) * moveSpeed,
          -moveSpeed,
          moveSpeed
        );
      }

      // Left/right movement based on phone tilt
      if (acc.x) {
        movement.current.x = THREE.MathUtils.clamp(
          acc.x * moveSpeed,
          -moveSpeed,
          moveSpeed
        );
      }

      // Apply movement in camera's direction
      const forward = new THREE.Vector3(0, 0, -movement.current.z);
      forward.applyQuaternion(camera.quaternion);
      forward.y = 0;

      const right = new THREE.Vector3(movement.current.x, 0, 0);
      right.applyQuaternion(camera.quaternion);
      right.y = 0;

      camera.position.add(forward);
      camera.position.add(right);
    };

    const requestPermissions = async () => {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            window.addEventListener('devicemotion', handleMotion);
          }
        } catch (error) {
          console.warn('Permission denied:', error);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('devicemotion', handleMotion);
      }
    };

    requestPermissions();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
      initialOrientation.current = null;
    };
  }, [camera, enabled, moveSpeed]);

  return null;
}