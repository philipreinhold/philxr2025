import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from '../../Layout/PageWrapper';
import { useLanguageStore } from '../../../store/languageStore';
import { motion } from 'framer-motion';

const projects = [
  {
    id: 'human-within',
    title: { en: 'Human Within', es: 'Human Within' },
    description: { 
      en: '360° VR Experience exploring human perception',
      es: 'Experiencia VR 360° explorando la percepción humana'
    },
    path: '/projects/human-within'
  },
  {
    id: 'digital-ecosystem',
    title: { en: 'Digital Ecosystem', es: 'Ecosistema Digital' },
    description: {
      en: 'Interactive digital environment',
      es: 'Entorno digital interactivo'
    },
    path: '/projects/digital-ecosystem'
  },
  {
    id: 'urban-data',
    title: { en: 'Urban Data', es: 'Datos Urbanos' },
    description: {
      en: 'Data visualization project',
      es: 'Proyecto de visualización de datos'
    },
    path: '/projects/urban-data'
  }
];

// Box als Platzhalter für 3D-Content
function Box() {
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function Projects() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguageStore();
  const [activeProject, setActiveProject] = useState(projects[0]);

  useEffect(() => {
    // Finde das aktive Projekt basierend auf der URL
    const currentProject = projects.find(p => 
      location.pathname.includes(p.id)) || projects[0];
    setActiveProject(currentProject);
  }, [location]);

  const handleProjectClick = (project) => {
    setActiveProject(project);
    navigate(project.path);
  };

  return (
    <PageWrapper>
      {/* Fixed Navigation Bar */}
      <div className="fixed top-32 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
          <ul className="flex items-center">
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  onClick={() => handleProjectClick(project)}
                  className={`
                    relative px-6 py-4 text-sm uppercase tracking-wider transition-colors
                    ${location.pathname.includes(project.id) 
                      ? 'text-black' 
                      : 'text-neutral-500 hover:text-black'
                    }
                  `}
                >
                  <span className="relative z-10">
                    {project.title[language]}
                  </span>
                  
                  {/* Animated underline */}
                  <motion.div 
                    className="absolute inset-0 border border-black"
                    initial={{ scaleX: 0 }}
                    animate={{ 
                      scaleX: location.pathname.includes(project.id) ? 1 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Project View */}
      <div className="w-full h-[calc(100vh-12rem)] bg-white/50 backdrop-blur-sm rounded-lg overflow-hidden mt-16">
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <Box />
          </Suspense>
        </Canvas>

        {/* Project Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-light mb-2">
            {activeProject.title[language]}
          </h2>
          <p className="text-neutral-600">
            {activeProject.description[language]}
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}