<template>
  <view class="success-page-root">
    <view
      v-if="formRendered"
      class="success-page-layer"
      :class="{ 'is-visible': formVisible }"
      :style="layerStyle"
    >
      <slot />
    </view>
    <view
      v-if="successRendered"
      class="success-page-layer"
      :class="{ 'is-visible': successVisible }"
      :style="layerStyle"
    >
      <slot name="success" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue';
import {
  SUCCESS_PAGE_FADE_DURATION_MS,
  SUCCESS_PAGE_FADE_EASING,
} from '@/utils/successPageTransition';
import { waitFrames } from '@/utils/nextFrame';

const props = defineProps<{
  showSuccess: boolean;
}>();

const layerStyle = {
  transition: `opacity ${SUCCESS_PAGE_FADE_DURATION_MS}ms ${SUCCESS_PAGE_FADE_EASING}`,
};

const formRendered = ref(!props.showSuccess);
const formVisible = ref(!props.showSuccess);
const successRendered = ref(props.showSuccess);
const successVisible = ref(props.showSuccess);

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
    }, SUCCESS_PAGE_FADE_DURATION_MS);
  });

const showForm = async (token: number) => {
  successVisible.value = false;
  await waitFade();
  if (token !== seq) return;

  successRendered.value = false;
  formRendered.value = true;
  formVisible.value = false;
  await nextTick();
  await waitFrames(1);
  if (token !== seq) return;
  formVisible.value = true;
};

const showSuccessPage = async (token: number) => {
  formVisible.value = false;
  await waitFade();
  if (token !== seq) return;

  formRendered.value = false;
  successRendered.value = true;
  successVisible.value = false;
  await nextTick();
  await waitFrames(1);
  if (token !== seq) return;
  successVisible.value = true;
};

watch(
  () => props.showSuccess,
  (showSuccess) => {
    const token = ++seq;
    if (showSuccess) {
      void showSuccessPage(token);
      return;
    }
    void showForm(token);
  },
);

onUnmounted(() => {
  seq += 1;
  clearFadeTimer();
});

defineExpose({
  duration: SUCCESS_PAGE_FADE_DURATION_MS,
  easing: SUCCESS_PAGE_FADE_EASING,
});
</script>

<style>
.success-page-root {
  position: relative;
  height: 100%;
  min-height: 100%;
}

.success-page-layer {
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

.success-page-layer.is-visible {
  opacity: 1;
}
</style>
