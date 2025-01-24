import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Line, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';

const ModernBuilding = () => {
  const walls = useMemo(() => {
    const points = [];

    // Ground floor walls
    points.push([
      new THREE.Vector3(-20, 0, -20),
      new THREE.Vector3(-20, 10, -20),
    ]);
    points.push([
      new THREE.Vector3(-20, 0, -20),
      new THREE.Vector3(20, 0, -20),
    ]);
    points.push([
      new THREE.Vector3(20, 0, -20),
      new THREE.Vector3(20, 10, -20),
    ]);
    points.push([
      new THREE.Vector3(20, 0, 20),
      new THREE.Vector3(20, 10, 20),
    ]);
    points.push([
      new THREE.Vector3(-20, 0, 20),
      new THREE.Vector3(-20, 10, 20),
    ]);
    points.push([
      new THREE.Vector3(-20, 10, -20),
      new THREE.Vector3(20, 10, -20),
    ]);
    points.push([
      new THREE.Vector3(20, 10, -20),
      new THREE.Vector3(20, 10, 20),
    ]);
    points.push([
      new THREE.Vector3(20, 10, 20),
      new THREE.Vector3(-20, 10, 20),
    ]);
    points.push([
      new THREE.Vector3(-20, 10, 20),
      new THREE.Vector3(-20, 10, -20),
    ]);

    return points;
  }, []);

  const windows = useMemo(() => {
    const windowFrames = [];

    // Add windows on walls
    for (let i = -15; i <= 15; i += 10) {
      windowFrames.push([
        new THREE.Vector3(i, 4, -20),
        new THREE.Vector3(i + 6, 4, -20),
      ]);
      windowFrames.push([
        new THREE.Vector3(i + 6, 4, -20),
        new THREE.Vector3(i + 6, 7, -20),
      ]);
      windowFrames.push([
        new THREE.Vector3(i + 6, 7, -20),
        new THREE.Vector3(i, 7, -20),
      ]);
      windowFrames.push([
        new THREE.Vector3(i, 7, -20),
        new THREE.Vector3(i, 4, -20),
      ]);
    }

    return windowFrames;
  }, []);

  const floor = useMemo(() => [
    new THREE.Vector3(-20, 0, -20),
    new THREE.Vector3(20, 0, -20),
    new THREE.Vector3(20, 0, 20),
    new THREE.Vector3(-20, 0, 20),
  ], []);

  const ceiling = useMemo(() => [
    new THREE.Vector3(-20, 10, -20),
    new THREE.Vector3(20, 10, -20),
    new THREE.Vector3(20, 10, 20),
    new THREE.Vector3(-20, 10, 20),
  ], []);

  return (
    <group>
      {/* Walls */}
      {walls.map((line, index) => (
        <Line key={`wall-${index}`} points={line} color={"#555"} lineWidth={2} />
      ))}

      {/* Windows */}
      {windows.map((frame, index) => (
        <Line key={`window-${index}`} points={frame} color={"#88c"} lineWidth={1} />
      ))}

      {/* Floor */}
      <Plane
        args={[40, 40]}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material-color="#e0e0e0"
      />

      {/* Ceiling */}
      <Plane
        args={[40, 40]}
        position={[0, 10, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material-color="#ffffff"
      />

      {/* Columns */}
      {[...Array(4)].map((_, i) => (
        <Box
          key={`column-${i}`}
          args={[1, 10, 1]}
          position={
            i === 0
              ? [-19, 5, -19]
              : i === 1
              ? [19, 5, -19]
              : i === 2
              ? [19, 5, 19]
              : [-19, 5, 19]
          }
          material-color="#cccccc"
        />
      ))}
    </group>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 15, 50], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <ModernBuilding />
    </Canvas>
  );
};

export default Scene;
