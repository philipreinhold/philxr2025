// src/components/World/DrawingStructure.tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { DrawingStructureProps } from '../../types/world';
import { BAUHAUS_COLORS } from '../../constants/colors';

export const DrawingStructure = ({ 
  initialPosition,
  initialDelay = 0,
  colorScheme = BAUHAUS_COLORS.red
}: DrawingStructureProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef<number>(-initialDelay);
  type LineRef = any; // Using any for drei Line component as it doesn't expose its type
  const linesRef = useRef<Array<LineRef>>([]);
  
  const linePoints = useMemo(() => [
    // Base
    [[-1, 0, -1], [1, 0, -1]],
    [[1, 0, -1], [1, 0, 1]],
    [[1, 0, 1], [-1, 0, 1]],
    [[-1, 0, 1], [-1, 0, -1]],
    // Vertical lines
    [[-1, 0, -1], [-1, 2, -1]],
    [[1, 0, -1], [1, 2, -1]],
    [[1, 0, 1], [1, 2, 1]],
    [[-1, 0, 1], [-1, 2, 1]],
    // Top
    [[-1, 2, -1], [1, 2, -1]],
    [[1, 2, -1], [1, 2, 1]],
    [[1, 2, 1], [-1, 2, 1]],
    [[-1, 2, 1], [-1, 2, -1]]
  ].map(([start, end]) => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ]), []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Handle delay phase
    if (progressRef.current < 0) {
      progressRef.current += delta;
      return;
    }

    // Update progress
    progressRef.current = Math.min(progressRef.current + delta * 0.3, 1);

    // Update line opacities
    linesRef.current.forEach((line, i) => {
      if (!line?.material) return;
      
      // Calculate line visibility
      const lineProgress = ((progressRef.current) * linePoints.length - i) * 2;
      const baseOpacity = Math.max(0, Math.min(1, lineProgress));
      
      // Apply distance-based fog
      if (groupRef.current) {
        const distance = groupRef.current.position.length();
        const fogFactor = Math.max(0, 1 - (distance / 40));
        line.material.opacity = baseOpacity * fogFactor;
      }
    });

    // Floating animation
    if (progressRef.current > 0.5 && groupRef.current) {
      const time = Date.now() * 0.0005;
      groupRef.current.position.y = initialPosition[1] + Math.sin(time) * 0.2;
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={initialPosition}
      rotation={[0, Math.random() * Math.PI * 2, 0]}
    >
      {linePoints.map((points, i) => (
        <Line
          key={i}
          ref={(el) => { linesRef.current[i] = el }}
          points={points}
          color={colorScheme}
          lineWidth={2}
          transparent
          opacity={0}
        />
      ))}
    </group>
  );
};