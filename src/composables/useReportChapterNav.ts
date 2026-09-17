import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { getFrostedGlassStyle } from '@/utils/frostedGlass';

export type ReportChapterTab<T extends string = string> = {
  id: T;
  label: string;
};

export function useReportChapterNav<T extends string>(options: {
  chapters: ReportChapterTab<T>[];
  idPrefix: string;
  resetKey: Ref<string>;
}) {
  const { chapters, idPrefix, resetKey } = options;
  const activeChapter = ref<T>(chapters[0].id);
  const tocVisible = ref(false);
  const tocFrosted = ref(false);
  const tocGlassStyle = {
    ...getFrostedGlassStyle('tabbar'),
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
  };

  const chapterDomId = (id: T) => `${idPrefix}-${id}`;

  const findScrollParent = (el: HTMLElement | null) => {
    let node = el?.parentElement ?? null;
    while (node) {
      const overflowY = window.getComputedStyle(node).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') return node;
      node = node.parentElement;
    }
    return null;
  };

  let scrollParent: HTMLElement | null = null;
  let frostTimer: ReturnType<typeof setTimeout> | null = null;
  let ticking = false;
  let activeLock = false;
  let activeLockTimer: ReturnType<typeof setTimeout> | null = null;
  let clickLockScrollTop: number | null = null;
  let contentCardHeight = 180;

  const measureContentCardHeight = () => {
    const card = document.querySelector('.anchor-size-card');
    const height = card?.getBoundingClientRect().height ?? 0;
    if (height > 0) contentCardHeight = height;
  };

  const getHeadingEl = (id: T) => document.getElementById(chapterDomId(id));

  const getAnchorOffset = () => contentCardHeight;

  const getDetectMarker = () => {
    if (!scrollParent) return 0;
    return scrollParent.getBoundingClientRect().top + getAnchorOffset();
  };

  const clearFrostTimer = () => {
    if (frostTimer) {
      clearTimeout(frostTimer);
      frostTimer = null;
    }
  };

  const setTocShown = (shown: boolean) => {
    if (shown) {
      if (tocVisible.value) return;
      tocVisible.value = true;
      clearFrostTimer();
      frostTimer = setTimeout(() => {
        tocFrosted.value = true;
        frostTimer = null;
      }, 400);
      return;
    }
    if (!tocVisible.value && !tocFrosted.value) return;
    tocFrosted.value = false;
    tocVisible.value = false;
    clearFrostTimer();
  };

  const updateActiveChapter = () => {
    if (!scrollParent || activeLock) return;
    if (
      clickLockScrollTop !== null &&
      Math.abs(scrollParent.scrollTop - clickLockScrollTop) < 24
    ) {
      return;
    }
    clickLockScrollTop = null;
    const marker = getDetectMarker();
    let current: T = chapters[0].id;
    chapters.forEach((chapter) => {
      const el = getHeadingEl(chapter.id);
      if (!el) return;
      if (el.getBoundingClientRect().top <= marker + 4) {
        current = chapter.id;
      }
    });
    activeChapter.value = current;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (!scrollParent) return;
      const shouldShow = scrollParent.scrollTop > 88;
      const shouldHide = scrollParent.scrollTop < 36;
      if (shouldShow) setTocShown(true);
      else if (shouldHide) setTocShown(false);
      if (tocVisible.value) updateActiveChapter();
    });
  };

  const bindScrollParent = () => {
    const chapterEl = getHeadingEl(chapters[0].id);
    scrollParent = findScrollParent(chapterEl);
    measureContentCardHeight();
    scrollParent?.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  const unbindScrollParent = () => {
    scrollParent?.removeEventListener('scroll', onScroll);
    scrollParent = null;
  };

  const scrollToChapter = (id: T | string) => {
    const next = chapters.find((chapter) => chapter.id === id)?.id;
    if (!scrollParent || !next) return;
    measureContentCardHeight();
    const el = getHeadingEl(next);
    if (!el) return;
    activeChapter.value = next;
    activeLock = true;
    clickLockScrollTop = null;
    if (activeLockTimer) clearTimeout(activeLockTimer);
    const parentTop = scrollParent.getBoundingClientRect().top;
    const delta = el.getBoundingClientRect().top - parentTop - getAnchorOffset();
    const targetTop = Math.max(0, scrollParent.scrollTop + delta);
    clickLockScrollTop = targetTop;
    scrollParent.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    });
    activeLockTimer = setTimeout(() => {
      activeLock = false;
      activeLockTimer = null;
    }, 720);
  };

  watch(resetKey, async () => {
    activeChapter.value = chapters[0].id;
    setTocShown(false);
    clickLockScrollTop = null;
    await nextTick();
    scrollParent?.scrollTo({ top: 0 });
  });

  onMounted(async () => {
    await nextTick();
    bindScrollParent();
  });

  onUnmounted(() => {
    unbindScrollParent();
    clearFrostTimer();
    if (activeLockTimer) clearTimeout(activeLockTimer);
  });

  return {
    activeChapter,
    tocVisible,
    tocFrosted,
    tocGlassStyle,
    chapterDomId,
    scrollToChapter,
  };
}
