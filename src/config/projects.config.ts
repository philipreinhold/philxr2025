// src/config/projects.config.ts
export interface Project {
    id: string;
    title: {
      en: string;
      es: string;
    };
    description: {
      en: string;
      es: string;
    };
    backgroundImage: string;
    category: 'vr' | 'interactive' | 'installation';
  }
  
  export const projects: Project[] = [
    {
      id: 'human-within',
      title: {
        en: 'Human Within',
        es: 'Human Within'
      },
      description: {
        en: '360° VR Experience exploring human perception and consciousness through immersive storytelling',
        es: 'Experiencia VR 360° que explora la percepción humana y la consciencia a través de narrativa inmersiva'
      },
      backgroundImage: '/src/components/Images/HW_360_VR_COLOR_CHECK_6.jpg',
      category: 'vr'
    },
    {
      id: 'digital-memories',
      title: {
        en: 'Digital Memories',
        es: 'Memorias Digitales'
      },
      description: {
        en: 'Interactive VR installation capturing and visualizing personal memories in virtual space',
        es: 'Instalación VR interactiva que captura y visualiza memorias personales en el espacio virtual'
      },
      backgroundImage: '/src/components/Images/digital-memories.jpg',
      category: 'vr'
    },
    {
      id: 'nature-redux',
      title: {
        en: 'Nature Redux',
        es: 'Naturaleza Redux'
      },
      description: {
        en: 'VR environmental art exploring the intersection of natural and digital landscapes',
        es: 'Arte ambiental en VR que explora la intersección entre paisajes naturales y digitales'
      },
      backgroundImage: '/src/components/Images/nature-redux.jpg',
      category: 'vr'
    },
    {
      id: 'urban-dreams',
      title: {
        en: 'Urban Dreams',
        es: 'Sueños Urbanos'
      },
      description: {
        en: 'Surreal cityscapes in VR examining modern urban life and architecture',
        es: 'Paisajes urbanos surrealistas en VR que examinan la vida urbana moderna y la arquitectura'
      },
      backgroundImage: '/src/components/Images/urban-dreams.jpg',
      category: 'vr'
    },
    {
      id: 'quantum-spaces',
      title: {
        en: 'Quantum Spaces',
        es: 'Espacios Cuánticos'
      },
      description: {
        en: 'Abstract VR environments inspired by quantum mechanics and particle physics',
        es: 'Entornos VR abstractos inspirados en la mecánica cuántica y la física de partículas'
      },
      backgroundImage: '/src/components/Images/quantum-spaces.jpg',
      category: 'vr'
    },
    {
      id: 'time-echoes',
      title: {
        en: 'Time Echoes',
        es: 'Ecos del Tiempo'
      },
      description: {
        en: 'Temporal VR experience exploring past, present and future simultaneously',
        es: 'Experiencia VR temporal que explora pasado, presente y futuro simultáneamente'
      },
      backgroundImage: '/src/components/Images/time-echoes.jpg',
      category: 'vr'
    }
  ];