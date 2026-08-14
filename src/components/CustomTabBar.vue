<template>
  <view class="tabbar-root">
    <!-- 仅切换中挂载遮罩，空闲时不在 DOM，避免 App 透明层吞触摸 -->
    <view
      v-if="coverVisible"
      class="page-fade-cover"
      :style="fadeCoverStyle"
    />

    <view class="tabbar-wrapper" :style="{ zIndex: TAB_BAR_Z_INDEX }">
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
          hover-class="tab-item-hover"
          :hover-stay-time="80"
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
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { getFrostedGlassStyle } from '@/utils/frostedGlass';
import { waitFrames } from '@/utils/nextFrame';
import {
  pageFadeBusy,
  pageFadeOpacity,
  PAGE_FADE_DURATION_MS,
  PAGE_FADE_EASING,
  PAGE_FADE_COVER_Z_INDEX,
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

const coverVisible = computed(
  () => pageFadeBusy.value || pageFadeOpacity.value > 0.01,
);

const fadeCoverStyle = computed(() => ({
  zIndex: PAGE_FADE_COVER_Z_INDEX,
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

  indicatorAnimating.value = false;
  await nextTick();
  await waitFrames(1);

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

      if (props.currentPath === targetPath) {
        snapTo(targetIndex);
        continue;
      }

      await animateTo(targetIndex);
      await wait(TAB_INDICATOR_SWITCH_DELAY_MS);

      if (pendingTargetPath) continue;

      await switchTabWithFade('/' + targetPath);
    }
  } finally {
    transitioning = false;
    snapTo(activeIndex.value);
  }
};

onMounted(() => {
  snapTo(activeIndex.value);
});
</script>

<style scoped>
.tabbar-root {
  position: relative;
  z-index: 999;
}

/* 不盖住底部 Tab 区域，避免 App 端 z-index/pointer-events 异常时吞掉菜单触摸 */
.page-fade-cover {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 240rpx;
  background-color: #f4f5f7;
}

.tabbar-wrapper {
  position: fixed;
  bottom: 48rpx;
  left: 48rpx;
  right: 48rpx;
}

.tabbar {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 64rpx;
  padding: 16rpx 24rpx;
  box-sizing: border-box;
}

.tab-indicator {
  position: absolute;
  top: 16rpx;
  left: 0;
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  background-color: #9fe870;
  opacity: 0;
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
  /* 扩大可点区域，App 端更稳 */
  min-height: 96rpx;
}

.tab-item-hover {
  opacity: 0.85;
}

.icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab-icon {
  width: 48rpx;
  height: 48rpx;
}
</style>
