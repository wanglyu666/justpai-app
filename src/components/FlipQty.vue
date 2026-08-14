<template>
  <view class="flip-qty" :class="`flip-qty--${size}`" :style="rootStyle">
    <view
      v-for="(state, index) in digitStates"
      :key="index"
      class="flip-digit-viewport"
      :style="viewportStyle"
    >
      <view
        class="flip-digit-track"
        :style="{
          transform: `translateY(${state.offsetPx}px)`,
          transition: state.animating
            ? 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'none',
        }"
      >
        <text class="flip-digit-cell" :style="cellStyle">{{ state.cells[0] }}</text>
        <text class="flip-digit-cell" :style="cellStyle">{{ state.cells[1] }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import { rpx2px } from '@/utils/rpx';

type DigitState = {
  cells: [string, string];
  offsetPx: number;
  animating: boolean;
};

const SIZE_CONFIG = {
  sm: { cellHeight: 28, cellWidth: 18, fontSize: 28, minWidth: 44 },
  md: { cellHeight: 36, cellWidth: 22, fontSize: 36, minWidth: 48 },
} as const;

const props = withDefaults(
  defineProps<{
    value: number;
    size?: keyof typeof SIZE_CONFIG;
  }>(),
  {
    size: 'sm',
  },
);

const config = computed(() => SIZE_CONFIG[props.size]);
const cellHeight = computed(() => config.value.cellHeight);

const rootStyle = computed(() => ({
  minWidth: `${config.value.minWidth}rpx`,
}));

const viewportStyle = computed(() => ({
  height: `${config.value.cellHeight}rpx`,
  width: `${config.value.cellWidth}rpx`,
}));

const cellStyle = computed(() => ({
  height: `${config.value.cellHeight}rpx`,
  lineHeight: `${config.value.cellHeight}rpx`,
  fontSize: `${config.value.fontSize}rpx`,
}));

const padValue = (value: number) => String(value).padStart(2, '0');

const createState = (digit: string): DigitState => ({
  cells: [digit, digit],
  offsetPx: 0,
  animating: false,
});

const digitStates = ref<DigitState[]>(
  padValue(props.value).split('').map((digit) => createState(digit)),
);

const waitFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

const animateDigit = async (
  state: DigitState,
  oldDigit: string,
  newDigit: string,
  goingUp: boolean,
) => {
  if (oldDigit === newDigit) return;

  const height = rpx2px(cellHeight.value);
  state.animating = false;

  if (goingUp) {
    state.cells = [oldDigit, newDigit];
    state.offsetPx = 0;
  } else {
    state.cells = [newDigit, oldDigit];
    state.offsetPx = -height;
  }

  await nextTick();
  await waitFrame();

  state.animating = true;
  state.offsetPx = goingUp ? -height : 0;

  await new Promise((resolve) => setTimeout(resolve, 250));

  state.animating = false;
  state.cells = [newDigit, newDigit];
  state.offsetPx = 0;
};

watch(
  () => props.value,
  async (nextValue, prevValue) => {
    if (prevValue === undefined) return;

    const goingUp = nextValue > prevValue;
    const nextDigits = padValue(nextValue).split('');
    const prevDigits = padValue(prevValue).split('');

    await Promise.all(
      nextDigits.map((digit, index) =>
        animateDigit(digitStates.value[index], prevDigits[index], digit, goingUp),
      ),
    );
  },
);
</script>

<style scoped>
.flip-qty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flip-digit-viewport {
  overflow: hidden;
}

.flip-digit-track {
  display: flex;
  flex-direction: column;
}

.flip-digit-cell {
  font-weight: 800;
  color: #111827;
  text-align: center;
}
</style>
