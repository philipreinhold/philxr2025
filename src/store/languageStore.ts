// src/store/languageStore.ts
import { create } from 'zustand'

export type Language = 'en' | 'es'

interface LanguageState {
 language: Language;
 setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
 language: navigator.language.startsWith('es') ? 'es' : 'en',
 setLanguage: (lang) => set({ language: lang })
}))
