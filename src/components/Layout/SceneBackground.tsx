import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UnifiedVR360 } from '../backgrounds/UnifiedVR360';
import { World } from '../World';
import { projects } from '../../config/projects.config';

interface SceneBackgroundProps {
  controls: {
    movement: { x: number; y: number };
    look: { x: number; y: number };
  };
  isLocked?: boolean;
  useDeviceOrientation?: boolean;
}

export function SceneBackground({ 
  controls, 
  isLocked = false,
  useDeviceOrientation = false 
}: SceneBackgroundProps) {
  const location = useLocation();
  const [background, setBackground] = useState<{
    type: 'world' | '360';
    imageUrl?: string;
    isOverUnder?: boolean;
  }>({ type: 'world' });
  
  // Bestimme den Hintergrund basierend auf dem aktuellen Pfad
  useEffect(() => {
    // Überprüfe, ob wir uns auf einer Projektseite befinden
    if (location.pathname.startsWith('/projects/')) {
      // Hole die Projekt-ID aus dem Pfad
      const projectId = location.pathname.split('/').pop();
      
      // Finde das entsprechende Projekt
      const project = projects.find(p => p.id === projectId);
      
      if (project && project.backgroundImage) {
        console.log('Lade 360°-Hintergrund für Projekt:', project.id);
        setBackground({
          type: '360',
          imageUrl: project.backgroundImage,
          isOverUnder: project.isOverUnder
        });
      } else {
        console.warn('Kein Projekt oder Hintergrundbild gefunden, verwende Standard-World');
        setBackground({ type: 'world' });
      }
    } else {
      // Auf anderen Seiten die Standard-World verwenden
      setBackground({ type: 'world' });
    }
  }, [location.pathname]);

  // Render basierend auf dem aktuellen Hintergrund-Typ
  return background.type === '360' && background.imageUrl ? (
    <UnifiedVR360
      imageUrl={background.imageUrl}
      controls={controls}
      isLocked={isLocked}
      useDeviceOrientation={useDeviceOrientation}
      isOverUnder={background.isOverUnder}
    />
  ) : (
    <World />
  );
} 