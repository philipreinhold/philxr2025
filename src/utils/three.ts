import * as THREE from 'three';
import { WORLD_CONFIG } from '../constants/config';

export const createFog = () => {
  return new THREE.Fog(
    '#ffffff',
    WORLD_CONFIG.FOG.NEAR,
    WORLD_CONFIG.FOG.FAR
  );
};

export const calculateStructurePositions = (count: number) => {
  return Array(count).fill(null).map(() => ({
    position: [
      (Math.random() - 0.5) * WORLD_CONFIG.STRUCTURES.SPAWN_RANGE,
      WORLD_CONFIG.STRUCTURES.MIN_HEIGHT + Math.random() * 
        (WORLD_CONFIG.STRUCTURES.MAX_HEIGHT - WORLD_CONFIG.STRUCTURES.MIN_HEIGHT),
      (Math.random() - 0.5) * WORLD_CONFIG.STRUCTURES.SPAWN_RANGE,
    ] as [number, number, number],
  }));
};
