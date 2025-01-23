// src/components/Controls/Controls.tsx
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ControlsProps {
  movementRef: React.MutableRefObject<{ x: number; y: number }>;
  lookRef?: React.MutableRefObject<{ x: number; y: number }>;
  useDeviceOrientation?: boolean;
  enabled: boolean;
  onLock?: () => void;
  onUnlock?: () => void;
}

const Controls = ({ 
  movementRef,
  lookRef,
  useDeviceOrientation = false,
  enabled,
  onLock,
  onUnlock 
}: ControlsProps) => {
  const { camera } = useThree();
  const speedRef = useRef(0.15);
  const rotationSpeed = useRef(0.05);
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const initialY = useRef(1.7);
  const baseRotation = useRef<null | { alpha: number; beta: number; gamma: number }>(null);
  const isLockedRef = useRef(false);

  useEffect(() => {
    if (useDeviceOrientation) return;

    const handlePointerLockChange = () => {
      const isLocked = document.pointerLockElement === document.body;
      isLockedRef.current = isLocked;
      if (isLocked) onLock?.();
      else onUnlock?.();
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, [useDeviceOrientation, onLock, onUnlock]);

  useEffect(() => {
    if (!useDeviceOrientation || !enabled) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!event.beta || !event.gamma) return;

      if (!baseRotation.current) {
        baseRotation.current = {
          alpha: event.alpha || 0,
          beta: event.beta,
          gamma: event.gamma
        };
        return;
      }

      const deltaGamma = THREE.MathUtils.degToRad(
        (event.gamma) - (baseRotation.current.gamma)
      );
      const deltaBeta = THREE.MathUtils.degToRad(
        (event.beta) - (baseRotation.current.beta)
      );

      euler.current.y = -deltaGamma;
      euler.current.x = THREE.MathUtils.clamp(
        -deltaBeta,
        -Math.PI / 2.5,
        Math.PI / 2.5
      );

      camera.quaternion.setFromEuler(euler.current);
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      baseRotation.current = null;
    };
  }, [camera, useDeviceOrientation, enabled]);

  useEffect(() => {
    if (!enabled || useDeviceOrientation) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!isLockedRef.current) return;
      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      camera.rotation.y -= movementX * 0.002;
      camera.rotation.x = THREE.MathUtils.clamp(
        camera.rotation.x - movementY * 0.002,
        -Math.PI / 2,
        Math.PI / 2
      );
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [camera, enabled, useDeviceOrientation]);

  useFrame(() => {
    if (!enabled || !movementRef.current) return;

    if (!useDeviceOrientation && lookRef?.current) {
      euler.current.y -= lookRef.current.x * rotationSpeed.current;
      euler.current.x = THREE.MathUtils.clamp(
        euler.current.x - lookRef.current.y * rotationSpeed.current,
        -Math.PI / 2.5,
        Math.PI / 2.5
      );
      euler.current.z = 0;
      camera.quaternion.setFromEuler(euler.current);
    }

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3(1, 0, 0);
    right.applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    const moveVector = new THREE.Vector3()
      .addScaledVector(forward, -movementRef.current.y * speedRef.current)
      .addScaledVector(right, movementRef.current.x * speedRef.current);

    camera.position.add(moveVector);
    camera.position.y = initialY.current;
  });

  useEffect(() => {
    return () => {
      if (camera) {
        camera.rotation.set(0, 0, 0);
        camera.position.y = initialY.current;
      }
    };
  }, [camera]);

  return null;
};

export default Controls;