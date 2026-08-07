import { ref } from 'vue';
import { FADE_EASING } from '@/utils/fadeTransition';

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

const TAB_PAGE_URLS = [
  '/pages/index/index',
  '/pages/store/index',
  '/pages/work/index',
  '/pages/manage/index',
];

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

/** H5：挂到 body 上的持久遮罩，避免 switchTab 销毁页面组件时闪白 */
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

/** 启动后预加载其余 Tab 页，减少首次切换白屏/加载感 */
export const preloadTabPages = () => {
  TAB_PAGE_URLS.forEach((url) => {
    try {
      uni.preloadPage({ url });
    } catch {
      // 部分端已存在或不支持时忽略
    }
  });

  // #ifdef H5
  ensureH5Cover();
  // #endif
};

/**
 * 带渐隐的 Tab 切换：旧页淡出与新页淡入交叉叠化（同时进行）。
 * 遮罩不必等完全盖住再揭开——半途切页并立刻反向淡出，形成并行过渡。
 * 采用串行队列，快速连点时按顺序依次执行，避免并发动画互相覆盖。
 */
let switchChain: Promise<void> = Promise.resolve();

/** 交叉点：遮罩淡入进行到该比例时切页并开始淡出 */
const CROSSFADE_SWITCH_RATIO = 0.4;

export const switchTabWithFade = (url: string): Promise<void> => {
  const run = switchChain.then(async () => {
    if (pageFadeBusy.value) return;

    pageFadeBusy.value = true;

    try {
      // 开始盖住旧页（淡出感）
      setCoverOpacity(1);
      await wait(Math.round(PAGE_FADE_DURATION_MS * CROSSFADE_SWITCH_RATIO));

      // 半途切换，不等待遮罩完全不透明
      await new Promise<void>((resolve) => {
        uni.switchTab({
          url,
          complete: () => resolve(),
        });
      });

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
