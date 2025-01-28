import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraControls = ({ 
  movementRef, 
  lookRef,
  useDeviceOrientation = false 
}) => {
  useFrame(({ camera }) => {
    if (!movementRef?.current || useDeviceOrientation) return;

    // Movement
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3(1, 0, 0);
    right.applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    camera.position.addScaledVector(forward, -movementRef.current.y * 0.15);
    camera.position.addScaledVector(right, movementRef.current.x * 0.15);

    // Look/Rotation
    if (lookRef?.current) {
      camera.rotation.y -= lookRef.current.x * 0.05;
      camera.rotation.x = THREE.MathUtils.clamp(
        camera.rotation.x - lookRef.current.y * 0.05,
        -Math.PI / 2,
        Math.PI / 2
      );
    }
  });

  return null;
};