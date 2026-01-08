// /src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true, // Laissez à true pour voir les erreurs dans la console F12
    
    // --- AJOUTEZ CETTE LIGNE ---
    load: 'languageOnly', // Force 'fr' au lieu de 'fr-FR'
    // ---------------------------

    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;