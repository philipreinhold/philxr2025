// src/components/pages/Projects/Projects.tsx
import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguageStore } from '../../../store/languageStore';
import { DualJoystickUI } from '../../Controls/DualJoystickUI';
import { DeviceOrientationControls } from '../../Controls/DeviceOrientationControls';
import { UnifiedVR360 } from '../../backgrounds/UnifiedVR360';
import PageWrapper from '../../Layout/PageWrapper';
import { projects } from '../../../config/projects.config';

export default function Projects() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { language } = useLanguageStore();
  
  const [isLocked, setIsLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useDeviceOrientation, setUseDeviceOrientation] = useState(false);
  const [showProjectInfo, setShowProjectInfo] = useState(true);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  
  const movementRef = useRef({ x: 0, y: 0 });
  const lookRef = useRef({ x: 0, y: 0 });

  const activeProject = projects.find(p => p.id === projectId) || projects[0];
  const activeIndex = projects.findIndex(p => p.id === activeProject.id);

  useEffect(() => {
    if (!projectId) {
      navigate(`/projects/${projects[0].id}`);
    }
    setCurrentProjectIndex(projects.findIndex(p => p.id === projectId) || 0);
  }, [projectId, navigate]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleProjectChange = (direction: 'prev' | 'next') => {
    let newIndex = currentProjectIndex;
    if (direction === 'next') {
      newIndex = (currentProjectIndex + 1) % projects.length;
    } else {
      newIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
    }
    setCurrentProjectIndex(newIndex);
    navigate(`/projects/${projects[newIndex].id}`);
  };

  const handleStartExploring = async () => {
    setIsLocked(true);
    if (isMobile) {
      await requestOrientationPermission();
    }
  };

  const handleStopExploring = () => {
    setIsLocked(false);
    setUseDeviceOrientation(false);
    movementRef.current = { x: 0, y: 0 };
    lookRef.current = { x: 0, y: 0 };
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (isLocked) {
      // Nur A/D für Projekt-Navigation während VR-Modus
      if (event.key === 'a') {
        handleProjectChange('prev');
      } else if (event.key === 'd') {
        handleProjectChange('next');
      } else if (event.key === 'Escape') {
        handleStopExploring();
      }
      // Pfeiltasten werden jetzt exklusiv für die VR-Navigation verwendet
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isLocked, currentProjectIndex]);

  const requestOrientationPermission = async () => {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          // @ts-ignore
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission();
        setUseDeviceOrientation(permission === 'granted');
      } else {
        setUseDeviceOrientation(true);
      }
    } catch (error) {
      console.error('Error requesting orientation permission:', error);
    }
  };

  return (
    <PageWrapper>
      <div className="fixed inset-0 pointer-events-none">
        {/* Project Navigation */}
        <AnimatePresence mode="wait">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-32 left-0 right-0 z-50 flex justify-center px-4 pointer-events-auto"
          >
            <nav className="border border-white/20 bg-white/40 backdrop-blur-sm">
              <ul className="flex items-center">
                {projects.map((project) => (
                  <li key={project.id}>
                    <button
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className={`
                        relative px-6 py-4 text-sm uppercase tracking-wider transition-colors cursor-pointer
                        ${project.id === activeProject.id 
                          ? 'text-black' 
                          : 'text-neutral-500 hover:text-black'
                        }
                      `}
                    >
                      <span className="relative z-10">
                        {project.title[language]}
                      </span>
                      {project.id === activeProject.id && (
                        <motion.div 
                          layoutId="activeProject"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" 
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </AnimatePresence>

        {/* VR Background */}
        <div className="absolute inset-0 pointer-events-auto">
          <Canvas
            camera={{
              position: [0, 1.7, 0],
              fov: 75,
              near: 0.1,
              far: 1000
            }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <UnifiedVR360
                imageUrl={activeProject.backgroundImage}
                controls={{
                  movement: movementRef.current,
                  look: lookRef.current
                }}
                useDeviceOrientation={useDeviceOrientation}
              />
              {useDeviceOrientation && (
                <DeviceOrientationControls enabled={isLocked} />
              )}
            </Suspense>
          </Canvas>
        </div>

        {/* Project Content */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Project Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              max-w-2xl w-full mx-auto p-8 
              ${isLocked ? 'bg-black/40' : 'bg-white/40'} 
              backdrop-blur-sm rounded-sm border border-white/20 
              pointer-events-auto
            `}
          >
            <h2 className={`text-2xl font-light mb-4 ${isLocked ? 'text-white' : 'text-black'}`}>
              {activeProject.title[language]}
            </h2>
            <p className={`mb-6 ${isLocked ? 'text-white/80' : 'text-neutral-600'}`}>
              {activeProject.description[language]}
            </p>
            {!isLocked && (
              <button 
                className="px-6 py-3 text-sm bg-black text-white 
                          hover:bg-black/80 transition-colors"
                onClick={handleStartExploring}
              >
                {isMobile ? 'Tap to explore' : 'Click to explore'}
              </button>
            )}
          </motion.div>

          {/* VR Controls */}
          {isLocked && (
            <>
              {/* Controls Group */}
              <div className="fixed bottom-40 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50 pointer-events-auto">
                {/* Exit Button */}
                <button
                  className="px-4 py-2 bg-black/60 backdrop-blur-sm text-white
                           text-sm hover:bg-black/80 transition-colors"
                  onClick={handleStopExploring}
                >
                  Exit
                </button>

                {/* Navigation Controls */}
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-black/60 backdrop-blur-sm text-white
                             text-sm hover:bg-black/80 transition-colors"
                    onClick={() => handleProjectChange('prev')}
                  >
                    ←
                  </button>
                  <button
                    className="px-4 py-2 bg-black/60 backdrop-blur-sm text-white
                             text-sm hover:bg-black/80 transition-colors"
                    onClick={() => handleProjectChange('next')}
                  >
                    →
                  </button>
                </div>

                {/* Mobile Motion Control */}
                {isMobile && (
                  <button
                    className={`px-4 py-2 backdrop-blur-sm text-sm transition-colors ${
                      useDeviceOrientation 
                        ? 'bg-white/20 text-white' 
                        : 'bg-black/60 text-white hover:bg-black/80'
                    }`}
                    onClick={requestOrientationPermission}
                  >
                    {useDeviceOrientation ? '✓ Motion' : '○ Motion'}
                  </button>
                )}
              </div>

              {/* Joysticks */}
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <DualJoystickUI
                  onMove={movement => {
                    movementRef.current = movement;
                  }}
                  onLook={rotation => {
                    if (!useDeviceOrientation) {
                      lookRef.current = rotation;
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Keyboard Controls Hint */}
        {isLocked && !isMobile && (
          <div className="fixed bottom-4 right-4 text-xs text-white/60 pointer-events-none">
            Use A/D to switch projects | Arrow keys to look around
          </div>
        )}
      </div>
    </PageWrapper>
  );
}