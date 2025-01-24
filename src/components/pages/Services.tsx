// src/components/pages/Services.tsx
import PageWrapper from '../Layout/PageWrapper'
import { useLanguageStore } from '../../store/languageStore'
import { translations } from '../../constants/translations'

const Services = () => {
  const { language } = useLanguageStore()
  
  return (
    <PageWrapper>
      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-light mb-6">
            {translations.pages.services.title[language]}
          </h2>
          <div className="space-y-8">
            {translations.pages.services.description[language]}
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}

export default Services