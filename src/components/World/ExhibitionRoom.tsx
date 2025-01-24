// src/components/World/ExhibitionRoom.tsx
import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { useBox, usePlane } from '@react-three/cannon';
import * as THREE from 'three';

interface ExhibitionRoomProps {
  width?: number;
  height?: number;
  depth?: number;
}

export function ExhibitionRoom({
  width = 40,
  height = 10,
  depth = 40
}: ExhibitionRoomProps) {
  // Drahtgitter-Linien
  const edges = useMemo(() => {
    const points = [
      // Unterer Rahmen
      [[-width/2, 0, -depth/2], [ width/2, 0, -depth/2]],
      [[ width/2, 0, -depth/2], [ width/2, 0,  depth/2]],
      [[ width/2, 0,  depth/2], [-width/2, 0,  depth/2]],
      [[-width/2, 0,  depth/2], [-width/2, 0, -depth/2]],
      // Oberer Rahmen
      [[-width/2, height, -depth/2], [ width/2, height, -depth/2]],
      [[ width/2, height, -depth/2], [ width/2, height,  depth/2]],
      [[ width/2, height,  depth/2], [-width/2, height,  depth/2]],
      [[-width/2, height,  depth/2], [-width/2, height, -depth/2]],
      // Vertikale Linien
      [[-width/2, 0, -depth/2], [-width/2, height, -depth/2]],
      [[ width/2, 0, -depth/2], [ width/2, height, -depth/2]],
      [[ width/2, 0,  depth/2], [ width/2, height,  depth/2]],
      [[-width/2, 0,  depth/2], [-width/2, height,  depth/2]]
    ];
    return points.map(([start, end]) => [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    ]);
  }, [width, height, depth]);

  // Collider für Boden
  usePlane(() => ({
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0], // horizontal
    type: 'Static'
  }));

  // Wände
  useBox(() => ({
    position: [0, height / 2, -depth / 2],
    args: [width, height, 1],
    type: 'Static'
  }));
  useBox(() => ({
    position: [0, height / 2, depth / 2],
    args: [width, height, 1],
    type: 'Static'
  }));
  useBox(() => ({
    position: [-width / 2, height / 2, 0],
    args: [1, height, depth],
    type: 'Static'
  }));
  useBox(() => ({
    position: [width / 2, height / 2, 0],
    args: [1, height, depth],
    type: 'Static'
  }));

  // Optional: Decke
  // useBox(() => ({
  //   position: [0, height, 0],
  //   args: [width, 1, depth],
  //   type: 'Static'
  // }));

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
}
