<template>
  <view v-if="show" class="frosted-action-root">
    <view class="frosted-action-mask" @click="emit('close')" />
    <view class="frosted-action-anchor" :style="anchorStyle">
      <view
        class="frosted-action-glass frosted-glass"
        :style="glassStyle"
      >
        <view
          v-for="item in items"
          :key="item.id"
          class="frosted-action-row"
          @click.stop="emit('select', item.id)"
        >
          <image :src="item.icon" mode="aspectFit" class="frosted-action-icon" />
          <text class="frosted-action-text">{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getFrostedGlassStyle } from '@/utils/frostedGlass';
import type { FrostedActionMenuItem } from '@/composables/useFrostedActionMenu';

const props = defineProps<{
  show: boolean;
  top: number;
  right: number;
  items: FrostedActionMenuItem[];
}>();

const emit = defineEmits<{
  close: [];
  select: [id: string];
}>();

const glassStyle = getFrostedGlassStyle('default');

const anchorStyle = computed(() => ({
  top: `${props.top}px`,
  right: `${props.right}px`,
}));
</script>

<style scoped>
.frosted-action-root {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
}

.frosted-action-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.frosted-action-anchor {
  position: absolute;
  z-index: 2;
}

.frosted-action-glass {
  min-width: 320rpx;
  padding: 16rpx 8rpx;
  border-radius: 28rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.frosted-action-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 22rpx 28rpx;
}

.frosted-action-icon {
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
}

.frosted-action-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}
</style>
