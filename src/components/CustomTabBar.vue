<template>
  <view class="tabbar-wrapper" :style="{ zIndex: TAB_BAR_Z_INDEX }">
    <!-- #ifndef H5 -->
    <view
      class="page-fade-cover"
      :class="{ active: pageFadeOpacity > 0 || pageFadeBusy }"
      :style="fadeCoverStyle"
    />
    <!-- #endif -->

    <view class="tabbar frosted-glass frosted-glass--tabbar" :style="tabbarGlassStyle">
      <view
        class="tab-indicator"
        :class="{ ready: indicatorReady }"
        :style="indicatorStyle"
      />

      <view
        v-for="(item, index) in list"
        :key="item.pagePath"
        class="tab-item"
        @click="handleTabClick(item, index)"
      >
        <view class="icon-wrap">
          <image
            class="tab-icon"
            :src="displayIndex === index ? item.selectedIconPath : item.iconPath"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { getFrostedGlassStyle } from '@/utils/frostedGlass';
import {
  pageFadeBusy,
  pageFadeOpacity,
  PAGE_FADE_DURATION_MS,
  PAGE_FADE_EASING,
  TAB_BAR_Z_INDEX,
  switchTabWithFade,
} from '@/utils/pageFadeTransition';
import {
  getIndicatorOffsetX,
  setSharedTabIndicatorIndex,
  TAB_INDICATOR_DURATION_MS,
  TAB_INDICATOR_EASING,
  TAB_INDICATOR_SWITCH_DELAY_MS,
  getTabIndexByPath,
} from '@/utils/tabBarIndicator';

const tabbarGlassStyle = getFrostedGlassStyle('tabbar');

const props = defineProps({
  currentPath: {
    type: String,
    required: true,
  },
});

const list = [
  {
    pagePath: 'pages/index/index',
    iconPath: '/static/tabbar/home.svg',
    selectedIconPath: '/static/tabbar/home-active.svg',
  },
  {
    pagePath: 'pages/store/index',
    iconPath: '/static/tabbar/store.svg',
    selectedIconPath: '/static/tabbar/store-active.svg',
  },
  {
    pagePath: 'pages/work/index',
    iconPath: '/static/tabbar/work.svg',
    selectedIconPath: '/static/tabbar/work-active.svg',
  },
  {
    pagePath: 'pages/manage/index',
    iconPath: '/static/tabbar/manage.svg',
    selectedIconPath: '/static/tabbar/manage-active.svg',
  },
];

const activeIndex = computed(() => getTabIndexByPath(props.currentPath));

/** 绿球 / 高亮 icon 的视觉 index（点击后先动球，再切页） */
const displayIndex = ref(getTabIndexByPath(props.currentPath));
const indicatorReady = ref(true);
const indicatorAnimating = ref(false);

const fadeCoverStyle = computed(() => ({
  opacity: pageFadeOpacity.value,
  transition: `opacity ${PAGE_FADE_DURATION_MS}ms ${PAGE_FADE_EASING}`,
}));

const indicatorStyle = computed(() => ({
  transform: `translate3d(${getIndicatorOffsetX(displayIndex.value, list.length)}px, 0, 0)`,
  transition: indicatorAnimating.value
    ? `transform ${TAB_INDICATOR_DURATION_MS}ms ${TAB_INDICATOR_EASING}`
    : 'none',
}));

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const snapTo = (index: number) => {
  indicatorAnimating.value = false;
  displayIndex.value = index;
  indicatorReady.value = true;
  setSharedTabIndicatorIndex(index);
};

const animateTo = async (index: number) => {
  if (displayIndex.value === index) {
    snapTo(index);
    return;
  }

  // 确保浏览器先画出旧位置，再开 transition
  indicatorAnimating.value = false;
  await nextTick();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

  indicatorAnimating.value = true;
  displayIndex.value = index;
  setSharedTabIndicatorIndex(index);
};

/**
 * 快速连点时以“最终目标页”为准：
 * - 记录最近一次点击的目标
 * - 动画播放期间的新点击只更新目标，不立即打断
 * - 动画结束后统一切到最后点击的页面
 */
let pendingTargetPath: string | null = null;
let pendingTargetIndex = -1;
let transitioning = false;

const handleTabClick = (item: { pagePath: string }, index: number) => {
  pendingTargetPath = item.pagePath;
  pendingTargetIndex = index;
  void flushPendingSwitch();
};

const flushPendingSwitch = async () => {
  if (transitioning) return;
  transitioning = true;

  try {
    while (pendingTargetPath) {
      const targetPath = pendingTargetPath;
      const targetIndex = pendingTargetIndex;
      pendingTargetPath = null;
      pendingTargetIndex = -1;

      // 当前页本身就是目标，校准一下位置
      if (props.currentPath === targetPath) {
        snapTo(targetIndex);
        continue;
      }

      await animateTo(targetIndex);
      await wait(TAB_INDICATOR_SWITCH_DELAY_MS);

      // 动画期间又有新点击：以最新目标为准，不在这里切页
      if (pendingTargetPath) continue;

      await switchTabWithFade('/' + targetPath);
    }
  } finally {
    transitioning = false;
    // 兜底校准，确保绿球最终停在当前页 icon 背面
    snapTo(activeIndex.value);
  }
};

onMounted(() => {
  // 新页挂载时绿球对齐当前页；点击流程里已先移到位，这里无动画对齐即可
  snapTo(activeIndex.value);
});
</script>

<style scoped>
.tabbar-wrapper {
  position: fixed;
  bottom: 24px;
  left: 24px;
  right: 24px;
  pointer-events: none;
}

.page-fade-cover {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  background-color: #f4f5f7;
  opacity: 0;
  pointer-events: none;
}

.page-fade-cover.active {
  pointer-events: auto;
}

.tabbar {
  position: relative;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 32px;
  padding: 8px 12px;
  pointer-events: auto;
  box-sizing: border-box;
}

.tab-indicator {
  position: absolute;
  top: 8px;
  left: 0;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #9fe870;
  opacity: 0;
  pointer-events: none;
  will-change: transform;
  z-index: 0;
}

.tab-indicator.ready {
  opacity: 1;
}

.tab-item {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab-icon {
  width: 24px;
  height: 24px;
}
</style>
