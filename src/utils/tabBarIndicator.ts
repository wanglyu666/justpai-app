/** 底部 Tab 绿球指示器共享状态与动效配置 */

let sharedIndicatorIndex = 0;
let hasSharedIndicator = false;

export const TAB_ROUTES = [
  'pages/index/index',
  'pages/store/index',
  'pages/work/index',
  'pages/manage/index',
] as const;

export type TabRoute = (typeof TAB_ROUTES)[number];

/** 先加速再减速并略带回弹 */
export const TAB_INDICATOR_EASING = 'cubic-bezier(0.22, 1.45, 0.36, 1)';
export const TAB_INDICATOR_DURATION_MS = 380;

/** 等绿球移动大半后再切页，避免动画被页面销毁打断 */
export const TAB_INDICATOR_SWITCH_DELAY_MS = 300;

export const TABBAR_SIDE_INSET = 24;
export const TABBAR_PADDING_X = 12;
export const INDICATOR_SIZE = 48;

export const getSharedTabIndicatorIndex = () => sharedIndicatorIndex;

export const setSharedTabIndicatorIndex = (index: number) => {
  sharedIndicatorIndex = index;
  hasSharedIndicator = true;
};

export const hasSharedTabIndicator = () => hasSharedIndicator;

export const getTabIndexByPath = (path: string) => {
  const index = TAB_ROUTES.indexOf(path as TabRoute);
  return index >= 0 ? index : 0;
};

/** TabBar 内容区宽度（左右各 24px 外边距） */
export const getTabBarWidth = () => {
  try {
    return uni.getSystemInfoSync().windowWidth - TABBAR_SIDE_INSET * 2;
  } catch {
    return 320;
  }
};

/** 第 index 个 icon 背后的绿球 left 偏移 */
export const getIndicatorOffsetX = (index: number, tabCount = TAB_ROUTES.length) => {
  const width = getTabBarWidth();
  const inner = width - TABBAR_PADDING_X * 2;
  const itemWidth = inner / tabCount;
  return TABBAR_PADDING_X + index * itemWidth + (itemWidth - INDICATOR_SIZE) / 2;
};
