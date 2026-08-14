import { rpx2px } from '@/utils/rpx';

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

/** 与 CustomTabBar 样式一致（设计稿 rpx） */
export const TABBAR_SIDE_INSET_RPX = 48;
export const TABBAR_PADDING_X_RPX = 24;
export const INDICATOR_SIZE_RPX = 96;

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

/** TabBar 内容区宽度（左右各 48rpx 外边距） */
export const getTabBarWidth = () => {
  const side = rpx2px(TABBAR_SIDE_INSET_RPX);
  try {
    return uni.getSystemInfoSync().windowWidth - side * 2;
  } catch {
    return rpx2px(640);
  }
};

/** 第 index 个 icon 背后的绿球 left 偏移（返回 CSS px，供 transform 使用） */
export const getIndicatorOffsetX = (index: number, tabCount = TAB_ROUTES.length) => {
  const width = getTabBarWidth();
  const pad = rpx2px(TABBAR_PADDING_X_RPX);
  const size = rpx2px(INDICATOR_SIZE_RPX);
  const inner = width - pad * 2;
  const itemWidth = inner / tabCount;
  return pad + index * itemWidth + (itemWidth - size) / 2;
};
