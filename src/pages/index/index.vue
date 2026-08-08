<template>
  <view class="main-shell">
    <view v-show="activeTabPath === 'pages/index/index'" class="tab-panel">
      <HomeTab />
    </view>
    <view v-show="activeTabPath === 'pages/store/index'" class="tab-panel">
      <StoreTab ref="storeTabRef" />
    </view>
    <view v-show="activeTabPath === 'pages/work/index'" class="tab-panel">
      <WorkTab />
    </view>
    <view v-show="activeTabPath === 'pages/manage/index'" class="tab-panel">
      <ManageTab />
    </view>

    <CustomTabBar :currentPath="activeTabPath" />
  </view>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import CustomTabBar from '@/components/CustomTabBar.vue';
import HomeTab from '@/components/tabs/HomeTab.vue';
import StoreTab from '@/components/tabs/StoreTab.vue';
import WorkTab from '@/components/tabs/WorkTab.vue';
import ManageTab from '@/components/tabs/ManageTab.vue';
import { useMainTab, type MainTabPath } from '@/composables/useMainTab';
import { registerTabSwitchHooks } from '@/utils/pageFadeTransition';

const { activeTabPath, setActiveTabPath, normalizeTabPath } = useMainTab();

type StoreTabExpose = {
  scheduleStickyActionsUpdate: () => void;
  updateStickyActionsVisibility: () => void;
};

const storeTabRef = ref<StoreTabExpose | null>(null);

/** 各 Tab 独立滚动位置，切换时互不干扰 */
const scrollTopByTab: Record<MainTabPath, number> = {
  'pages/index/index': 0,
  'pages/store/index': 0,
  'pages/work/index': 0,
  'pages/manage/index': 0,
};

let currentScrollTop = 0;

const restoreScrollTop = (path: MainTabPath) =>
  new Promise<void>((resolve) => {
    uni.pageScrollTo({
      scrollTop: scrollTopByTab[path] || 0,
      duration: 0,
      complete: () => resolve(),
      fail: () => resolve(),
    });
  });

onLoad((query) => {
  const tabQuery = typeof query?.tab === 'string' ? query.tab : '';
  if (tabQuery) {
    // 兼容 ?tab=store / ?tab=pages/store/index
    const mapped =
      tabQuery.includes('/')
        ? tabQuery
        : (`pages/${tabQuery}/index` as MainTabPath);
    setActiveTabPath(normalizeTabPath(mapped));
  }
});

onPageScroll((e) => {
  currentScrollTop = e.scrollTop;
  scrollTopByTab[activeTabPath.value] = e.scrollTop;

  if (activeTabPath.value === 'pages/store/index') {
    storeTabRef.value?.scheduleStickyActionsUpdate();
  }
});

onMounted(() => {
  registerTabSwitchHooks({
    before: async () => {
      scrollTopByTab[activeTabPath.value] = currentScrollTop;
    },
    after: async (path) => {
      const next = normalizeTabPath(path);
      await nextTick();
      await restoreScrollTop(next);
      if (next === 'pages/store/index') {
        storeTabRef.value?.updateStickyActionsVisibility();
      }
    },
  });

  // 冷启动时校准一次当前 Tab 滚动
  nextTick(() => {
    void restoreScrollTop(activeTabPath.value);
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
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #f4f5f7;
}

.tab-panel {
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
