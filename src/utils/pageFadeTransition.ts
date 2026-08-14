import { ref } from 'vue';
import { FADE_EASING } from '@/utils/fadeTransition';
import { setActiveTabPath } from '@/composables/useMainTab';
import { waitFrames } from '@/utils/nextFrame';

/** Tab 页切换渐隐遮罩透明度（模块级单例） */
export const pageFadeOpacity = ref(0);

/** 是否正在执行页面切换渐隐 */
export const pageFadeBusy = ref(false);

/** 页面切换渐隐时长（比内容 Fade 更快） */
export const PAGE_FADE_DURATION_MS = 160;
export const PAGE_FADE_EASING = FADE_EASING;

/** 遮罩盖住页面内容，但低于底部 TabBar */
export const PAGE_FADE_COVER_Z_INDEX = 998;
/** 一级页 TabBar；需低于 SlideOver / BottomSheet，才能被二级页盖住 */
export const TAB_BAR_Z_INDEX = 999;

const COVER_ID = 'justpai-page-fade-cover';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** H5：挂到 body 上的持久遮罩；App 端由 CustomTabBar 内 v-if 遮罩负责 */
const ensureH5Cover = (): HTMLElement | null => {
  // #ifdef H5
  if (typeof document === 'undefined') return null;

  let el = document.getElementById(COVER_ID) as HTMLElement | null;
  if (!el) {
    el = document.createElement('div');
    el.id = COVER_ID;
    el.setAttribute('aria-hidden', 'true');
    el.style.opacity = '0';
    document.body.appendChild(el);
  }

  Object.assign(el.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    // 与 App 遮罩一致：底部留给 TabBar，避免吞触摸
    bottom: '240rpx',
    left: '0',
    zIndex: String(PAGE_FADE_COVER_Z_INDEX),
    backgroundColor: '#F4F5F7',
    pointerEvents: 'none',
    transition: `opacity ${PAGE_FADE_DURATION_MS}ms ${PAGE_FADE_EASING}`,
  });

  return el;
  // #endif

  // #ifndef H5
  return null;
  // #endif
};

const setCoverOpacity = (opacity: number) => {
  pageFadeOpacity.value = opacity;

  // #ifdef H5
  const el = ensureH5Cover();
  if (!el) return;
  el.style.pointerEvents = opacity > 0.01 ? 'auto' : 'none';
  void el.offsetHeight;
  el.style.opacity = String(opacity);
  // #endif
};

/** 初始化 H5 切换遮罩 */
export const preloadTabPages = () => {
  // #ifdef H5
  ensureH5Cover();
  // #endif
};

/**
 * 带渐隐的 Tab 切换：旧页淡出与新页淡入交叉叠化。
 * 单页壳内只切换当前面板。
 */
let switchChain: Promise<void> = Promise.resolve();

const CROSSFADE_SWITCH_RATIO = 0.4;

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

export const switchTabWithFade = (url: string): Promise<void> => {
  const run = switchChain.then(async () => {
    if (pageFadeBusy.value) return;

    pageFadeBusy.value = true;

    try {
      const path = url.replace(/^\//, '');

      setCoverOpacity(1);
      await wait(Math.round(PAGE_FADE_DURATION_MS * CROSSFADE_SWITCH_RATIO));

      if (beforeTabSwitch) {
        await beforeTabSwitch(path);
      }

      setActiveTabPath(path);

      if (afterTabSwitch) {
        await afterTabSwitch(path);
      }

      await waitFrames(1);
      setCoverOpacity(0);
      await wait(PAGE_FADE_DURATION_MS);
    } finally {
      pageFadeOpacity.value = 0;
      pageFadeBusy.value = false;
      // #ifdef H5
      const el = ensureH5Cover();
      if (el) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      }
      // #endif
    }
  });

  switchChain = run.catch(() => {});
  return run;
};
