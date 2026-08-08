import { ref } from 'vue';
import { TAB_ROUTES, type TabRoute } from '@/utils/tabBarIndicator';

/** 一级 Tab 路径（与历史 pages 路径保持一致，避免改动指示器/TabBar 逻辑） */
export type MainTabPath = TabRoute;

const activeTabPath = ref<MainTabPath>('pages/index/index');

const normalizeTabPath = (path: string): MainTabPath => {
  const cleaned = path.replace(/^\//, '') as MainTabPath;
  return TAB_ROUTES.includes(cleaned) ? cleaned : 'pages/index/index';
};

export const getActiveTabPath = () => activeTabPath.value;

export const setActiveTabPath = (path: string) => {
  activeTabPath.value = normalizeTabPath(path);
};

/** 单页壳内共享的当前一级 Tab */
export function useMainTab() {
  return {
    activeTabPath,
    setActiveTabPath,
    normalizeTabPath,
  };
}
