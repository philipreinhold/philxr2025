import { useEffect } from 'react';
import { MobileCameraControls } from './MobileCameraControls';
import { DeviceOrientationControls } from './DeviceOrientationControls';
import { DualJoystickUI } from './DualJoystickUI';

interface VRViewerControlsProps {
  movementRef: React.MutableRefObject<{ x: number; y: number }>;
  lookRef: React.MutableRefObject<{ x: number; y: number }>;
  isLocked: boolean;
  isMobile: boolean;
  useDeviceOrientation: boolean;
}

export function VRViewerControls({
  movementRef,
  lookRef,
  isLocked,
  isMobile,
  useDeviceOrientation
}: VRViewerControlsProps) {
  // Debug-Ausgaben für bessere Diagnose
  useEffect(() => {
    console.log('VRViewerControls wurde gerendert mit:', {
      isLocked,
      isMobile,
      useDeviceOrientation
    });
  }, [isLocked, isMobile, useDeviceOrientation]);

  // Wenn der Betrachter gesperrt ist (immersiver Modus)
  if (!isLocked) return null;

  return (
    <>
      {/* Kamera-Steuerung mit MobileCameraControls */}
      <MobileCameraControls
        movementRef={movementRef}
        lookRef={lookRef}
        useDeviceOrientation={useDeviceOrientation}
      />

      {/* DeviceOrientation-Steuerung nur aktivieren, wenn explizit angefordert */}
      {useDeviceOrientation && (
        <DeviceOrientationControls enabled={true} />
      )}

      {/* Joystick-UI nur auf Mobilgeräten ohne Orientierungssteuerung anzeigen */}
      {isMobile && !useDeviceOrientation && (
        <DualJoystickUI
          onMove={(movement) => {
            // Debug beim Bewegen
            if (movement.x !== 0 || movement.y !== 0) {
              console.log('Joystick Bewegung:', movement);
            }
            movementRef.current = movement;
          }}
          onLook={(look) => {
            // Debug beim Umschauen
            if (look.x !== 0 || look.y !== 0) {
              console.log('Joystick Umschauen:', look);
            }
            lookRef.current = look;
          }}
        />
      )}
    </>
  );
} 