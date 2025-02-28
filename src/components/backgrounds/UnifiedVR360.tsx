// src/components/backgrounds/UnifiedVR360.tsx
import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTexturePathFromUrl } from './ImageImports';

interface UnifiedVR360Props {
  imageUrl: string;
  controls: {
    movement: { x: number; y: number };
    look: { x: number; y: number };
  };
  useDeviceOrientation?: boolean;
}

export function UnifiedVR360({ 
  imageUrl, 
  controls,
  useDeviceOrientation = false 
}: UnifiedVR360Props) {
  const { camera, scene } = useThree();
  const sphereRef = useRef<THREE.Mesh>(null);
  const currentRotation = useRef({ x: 0, y: Math.PI, z: 0 });
  const targetRotation = useRef({ x: 0, y: Math.PI, z: 0 });
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>(undefined);
  const textureCache = useRef<Record<string, THREE.Texture>>({});
  const [debugInfo, setDebugInfo] = useState<string>('Initialisiere...');
  
  // Konvertiere URL in echten Pfad
  const getActualImagePath = (url: string) => {
    try {
      console.log('getActualImagePath aufgerufen mit:', url, currentProjectId);
      const result = getTexturePathFromUrl(url, currentProjectId);
      console.log('getActualImagePath Ergebnis:', result);
      return result;
    } catch (error) {
      console.error('Fehler beim Abrufen des Bildpfads:', error);
      return url;
    }
  };

  // Event-Listener für Hintergrundänderungen
  useEffect(() => {
    const handleBackgroundChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        // Speichere sowohl URL als auch Projekt-ID, wenn verfügbar
        if (customEvent.detail.imageUrl) {
          setCurrentImageUrl(customEvent.detail.imageUrl);
          // Debug-Info ausgeben
          console.log('Setze 360°-Bild:', customEvent.detail.imageUrl);
          setDebugInfo(`Event empfangen: ${customEvent.detail.imageUrl}`);
          if (customEvent.detail.projectId) {
            setCurrentProjectId(customEvent.detail.projectId);
            console.log('Für Projekt:', customEvent.detail.projectId);
          }
        }
      }
    };

    console.log('EVENT LISTENER FÜR HINTERGRUNDÄNDERUNGEN WURDE EINGERICHTET');
    window.addEventListener('changeBackground', handleBackgroundChange);
    return () => {
      window.removeEventListener('changeBackground', handleBackgroundChange);
    };
  }, []);

  // Initialisierung und Aktualisierung der Textur mit Caching für bessere Performance
  useEffect(() => {
    const loadTexture = () => {
      console.log('Versuche Textur zu laden:', currentImageUrl, 'für Projekt:', currentProjectId);
      setDebugInfo(`Lade Textur: ${currentImageUrl} (Projekt: ${currentProjectId || 'keins'})`);
      
      // Wenn die Textur bereits im Cache ist, verwende sie
      if (textureCache.current[currentImageUrl]) {
        console.log('Textur aus Cache verwendet:', currentImageUrl);
        setDebugInfo(`Textur aus Cache: ${currentImageUrl}`);
        if (sphereRef.current) {
          const material = new THREE.MeshBasicMaterial({
            map: textureCache.current[currentImageUrl],
            side: THREE.BackSide
          });
          sphereRef.current.material = material;
        }
        return;
      }

      // Konvertiere die URL in den tatsächlichen Pfad
      const actualImagePath = getActualImagePath(currentImageUrl);
      console.log('Verwende tatsächlichen Bildpfad:', actualImagePath);
      setDebugInfo(`Bildpfad: ${actualImagePath}`);

      // Prüfe, ob wir einen tatsächlichen, gültigen Pfad haben
      if (!actualImagePath) {
        console.error('Kein gültiger Bildpfad gefunden');
        setDebugInfo('FEHLER: Kein gültiger Bildpfad');
        return;
      }

      // Lade die Textur mit dem tatsächlichen Pfad
      const textureLoader = new THREE.TextureLoader();
      setDebugInfo(`Starte TextureLoader für: ${actualImagePath}`);
      textureLoader.load(
        actualImagePath, 
        (texture) => {
          console.log('Textur erfolgreich geladen:', actualImagePath);
          setDebugInfo(`Textur erfolgreich geladen: ${actualImagePath}`);
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.colorSpace = THREE.SRGBColorSpace;
          
          // Speichere Textur im Cache
          textureCache.current[currentImageUrl] = texture;
          
          if (sphereRef.current) {
            console.log('Wende Textur auf Sphäre an');
            setDebugInfo(`Wende Textur auf Sphäre an`);
            const material = new THREE.MeshBasicMaterial({
              map: texture,
              side: THREE.BackSide
            });
            sphereRef.current.material = material;
          } else {
            console.error('Sphäre-Referenz ist null!');
            setDebugInfo('FEHLER: Sphäre-Referenz ist null!');
          }
        },
        (progress) => {
          // Zeige Ladestatus
          const percentComplete = Math.round((progress.loaded / progress.total) * 100);
          setDebugInfo(`Lade: ${percentComplete}%`);
          console.log(`Ladefortschritt: ${percentComplete}%`);
        },
        (error: unknown) => {
          console.error('Fehler beim Laden der 360°-Textur:', error, actualImagePath);
          const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
          setDebugInfo(`FEHLER beim Laden: ${errorMessage}`);
          // Fallback-Versuche werden jetzt direkt in der getActualImagePath-Funktion behandelt
        }
      );
    };

    loadTexture();

    // Initial camera setup
    camera.rotation.order = 'YXZ';
    camera.position.set(0, 1.7, 0);
    
    // Stelle sicher, dass die Sphäre immer um die Kamera herum ist
    if (sphereRef.current) {
      sphereRef.current.position.copy(camera.position);
    }
    
    // Debug-Informationen zur Scene
    console.log('Scene-Kinder:', scene.children.length);
    scene.children.forEach((child, index) => {
      console.log(`Kind ${index}:`, child.type, child.visible);
    });
    
    return () => {
      console.log('UnifiedVR360 useEffect Cleanup');
    };
  }, [currentImageUrl, currentProjectId, camera, scene]);

  // Stelle sicher, dass die Sphäre immer bei der Kamera ist
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.position.copy(camera.position);
    }
    
    if (!controls || useDeviceOrientation) return;

    // Debug der Steuerungseingaben
    if (controls.movement.x !== 0 || controls.movement.y !== 0 || controls.look.x !== 0 || controls.look.y !== 0) {
      console.log('UnifiedVR360 Steuerungseingaben:', 
        'Movement:', JSON.stringify(controls.movement), 
        'Look:', JSON.stringify(controls.look)
      );
    }

    // PROBLEMBEHEBUNG: Direkte Anwendung der Steuerung auf die Kamera
    // Statt komplexe Rotationsberechnung verwenden wir direkte Kamerarotation
    
    // Bewegungssteuerung - erhöhte Empfindlichkeit
    camera.rotation.y -= controls.movement.x * 0.1;
    camera.rotation.x = THREE.MathUtils.clamp(
      camera.rotation.x - controls.movement.y * 0.1,
      -Math.PI / 2.5,
      Math.PI / 2.5
    );

    // Blicksteuerung - erhöhte Empfindlichkeit
    camera.rotation.y -= controls.look.x * 0.1;
    camera.rotation.x = THREE.MathUtils.clamp(
      camera.rotation.x - controls.look.y * 0.1,
      -Math.PI / 2.5,
      Math.PI / 2.5
    );

    // Aktualisiere die internen Rotationswerte, um die Steuerung konsistent zu halten
    currentRotation.current.x = camera.rotation.x;
    currentRotation.current.y = camera.rotation.y;
    targetRotation.current.x = camera.rotation.x;
    targetRotation.current.y = camera.rotation.y;
  });

  return (
    <>
      {/* Subtile Steuerungshinweise statt Debug-Overlay */}
      {!useDeviceOrientation && (
        <mesh position={[0, 0, -2]} rotation={[0, 0, 0]}>
          <planeGeometry args={[3, 0.5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </mesh>
      )}
      
      {/* 360° Sphäre */}
      <mesh ref={sphereRef} visible={true} renderOrder={-1}>
        <sphereGeometry args={[50, 60, 40]} />
        <meshBasicMaterial color="gray" wireframe={false} side={THREE.BackSide} opacity={1.0} transparent={false} />
      </mesh>
    </>
  );
}