import {
  getCurrentInstance,
  nextTick,
  onUnmounted,
  ref,
  shallowRef,
  unref,
  watch,
  type MaybeRef,
} from 'vue';
import { getFrostedGlassStyle } from '@/utils/frostedGlass';

export type ReportChapterTab<T extends string = string> = {
  id: T;
  label: string;
};

export function reportChapterDomId(prefix: string, id: string) {
  return `${prefix}-${id}`;
}

export function useReportChapterNav<T extends string>(options: {
  chapters: MaybeRef<ReportChapterTab<T>[]>;
  idPrefix: MaybeRef<string>;
  resetKey: MaybeRef<string>;
  scrollHost: string;
}) {
  const instance = getCurrentInstance();
  const chapterList = () => unref(options.chapters);
  const prefix = () => unref(options.idPrefix);
  const activeChapter = shallowRef<T>(chapterList()[0].id);
  const tocVisible = ref(false);
  const tocFrosted = ref(false);
  const scrollIntoView = ref('');
  const tocGlassStyle = {
    ...getFrostedGlassStyle('tabbar'),
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
  };

  const chapterDomId = (id: T) => reportChapterDomId(prefix(), id);
  let frostTimer: ReturnType<typeof setTimeout> | null = null;
  let activeLock = false;
  let activeLockTimer: ReturnType<typeof setTimeout> | null = null;
  let measureTimer: ReturnType<typeof setTimeout> | null = null;
  let currentScrollTop = 0;
  let activeMarkerOffset = 180;
  let chapterOffsets: { id: T; top: number }[] = [];

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
    if (activeLock || !chapterOffsets.length) return;
    const marker = currentScrollTop + activeMarkerOffset;
    let current: T = chapterList()[0].id;
    chapterOffsets.forEach((chapter) => {
      if (chapter.top <= marker + 4) current = chapter.id;
    });
    activeChapter.value = current;
  };

  const handleScroll = (event: unknown) => {
    const detail = (event as { detail?: { scrollTop?: number } })?.detail;
    currentScrollTop = Number(detail?.scrollTop ?? 0);
    if (currentScrollTop > 88) setTocShown(true);
    else if (currentScrollTop < 36) setTocShown(false);
    if (tocVisible.value) updateActiveChapter();
  };

  type Rect = { top?: number; height?: number };

  const measureChapterOffsets = () =>
    new Promise<boolean>((resolve) => {
      if (!instance) {
        resolve(false);
        return;
      }

      uni.createSelectorQuery()
        .in(instance)
        .select(options.scrollHost)
        .boundingClientRect()
        .selectAll('.report-chapter-heading')
        .boundingClientRect()
        .select('.anchor-size-card')
        .boundingClientRect()
        .exec((result) => {
          const host = result?.[0] as Rect | null;
          const anchors = result?.[1] as Rect[] | null;
          const markerCard = result?.[2] as Rect | null;
          const hostTop = host?.top;
          if (typeof hostTop !== 'number' || !anchors?.length) {
            resolve(false);
            return;
          }

          const chapters = chapterList();
          chapterOffsets = anchors
            .slice(0, chapters.length)
            .map((rect, index) => ({
              id: chapters[index].id,
              top:
                currentScrollTop +
                (typeof rect.top === 'number' ? rect.top - hostTop : 0),
            }));
          if (typeof markerCard?.height === 'number' && markerCard.height > 0) {
            activeMarkerOffset = markerCard.height;
          }
          resolve(chapterOffsets.length === chapters.length);
        });
    });

  const scheduleMeasurement = (attempt = 0) => {
    if (measureTimer) clearTimeout(measureTimer);
    measureTimer = setTimeout(async () => {
      measureTimer = null;
      const measured = await measureChapterOffsets();
      if (!measured && attempt < 5) scheduleMeasurement(attempt + 1);
    }, attempt === 0 ? 32 : 64);
  };

  const scrollToChapter = (id: T | string) => {
    const next = chapterList().find((chapter) => chapter.id === id)?.id;
    if (!next) return;
    activeChapter.value = next;
    activeLock = true;
    if (activeLockTimer) clearTimeout(activeLockTimer);
    scrollIntoView.value = '';
    nextTick(() => {
      scrollIntoView.value = chapterDomId(next);
    });
    activeLockTimer = setTimeout(() => {
      activeLock = false;
      activeLockTimer = null;
      updateActiveChapter();
    }, 720);
  };

  watch(
    () => [unref(options.resetKey), prefix()] as const,
    async () => {
      activeChapter.value = chapterList()[0].id;
      setTocShown(false);
      currentScrollTop = 0;
      chapterOffsets = [];
      scrollIntoView.value = '';
      await nextTick();
      scheduleMeasurement();
    },
    { flush: 'post' },
  );

  onUnmounted(() => {
    clearFrostTimer();
    if (activeLockTimer) clearTimeout(activeLockTimer);
    if (measureTimer) clearTimeout(measureTimer);
  });

  return {
    activeChapter,
    tocVisible,
    tocFrosted,
    tocGlassStyle,
    scrollIntoView,
    handleScroll,
    scrollToChapter,
  };
}
