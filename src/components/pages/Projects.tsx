import { useRef, useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DualJoystickUI } from '../Controls/DualJoystickUI';
import { MobileCameraControls } from '../Controls/MobileCameraControls';
import { DeviceOrientationControls } from '../Controls/DeviceOrientationControls';

function CameraControls({ 
  movementRef, 
  lookRef, 
  useDeviceOrientation 
}: {
  movementRef: React.MutableRefObject<{ x: number; y: number }>;
  lookRef: React.MutableRefObject<{ x: number; y: number }>;
  useDeviceOrientation: boolean;
}) {
  const { camera } = useThree();
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ')); // Kamerarotation
  const speed = useRef(0.15); // Bewegungsgeschwindigkeit
  const initialY = useRef(1.7); // Konstante Kamerahöhe

  useFrame(() => {
    // 1. Kamera-Rotation (Joystick oder Tasten)
    if (!useDeviceOrientation) {
      euler.current.y -= lookRef.current.x * speed.current; // Horizontale Rotation
      euler.current.x = THREE.MathUtils.clamp(
        euler.current.x - lookRef.current.y * speed.current, // Vertikale Rotation
        -Math.PI / 2.5, // Begrenzung nach oben
        Math.PI / 2.5   // Begrenzung nach unten
      );
      camera.quaternion.setFromEuler(euler.current); // Rotation anwenden
    }

    // 2. Kamera-Bewegung (Joystick oder Tasten)
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion); // Vorwärts
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion); // Seitwärts

    forward.y = 0; // Keine vertikale Bewegung
    right.y = 0;
    forward.normalize();
    right.normalize();

    // Bewegung basierend auf `movementRef`
    camera.position.addScaledVector(forward, -movementRef.current.y * speed.current);
    camera.position.addScaledVector(right, movementRef.current.x * speed.current);

    // Konstante Höhe sicherstellen
    camera.position.y = initialY.current;
  });

  return null;
}

function BackgroundSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const texture = new THREE.TextureLoader().load(
      'src/components/Images/HW_360_VR_COLOR_CHECK_LOW.jpg',
      (tex) => {
        tex.repeat.set(1, 0.5);
        tex.offset.set(0, 0.5);
        tex.colorSpace = THREE.SRGBColorSpace;
      }
    );

    if (sphereRef.current) {
      sphereRef.current.material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide, // Die Innenseite der Kugel wird gerendert
      });
    }

    return () => texture.dispose();
  }, []);

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial side={THREE.BackSide} />
    </mesh>
  );
}

export default function Projects() {
  const movementRef = useRef({ x: 0, y: 0 }); // Bewegungsrichtung
  const lookRef = useRef({ x: 0, y: 0 }); // Blickrichtung
  const [isLocked, setIsLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useDeviceOrientation, setUseDeviceOrientation] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0;
      setIsMobile(isTouchDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const requestOrientationPermission = async () => {
    if (!window.isSecureContext) {
      alert('Device orientation requires HTTPS');
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    try {
      if (isIOS && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permission = await DeviceOrientationEvent.requestPermission();
        setUseDeviceOrientation(permission === 'granted');
      } else {
        setUseDeviceOrientation(true);
      }
    } catch (error) {
      console.error('Error requesting orientation permission:', error);
    }
  };

  const handleStartExploring = useCallback(async () => {
    setIsLocked(true);
    setShowControls(true);
    if (isMobile) await requestOrientationPermission();
  }, [isMobile]);

  const handleStopExploring = useCallback(() => {
    setIsLocked(false);
    setShowControls(false);
    setUseDeviceOrientation(false);
    movementRef.current = { x: 0, y: 0 };
    lookRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLocked) {
        handleStopExploring();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, handleStopExploring]);

  return (
    <div className="relative w-screen h-screen bg-white">
      <div className="absolute inset-0">
        <Canvas
          camera={{
            position: [0, 1.7, 0],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <BackgroundSphere />
            <CameraControls 
              movementRef={movementRef}
              lookRef={lookRef}
              useDeviceOrientation={useDeviceOrientation}
            />
            {useDeviceOrientation && (
              <DeviceOrientationControls enabled={isLocked} />
            )}
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="pointer-events-auto">
          <div className="max-w-2xl mx-auto mt-32 p-8">
            <h1 className="text-2xl mb-4">Human Within</h1>
            <p className="text-lg opacity-80">VR Experience in 360° stereo</p>
          </div>
        </div>

        {showControls && (
          <div className="fixed bottom-0 left-0 right-0 pb-4 pointer-events-none">
            <DualJoystickUI
              onMove={(movement) => {
                movementRef.current = movement;
              }}
              onLook={(rotation) => {
                if (!useDeviceOrientation) {
                  lookRef.current = rotation;
                }
              }}
            />
          </div>
        )}
      </div>

      {!isLocked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="space-y-4 text-center">
            <button 
              className="px-6 py-3 text-sm bg-white/80 backdrop-blur-sm rounded-lg 
                       pointer-events-auto hover:bg-white/90 transition-colors"
              onClick={handleStartExploring}
            >
              {isMobile ? 'Tap to explore' : 'Click to explore'}
            </button>
            {isMobile && (
              <p className="text-xs text-black/60">
                Enable device orientation for immersive viewing
              </p>
            )}
          </div>
        </div>
      )}

      {isLocked && (
        <div className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm">
          <button
            className="px-3 py-1 text-xs bg-white/80 backdrop-blur-sm rounded-lg 
                     pointer-events-auto hover:bg-white/90 transition-colors"
            onClick={handleStopExploring}
          >
            Exit View
          </button>
          {isMobile && (
            <button
              className={`px-3 py-1 text-xs backdrop-blur-sm rounded-lg pointer-events-auto 
                     transition-colors ${
                       useDeviceOrientation 
                         ? 'bg-blue-500/20 text-blue-500' 
                         : 'bg-white/80 hover:bg-white/90'
                     }`}
              onClick={requestOrientationPermission}
            >
              {useDeviceOrientation ? 'Motion Control Active' : 'Enable Motion Control'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
