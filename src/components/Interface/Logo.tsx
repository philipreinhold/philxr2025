// src/components/Interface/Logo.tsx
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../constants/translations';

export const Logo = () => {
  const { language } = useLanguageStore();
  
  return (
    <Link to="/" className="group">
      <h1 className="text-xl md:text-2xl font-light tracking-wide">
        Philip Reinhold
      </h1>
      <span className="text-xs md:text-sm font-light text-neutral-500 tracking-wider">
        {translations.header.role[language]}
      </span>
    </Link>
  );
};