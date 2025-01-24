// src/components/Interface/Interface.tsx
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useLanguageStore } from '../../store/languageStore'
import { translations } from '../../constants/translations'

const Interface = () => {
 const location = useLocation()
 const [isMenuOpen, setIsMenuOpen] = useState(false)
 const { language, setLanguage } = useLanguageStore()

 const navigationItems = [
   { path: '/projects', key: 'projects' },
   { path: '/about', key: 'about' },
   { path: '/services', key: 'services' },
   { path: '/contact', key: 'contact' }
 ] as const

 return (
   <header className="fixed top-0 left-0 right-0 p-4 z-50 bg-white/80 backdrop-blur-sm">
     <div className="max-w-7xl mx-auto">
       <div className="flex justify-between items-center">
         <Link to="/" className="group">
           <h1 className="text-xl md:text-2xl font-light tracking-wide">
             Philip Reinhold
           </h1>
           <span className="text-xs md:text-sm font-light text-neutral-500 tracking-wider">
             {translations.header.role[language]}
           </span>
         </Link>

         <div className="flex items-center gap-4">
           <div className="relative group z-50">
             <button className="px-3 py-1 text-sm bg-white/50 rounded hover:bg-white/80 transition-colors">
               {language.toUpperCase()} ▼
             </button>
             <div className="absolute right-0 mt-1 hidden group-hover:block">
               <div className="bg-white rounded shadow-lg py-1">
                 <button 
                   className="px-4 py-1 w-full text-left hover:bg-gray-100"
                   onClick={() => setLanguage('en')}
                 >
                   English
                 </button>
                 <button 
                   className="px-4 py-1 w-full text-left hover:bg-gray-100"
                   onClick={() => setLanguage('es')}
                 >
                   Español
                 </button>
               </div>
             </div>
           </div>

           <button
             className="md:hidden p-2"
             onClick={() => setIsMenuOpen(!isMenuOpen)}
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

           <nav className="hidden md:flex space-x-8">
             {navigationItems.map(({ path, key }) => (
               <Link 
                 key={key}
                 to={path} 
                 className={`
                   relative px-4 py-2 text-sm uppercase tracking-wider transition-colors
                   ${location.pathname === path 
                     ? 'text-black' 
                     : 'text-neutral-500 hover:text-black'
                   }
                 `}
               >
                 <span className="relative z-10">
                   {translations.navigation[key][language]}
                 </span>
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
               </Link>
             ))}
           </nav>
         </div>
       </div>

       {isMenuOpen && (
         <nav className="md:hidden mt-4 py-4 border-t border-neutral-200">
           <div className="flex flex-col space-y-4">
             {navigationItems.map(({ path, key }) => (
               <Link
                 key={key}
                 to={path}
                 onClick={() => setIsMenuOpen(false)}
                 className={`
                   text-sm uppercase tracking-wider transition-colors px-2
                   ${location.pathname === path
                     ? 'text-black font-medium'
                     : 'text-neutral-500'
                   }
                 `}
               >
                 {translations.navigation[key][language]}
               </Link>
             ))}
           </div>
         </nav>
       )}
     </div>
   </header>
 )
}

export default Interface