import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MovementRef } from '../../types/controls';

interface CameraControlsProps {
  movement: MutableRefObject<MovementRef>;
}

export const CameraControls = ({ movement }: CameraControlsProps) => {
  const { camera } = useThree();
  const speedRef = useRef(0.15);

  useFrame(() => {
    if (!movement.current) return;

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
      .addScaledVector(forward, -movement.current.y * speedRef.current)
      .addScaledVector(right, movement.current.x * speedRef.current);

    camera.position.add(moveVector);
  });

  return null;
};