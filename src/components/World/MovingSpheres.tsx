// src/components/World/MovingSpheres.tsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Vector3, Color } from 'three';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';

// Anzahl der Kugeln im Schwarm
const NUM_SPHERES = 50;

// Farben im Bauhaus-Stil
const COLORS = ['#FF4B4B', '#FFD700', '#4169E1', '#32CD32', '#1E90FF'];

// Boids-Parameter
const SEPARATION_DISTANCE = 2;
const ALIGNMENT_DISTANCE = 5;
const COHESION_DISTANCE = 5;
const MAX_SPEED = 0.1;
const MAX_FORCE = 0.01;

// Typdefinition für einen einzelnen Boid
interface Boid {
  position: Vector3;
  velocity: Vector3;
}

const MovingSpheres: React.FC = () => {
  const meshRef = useRef<InstancedMesh>(null);

  // Initialisiere die Boids mit zufälligen Positionen und Geschwindigkeiten
  const boids = useMemo(() => {
    const temp: Boid[] = [];
    for (let i = 0; i < NUM_SPHERES; i++) {
      const position = new Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20
      );
      const velocity = new Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      );
      temp.push({ position, velocity });
    }
    return temp;
  }, []);

  // Erstelle eine Kugelgeometrie für die Sphären
  const geometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(0.5, 16, 16);
    return geom;
  }, []);

  // Material für die Sphären mit vertexColors aktiviert
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      vertexColors: true, // Ermöglicht individuelle Farben pro Instanz
      metalness: 0.5,
      roughness: 0.5,
    });
    return mat;
  }, []);

  // Erstelle physikalische Instanzen für jede Kugel
  boids.forEach((boid, index) => {
    useSphere(() => ({
      mass: 1,
      position: [boid.position.x, boid.position.y, boid.position.z],
      args: [0.5], // Korrekt als Array
      restitution: 0.7, // Bounciness
      friction: 0.5,
    }), ref => {
      // Verbinde die physikalische Instanz mit der InstancedMesh
      if (meshRef.current) {
        meshRef.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      }
    });
  });

  // Update die Boids und deren Positionen bei jedem Frame
  useFrame(() => {
    if (!meshRef.current) {
      console.warn('InstancedMesh reference is null');
      return;
    }

    const dummy = new Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < NUM_SPHERES; i++) {
      const boid = boids[i];

      // Flocking-Regeln anwenden
      const separation = new Vector3();
      const alignment = new Vector3();
      const cohesion = new Vector3();
      let countSeparation = 0;
      let countAlignment = 0;
      let countCohesion = 0;

      for (let j = 0; j < NUM_SPHERES; j++) {
        if (i === j) continue;
        const other = boids[j];
        const distance = boid.position.distanceTo(other.position);

        // Separation
        if (distance < SEPARATION_DISTANCE) {
          const diff = new Vector3().subVectors(boid.position, other.position).divideScalar(distance);
          separation.add(diff);
          countSeparation++;
        }

        // Alignment
        if (distance < ALIGNMENT_DISTANCE) {
          alignment.add(other.velocity);
          countAlignment++;
        }

        // Cohesion
        if (distance < COHESION_DISTANCE) {
          cohesion.add(other.position);
          countCohesion++;
        }
      }

      // Durchschnittswerte berechnen
      if (countSeparation > 0) {
        separation.divideScalar(countSeparation);
        separation.setLength(MAX_SPEED);
        separation.sub(boid.velocity);
        separation.clampLength(0, MAX_FORCE);
      }

      if (countAlignment > 0) {
        alignment.divideScalar(countAlignment);
        alignment.setLength(MAX_SPEED);
        alignment.sub(boid.velocity);
        alignment.clampLength(0, MAX_FORCE);
      }

      if (countCohesion > 0) {
        cohesion.divideScalar(countCohesion);
        cohesion.sub(boid.position);
        cohesion.setLength(MAX_SPEED);
        cohesion.sub(boid.velocity);
        cohesion.clampLength(0, MAX_FORCE);
      }

      // Gesamtkräfte berechnen
      const force = new Vector3();
      force.add(separation);
      force.add(alignment);
      force.add(cohesion);

      // Geschwindigkeit aktualisieren
      boid.velocity.add(force);
      boid.velocity.clampLength(0, MAX_SPEED);

      // Position aktualisieren
      boid.position.add(boid.velocity);

      // Begrenzung des Raums und Kollision mit Wänden
      const boundary = 10;
      ['x', 'y', 'z'].forEach((axis) => {
        if (boid.position[axis as keyof Vector3] > boundary) {
          boid.position[axis as keyof Vector3] = boundary;
          boid.velocity[axis as keyof Vector3] *= -1;
        }
        if (boid.position[axis as keyof Vector3] < -boundary) {
          boid.position[axis as keyof Vector3] = -boundary;
          boid.velocity[axis as keyof Vector3] *= -1;
        }
      });

      // Drehung der Kugel entsprechend der Richtung
      dummy.position.copy(boid.position);
      dummy.lookAt(boid.position.clone().add(boid.velocity));
      dummy.rotation.y += Math.PI / 2; // Optional: Anpassung der Rotation

      // Setze die Transformation der Instanz
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Setze die Farbe basierend auf der Farbe des Boids
      color.set(COLORS[i % COLORS.length]);
      meshRef.current.setColorAt(i, color);
    }

    // Aktualisiere die Instanzen
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, NUM_SPHERES]}>
      {/* Initialisiere die Farben */}
      {boids.map((_, i) => {
        const color = new THREE.Color(COLORS[i % COLORS.length]);
        meshRef.current?.setColorAt(i, color);
        return null;
      })}
    </instancedMesh>
  );
};

export default MovingSpheres;
