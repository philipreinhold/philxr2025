// src/hooks/useViewerControls.ts
import { useRef, useState, useCallback, useEffect } from 'react';
import { VIEWER_CONFIG } from '../config/viewer.config';

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
  const movementRef = useRef({ x: 0, y: 0 });
  const lookRef = useRef({ x: 0, y: 0 });
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
      if (isIOS && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permission = await DeviceOrientationEvent.requestPermission();
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
    setIsLocked(true);
    if (isMobile) await requestOrientationPermission();
  }, [isMobile, requestOrientationPermission]);

  // Stop exploring handler
  const handleStopExploring = useCallback(() => {
    setIsLocked(false);
    setUseDeviceOrientation(false);
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