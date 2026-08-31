<template>
  <view class="standard-page">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">施工标准</text>
          <text class="page-desc">查看施工现场管控标准</text>
        </view>
      </view>

      <StatusCapsuleSwitch
        class="status-capsule-wrap"
        v-model="activeCategory"
        :tabs="tabs"
      />

      <view class="card-grid">
        <view v-for="item in visibleItems" :key="item.id" class="info-card">
          <view class="info-stack">
            <view class="info-icon-wrap">
              <image :src="categoryIcon" mode="aspectFit" class="info-icon" />
            </view>
            <text class="info-title">{{ item.title }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';
import {
  CONSTRUCTION_STANDARD_ICONS,
  useConstructionStandards,
  type ConstructionStandardCategory,
} from '@/composables/useConstructionStandards';
import { usePageBack } from '@/composables/usePageBack';

const emit = defineEmits<{
  back: [];
}>();

const { tabs, getByCategory } = useConstructionStandards();
const activeCategory = ref<ConstructionStandardCategory>('environment');

const visibleItems = computed(() => getByCategory(activeCategory.value));
const categoryIcon = computed(
  () => CONSTRUCTION_STANDARD_ICONS[activeCategory.value],
);

const handleBack = usePageBack(() => emit('back'));
</script>

<style scoped>
.standard-page {
  min-height: 100%;
  padding-bottom: 80rpx;
  box-sizing: border-box;
}

.page-header {
  padding: 0 48rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.icon-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.header-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.content {
  padding: 64rpx 48rpx 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.title-block {
  flex: 1;
  min-width: 0;
}

.page-title {
  display: block;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.page-desc {
  display: block;
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.status-capsule-wrap {
  margin-bottom: 48rpx;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.info-card {
  min-width: 0;
  min-height: 220rpx;
  background-color: #ffffff;
  border-radius: 32rpx;
  padding: 24rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
}

.info-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
}

.info-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon {
  width: 40rpx;
  height: 40rpx;
  display: block;
}

.info-title {
  font-size: 26rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
  text-align: center;
}
</style>
