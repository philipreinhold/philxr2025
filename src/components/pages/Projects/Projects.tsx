// src/components/pages/Projects/Projects.tsx
import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguageStore } from '../../../store/languageStore';
import PageWrapper from '../../Layout/PageWrapper';
import { projects } from '../../../config/projects.config';

export default function Projects() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { language } = useLanguageStore();
  
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [showProjectInfo, setShowProjectInfo] = useState(true);
  
  const activeProject = projects.find(p => p.id === projectId) || projects[0];
  const activeIndex = projects.findIndex(p => p.id === activeProject.id);

  // Automatisch zum ersten Projekt navigieren, wenn keines ausgewählt ist
  useEffect(() => {
    if (!projectId) {
      navigate(`/projects/${projects[0].id}`);
    }
    setCurrentProjectIndex(projects.findIndex(p => p.id === projectId) || 0);
  }, [projectId, navigate]);

  // Projektbildhintergrund für World aktualisieren
  useEffect(() => {
    if (activeProject) {
      console.log('Projects: Setze Hintergrundbild für Projekt', activeProject.id, activeProject.backgroundImage);
      
      // Zeitverzögerung, um dem App.tsx-Events Zeit zu geben, korrekt zu verarbeiten
      setTimeout(() => {
        // Wir verwenden die ID des Projekts, damit die ImageImports-Helfer das richtige Bild finden können
        const event = new CustomEvent('changeBackground', { 
          detail: { 
            imageUrl: activeProject.backgroundImage,
            projectId: activeProject.id
          } 
        });
        window.dispatchEvent(event);
      }, 100);
    }
    
    // Cleanup-Funktion: Stellen wir sicher, dass wir nicht unnötig das resetBackground-Event auslösen
    return () => {
      // Nur aufrufen, wenn wir die Projektseite wirklich verlassen, nicht bei Wechsel zwischen Projekten
      // App.tsx kümmert sich jetzt besser um diesen Fall
    };
  }, [activeProject]);

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

  return (
    <PageWrapper>
      {/* Project Navigation */}
      <AnimatePresence mode="wait">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-32 left-0 right-0 z-50 flex justify-center px-4 pointer-events-auto"
        >
          <nav className="border border-white/20 bg-white/40 backdrop-blur-sm rounded-md">
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

      {/* Project Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-32 left-1/2 transform -translate-x-1/2
                  max-w-2xl w-full mx-auto p-8 
                  bg-white/40 backdrop-blur-sm rounded-sm border border-white/20 
                  pointer-events-auto"
      >
        <h2 className="text-2xl font-light mb-4 text-black">
          {activeProject.title[language]}
        </h2>
        <p className="mb-6 text-neutral-600">
          {activeProject.description[language]}
        </p>
        
        {/* Project Navigation - visuell verstärkt */}
        <div className="flex justify-between mt-6">
          <button
            className="px-6 py-3 bg-black/15 backdrop-blur-sm text-black rounded-md
                     text-sm hover:bg-black/25 transition-colors flex items-center"
            onClick={() => handleProjectChange('prev')}
          >
            <span className="mr-2">←</span> Vorheriges
          </button>
          <button
            className="px-6 py-3 bg-black/15 backdrop-blur-sm text-black rounded-md
                     text-sm hover:bg-black/25 transition-colors flex items-center"
            onClick={() => handleProjectChange('next')}
          >
            Nächstes <span className="ml-2">→</span>
          </button>
        </div>
      </motion.div>
    </PageWrapper>
  );
}