<template>
  <view
    v-if="rendered"
    class="filter-modal-root"
    :class="{ 'is-entered': entered }"
    @click="handleApply"
  >
    <view class="filter-modal-dim frosted-overlay" :style="overlayStyle" />
    <view
      class="filter-modal-panel frosted-glass frosted-glass--modal-panel"
      :style="glassStyle"
      @click.stop
    >
      <view class="filter-modal-content">
        <text class="filter-modal-title">商品筛选</text>

        <view class="product-toggle">
          <view class="toggle-track">
            <view class="toggle-thumb" :class="{ right: draftProductType === 'annual' }" />
            <view
              class="toggle-item"
              :class="{ active: draftProductType === 'ordinary' }"
              hover-class="none"
              @click.stop="draftProductType = 'ordinary'"
            >
              <text class="toggle-text">普通产品</text>
            </view>
            <view
              class="toggle-item"
              :class="{ active: draftProductType === 'annual' }"
              hover-class="none"
              @click.stop="draftProductType = 'annual'"
            >
              <text class="toggle-text">年框产品</text>
            </view>
          </view>
        </view>

        <view class="region-section" :class="{ visible: draftProductType === 'annual' }">
          <template v-if="draftProductType === 'annual'">
            <text class="region-label">年框区域</text>
            <view class="region-scroll-wrap">
              <view
                class="region-scroll-inner"
                :style="regionInnerStyle"
                @touchstart.stop="onRegionTouchStart"
                @touchend.stop="onRegionTouchEnd"
              >
                <view
                  v-for="(region, index) in annualRegions"
                  :key="region.id"
                  class="region-item"
                  :class="{ centered: focusedRegionIndex === index }"
                  :style="regionItemStyle(index)"
                  hover-class="none"
                  @click.stop="handleRegionClick(index)"
                >
                  <text class="region-item-text">{{ region.name }}</text>
                </view>
              </view>
            </view>
          </template>
        </view>

        <view class="filter-modal-action" hover-class="none" @click.stop="handleApply">
          <text class="filter-modal-action-text">完成</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
import {
  MODAL_DURATION_MS,
  MODAL_EASING,
} from '@/utils/modalTransition';
import { getFrostedGlassStyle, getFrostedOverlayStyle } from '@/utils/frostedGlass';
import { annualRegions, type AnnualRegionId } from '@/data/storeProducts';
import { waitFrames } from '@/utils/nextFrame';
import { registerSecondaryPage } from '@/composables/useSecondaryPage';

export type StoreProductType = 'ordinary' | 'annual';

export type StoreFilterResult = {
  productType: StoreProductType;
  annualRegion: AnnualRegionId;
};

const REGION_ITEM_WIDTH_RPX = 200;
const REGION_ITEM_GAP_RPX = 24;
const REGION_ITEM_STEP_RPX = REGION_ITEM_WIDTH_RPX + REGION_ITEM_GAP_RPX;

const glassStyle = getFrostedGlassStyle('modalPanel');
const overlayStyle = getFrostedOverlayStyle();

const props = withDefaults(
  defineProps<{
    show: boolean;
    productType?: StoreProductType;
    annualRegion?: AnnualRegionId;
  }>(),
  {
    productType: 'ordinary',
    annualRegion: 'north',
  },
);

const emit = defineEmits<{
  apply: [result: StoreFilterResult];
  closed: [];
}>();

const draftProductType = ref<StoreProductType>('ordinary');
const draftAnnualRegion = ref<AnnualRegionId>('north');
const focusedRegionIndex = ref(0);
let regionTouchStartX = 0;
let regionSwiped = false;

const regionInnerStyle = computed(() => ({
  transform: `translate3d(${-focusedRegionIndex.value * REGION_ITEM_STEP_RPX}rpx, 0, 0)`,
}));

const regionItemStyle = (index: number) => {
  const dist = Math.abs(index - focusedRegionIndex.value);
  const opacity = dist === 0 ? 1 : dist === 1 ? 0.36 : 0.14;
  const scale = dist === 0 ? 1.06 : dist === 1 ? 0.9 : 0.82;
  return {
    opacity,
    transform: `scale(${scale})`,
  };
};

const rendered = ref(props.show);
const entered = ref(props.show);
registerSecondaryPage(rendered);
let closeTimer: ReturnType<typeof setTimeout> | null = null;
let showSeq = 0;

const clearCloseTimer = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const finishClose = () => {
  clearCloseTimer();
  if (props.show) return;
  rendered.value = false;
  entered.value = false;
  emit('closed');
};

const syncDraftFromProps = () => {
  draftProductType.value = props.productType;
  draftAnnualRegion.value = props.annualRegion;
  const index = annualRegions.findIndex((region) => region.id === props.annualRegion);
  focusedRegionIndex.value = index >= 0 ? index : 0;
};

watch(
  () => props.show,
  async (visible) => {
    const seq = ++showSeq;
    clearCloseTimer();

    if (visible) {
      syncDraftFromProps();
      rendered.value = true;
      entered.value = false;
      await nextTick();
      await waitFrames(1);
      if (seq !== showSeq) return;
      entered.value = true;
      return;
    }

    entered.value = false;
    closeTimer = setTimeout(finishClose, MODAL_DURATION_MS + 80);
  },
);

onUnmounted(() => {
  clearCloseTimer();
});

const focusRegion = (index: number) => {
  const clamped = Math.max(0, Math.min(annualRegions.length - 1, index));
  focusedRegionIndex.value = clamped;
  draftAnnualRegion.value = annualRegions[clamped].id;
};

const getTouchX = (event: {
  touches?: Array<{ clientX?: number; pageX?: number }>;
  changedTouches?: Array<{ clientX?: number; pageX?: number }>;
}) =>
  event.changedTouches?.[0]?.clientX ??
  event.changedTouches?.[0]?.pageX ??
  event.touches?.[0]?.clientX ??
  event.touches?.[0]?.pageX ??
  0;

const onRegionTouchStart = (event: {
  touches?: Array<{ clientX?: number; pageX?: number }>;
  changedTouches?: Array<{ clientX?: number; pageX?: number }>;
}) => {
  regionSwiped = false;
  regionTouchStartX = getTouchX(event);
};

const onRegionTouchEnd = (event: {
  touches?: Array<{ clientX?: number; pageX?: number }>;
  changedTouches?: Array<{ clientX?: number; pageX?: number }>;
}) => {
  const deltaX = getTouchX(event) - regionTouchStartX;
  if (Math.abs(deltaX) < 36) return;
  regionSwiped = true;
  focusRegion(focusedRegionIndex.value + (deltaX < 0 ? 1 : -1));
};

const handleRegionClick = (index: number) => {
  if (regionSwiped) {
    regionSwiped = false;
    return;
  }
  focusRegion(index);
};

const handleApply = () => {
  emit('apply', {
    productType: draftProductType.value,
    annualRegion: draftAnnualRegion.value,
  });
};

defineExpose({
  duration: MODAL_DURATION_MS,
  easing: MODAL_EASING,
});
</script>

<style>
.filter-modal-root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 64rpx;
  box-sizing: border-box;
  opacity: 0;
  transition: opacity 280ms cubic-bezier(0.32, 0.72, 0, 1);
}

.filter-modal-root.is-entered {
  opacity: 1;
}

.filter-modal-dim {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.filter-modal-panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 680rpx;
  border-radius: 48rpx;
  overflow: hidden;
}

.filter-modal-content {
  position: relative;
  z-index: 1;
  padding: 48rpx 40rpx 40rpx;
  box-sizing: border-box;
}

.filter-modal-title {
  display: block;
  text-align: center;
  font-size: 34rpx;
  font-weight: 800;
  color: #111827;
  margin-bottom: 40rpx;
}

.product-toggle {
  width: 100%;
}

.toggle-track {
  position: relative;
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 8rpx;
  border-radius: 1998rpx;
  background-color: rgba(255, 255, 255, 0.72);
  box-sizing: border-box;
}

.toggle-thumb {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  width: calc(50% - 8rpx);
  height: calc(100% - 16rpx);
  border-radius: 1998rpx;
  background-color: #9fe870;
  transition: left 280ms cubic-bezier(0.32, 0.72, 0, 1);
}

.toggle-thumb.right {
  left: calc(50%);
}

.toggle-item {
  position: relative;
  z-index: 1;
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #9ca3af;
  line-height: 1;
  transition: color 280ms cubic-bezier(0.32, 0.72, 0, 1);
  white-space: nowrap;
  pointer-events: none;
}

.toggle-item.active .toggle-text {
  color: #163300;
  font-weight: 700;
}

.region-section {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition:
    max-height 320ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 280ms ease,
    margin-top 280ms ease;
  margin-top: 0;
}

.region-section.visible {
  max-height: 320rpx;
  opacity: 1;
  margin-top: 40rpx;
  overflow: visible;
}

.region-label {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 24rpx;
}

.region-scroll-wrap {
  position: relative;
  height: 168rpx;
  margin-left: -40rpx;
  margin-right: -40rpx;
  width: calc(100% + 80rpx);
  overflow: hidden;
  -webkit-mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 18%,
    rgba(0, 0, 0, 1) 82%,
    rgba(0, 0, 0, 0) 100%
  );
  mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 18%,
    rgba(0, 0, 0, 1) 82%,
    rgba(0, 0, 0, 0) 100%
  );
}

.region-scroll-inner {
  display: inline-flex;
  align-items: center;
  height: 168rpx;
  gap: 24rpx;
  position: relative;
  left: 50%;
  margin-left: -100rpx;
  transition: transform 280ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform;
}

.region-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200rpx;
  height: 88rpx;
  border-radius: 1998rpx;
  background-color: rgba(255, 255, 255, 0.72);
  flex-shrink: 0;
  transition:
    transform 280ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 280ms ease,
    background-color 280ms ease,
    box-shadow 280ms ease;
}

.region-item.centered {
  background-color: #ffffff;
  box-shadow: 0 8rpx 28rpx rgba(22, 51, 0, 0.12);
}

.region-item-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  pointer-events: none;
}

.region-item.centered .region-item-text {
  color: #163300;
  font-weight: 700;
}

.filter-modal-action {
  position: relative;
  z-index: 2;
  margin-top: 44rpx;
  height: 96rpx;
  border-radius: 1998rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-modal-action-text {
  font-size: 30rpx;
  font-weight: 700;
  color: #163300;
  pointer-events: none;
}
</style>
