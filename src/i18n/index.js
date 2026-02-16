import i18next from 'i18next';
import en from '../locales/en.json';
import es from '../locales/es.json';

const savedLanguage = localStorage.getItem('language') || 'en';

i18next.init({
  lng: savedLanguage,
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    es: { translation: es }
  }
});

export function t(key) {
  return i18next.t(key);
}

export function changeLanguage(lng) {
  i18next.changeLanguage(lng);
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
  return lng;
}

export function getCurrentLanguage() {
  return i18next.language;
}

export function getAvailableLanguages() {
  return [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];
}

export default i18next;
