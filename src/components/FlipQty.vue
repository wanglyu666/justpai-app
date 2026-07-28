<template>
  <view class="flip-qty">
    <view
      v-for="(state, index) in digitStates"
      :key="index"
      class="flip-digit-viewport"
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
        <text class="flip-digit-cell">{{ state.cells[0] }}</text>
        <text class="flip-digit-cell">{{ state.cells[1] }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

const CELL_HEIGHT = 14;

type DigitState = {
  cells: [string, string];
  offsetPx: number;
  animating: boolean;
};

const props = defineProps<{
  value: number;
}>();

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

  state.animating = false;

  if (goingUp) {
    state.cells = [oldDigit, newDigit];
    state.offsetPx = 0;
  } else {
    state.cells = [newDigit, oldDigit];
    state.offsetPx = -CELL_HEIGHT;
  }

  await nextTick();
  await waitFrame();

  state.animating = true;
  state.offsetPx = goingUp ? -CELL_HEIGHT : 0;

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
  min-width: 22px;
}

.flip-digit-viewport {
  height: 14px;
  width: 9px;
  overflow: hidden;
}

.flip-digit-track {
  display: flex;
  flex-direction: column;
}

.flip-digit-cell {
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  font-weight: 800;
  color: #111827;
  text-align: center;
}
</style>
