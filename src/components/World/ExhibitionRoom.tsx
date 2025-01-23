import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { WORLD_CONFIG } from '../../constants/config';
import type { ExhibitionRoomProps } from '../../types/world';

export const ExhibitionRoom = ({
  width = WORLD_CONFIG.ROOM.DEFAULT_WIDTH,
  height = WORLD_CONFIG.ROOM.DEFAULT_HEIGHT,
  depth = WORLD_CONFIG.ROOM.DEFAULT_DEPTH
}: ExhibitionRoomProps) => {
  const edges = useMemo(() => {
    const points = [
      // Base square
      [[-width/2, 0, -depth/2], [width/2, 0, -depth/2]],
      [[width/2, 0, -depth/2], [width/2, 0, depth/2]],
      [[width/2, 0, depth/2], [-width/2, 0, depth/2]],
      [[-width/2, 0, depth/2], [-width/2, 0, -depth/2]],
      // Top square
      [[-width/2, height, -depth/2], [width/2, height, -depth/2]],
      [[width/2, height, -depth/2], [width/2, height, depth/2]],
      [[width/2, height, depth/2], [-width/2, height, depth/2]],
      [[-width/2, height, depth/2], [-width/2, height, -depth/2]],
      // Connecting lines
      [[-width/2, 0, -depth/2], [-width/2, height, -depth/2]],
      [[width/2, 0, -depth/2], [width/2, height, -depth/2]],
      [[width/2, 0, depth/2], [width/2, height, depth/2]],
      [[-width/2, 0, depth/2], [-width/2, height, depth/2]]
    ];

    return points.map(([start, end]) => [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    ]);
  }, [width, height, depth]);

  return (
    <group>
      {edges.map((linePoints, i) => (
        <Line
          key={i}
          points={linePoints}
          color="#dedede"
          lineWidth={1}
          transparent
          opacity={0.5}
        />
      ))}
    </group>
  );
};