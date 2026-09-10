<template>
  <view class="time-wheel-picker">
    <view class="time-wheel-wrap">
      <view class="time-wheel-indicator-bar" />
      <picker-view
        class="time-wheel"
        :value="pickerIndex"
        indicator-class="time-wheel-indicator"
        mask-class="time-wheel-mask"
        @change="handlePickerChange"
      >
        <picker-view-column>
          <view v-for="hour in hours" :key="`h-${hour}`" class="wheel-item">
            <view class="wheel-item-content">
              <text class="wheel-item-text">{{ hour }}</text>
              <view class="wheel-item-unit-slot" />
            </view>
          </view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="minute in minutes" :key="`m-${minute}`" class="wheel-item">
            <view class="wheel-item-content">
              <text class="wheel-item-text">{{ minute }}</text>
              <view class="wheel-item-unit-slot" />
            </view>
          </view>
        </picker-view-column>
      </picker-view>
      <view class="time-unit-overlay">
        <view class="time-unit-col">
          <text class="time-unit-ghost">00</text>
          <text class="time-unit-label">时</text>
        </view>
        <view class="time-unit-col">
          <text class="time-unit-ghost">00</text>
          <text class="time-unit-label">分</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const hours = Array.from({ length: 24 }, (_, index) => index);
const minutes = Array.from({ length: 60 }, (_, index) => index);

const pickerIndex = ref([0, 0]);

const pad = (value: number) => String(value).padStart(2, '0');

const parseTime = (value: string) => {
  const matched = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!matched) return null;
  return {
    hour: Math.max(0, Math.min(23, Number(matched[1]))),
    minute: Math.max(0, Math.min(59, Number(matched[2]))),
  };
};

const getDefaultTime = () => {
  const now = new Date();
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
  };
};

const selectedHour = computed(() => hours[pickerIndex.value[0]] ?? 0);
const selectedMinute = computed(() => minutes[pickerIndex.value[1]] ?? 0);

const formatTime = (hour: number, minute: number) =>
  `${pad(hour)}:${pad(minute)}`;

const syncPickerFromValue = (value: string) => {
  const parsed = parseTime(value) ?? getDefaultTime();
  pickerIndex.value = [parsed.hour, parsed.minute];
};

const emitCurrentValue = () => {
  emit('update:modelValue', formatTime(selectedHour.value, selectedMinute.value));
};

const handlePickerChange = (event: { detail: { value: number[] } }) => {
  const next = [...event.detail.value];
  pickerIndex.value = [
    Math.max(0, Math.min(23, next[0] ?? 0)),
    Math.max(0, Math.min(59, next[1] ?? 0)),
  ];
  emitCurrentValue();
};

watch(
  () => props.modelValue,
  (value) => {
    syncPickerFromValue(value);
  },
  { immediate: true },
);
</script>

<style scoped>
.time-wheel-picker {
  background-color: #f9fafb;
  border-radius: 32rpx;
  border: 2rpx solid #e5e7eb;
  overflow: hidden;
  padding: 8rpx 0;
}

.time-wheel-wrap {
  position: relative;
}

.time-wheel-indicator-bar {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 88rpx;
  background-color: rgba(15, 23, 42, 0.06);
  pointer-events: none;
  z-index: 0;
}

.time-wheel {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 360rpx;
}

.wheel-item {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wheel-item-content,
.time-unit-col {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

.wheel-item-text,
.time-unit-ghost {
  font-size: 40rpx;
  font-weight: 500;
  color: #374151;
  line-height: 1;
  min-width: 48rpx;
  text-align: center;
}

.wheel-item-unit-slot {
  width: 36rpx;
  height: 1em;
  flex-shrink: 0;
}

.time-unit-overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 88rpx;
  display: flex;
  pointer-events: none;
  z-index: 2;
}

.time-unit-col {
  flex: 1;
}

.time-unit-ghost {
  opacity: 0;
}

.time-unit-label {
  width: 36rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #374151;
  line-height: 1;
  flex-shrink: 0;
}

:deep(.time-wheel-indicator) {
  height: 88rpx;
  background-color: transparent;
  border: none;
}

:deep(.time-wheel-mask) {
  background-image: linear-gradient(
      180deg,
      rgba(249, 250, 251, 0.95),
      rgba(249, 250, 251, 0.35)
    ),
    linear-gradient(0deg, rgba(249, 250, 251, 0.95), rgba(249, 250, 251, 0.35));
  background-position: top, bottom;
  background-size: 100% 136rpx;
  background-repeat: no-repeat;
}
</style>
