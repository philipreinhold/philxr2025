// src/components/pages/About.tsx
import PageWrapper from '../Layout/PageWrapper'
import { useLanguageStore } from '../../store/languageStore'
import { translations } from '../../constants/translations'

export default function About() {
  const { language } = useLanguageStore()
  const content = translations.about
  
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="/placeholder-portrait.jpg"
                alt="Philip Reinhold"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-xl font-light mb-6">{content.title[language]}</h2>
            <p className="text-lg mb-4">{content.intro[language]}</p>
            <p className="text-neutral-600">{content.biography[language]}</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}