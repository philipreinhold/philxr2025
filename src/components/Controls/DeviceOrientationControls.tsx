// DeviceOrientationControls.tsx
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface DeviceOrientationControlsProps {
  enabled: boolean;
  fixHeight?: number; // z.B. 1.7 für "Augenhöhe"
}

/**
 * Diese Version lehnt sich an das klassische three.js DeviceOrientationControls-Beispiel an.
 * Sie berechnet die Kamera-Quaternion aus alpha, beta, gamma, inkl. Bildschirm-orientierung.
 */
export function DeviceOrientationControls({
  enabled,
  fixHeight = 1.7
}: DeviceOrientationControlsProps) {
  const { camera } = useThree();

  useEffect(() => {
    if (!enabled) return;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      // --- 1) alpha, beta, gamma in Bogenmaß ---
      const alpha = event.alpha ? THREE.MathUtils.degToRad(event.alpha) : 0; // Z-Achse
      const beta = event.beta ? THREE.MathUtils.degToRad(event.beta) : 0;    // X-Achse
      const gamma = event.gamma ? THREE.MathUtils.degToRad(event.gamma) : 0; // Y-Achse

      // --- 2) Bildschirm-Orientierung auslesen (Portrait/Landscape) ---
      //     iOS: window.orientation (alt), neuere Browser: screen.orientation.angle
      let orientDeg = 0;
      if (typeof window.orientation === 'number') {
        // Eher ältere iOS-Geräte
        orientDeg = window.orientation;
      } else if (
        screen.orientation && 
        typeof screen.orientation.angle === 'number'
      ) {
        // Moderne Browser (Android, neuere Desktop- oder iOS-Betas)
        orientDeg = screen.orientation.angle;
      }
      const orient = THREE.MathUtils.degToRad(orientDeg);

      // --- 3) Eulers und Quaternions aufbauen ---
      //     Reihenfolge YXZ hat sich in der Praxis bewährt:
      //       - Beta (X) => Kippen
      //       - Alpha (Y) => Drehen
      //       - Gamma (Z) => Seitenneigung
      //     Dazu kommt später ein Offset und die Bildschirm-Korrektur.
      const euler = new THREE.Euler(0, 0, 0, 'YXZ');
      euler.set(beta, alpha, -gamma, 'YXZ');

      // q0: Offset-Quaternion, damit "Handy gerade vor dem Gesicht" => Blick nach vorne
      //     - hier rotieren wir um -90° auf der X-Achse
      const q0 = new THREE.Quaternion();
      q0.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI / 2);

      // qOrient: Korrektur für Portrait vs. Landscape
      const qOrient = new THREE.Quaternion();
      qOrient.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -orient);

      // --- 4) Zusammenmultiplizieren ---
      const quaternion = new THREE.Quaternion();
      quaternion.setFromEuler(euler); // aus alpha,beta,gamma
      quaternion.multiply(q0);        // Offset
      quaternion.multiply(qOrient);   // Bildschirmlage

      // --- 5) Kamera-Anpassungen ---
      camera.quaternion.copy(quaternion);
      if (fixHeight !== null) {
        camera.position.y = fixHeight;
      }
    };

    // --- 6) Listener einhängen ---
    window.addEventListener('deviceorientation', handleDeviceOrientation, true);

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
    };
  }, [camera, enabled, fixHeight]);

  return null;
}
