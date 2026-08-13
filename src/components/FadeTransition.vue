<template>
  <!-- duration 强制结束：App 端 CSS transitionend 常丢失，避免 leave 卡死 -->
  <Transition
    :name="FADE_TRANSITION_NAME"
    :mode="mode"
    :duration="FADE_DURATION_MS"
    @after-enter="onAfterEnter"
    @after-leave="onAfterLeave"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import {
  FADE_DURATION_MS,
  FADE_EASING,
  FADE_TRANSITION_NAME,
} from '@/utils/fadeTransition';

withDefaults(
  defineProps<{
    mode?: 'default' | 'in-out' | 'out-in';
  }>(),
  {
    mode: 'out-in',
  },
);

const emit = defineEmits<{
  afterEnter: [el: Element];
  afterLeave: [el: Element];
}>();

const onAfterEnter = (el: Element) => {
  emit('afterEnter', el);
};

const onAfterLeave = (el: Element) => {
  emit('afterLeave', el);
};

defineExpose({
  duration: FADE_DURATION_MS,
  easing: FADE_EASING,
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
