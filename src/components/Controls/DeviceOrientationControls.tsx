// src/components/Controls/DeviceOrientationControls.tsx
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

declare global {
  interface DeviceOrientationEvent {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  }
  interface Window {
    isSecureContext: boolean;
  }
}

interface DeviceOrientationControlsProps {
  enabled: boolean;
}

export function DeviceOrientationControls({ enabled }: DeviceOrientationControlsProps) {
  const { camera } = useThree();
  const orientationRef = useRef({ x: 0, y: 0, z: 0 });
  const startOrientationRef = useRef<null | { x: number; y: number; z: number }>(null);
  const isIOS = useRef(false);

  useEffect(() => {
    // iOS Erkennung
    isIOS.current = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (!enabled) return;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (!event.beta || !event.alpha || !event.gamma) return;

      let x = event.beta * Math.PI / 180;   // X-Achse [-180, 180]
      let y = event.alpha * Math.PI / 180;  // Y-Achse [0, 360]
      let z = event.gamma * Math.PI / 180;  // Z-Achse [-90, 90]

      // Initialisiere Startorientierung
      if (!startOrientationRef.current) {
        startOrientationRef.current = { x, y, z };
        return;
      }

      // Berechne relative Änderungen
      const deltaX = x - startOrientationRef.current.x;
      const deltaY = y - startOrientationRef.current.y;
      const deltaZ = z - startOrientationRef.current.z;

      // Aktualisiere Kamerarotation
      // Für iOS müssen wir die Achsen anders zuweisen
      if (isIOS.current) {
        camera.rotation.x = THREE.MathUtils.clamp(deltaX, -Math.PI / 2, Math.PI / 2);
        camera.rotation.y = -deltaZ;
      } else {
        camera.rotation.x = THREE.MathUtils.clamp(-deltaX, -Math.PI / 2, Math.PI / 2);
        camera.rotation.y = -deltaZ;
      }
    };

    const initOrientation = async () => {
      // Überprüfe HTTPS
      if (!window.isSecureContext) {
        console.error('Device orientation requires HTTPS');
        return;
      }

      try {
        // iOS Berechtigungsanfrage
        if (isIOS.current && typeof DeviceOrientationEvent.requestPermission === 'function') {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation, true);
          } else {
            console.warn('Device orientation permission denied');
          }
        } else {
          // Für Android und andere Geräte
          window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        }
      } catch (error) {
        console.error('Error initializing device orientation:', error);
      }
    };

    initOrientation();

    // Cleanup
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
      startOrientationRef.current = null;
      // Reset camera rotation
      if (camera) {
        camera.rotation.set(0, 0, 0);
      }
    };
  }, [camera, enabled]);

  return null;
}