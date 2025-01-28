// src/components/Interface/LanguageSelector.tsx
import { useLanguageStore } from '../../store/languageStore';
import type { Language } from '../../store/languageStore';

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguageStore();
  
  const LanguageButton = ({ lang }: { lang: Language }) => (
    <button 
      onClick={() => setLanguage(lang)}
      className={`px-3 py-1 transition-colors ${
        language === lang 
          ? 'border border-black' 
          : 'text-neutral-500 hover:text-black'
      }`}
    >
      {lang.toUpperCase()}
    </button>
  );

  return (
    <div className="absolute top-1 right-0 z-50 flex items-center gap-1 text-sm">
      <LanguageButton lang="en" />
      <span className="text-neutral-300">|</span>
      <LanguageButton lang="es" />
    </div>
  );
};