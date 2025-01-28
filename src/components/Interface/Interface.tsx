// src/components/Interface/Interface.tsx
import { memo } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';

const Interface = memo(() => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 p-4 z-50 bg-white/80 backdrop-blur-sm"
      role="banner"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto relative">
        <LanguageSelector />
        
        <div className="flex justify-between items-center pt-8">
          <Logo />
          <Navigation />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
});

Interface.displayName = 'Interface';

export default Interface;