<template>
  <view
    v-if="hasPageBack"
    class="edge-swipe-back"
    @touchstart="onStart"
    @touchmove.stop.prevent="onMove"
    @touchend="onEnd"
    @touchcancel="onEnd"
  />
</template>

<script setup lang="ts">
import { hasPageBack, triggerPageBack } from '@/composables/usePageBack';
import {
  EDGE_SWIPE_DISTANCE_PX,
  EDGE_SWIPE_HORIZONTAL_RATIO,
} from '@/utils/edgeSwipeBack';

type TouchLike = {
  clientX?: number;
  clientY?: number;
  pageX?: number;
  pageY?: number;
};

type TouchEventLike = {
  touches?: TouchLike[];
  changedTouches?: TouchLike[];
};

let tracking = false;
let startX = 0;
let startY = 0;
let lastX = 0;
let lastY = 0;

const point = (event: TouchEventLike): TouchLike | null =>
  event.changedTouches?.[0] ?? event.touches?.[0] ?? null;

const coord = (touch: TouchLike | null) => ({
  x: touch?.clientX ?? touch?.pageX ?? 0,
  y: touch?.clientY ?? touch?.pageY ?? 0,
});

const onStart = (event: TouchEventLike) => {
  const { x, y } = coord(point(event));
  tracking = true;
  startX = x;
  startY = y;
  lastX = x;
  lastY = y;
};

const onMove = (event: TouchEventLike) => {
  if (!tracking) return;
  const { x, y } = coord(point(event));
  lastX = x;
  lastY = y;
};

const onEnd = () => {
  if (!tracking) return;
  tracking = false;

  const dx = lastX - startX;
  const dy = Math.abs(lastY - startY);
  if (dx < EDGE_SWIPE_DISTANCE_PX) return;
  if (dx < dy * EDGE_SWIPE_HORIZONTAL_RATIO) return;
  triggerPageBack();
};
</script>

<style>
.edge-swipe-back {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 64rpx;
  z-index: 50000;
  /* App WebView 全透明节点经常点不到，留一层极淡底色只为命中 */
  background-color: rgba(0, 0, 0, 0.002);
  touch-action: none;
}
</style>
