// src/components/pages/Services/index.tsx
import PageWrapper from '../../Layout/PageWrapper'
import { useLanguageStore } from '../../../store/languageStore'
import { translations } from '../../../constants/translations'

export function Services() {
  const { language } = useLanguageStore()
  const content = translations.services
  
  return (
    <PageWrapper>
      <h2 className="text-xl font-light mb-6">{content.title[language]}</h2>
      <p className="text-lg mb-8">{content.intro[language]}</p>
      <div className="grid gap-8 md:grid-cols-2">
        {content.services.map((service, index) => (
          <div key={index} className="p-6 bg-white/50 backdrop-blur-sm rounded-lg">
            <h3 className="text-lg font-medium mb-2">
              {service.title[language]}
            </h3>
            <p className="text-neutral-600">
              {service.description[language]}
            </p>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}

// components/pages/Services/index.tsx
export default function Services() {
    // Services component code
  }