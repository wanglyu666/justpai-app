<template>
  <view class="main-shell">
    <view
      class="tab-panel"
      :class="{ 'is-visible': activeTabPath === 'pages/index/index' }"
      :style="panelStyle(activeTabPath === 'pages/index/index')"
    >
      <HomeTab />
    </view>
    <view
      class="tab-panel"
      :class="{ 'is-visible': activeTabPath === 'pages/store/index' }"
      :style="panelStyle(activeTabPath === 'pages/store/index')"
      @touchmove="onStorePanelScroll"
      @touchend="onStorePanelScroll"
    >
      <StoreTab ref="storeTabRef" />
    </view>
    <view
      class="tab-panel"
      :class="{ 'is-visible': activeTabPath === 'pages/work/index' }"
      :style="panelStyle(activeTabPath === 'pages/work/index')"
    >
      <WorkTab />
    </view>
    <view
      class="tab-panel"
      :class="{ 'is-visible': activeTabPath === 'pages/manage/index' }"
      :style="panelStyle(activeTabPath === 'pages/manage/index')"
    >
      <ManageTab />
    </view>

    <CustomTabBar :currentPath="activeTabPath" />
    <EdgeSwipeBack />
  </view>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { onBackPress, onLoad } from '@dcloudio/uni-app';
import CustomTabBar from '@/components/CustomTabBar.vue';
import EdgeSwipeBack from '@/components/EdgeSwipeBack.vue';
import HomeTab from '@/components/tabs/HomeTab.vue';
import StoreTab from '@/components/tabs/StoreTab.vue';
import WorkTab from '@/components/tabs/WorkTab.vue';
import ManageTab from '@/components/tabs/ManageTab.vue';
import { useMainTab, type MainTabPath } from '@/composables/useMainTab';
import { consumePageBack } from '@/composables/usePageBack';
import {
  PAGE_FADE_DURATION_MS,
  PAGE_FADE_EASING,
  registerTabSwitchHooks,
} from '@/utils/pageFadeTransition';

const { activeTabPath, setActiveTabPath, normalizeTabPath } = useMainTab();

type StoreTabExpose = {
  scheduleStickyActionsUpdate: () => void;
  updateStickyActionsVisibility: () => void;
};

const storeTabRef = ref<StoreTabExpose | null>(null);
const fadeReady = ref(false);

const panelStyle = (visible: boolean) => {
  if (!fadeReady.value) {
    return { transition: 'none' };
  }
  return {
    transition: visible
      ? `opacity ${PAGE_FADE_DURATION_MS}ms ${PAGE_FADE_EASING}, visibility 0ms linear 0ms`
      : `opacity ${PAGE_FADE_DURATION_MS}ms ${PAGE_FADE_EASING}, visibility 0ms linear ${PAGE_FADE_DURATION_MS}ms`,
  };
};

const onStorePanelScroll = () => {
  storeTabRef.value?.scheduleStickyActionsUpdate();
};

onBackPress(() => consumePageBack());

onLoad((query) => {
  const tabQuery = typeof query?.tab === 'string' ? query.tab : '';
  if (tabQuery) {
    const mapped =
      tabQuery.includes('/')
        ? tabQuery
        : (`pages/${tabQuery}/index` as MainTabPath);
    setActiveTabPath(normalizeTabPath(mapped));
  }
});

onMounted(() => {
  registerTabSwitchHooks({
    after: async (path) => {
      const next = normalizeTabPath(path);
      await nextTick();
      if (next === 'pages/store/index') {
        storeTabRef.value?.updateStickyActionsVisibility();
      }
    },
  });

  nextTick(() => {
    fadeReady.value = true;
  });
});

watch(activeTabPath, (path) => {
  if (path === 'pages/store/index') {
    nextTick(() => storeTabRef.value?.updateStickyActionsVisibility());
  }
});

onUnmounted(() => {
  registerTabSwitchHooks({ before: null, after: null });
});
</script>

<style scoped>
.main-shell {
  position: relative;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #f4f5f7;
}

.tab-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* 不在此层滚动：overflow 会把内部 position:fixed 二级页困在面板里，盖不住 TabBar */
  overflow: visible;
  box-sizing: border-box;
  opacity: 0;
  visibility: hidden;
}

.tab-panel.is-visible {
  opacity: 1;
  visibility: visible;
}
</style>
