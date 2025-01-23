// src/components/Controls/DeviceOrientationControls.tsx
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface DeviceOrientationControlsProps {
  enabled: boolean;
}

export function DeviceOrientationControls({ enabled }: DeviceOrientationControlsProps) {
  const { camera } = useThree();
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const initialY = useRef(1.7);
  const startOrientationRef = useRef<null | { beta: number; gamma: number; alpha: number }>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (!event.beta || !event.gamma || !event.alpha) return;

      // Erste Orientierung als Referenz speichern
      if (!startOrientationRef.current) {
        startOrientationRef.current = {
          beta: event.beta,
          gamma: event.gamma,
          alpha: event.alpha
        };
        return;
      }

      // Relative Änderungen berechnen
      const deltaX = THREE.MathUtils.degToRad(event.beta - startOrientationRef.current.beta);
      const deltaY = THREE.MathUtils.degToRad(event.alpha - startOrientationRef.current.alpha);

      // Vertikale Rotation (X-Achse)
      euler.current.x = THREE.MathUtils.clamp(
        -deltaX,
        -Math.PI / 2.5,
        Math.PI / 2.5
      );

      // Horizontale Rotation (Y-Achse)
      euler.current.y = -THREE.MathUtils.degToRad(event.alpha);

      // Keine Z-Rotation (verhindert Rollen)
      euler.current.z = 0;

      // Anwenden der Rotation
      camera.quaternion.setFromEuler(euler.current);
      
      // Konstante Höhe beibehalten
      camera.position.y = initialY.current;
    };

    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation, true);
          }
        } catch (error) {
          console.warn('Device orientation permission denied:', error);
        }
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
      startOrientationRef.current = null;
      if (camera) {
        camera.rotation.set(0, 0, 0);
        camera.position.y = initialY.current;
      }
    };
  }, [camera, enabled]);

  return null;
}