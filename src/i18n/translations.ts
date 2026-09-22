import en from './locales/en';
import zh from './locales/zh';
import type { Locale, TranslationTree } from './types';

export const translations: Record<Locale, TranslationTree> = { en, zh };
export type { Locale, TranslationTree };
