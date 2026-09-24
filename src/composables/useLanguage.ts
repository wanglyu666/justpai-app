import { computed, ref } from 'vue';
import {
  baseMessages,
  LANGUAGE_STORAGE_KEY,
  languageOptions,
  languagePatches,
  type AppLanguage,
  type LanguageKey,
} from '@/locales/languagePatch';

const isAppLanguage = (value: unknown): value is AppLanguage =>
  languageOptions.some((option) => option.code === value);

const readSavedLanguage = (): AppLanguage => {
  try {
    const saved = uni.getStorageSync(LANGUAGE_STORAGE_KEY) as unknown;
    return isAppLanguage(saved) ? saved : 'zh-CN';
  } catch {
    return 'zh-CN';
  }
};

const currentLanguage = ref<AppLanguage>(readSavedLanguage());

const t = (key: LanguageKey): string => {
  const language = currentLanguage.value;
  if (language === 'zh-CN') return baseMessages[key];
  return languagePatches[language][key] ?? baseMessages[key];
};

const tf = (key: LanguageKey, values: Record<string, string | number>): string =>
  Object.entries(values).reduce(
    (message, [name, value]) => message.split(`{${name}}`).join(String(value)),
    t(key),
  );

const setLanguage = (language: AppLanguage) => {
  if (currentLanguage.value === language) return;
  currentLanguage.value = language;
  try {
    uni.setStorageSync(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // 存储不可用时仍保留本次会话内的切换结果。
  }
};

export const useLanguage = () => {
  const currentLanguageName = computed(
    () =>
      languageOptions.find((option) => option.code === currentLanguage.value)?.label ??
      languageOptions[0].label,
  );

  return {
    currentLanguage,
    currentLanguageName,
    languageOptions,
    setLanguage,
    t,
    tf,
  };
};
