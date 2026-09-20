import zh from './zh';
import en from './en';

export type Locale = 'zh' | 'en';

export const locales: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
};

export const defaultLocale: Locale = 'zh';

const translations: Record<Locale, typeof zh> = {
  zh,
  en,
};

export function getLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  // Check localStorage first
  const saved = localStorage.getItem('locale') as Locale;
  if (saved && (saved === 'zh' || saved === 'en')) {
    return saved;
  }
  
  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('en')) return 'en';
  
  return defaultLocale;
}

export function setLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
  window.dispatchEvent(new CustomEvent('localechange', { detail: locale }));
}

export function t(): typeof zh {
  const locale = getLocale();
  return translations[locale];
}
