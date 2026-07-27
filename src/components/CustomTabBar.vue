<template>
  <view class="tabbar-wrapper">
    <view class="tabbar frosted-glass frosted-glass--tabbar" :style="tabbarGlassStyle">
      <view 
        class="tab-item" 
        v-for="(item, index) in list" 
        :key="index"
        @click="switchTab(item)"
      >
        <view class="icon-wrap" :class="{ 'active': currentPath === item.pagePath }">
          <image 
            class="tab-icon" 
            :src="currentPath === item.pagePath ? item.selectedIconPath : item.iconPath"
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getFrostedGlassStyle } from '@/utils/frostedGlass';

const tabbarGlassStyle = getFrostedGlassStyle('tabbar');

const props = defineProps({
  currentPath: {
    type: String,
    required: true
  }
});

const list = ref([
  {
    pagePath: 'pages/index/index',
    iconPath: '/static/tabbar/home.svg',
    selectedIconPath: '/static/tabbar/home-active.svg'
  },
  {
    pagePath: 'pages/store/index',
    iconPath: '/static/tabbar/store.svg',
    selectedIconPath: '/static/tabbar/store-active.svg'
  },
  {
    pagePath: 'pages/work/index',
    iconPath: '/static/tabbar/work.svg',
    selectedIconPath: '/static/tabbar/work-active.svg'
  },
  {
    pagePath: 'pages/manage/index',
    iconPath: '/static/tabbar/manage.svg',
    selectedIconPath: '/static/tabbar/manage-active.svg'
  }
]);

const switchTab = (item: any) => {
  if (props.currentPath !== item.pagePath) {
    uni.switchTab({
      url: '/' + item.pagePath
    });
  }
};
</script>

<style scoped>
.tabbar-wrapper {
  position: fixed;
  bottom: 24px;
  left: 24px;
  right: 24px;
  z-index: 999;
}

.tabbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 32px;
  padding: 8px 12px;
}

.tab-item {
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-wrap.active {
  background-color: #9FE870;
}

.tab-icon {
  width: 24px;
  height: 24px;
}
</style>
