// Public API of the i18n module.
//
// - `types`         Locale + TranslationTree (author new locales against this)
// - `translations`  Registry of loaded dictionaries, keyed by Locale
// - `locales`       Display labels for the language switcher
//                   ({ zh: '中文', en: 'English' })
//
// Runtime helpers (getLocale / setLocale / applyTranslations /
// syncActiveLocaleButton) are inlined in `src/layouts/Layout.astro`:
//   - head: tiny sync script that sets `document.documentElement.lang`
//     from localStorage before paint (audit F-008).
//   - end-of-body: full bootstrap that wires DOMContentLoaded, listbox
//     keyboard nav, and the body[data-scrolling] scrollbar state.

export type { Locale, TranslationTree } from './types';
export { translations } from './translations';
export { locales } from './locales-meta';
