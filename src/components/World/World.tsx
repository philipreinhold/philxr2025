import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { UnifiedVR360 } from '../backgrounds/UnifiedVR360'
import { useViewerControls } from '../../hooks/useViewerControls'

const ExhibitionRoom = () => {
  const width = 40
  const height = 8
  const depth = 40

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
    ]

    return points.map(([start, end]) => [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    ])
  }, [])

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
  )
}

const DrawingStructure = ({ 
  initialPosition,
  initialDelay = 0,
  colorScheme = '#FF4B4B'
}: {
  initialPosition: [number, number, number]
  initialDelay?: number
  colorScheme?: string
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const progressRef = useRef<number>(-initialDelay)
  type LineRef = any // Using any for drei Line component as it doesn't expose its type
  const linesRef = useRef<Array<LineRef>>([])
  
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
  ]), [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Handle delay phase
    if (progressRef.current < 0) {
      progressRef.current += delta
      return
    }

    // Update progress
    progressRef.current = Math.min(progressRef.current + delta * 0.3, 1)

    // Update line opacities
    linesRef.current.forEach((line, i) => {
      if (!line) return
      if (!line?.material) return
      
      // Calculate line visibility
      const lineProgress = ((progressRef.current) * linePoints.length - i) * 2
      const baseOpacity = Math.max(0, Math.min(1, lineProgress))
      
      // Apply distance-based fog
      if (groupRef.current) {
        const distance = groupRef.current.position.length()
        const fogFactor = Math.max(0, 1 - (distance / 40))
        line.material.opacity = baseOpacity * fogFactor
      }
    })

    // Floating animation
    if (progressRef.current > 0.5 && groupRef.current) {
      const time = Date.now() * 0.0005
      groupRef.current.position.y = initialPosition[1] + Math.sin(time) * 0.2
    }
  })

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
  )
}

const World = () => {
  const { scene } = useThree()
  const { movementRef, lookRef, useDeviceOrientation } = useViewerControls()
  const [showNormalWorld, setShowNormalWorld] = useState(true)
  
  // Setze einen Standardhintergrund, der für alle Seiten gilt
  const [backgroundImage, setBackgroundImage] = useState('/components/Images/HW_360_VR_COLOR_CHECK_LOW.jpg')
  
  // Reagiere auf Events, die den Hintergrund ändern
  useEffect(() => {
    const handleBackgroundChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.imageUrl) {
        console.log('Wechsle Hintergrund zu:', customEvent.detail.imageUrl);
        setBackgroundImage(customEvent.detail.imageUrl);
        // Optional: Projektinformationen speichern, wenn vorhanden
        if (customEvent.detail.projectId) {
          console.log('Für Projekt:', customEvent.detail.projectId);
          // Hier könnten wir z.B. das aktuelle Projekt-ID in einem State speichern
        }
        // Blende die normale Welt aus, wenn ein 360°-Bild verwendet wird
        setShowNormalWorld(false);
      } else {
        console.log('Warnung: changeBackground-Event ohne gültige imageUrl');
      }
    };

    const handleResetBackground = () => {
      // Wenn ein Reset angefordert wird, setzen wir auf den Standardhintergrund zurück
      console.log('Setze Hintergrund zurück auf Standard');
      // Sicherstellen, dass wir nicht in eine Endlosschleife geraten
      if (showNormalWorld) {
        console.log('Normale Welt wird bereits angezeigt, kein Reset nötig');
        return;
      }
      setBackgroundImage('/components/Images/HW_360_VR_COLOR_CHECK_LOW.jpg');
      setShowNormalWorld(true);
    };

    window.addEventListener('changeBackground', handleBackgroundChange);
    window.addEventListener('resetBackground', handleResetBackground);
    return () => {
      window.removeEventListener('changeBackground', handleBackgroundChange);
      window.removeEventListener('resetBackground', handleResetBackground);
    };
  }, [showNormalWorld]);
  
  const structures = useMemo(() => 
    Array(20).fill(null).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        2 + Math.random() * 3,
        (Math.random() - 0.5) * 30
      ] as [number, number, number],
      delay: i * 0.5,
      color: ['#FF4B4B', '#FFD700', '#4169E1'][i % 3]
    }))
  , [])

  // Scene setup mit Fade-Effekt für sanftere Übergänge
  if (showNormalWorld) {
    scene.background = new THREE.Color('#ffffff');
    scene.fog = new THREE.Fog('#ffffff', 5, 30);
  } else {
    scene.background = null;
    scene.fog = null;
  }

  return (
    <>
      {/* Gemeinsame 360°-Hintergrundkomponente für alle Seiten */}
      <UnifiedVR360
        imageUrl={backgroundImage}
        controls={{
          movement: movementRef.current,
          look: lookRef.current
        }}
        useDeviceOrientation={useDeviceOrientation}
      />
      
      {/* Minimaler Orientierungspunkt für Navigation */}
      {!showNormalWorld && (
        <mesh position={[0, 0, -3]} scale={[0.05, 0.05, 0.05]} visible={false}>
          <boxGeometry />
          <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
        </mesh>
      )}
      
      {/* Debug-Logs nur während der Entwicklung aktivieren */}
      {/* {useFrame(() => {
        if (movementRef.current.x !== 0 || movementRef.current.y !== 0 || 
            lookRef.current.x !== 0 || lookRef.current.y !== 0) {
          console.log('World: Steuerungswerte', 
            'Movement:', JSON.stringify(movementRef.current), 
            'Look:', JSON.stringify(lookRef.current),
            'DeviceOrientation:', useDeviceOrientation
          );
        }
      })} */}
      
      {/* Reguläre 3D-Welt, nur angezeigt wenn kein spezieller 360°-Hintergrund aktiv ist */}
      {showNormalWorld && (
        <>
          <ambientLight intensity={0.8} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.6} 
          />
          <pointLight 
            position={[0, 6, 0]} 
            intensity={0.4}
          />

          <ExhibitionRoom />
          
          {structures.map((structure, index) => (
            <DrawingStructure
              key={index}
              initialPosition={structure.position}
              initialDelay={structure.delay}
              colorScheme={structure.color}
            />
          ))}
        </>
      )}
    </>
  )
}

export default World