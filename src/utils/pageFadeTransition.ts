import { ref } from 'vue';
import { FADE_EASING } from '@/utils/fadeTransition';
import { setActiveTabPath } from '@/composables/useMainTab';

/** Tab 页切换渐隐遮罩透明度（模块级单例，跨页面共享；非 H5 用） */
export const pageFadeOpacity = ref(0);

/** 是否正在执行页面切换渐隐 */
export const pageFadeBusy = ref(false);

/** 页面切换渐隐时长（比内容 Fade 更快） */
export const PAGE_FADE_DURATION_MS = 160;
export const PAGE_FADE_EASING = FADE_EASING;

/** 遮罩盖住页面内容，但低于底部 TabBar（Tab 切换时 bar 不跟着渐隐） */
export const PAGE_FADE_COVER_Z_INDEX = 998;
/** 一级页 TabBar；需低于 SlideOver / BottomSheet，才能被二级页盖住 */
export const TAB_BAR_Z_INDEX = 999;

const COVER_ID = 'justpai-page-fade-cover';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const waitFrames = (count = 2) =>
  new Promise<void>((resolve) => {
    let left = count;
    const tick = () => {
      left -= 1;
      if (left <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

/** H5：挂到 body 上的持久遮罩，避免切换瞬间闪白 */
const ensureH5Cover = (): HTMLElement | null => {
  // #ifdef H5
  if (typeof document === 'undefined') return null;

  let el = document.getElementById(COVER_ID) as HTMLElement | null;
  if (!el) {
    el = document.createElement('div');
    el.id = COVER_ID;
    el.setAttribute('aria-hidden', 'true');
    // 新建时必须显式透明，否则默认 opacity:1 会盖住首页内容
    el.style.opacity = '0';
    document.body.appendChild(el);
  }

  Object.assign(el.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    bottom: '0',
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
  el.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
  // 强制一次回流，确保 transition 生效
  void el.offsetHeight;
  el.style.opacity = String(opacity);
  // #endif
};

/** 初始化切换遮罩（单页壳下无需 preloadPage） */
export const preloadTabPages = () => {
  // #ifdef H5
  ensureH5Cover();
  // #endif
};

/**
 * 带渐隐的 Tab 切换：旧页淡出与新页淡入交叉叠化（同时进行）。
 * 单页壳内只切换当前面板，不再 uni.switchTab。
 * 采用串行队列，快速连点时按顺序依次执行，避免并发动画互相覆盖。
 */
let switchChain: Promise<void> = Promise.resolve();

/** 交叉点：遮罩淡入进行到该比例时切页并开始淡出 */
const CROSSFADE_SWITCH_RATIO = 0.4;

/** 切 Tab 前由壳页注册：保存/恢复滚动位置等 */
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

      // 开始盖住旧页（淡出感）
      setCoverOpacity(1);
      await wait(Math.round(PAGE_FADE_DURATION_MS * CROSSFADE_SWITCH_RATIO));

      if (beforeTabSwitch) {
        await beforeTabSwitch(path);
      }

      // 半途切换面板，不等待遮罩完全不透明
      setActiveTabPath(path);

      if (afterTabSwitch) {
        await afterTabSwitch(path);
      }

      await waitFrames(1);
      // 立刻揭开新页（淡入感），与上一阶段在时间上重叠
      setCoverOpacity(0);
      await wait(PAGE_FADE_DURATION_MS);
    } finally {
      pageFadeBusy.value = false;
    }
  });

  switchChain = run.catch(() => {});
  return run;
};
