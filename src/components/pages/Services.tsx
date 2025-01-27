// src/components/pages/Services/Services.tsx
import PageWrapper from '../Layout/PageWrapper';
import { useLanguageStore } from '../../store/languageStore';

const services = [
  {
    title: { en: 'Director of Photography', es: 'Director de Fotografía' },
    description: {
      en: '20 years of experience in professional filmmaking as Director of Photography, involved in international film projects. Contributed to over 200 commercial films and several feature films.',
      es: '20 años de experiencia en cine profesional como Director de Fotografía, participando en proyectos cinematográficos internacionales. Contribuyó a más de 200 comerciales y varios largometrajes.'
    }
  },
  {
    title: { en: 'XR Development', es: 'Desarrollo XR' },
    description: {
      en: 'Extensive experience in developing VR & AR content, from traditional to modern 3D content creation and integration in game engines. Specialized in WebXR, standalone, and high-end hardware solutions. Recent focus on educational and business applications beyond entertainment.',
      es: 'Amplia experiencia en desarrollo de contenido VR & AR, desde creación de contenido 3D tradicional hasta moderno e integración en motores de juego. Especializado en soluciones WebXR, independientes y hardware de alta gama. Enfoque reciente en aplicaciones educativas y empresariales más allá del entretenimiento.'
    }
  },
  {
    title: { en: '360° & Interactive Imagery', es: 'Imágenes 360° e Interactivas' },
    description: {
      en: 'Expert in optimal positioning, experienced in capturing from 3 DoF to limited 6 DoF using modern techniques like Gaussian Splats. Focus on creative viewer guidance and pushing technical boundaries.',
      es: 'Experto en posicionamiento óptimo, experimentado en captura desde 3 DoF hasta 6 DoF limitado utilizando técnicas modernas como Gaussian Splats. Enfoque en guía creativa del espectador y expansión de límites técnicos.'
    }
  },
  {
    title: { en: 'Interactive Installations', es: 'Instalaciones Interactivas' },
    description: {
      en: 'Custom interactive installations and applications for exhibitions, museums, and events.',
      es: 'Instalaciones y aplicaciones interactivas personalizadas para exposiciones, museos y eventos.'
    }
  },
  {
    title: { en: 'Technical Consulting', es: 'Consultoría Técnica' },
    description: {
      en: 'Guidance and support for those seeking to enter the world of XR.',
      es: 'Orientación y apoyo para aquellos que buscan ingresar al mundo XR.'
    }
  }
];

export default function Services() {
  const { language } = useLanguageStore();

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white/50 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-xl font-medium mb-4">
                {service.title[language]}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {service.description[language]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}