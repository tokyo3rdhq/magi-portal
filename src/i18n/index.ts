// Public API of the i18n module.
//
// - `types`         Locale + TranslationTree (author new locales against this)
// - `translations`  Registry of loaded dictionaries, keyed by Locale
// - `locales`       Display labels for the language switcher
//                   ({ zh: '中文', en: 'EN' })
//
// Runtime helpers (getLocale / setLocale / applyTranslations /
// syncActiveLocaleButton) live in `./runtime.ts` and touch the DOM and
// localStorage, so they must only be imported from a browser-side script
// block (see Layout.astro's inline <script>).

export type { Locale, TranslationTree } from './types';
export { translations } from './translations';
export { locales } from './locales-meta';
