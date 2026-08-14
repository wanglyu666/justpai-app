<template>
  <view class="step-fade-root">
    <view
      v-if="layerRendered"
      class="step-fade-layer"
      :class="{ 'is-visible': layerVisible }"
      :style="layerStyle"
    >
      <slot :name="renderedStep" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue';
import {
  STEP_FADE_DURATION_MS,
  STEP_FADE_EASING,
} from '@/utils/stepFadeTransition';
import { waitFrames } from '@/utils/nextFrame';

const props = defineProps<{
  step: string;
}>();

const layerStyle = {
  transition: `opacity ${STEP_FADE_DURATION_MS}ms ${STEP_FADE_EASING}`,
};

const renderedStep = ref(props.step);
const layerRendered = ref(true);
const layerVisible = ref(true);

let seq = 0;
let fadeTimer: ReturnType<typeof setTimeout> | null = null;

const clearFadeTimer = () => {
  if (fadeTimer) {
    clearTimeout(fadeTimer);
    fadeTimer = null;
  }
};

const waitFade = () =>
  new Promise<void>((resolve) => {
    clearFadeTimer();
    fadeTimer = setTimeout(() => {
      fadeTimer = null;
      resolve();
    }, STEP_FADE_DURATION_MS);
  });

watch(
  () => props.step,
  async (nextStep) => {
    if (nextStep === renderedStep.value) return;

    const token = ++seq;
    layerVisible.value = false;
    await waitFade();
    if (token !== seq) return;

    layerRendered.value = false;
    renderedStep.value = nextStep;
    await nextTick();
    layerRendered.value = true;
    layerVisible.value = false;
    await nextTick();
    await waitFrames(1);
    if (token !== seq) return;
    layerVisible.value = true;
  },
);

onUnmounted(() => {
  seq += 1;
  clearFadeTimer();
});

defineExpose({
  duration: STEP_FADE_DURATION_MS,
  easing: STEP_FADE_EASING,
});
</script>

<style>
.step-fade-root {
  position: relative;
  height: 100%;
  min-height: 100%;
}

.step-fade-layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  opacity: 0;
}

.step-fade-layer.is-visible {
  opacity: 1;
}
</style>
