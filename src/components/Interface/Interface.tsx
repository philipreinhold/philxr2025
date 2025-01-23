// src/components/Interface.tsx
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Interface = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 p-4 z-50 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo/Title Section */}
          <Link to="/" className="group">
            <h1 className="text-xl md:text-2xl font-light tracking-wide">
              Philip Reinhold
            </h1>
            <span className="text-xs md:text-sm font-light text-neutral-500 tracking-wider">
              XR Artist
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {['projects', 'about', 'contact'].map((item) => (
              <Link 
                key={item}
                to={`/${item}`} 
                className={`
                  relative px-4 py-2 text-sm uppercase tracking-wider transition-colors
                  ${location.pathname === `/${item}` 
                    ? 'text-black' 
                    : 'text-neutral-500 hover:text-black'
                  }
                `}
              >
                <span className="relative z-10">{item}</span>
                <div 
                  className={`
                    absolute inset-0 border border-black transform origin-left
                    transition-transform duration-300 ease-out
                    ${location.pathname === `/${item}` 
                      ? 'scale-x-100' 
                      : 'scale-x-0 group-hover:scale-x-100'
                    }
                  `}
                />
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-neutral-200">
            <div className="flex flex-col space-y-4">
              {['projects', 'about', 'contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    text-sm uppercase tracking-wider transition-colors px-2
                    ${location.pathname === `/${item}`
                      ? 'text-black font-medium'
                      : 'text-neutral-500'
                    }
                  `}
                >
                  {item}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Interface;