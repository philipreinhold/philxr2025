// src/components/pages/About.tsx
import PageWrapper from '../Layout/PageWrapper'
import { useLanguageStore } from '../../store/languageStore'
import { translations } from '../../constants/translations'

export default function About() {
  const { language } = useLanguageStore()
  const content = translations.about
  
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-md rounded-lg">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-md">
              <img
                src="/placeholder-portrait.jpg"
                alt="Philip Reinhold"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-light mb-6">Philip Reinhold</h2>
            <h3 className="text-xl text-neutral-700 mb-4">Cinematographer / Filmmaker</h3>
            
            <div className="space-y-4 text-neutral-800">
              <p>
                I love blending art and technology. Over the years, I've shot promos for international A List artists 
                and shot over 200 commercials for major Brands around the world as director of photography.
              </p>
              
              <p>
                My passion lies in creating entertaining projects. I enjoy bringing together creativity, vision, 
                artistic expression, and digital elements to craft unique stories and experiences. I want to visually 
                captivate audiences, spark their excitement, and immerse them in interactive worlds that truly resonate.
              </p>
              
              <p>
                I'm inspired by music, nature, urban chaos, and cultures. I thrive in artistic and documentary film 
                projects, as well as XR Art.
              </p>
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-3">Directors I've Worked With</h4>
              <p className="text-sm text-neutral-600">
                Andrew Becker, Andy Blackburn, André Chammas, Angnew Summer, Anne Weigel, Annie Gunn (Peter & Annie), 
                Astrid Salomon, Benjamin Brettschneider, Bernard Wedig, Bernie Roux, Christoph Urban, Cinzia Pedrizzetti, 
                Damien Vignaux, Don Broida, Frank Brendel, Frank Nesemann, Eric van den Hoonaard, Gabriel Bihina, 
                Jeremie Saindon, Job van As, Liz Murphy, Manuel Werner, Marcus Lundin, Marie Schuller, Markus Bader, 
                Markus Sternberg, Mate Steinforth, Reto Salimbeni, Pet&Flo, Sam Holst, Thomas Krygier, Vivane Blumenschein 
                and more
              </p>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-3">Production Companies</h4>
              <p className="text-sm text-neutral-600">
                AnimalfactoryFilms, BLM Film, BigBlue Thai, Casta Diva Pictures, CityFilms, Clandestino, Cobblestone, 
                Filmdeluxe, GangFilms, GreatGuns, Manifesto-Films, MARKENFILM Wedel/Schweiz & Crossing, Onirim Paris, 
                Parasol Island, Partizan, Satelitte my Love, Stillking, Stink, The Sweetshop, TwinFilm, 27KM
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}