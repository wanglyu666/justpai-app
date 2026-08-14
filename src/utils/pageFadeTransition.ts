import { setActiveTabPath } from '@/composables/useMainTab';

/** Tab 页交叉淡入淡出时长（旧页渐隐与新页渐显同时开始） */
export const PAGE_FADE_DURATION_MS = 160;

export const PAGE_FADE_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

/** 一级页 TabBar，必须低于侧滑/全屏二级页 */
export const TAB_BAR_Z_INDEX = 100;

/** 二级全屏页（商品详情、个人中心等），盖住 TabBar */
export const SECONDARY_PAGE_Z_INDEX = 2000;

/** 二级页里再打开的全屏页（改密码、咨询等），必须高于侧滑页 */
export const NESTED_PAGE_Z_INDEX = 2100;

/** @deprecated 单页壳已改为面板自身交叉淡入淡出，不再使用全屏遮罩 */
export const PAGE_FADE_COVER_Z_INDEX = 998;
export const pageFadeOpacity = { value: 0 };
export const pageFadeBusy = { value: false };

type TabSwitchHook = (path: string) => void | Promise<void>;
let beforeTabSwitch: TabSwitchHook | null = null;
let afterTabSwitch: TabSwitchHook | null = null;

export const registerTabSwitchHooks = (hooks: {
  before?: TabSwitchHook | null;
  after?: TabSwitchHook | null;
}) => {
  beforeTabSwitch = hooks.before ?? null;
  afterTabSwitch = hooks.after ?? null;
};

export const preloadTabPages = () => {};

/**
 * 立即切换当前 Tab。旧页渐隐与新页渐显由页面面板 CSS 同时播放。
 */
export const switchTabWithFade = async (url: string) => {
  const path = url.replace(/^\//, '');

  if (beforeTabSwitch) {
    await beforeTabSwitch(path);
  }

  setActiveTabPath(path);

  if (afterTabSwitch) {
    await afterTabSwitch(path);
  }
};
