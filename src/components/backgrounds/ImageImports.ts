// src/components/backgrounds/ImageImports.ts
// Explizite Importe aller 360°-Bilder für korrekte Vite-Bundling

// Importiere alle Bilder direkt
import hwLowImage from '../../components/Images/HW_360_VR_COLOR_CHECK_LOW.jpg';
import digitalMemoriesImage from '../../components/Images/digital-memories.jpg';
import natureReduxImage from '../../components/Images/nature-redux.jpg';
import urbanDreamsImage from '../../components/Images/urban-dreams.jpg';
import quantumSpacesImage from '../../components/Images/quantum-spaces.jpg';
import timeEchoesImage from '../../components/Images/time-echoes.jpg';

// Debug-Ausgabe für importierte Bilder
console.log('Importierte Bilder in ImageImports.ts:');
console.log('hwLowImage:', hwLowImage);
console.log('digitalMemoriesImage:', digitalMemoriesImage);
console.log('natureReduxImage:', natureReduxImage);
console.log('urbanDreamsImage:', urbanDreamsImage);
console.log('quantumSpacesImage:', quantumSpacesImage);
console.log('timeEchoesImage:', timeEchoesImage);

// Definiere die validen Projekt-IDs als Typ
type ProjectId = 'human-within' | 'digital-memories' | 'nature-redux' | 'urban-dreams' | 'quantum-spaces' | 'time-echoes';

// Exportiere sie als Objekt für einfachen Zugriff
export const TEXTURE_PATHS: Record<ProjectId, string> = {
  'human-within': hwLowImage,
  'digital-memories': digitalMemoriesImage,
  'nature-redux': natureReduxImage,
  'urban-dreams': urbanDreamsImage,
  'quantum-spaces': quantumSpacesImage,
  'time-echoes': timeEchoesImage,
};

// Debug-Ausgabe der TEXTURE_PATHS
console.log('TEXTURE_PATHS Objekt:', JSON.stringify(TEXTURE_PATHS, null, 2));

// Exportiere auch eine Funktion, die den richtigen Pfad basierend auf der URL zurückgibt
export function getTexturePathFromUrl(url: string, projectId?: string): string {
  console.log('getTexturePathFromUrl wurde aufgerufen mit URL:', url, 'und Projekt-ID:', projectId);
  
  // Wenn eine Projekt-ID angegeben ist, verwende diese direkt
  if (projectId && Object.keys(TEXTURE_PATHS).includes(projectId)) {
    const typedProjectId = projectId as ProjectId;
    console.log('Gefundenes Bild basierend auf Projekt-ID:', projectId, TEXTURE_PATHS[typedProjectId]);
    return TEXTURE_PATHS[typedProjectId];
  }
  
  // Extrahiere den Dateinamen aus der URL
  const fileName = url.split('/').pop();
  console.log('Extrahierter Dateiname aus URL:', fileName);
  
  // Wenn der Dateiname "HW_360_VR_COLOR_CHECK_LOW.jpg" ist, gib den Pfad für "human-within" zurück
  if (fileName === 'HW_360_VR_COLOR_CHECK_LOW.jpg') {
    console.log('Verwende human-within basierend auf Dateinamen', TEXTURE_PATHS['human-within']);
    return TEXTURE_PATHS['human-within'];
  }
  
  // Versuche, die Projekt-ID aus dem Dateinamen abzuleiten
  const possibleIds = Object.keys(TEXTURE_PATHS) as ProjectId[];
  for (const id of possibleIds) {
    if (fileName && fileName.toLowerCase().includes(id.toLowerCase())) {
      console.log('Verwende Projekt', id, 'basierend auf Dateinamenanalyse', TEXTURE_PATHS[id]);
      return TEXTURE_PATHS[id];
    }
  }
  
  // Durchsuche alle Werte in TEXTURE_PATHS und finde den passenden
  for (const [key, path] of Object.entries(TEXTURE_PATHS)) {
    const pathStr = path.toString();
    if (fileName && pathStr.includes(fileName)) {
      const typedKey = key as ProjectId;
      console.log('Verwende Projekt', key, 'basierend auf Pfadanalyse', path);
      return TEXTURE_PATHS[typedKey];
    }
  }
  
  // Fallback auf das erste Bild
  console.warn('Konnte keinen passenden Texturpfad finden für URL:', url, '- Verwende Standard');
  console.log('Verfügbare Pfade:', Object.keys(TEXTURE_PATHS).map(key => `${key}: ${TEXTURE_PATHS[key as ProjectId]}`).join(', '));
  return TEXTURE_PATHS['human-within'];
} 