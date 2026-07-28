<template>
  <Transition
    :name="FADE_TRANSITION_NAME"
    :mode="mode"
    @after-enter="(el) => emit('afterEnter', el)"
    @after-leave="(el) => emit('afterLeave', el)"
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
