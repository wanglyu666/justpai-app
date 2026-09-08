<template>
  <view class="deck">
    <view
      class="deck-stage"
      @touchstart="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
      @mousedown="onMouseDown"
    >
      <view
        v-for="card in stackedCards"
        :key="card.id"
        class="deck-card"
        :class="{ 'is-front': card.depth === 0 && !isLeaving(card.id) }"
        :style="cardStyle(card)"
      >
        <image :src="card.image" mode="aspectFill" class="deck-card-image" />
      </view>
    </view>

    <view class="deck-dots">
      <view
        v-for="(item, index) in items"
        :key="item.id"
        class="deck-dot"
        :class="{ active: index === frontIndex }"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { rpx2px } from '@/utils/rpx';

type BannerItem = {
  id: number | string;
  image: string;
};

type StackCard = BannerItem & { depth: number };
type LeavePhase = 'out' | 'in' | null;

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

const props = withDefaults(
  defineProps<{
    items: BannerItem[];
    autoplay?: boolean;
    interval?: number;
  }>(),
  {
    autoplay: true,
    interval: 4000,
  },
);

const frontIndex = ref(0);
const dragX = ref(0);
const dragging = ref(false);
const animating = ref(false);
const lockHorizontal = ref(false);
const leavingId = ref<BannerItem['id'] | null>(null);
const leavingX = ref(0);
const leavingY = ref(0);
const leavingRotate = ref(0);
const leavingScale = ref(1);
const leavingFly = ref(false);
const leavePhase = ref<LeavePhase>(null);
const settleLock = ref(false);

let startX = 0;
let startY = 0;
let lastX = 0;
let lastY = 0;
let pointerActive = false;
let mouseBound = false;
let autoplayTimer: ReturnType<typeof setInterval> | null = null;
let outTimer: ReturnType<typeof setTimeout> | null = null;
let inTimer: ReturnType<typeof setTimeout> | null = null;

const OUT_MS = 440;
const IN_MS = 520;
const EASE_OUT = 'cubic-bezier(0.4, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.22, 1, 0.36, 1)';
const visibleCount = computed(() => Math.min(3, props.items.length));

const stackedCards = computed(() => {
  const list = props.items;
  const count = list.length;
  if (!count) return [];
  const cards: StackCard[] = [];
  for (let depth = visibleCount.value - 1; depth >= 0; depth -= 1) {
    const index = (frontIndex.value + depth) % count;
    cards.push({ ...list[index], depth });
  }
  return cards;
});

const thresholdPx = () => rpx2px(120);

const exitPx = () => {
  try {
    const width = uni.getSystemInfoSync().windowWidth || 0;
    return Math.max(width, rpx2px(750)) + rpx2px(80);
  } catch {
    return rpx2px(830);
  }
};

const isLeaving = (id: BannerItem['id']) => leavingId.value === id;

const stackPose = (depth: number) => {
  if (depth <= 0) {
    return { x: 0, y: 0, rotate: 0, scale: 1 };
  }
  if (depth === 1) {
    return { x: rpx2px(-28), y: rpx2px(18), rotate: -7, scale: 0.95 };
  }
  return { x: rpx2px(28), y: rpx2px(18), rotate: 7, scale: 0.95 };
};

const backPose = () => stackPose(Math.max(1, visibleCount.value - 1));

const cardStyle = (card: StackCard) => {
  const useTransition = !settleLock.value
    && !dragging.value
    && !(isLeaving(card.id) && !leavingFly.value);

  if (isLeaving(card.id)) {
    const duration = leavePhase.value === 'in' ? IN_MS : OUT_MS;
    const ease = leavePhase.value === 'in' ? EASE_IN : EASE_OUT;
    return {
      zIndex: leavePhase.value === 'in' ? 6 : 20,
      transform: `translate3d(${leavingX.value}px, ${leavingY.value}px, 0) rotate(${leavingRotate.value}deg) scale(${leavingScale.value})`,
      transition: useTransition ? `transform ${duration}ms ${ease}` : 'none',
    };
  }

  const pose = { ...stackPose(card.depth) };
  if (card.depth === 1 && !leavingId.value) {
    const lift = Math.min(1, Math.max(0, -dragX.value / thresholdPx()));
    const front = stackPose(0);
    pose.x += (front.x - pose.x) * lift;
    pose.y += (front.y - pose.y) * lift;
    pose.rotate += (front.rotate - pose.rotate) * lift;
    pose.scale += (front.scale - pose.scale) * lift;
  }
  const drag = card.depth === 0 ? dragX.value : 0;
  return {
    zIndex: 10 - card.depth,
    transform: `translate3d(${pose.x + drag}px, ${pose.y}px, 0) rotate(${pose.rotate + drag * 0.04}deg) scale(${pose.scale})`,
    transition: useTransition ? `transform ${OUT_MS}ms ${EASE_OUT}` : 'none',
  };
};

const point = (event: TouchEventLike): TouchLike | null =>
  event.changedTouches?.[0] ?? event.touches?.[0] ?? null;

const coord = (touch: TouchLike | null) => ({
  x: touch?.clientX ?? touch?.pageX ?? 0,
  y: touch?.clientY ?? touch?.pageY ?? 0,
});

const clearShuffleTimers = () => {
  if (outTimer) {
    clearTimeout(outTimer);
    outTimer = null;
  }
  if (inTimer) {
    clearTimeout(inTimer);
    inTimer = null;
  }
};

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
};

const startAutoplay = () => {
  stopAutoplay();
  if (!props.autoplay || props.items.length < 2) return;
  autoplayTimer = setInterval(() => {
    if (!dragging.value && !animating.value) {
      commitShuffle();
    }
  }, props.interval);
};

const finishLeave = () => {
  settleLock.value = true;
  leavingId.value = null;
  leavePhase.value = null;
  leavingFly.value = false;
  leavingX.value = 0;
  leavingY.value = 0;
  leavingRotate.value = 0;
  leavingScale.value = 1;
  animating.value = false;
  nextTick(() => {
    setTimeout(() => {
      settleLock.value = false;
    }, 16);
  });
};

const startReturn = () => {
  const back = backPose();
  leavingFly.value = false;
  leavePhase.value = 'in';
  leavingRotate.value = back.rotate;
  leavingScale.value = back.scale;
  leavingY.value = back.y;
  nextTick(() => {
    leavingFly.value = true;
    leavingX.value = back.x;
  });
  inTimer = setTimeout(finishLeave, IN_MS);
};

const commitShuffle = () => {
  if (animating.value || props.items.length < 2) return;
  animating.value = true;
  dragging.value = false;
  clearShuffleTimers();

  const current = props.items[frontIndex.value];
  leavingId.value = current.id;
  leavingX.value = dragX.value;
  leavingY.value = 0;
  leavingRotate.value = dragX.value * 0.04;
  leavingScale.value = 1;
  leavingFly.value = false;
  leavePhase.value = 'out';
  dragX.value = 0;
  frontIndex.value = (frontIndex.value + 1) % props.items.length;

  nextTick(() => {
    leavingFly.value = true;
    leavingX.value = -exitPx();
    leavingRotate.value = -8;
  });

  outTimer = setTimeout(startReturn, OUT_MS);
};

const onPointerStart = (x: number, y: number) => {
  if (animating.value || props.items.length < 2) return;
  pointerActive = true;
  dragging.value = false;
  lockHorizontal.value = false;
  startX = x;
  startY = y;
  lastX = x;
  lastY = y;
  stopAutoplay();
};

const onPointerMove = (x: number, y: number, event?: { preventDefault?: () => void }) => {
  if (!pointerActive || animating.value) return;
  lastX = x;
  lastY = y;
  const dx = x - startX;
  const dy = y - startY;
  if (!lockHorizontal.value) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    if (Math.abs(dx) <= Math.abs(dy)) {
      pointerActive = false;
      startAutoplay();
      return;
    }
    lockHorizontal.value = true;
    dragging.value = true;
  }
  event?.preventDefault?.();
  dragX.value = Math.min(rpx2px(36), dx);
};

const onPointerEnd = () => {
  if (!pointerActive) return;
  pointerActive = false;
  const dx = lastX - startX;
  dragging.value = false;
  lockHorizontal.value = false;
  if (dx <= -thresholdPx()) {
    commitShuffle();
  } else {
    dragX.value = 0;
  }
  startAutoplay();
};

const onTouchStart = (event: TouchEventLike) => {
  const { x, y } = coord(point(event));
  onPointerStart(x, y);
};

const onTouchMove = (event: TouchEventLike & { preventDefault?: () => void }) => {
  const { x, y } = coord(point(event));
  onPointerMove(x, y, event);
};

const onTouchEnd = () => {
  onPointerEnd();
};

const onMouseMove = (event: MouseEvent) => {
  onPointerMove(event.clientX, event.clientY, event);
};

const onMouseUp = () => {
  unbindMouse();
  onPointerEnd();
};

const bindMouse = () => {
  if (mouseBound || typeof window === 'undefined') return;
  mouseBound = true;
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

const unbindMouse = () => {
  if (!mouseBound || typeof window === 'undefined') return;
  mouseBound = false;
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

const onMouseDown = (event: MouseEvent) => {
  event.preventDefault();
  onPointerStart(event.clientX, event.clientY);
  bindMouse();
};

onMounted(startAutoplay);

onBeforeUnmount(() => {
  stopAutoplay();
  unbindMouse();
  clearShuffleTimers();
});
</script>

<style scoped>
.deck {
  width: 100%;
}

.deck-stage {
  position: relative;
  height: 448rpx;
  overflow: visible;
  user-select: none;
}

.deck-card {
  position: absolute;
  left: 0;
  right: 0;
  top: 24rpx;
  height: 400rpx;
  border-radius: 40rpx;
  overflow: hidden;
  background-color: #c5d0d8;
  box-shadow: 0 12rpx 36rpx rgba(15, 23, 42, 0.12);
  transform-origin: center center;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  will-change: transform;
}

.deck-card-image {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.deck-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12rpx;
  margin-top: 20rpx;
}

.deck-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: rgba(17, 24, 39, 0.18);
}

.deck-dot.active {
  background-color: #111827;
}
</style>
