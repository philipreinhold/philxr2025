// src/hooks/useViewerControls.ts
import { useRef, useState, useCallback, useEffect } from 'react';
import { VIEWER_CONFIG } from '../config/viewer.config';

// Erweitern der DeviceOrientationEvent-Typdeklaration für iOS
interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<string>;
}

interface DeviceOrientationEventStatic {
  requestPermission?: () => Promise<string>;
}

interface ViewerControls {
  movementRef: React.MutableRefObject<{ x: number; y: number }>;
  lookRef: React.MutableRefObject<{ x: number; y: number }>;
  isLocked: boolean;
  isMobile: boolean;
  useDeviceOrientation: boolean;
  handleStartExploring: () => Promise<void>;
  handleStopExploring: () => void;
  requestOrientationPermission: () => Promise<void>;
}

export const useViewerControls = (): ViewerControls => {
  const movementRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lookRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useDeviceOrientation, setUseDeviceOrientation] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0;
      setIsMobile(isTouchDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Device orientation permission request
  const requestOrientationPermission = useCallback(async () => {
    if (!window.isSecureContext) {
      alert(VIEWER_CONFIG.messages.httpsRequired);
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    try {
      // Ordnungsgemäße Typbeschreibung für DeviceOrientationEvent
      if (isIOS && typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventStatic).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as unknown as DeviceOrientationEventStatic).requestPermission!();
        setUseDeviceOrientation(permission === 'granted');
        if (permission === 'granted') {
          alert(VIEWER_CONFIG.messages.orientationEnabled);
        }
      } else {
        setUseDeviceOrientation(true);
        alert(VIEWER_CONFIG.messages.orientationEnabled);
      }
    } catch (error) {
      console.error('Error requesting orientation permission:', error);
      alert(VIEWER_CONFIG.messages.orientationError);
    }
  }, []);

  // Start exploring handler
  const handleStartExploring = useCallback(async () => {
    console.log("Starte Exploration-Modus");
    setIsLocked(true);
    
    // Setze die Referenzen auf 0 beim Start
    movementRef.current = { x: 0, y: 0 };
    lookRef.current = { x: 0, y: 0 };

    // Aktiviere Gerätesensoren auf Mobilgeräten, falls erlaubt
    if (isMobile) {
      try {
        await requestOrientationPermission();
        console.log("Geräteorientierung wurde aktiviert:", useDeviceOrientation);
      } catch (error) {
        console.error("Fehler beim Aktivieren der Geräteorientierung:", error);
      }
    }
  }, [isMobile, requestOrientationPermission, useDeviceOrientation]);

  // Stop exploring handler
  const handleStopExploring = useCallback(() => {
    console.log("Beende Exploration-Modus");
    setIsLocked(false);
    setUseDeviceOrientation(false);
    
    // Zurücksetzen der Bewegungsreferenzen
    movementRef.current = { x: 0, y: 0 };
    lookRef.current = { x: 0, y: 0 };
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLocked) {
        handleStopExploring();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, handleStopExploring]);

  return {
    movementRef,
    lookRef,
    isLocked,
    isMobile,
    useDeviceOrientation,
    handleStartExploring,
    handleStopExploring,
    requestOrientationPermission,
  };
};