<template>
  <view class="date-wheel-picker">
    <view class="date-wheel-wrap">
      <view class="date-wheel-indicator-bar" />
      <picker-view
        class="date-wheel"
        :value="pickerIndex"
        indicator-class="date-wheel-indicator"
        mask-class="date-wheel-mask"
        @change="handlePickerChange"
      >
      <picker-view-column>
        <view v-for="year in years" :key="`y-${year}`" class="wheel-item">
          <text class="wheel-item-text">{{ year }}</text>
        </view>
      </picker-view-column>
      <picker-view-column>
        <view v-for="month in months" :key="`m-${month}`" class="wheel-item">
          <text class="wheel-item-text">{{ pad(month) }}</text>
        </view>
      </picker-view-column>
      <picker-view-column>
        <view v-for="day in days" :key="`d-${day}`" class="wheel-item">
          <text class="wheel-item-text">{{ pad(day) }}</text>
        </view>
      </picker-view-column>
      </picker-view>
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

const START_YEAR = new Date().getFullYear();
const YEAR_COUNT = 10;

const years = Array.from({ length: YEAR_COUNT }, (_, index) => START_YEAR + index);
const months = Array.from({ length: 12 }, (_, index) => index + 1);

const pickerIndex = ref([0, 0, 0]);

const pad = (value: number) => String(value).padStart(2, '0');

const parseDate = (value: string) => {
  if (!value) return null;
  const matched = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!matched) return null;
  return {
    year: Number(matched[1]),
    month: Number(matched[2]),
    day: Number(matched[3]),
  };
};

const getDefaultDate = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
};

const selectedYear = computed(() => years[pickerIndex.value[0]] ?? START_YEAR);
const selectedMonth = computed(() => months[pickerIndex.value[1]] ?? 1);

const daysInMonth = computed(() =>
  new Date(selectedYear.value, selectedMonth.value, 0).getDate(),
);

const days = computed(() =>
  Array.from({ length: daysInMonth.value }, (_, index) => index + 1),
);

const formatDate = (year: number, month: number, day: number) =>
  `${year}-${pad(month)}-${pad(day)}`;

const syncPickerFromValue = (value: string) => {
  const parsed = parseDate(value) ?? getDefaultDate();
  const yearIndex = Math.max(0, years.indexOf(parsed.year));
  const monthIndex = Math.max(0, Math.min(11, parsed.month - 1));
  const maxDay = new Date(parsed.year, parsed.month, 0).getDate();
  const dayIndex = Math.max(0, Math.min(maxDay - 1, parsed.day - 1));

  pickerIndex.value = [yearIndex, monthIndex, dayIndex];
};

const emitCurrentValue = () => {
  const day = days.value[pickerIndex.value[2]] ?? 1;
  emit('update:modelValue', formatDate(selectedYear.value, selectedMonth.value, day));
};

const handlePickerChange = (event: { detail: { value: number[] } }) => {
  const next = [...event.detail.value];
  const maxDay = new Date(
    years[next[0]] ?? START_YEAR,
    months[next[1]] ?? 1,
    0,
  ).getDate();

  if (next[2] >= maxDay) {
    next[2] = maxDay - 1;
  }

  pickerIndex.value = next;
  emitCurrentValue();
};

watch(daysInMonth, (count) => {
  if (pickerIndex.value[2] >= count) {
    pickerIndex.value = [pickerIndex.value[0], pickerIndex.value[1], count - 1];
    emitCurrentValue();
  }
});

watch(
  () => props.modelValue,
  (value) => {
    syncPickerFromValue(value);
  },
  { immediate: true },
);
</script>

<style scoped>
.date-wheel-picker {
  background-color: #f9fafb;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  padding: 4px 0;
}

.date-wheel-wrap {
  position: relative;
}

.date-wheel-indicator-bar {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 44px;
  background-color: rgba(15, 23, 42, 0.06);
  border-radius: 0;
  pointer-events: none;
  z-index: 0;
}

.date-wheel {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 220px;
}

.wheel-item {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wheel-item-text {
  font-size: 20px;
  font-weight: 500;
  color: #374151;
  line-height: 1;
}

:deep(.date-wheel-indicator) {
  height: 44px;
  background-color: transparent;
  border: none;
}

:deep(.date-wheel-mask) {
  background-image: linear-gradient(
      180deg,
      rgba(249, 250, 251, 0.95),
      rgba(249, 250, 251, 0.35)
    ),
    linear-gradient(0deg, rgba(249, 250, 251, 0.95), rgba(249, 250, 251, 0.35));
  background-position: top, bottom;
  background-size: 100% 88px;
  background-repeat: no-repeat;
}
</style>
