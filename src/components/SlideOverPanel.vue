<template>
  <Transition
    :name="SLIDE_OVER_TRANSITION_NAME"
    @after-leave="handleAfterLeave"
  >
    <view v-if="show" class="slide-over-panel" :style="panelStyle">
      <view
        class="slide-over-scroll"
        :class="edgeToEdge ? 'slide-over-edge' : 'page-safe-top'"
      >
        <slot />
      </view>
    </view>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  SLIDE_OVER_DURATION_MS,
  SLIDE_OVER_EASING,
  SLIDE_OVER_TRANSITION_NAME,
} from '@/utils/slideOverTransition';

const props = withDefaults(
  defineProps<{
    show: boolean;
    zIndex?: number;
    edgeToEdge?: boolean;
  }>(),
  {
    zIndex: 1000,
    edgeToEdge: false,
  },
);

const panelStyle = computed(() => ({
  zIndex: props.zIndex,
}));

const emit = defineEmits<{
  closed: [];
}>();

const handleAfterLeave = () => {
  emit('closed');
};

defineExpose({
  duration: SLIDE_OVER_DURATION_MS,
  easing: SLIDE_OVER_EASING,
});
</script>

<style>
/* 进入/退出：均从右侧滑入滑出，底层页面始终保留 */
.slide-over-enter-active,
.slide-over-leave-active {
  transition: transform 420ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform;
}

.slide-over-enter-from,
.slide-over-leave-to {
  transform: translateX(100%);
}

.slide-over-enter-to,
.slide-over-leave-from {
  transform: translateX(0);
}

.slide-over-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #F4F5F7;
  overflow: hidden;
  box-sizing: border-box;
}

/* 滚动放在内层，外层固定铺底色，弹性越界时仍显示个人中心背景而不露出首页 */
.slide-over-scroll {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  background-color: #F4F5F7;
  box-sizing: border-box;
}

.slide-over-edge {
  padding-top: calc(8px + env(safe-area-inset-top, 0px));
}
</style>
