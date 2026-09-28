import type { Locale } from './types';

/**
 * Display labels for the language switcher.
 *
 * Per docs/guidelines.md §5.1 (Internationalization):
 *   - Use language NAMES in native script (endonym), not language codes.
 *   - Never use country flags. Flags ≠ languages.
 *   - Sort according to the user's current locale's conventions.
 */
export const locales: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
};
