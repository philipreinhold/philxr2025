// src/components/World/HangingCubes.tsx
import React, { useMemo } from 'react'
import { useBox, useSphere, usePointToPointConstraint } from '@react-three/cannon'
import { MeshToonMaterial } from 'three'
import { useFrame } from '@react-three/fiber'

// Ein paar Farben im Bauhaus-Stil
const COLORS = ['#FF4B4B', '#FFD700', '#4169E1']

interface HangingCubesProps {
  count?: number
}

// Funktion zur Erstellung eines Toon-Materials
function createToonMaterial(color: string) {
  return new MeshToonMaterial({
    color,
    transparent: true,
    opacity: 0.7, // Halbtransparent
    // Optional: Hier kannst du weitere Eigenschaften anpassen, z.B. Gradient Map
  })
}

/**
 * Erzeugt mehrere Würfel, die an virtuellen Ankerpunkten "hängen"
 * und ruckartig auf/ab bewegt werden (Seil-Effekt via PointToPointConstraint).
 */
export function HangingCubes({ count = 5 }: HangingCubesProps) {
  // Random-Setup
  const data = useMemo(() => {
    return new Array(count).fill(null).map((_, i) => {
      const x = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 20
      const color = COLORS[i % COLORS.length]
      return {
        anchorPos: [x, 8 + Math.random() * 5, z] as [number, number, number],
        boxSize: 1 + Math.random() * 1,
        color,
        phaseOffset: Math.random() * 10
      }
    })
  }, [count])

  return (
    <>
      {data.map((item, index) => (
        <HangingCube
          key={index}
          anchorPos={item.anchorPos}
          boxSize={item.boxSize}
          color={item.color}
          phaseOffset={item.phaseOffset}
        />
      ))}
    </>
  )
}

function HangingCube({
  anchorPos,
  boxSize,
  color,
  phaseOffset
}: {
  anchorPos: [number, number, number]
  boxSize: number
  color: string
  phaseOffset: number
}) {
  // 1) Anker-Kugel (Kinematic) => wir bewegen sie manuell
  const [anchorRef, anchorApi] = useSphere(() => ({
    type: 'Kinematic',
    args: [0.1],
    position: anchorPos
  }))

  // 2) Würfel (Dynamic)
  const [boxRef] = useBox(() => ({
    mass: 1,
    args: [boxSize, boxSize, boxSize],
    position: [anchorPos[0], anchorPos[1] - 2, anchorPos[2]],
    allowSleep: false,
    angularDamping: 0.2,
    linearDamping: 0.1
  }))

  // 3) Beide per PointToPointConstraint "verbinden"
  usePointToPointConstraint(anchorRef, boxRef, {
    pivotA: [0, 0, 0],
    pivotB: [0, 0, 0]
  })

  // 4) Die Ankerposition animieren => Würfel wird hochgezogen und pendelt
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + phaseOffset
    const speed = 0.3
    const saw = (t * speed) % 1

    // Einfaches Schema: 0-0.4 => hoch, 0.4-0.6 => Pause, 0.6-1 => runter
    let yOffset = 0
    if (saw < 0.4) {
      yOffset = (saw / 0.4) * 3
    } else if (saw < 0.6) {
      yOffset = 3
    } else {
      const part = (saw - 0.6) / 0.4
      yOffset = 3 * (1 - part)
    }

    // Leichtes Pendeln
    const sin = Math.sin(t * 2) * 0.3
    const cos = Math.cos(t) * 0.15

    anchorApi.position.set(
      anchorPos[0] + sin,
      anchorPos[1] + yOffset,
      anchorPos[2] + cos
    )
  })

  // 5) Toon-Material
  const material = useMemo(() => createToonMaterial(color), [color])

  return (
    <>
      {/* Ankerpunkt – kann man visibility={false} machen für "unsichtbares Gelenk" */}
      <mesh ref={anchorRef} visible={false}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* Toon-Würfel */}
      <mesh ref={boxRef} castShadow>
        <boxGeometry args={[boxSize, boxSize, boxSize]} />
        <primitive object={material} attach="material" />
      </mesh>
    </>
  )
}
