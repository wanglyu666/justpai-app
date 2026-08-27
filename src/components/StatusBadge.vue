<template>
  <view class="status-badge" :style="badgeStyle">
    <text class="status-badge-text" :style="textStyle">{{ label }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  getStatusBadgeColors,
  STATUS_BADGE_SIZE,
  type StatusBadgeSize,
  type StatusBadgeTone,
} from '@/config/statusBadge';

const props = withDefaults(
  defineProps<{
    label: string;
    /** 业务状态码，走 STATUS_BADGE_TONE_BY_KEY 调度 */
    status?: string;
    /** 直接指定语义色，优先于 status */
    tone?: StatusBadgeTone;
    size?: StatusBadgeSize;
  }>(),
  {
    size: 'default',
  },
);

const colors = computed(() => getStatusBadgeColors(props.status, props.tone));
const sizeToken = computed(() => STATUS_BADGE_SIZE[props.size]);

const badgeStyle = computed(() => ({
  height: `${sizeToken.value.height}rpx`,
  padding: `0 ${sizeToken.value.paddingX}rpx`,
  backgroundColor: colors.value.background,
}));

const textStyle = computed(() => ({
  fontSize: `${sizeToken.value.fontSize}rpx`,
  color: colors.value.color,
}));
</script>

<style>
.status-badge {
  border-radius: 1998rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
}

.status-badge-text {
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}
</style>
