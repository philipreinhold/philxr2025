// src/App.tsx
import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { VIEWER_CONFIG } from './config/viewer.config';
import { useViewerControls } from './hooks/useViewerControls';
import { 
  World, 
  Interface,
  About,
  Contact,
  Projects,
  Services,
} from './components';
import { DualJoystickUI } from './components/Controls/DualJoystickUI';
import { MobileCameraControls } from './components/Controls/MobileCameraControls';
import { DeviceOrientationControls } from './components/Controls/DeviceOrientationControls';

function App() {
  const location = useLocation();
  const wasOnProjectPage = useRef(false);
  const {
    movementRef,
    lookRef,
    isLocked,
    isMobile,
    useDeviceOrientation,
    handleStartExploring,
    handleStopExploring,
    requestOrientationPermission,
  } = useViewerControls();

  // Beim Routenwechsel den Hintergrund nur zurücksetzen,
  // wenn wir von einer Projektseite zu einer Nicht-Projektseite wechseln
  useEffect(() => {
    if (location.pathname.startsWith('/projects/')) {
      wasOnProjectPage.current = true;
    } else if (wasOnProjectPage.current) {
      // Nur zurücksetzen, wenn wir zuvor auf einer Projektseite waren
      console.log('Verlassen der Projektseite - Hintergrund zurücksetzen');
      const resetEvent = new CustomEvent('resetBackground', {});
      window.dispatchEvent(resetEvent);
      wasOnProjectPage.current = false;
    }
  }, [location.pathname]);

  return (
    <div className="relative w-screen h-screen bg-white">
      <div className="absolute inset-0">
        <Canvas
          camera={{
            position: VIEWER_CONFIG.camera.position,
            fov: VIEWER_CONFIG.camera.fov,
            near: VIEWER_CONFIG.camera.near,
            far: VIEWER_CONFIG.camera.far
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <World />
            <MobileCameraControls 
              movementRef={movementRef}
              lookRef={lookRef}
              useDeviceOrientation={useDeviceOrientation}
            />
            {useDeviceOrientation && (
              <DeviceOrientationControls enabled={isLocked} />
            )}
          </Suspense>
        </Canvas>
      </div>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          <div className="pointer-events-auto">
            <Interface />
          </div>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={null} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<Projects />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </AnimatePresence>
          
          {isLocked && (
            <div className="fixed bottom-0 left-0 right-0 pb-4 pointer-events-none">
              <DualJoystickUI
                onMove={(movement) => {
                  movementRef.current = movement;
                }}
                onLook={(rotation) => {
                  if (!useDeviceOrientation) {
                    lookRef.current = rotation;
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {!isLocked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="space-y-4 text-center">
            <button 
              className="px-6 py-3 text-sm bg-white/80 backdrop-blur-sm rounded-lg 
                       pointer-events-auto hover:bg-white/90 transition-colors"
              onClick={handleStartExploring}
              aria-label={isMobile ? 'Tap to explore' : 'Click to explore'}
            >
              {isMobile ? 'Tap to explore' : 'Click to explore'}
            </button>
            {isMobile && (
              <p className="text-xs text-black/60">
                Enable device orientation for immersive viewing
              </p>
            )}
          </div>
        </div>
      )}

      {isLocked && (
        <div className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm">
          <button
            className="px-3 py-1 text-xs bg-white/80 backdrop-blur-sm rounded-lg 
                     pointer-events-auto hover:bg-white/90 transition-colors"
            onClick={handleStopExploring}
            aria-label="Exit view"
          >
            Exit View
          </button>
          {isMobile && (
            <button
              className={`px-3 py-1 text-xs backdrop-blur-sm rounded-lg pointer-events-auto 
                       transition-colors ${
                         useDeviceOrientation 
                           ? 'bg-bauhaus-blue/20 text-bauhaus-blue' 
                           : 'bg-white/80 hover:bg-white/90'
                       }`}
              onClick={requestOrientationPermission}
              aria-label={useDeviceOrientation ? 'Motion control active' : 'Enable motion control'}
            >
              {useDeviceOrientation ? 'Motion Control Active' : 'Enable Motion Control'}
            </button>
          )}
        </div>
      )}

      {useDeviceOrientation && (
        <div className="fixed bottom-4 left-4 text-xs text-black/60 bg-white/80 p-2 rounded">
          Debug: Motion Control Active
        </div>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}