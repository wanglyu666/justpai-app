import { ref } from 'vue';

const STORAGE_KEY = 'justpai-store-search-history';
const MAX_HISTORY = 10;

const readHistory = (): string[] => {
  try {
    const stored = uni.getStorageSync(STORAGE_KEY);
    if (!Array.isArray(stored)) return [];
    return stored.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  } catch {
    return [];
  }
};

export const useStoreSearchHistory = () => {
  const history = ref<string[]>(readHistory());

  const remember = (keyword: string) => {
    const query = keyword.trim();
    if (!query) return;

    const next = [query, ...history.value.filter((item) => item !== query)].slice(0, MAX_HISTORY);
    history.value = next;
    uni.setStorageSync(STORAGE_KEY, next);
  };

  return {
    history,
    remember,
  };
};
