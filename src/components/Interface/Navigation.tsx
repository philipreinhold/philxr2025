// src/components/Interface/Navigation.tsx
import { Link, useLocation } from 'react-router-dom';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../constants/translations';

export const Navigation = ({ isMobile = false }) => {
  const location = useLocation();
  const { language } = useLanguageStore();
  
  const navigationItems = [
    { path: '/projects', key: 'projects' },
    { path: '/about', key: 'about' },
    { path: '/services', key: 'services' },
    { path: '/contact', key: 'contact' }
  ] as const;

  const NavLink = ({ path, translationKey }: { path: string, translationKey: string }) => (
    <Link 
      to={path} 
      className={`
        relative px-4 py-2 text-sm uppercase tracking-wider transition-colors
        ${location.pathname === path 
          ? 'text-black' 
          : 'text-neutral-500 hover:text-black'
        }
        ${isMobile ? 'block py-3' : ''}
      `}
    >
      <span className="relative z-10">
        {translations.navigation[translationKey][language]}
      </span>
      {!isMobile && (
        <div 
          className={`
            absolute inset-0 border border-black transform origin-left
            transition-transform duration-300 ease-out
            ${location.pathname === path 
              ? 'scale-x-100' 
              : 'scale-x-0 group-hover:scale-x-100'
            }
          `}
        />
      )}
    </Link>
  );

  return (
    <nav className={isMobile ? 'space-y-2' : 'hidden md:flex space-x-8'}>
      {navigationItems.map(({ path, key }) => (
        <NavLink key={path} path={path} translationKey={key} />
      ))}
    </nav>
  );
};