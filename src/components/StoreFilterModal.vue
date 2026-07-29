<template>
  <Teleport to="body">
    <Transition :name="MODAL_TRANSITION_NAME" @after-leave="handleAfterLeave">
      <view v-if="show" class="filter-modal-root" @click="handleApply">
        <view class="filter-modal-dim frosted-overlay" :style="overlayStyle" />
        <view class="filter-modal-panel" @click.stop>
          <view class="filter-modal-glass frosted-glass frosted-glass--modal-panel" :style="glassStyle" />
          <view class="filter-modal-content">
            <text class="filter-modal-title">商品筛选</text>

            <view class="product-toggle">
              <view class="toggle-track">
                <view class="toggle-thumb" :class="{ right: draftProductType === 'annual' }" />
                <view
                  class="toggle-item"
                  :class="{ active: draftProductType === 'ordinary' }"
                  @click="draftProductType = 'ordinary'"
                >
                  <text class="toggle-text">普通产品</text>
                </view>
                <view
                  class="toggle-item"
                  :class="{ active: draftProductType === 'annual' }"
                  @click="draftProductType = 'annual'"
                >
                  <text class="toggle-text">年框产品</text>
                </view>
              </view>
            </view>

            <view class="region-section" :class="{ visible: draftProductType === 'annual' }">
              <text class="region-label">年框区域</text>
              <view class="region-scroll-wrap">
                <scroll-view
                  scroll-x
                  class="region-scroll"
                  :show-scrollbar="false"
                  scroll-with-animation
                  :scroll-left="regionScrollLeft"
                  @scroll="handleRegionScroll"
                >
                  <view class="region-scroll-inner">
                    <view class="region-edge-spacer" />
                    <view
                      v-for="(region, index) in annualRegions"
                      :key="region.id"
                      class="region-item"
                      :class="{ centered: focusedRegionIndex === index }"
                      @click="focusRegion(index)"
                    >
                      <text class="region-item-text">{{ region.name }}</text>
                    </view>
                    <view class="region-edge-spacer" />
                  </view>
                </scroll-view>
              </view>
            </view>

            <view class="filter-modal-action" @click="handleApply">
              <text class="filter-modal-action-text">完成</text>
            </view>
          </view>
        </view>
      </view>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  MODAL_DURATION_MS,
  MODAL_EASING,
  MODAL_TRANSITION_NAME,
} from '@/utils/modalTransition';
import { getFrostedGlassStyle, getFrostedOverlayStyle } from '@/utils/frostedGlass';
import { annualRegions, type AnnualRegionId } from '@/data/storeProducts';

export type StoreProductType = 'ordinary' | 'annual';

export type StoreFilterResult = {
  productType: StoreProductType;
  annualRegion: AnnualRegionId;
};

const REGION_ITEM_STEP = 112;

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
const regionScrollLeft = ref(0);

const syncDraftFromProps = () => {
  draftProductType.value = props.productType;
  draftAnnualRegion.value = props.annualRegion;
  const index = annualRegions.findIndex((region) => region.id === props.annualRegion);
  focusedRegionIndex.value = index >= 0 ? index : 0;
  regionScrollLeft.value = focusedRegionIndex.value * REGION_ITEM_STEP;
};

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      syncDraftFromProps();
    }
  },
);

const focusRegion = (index: number) => {
  focusedRegionIndex.value = index;
  draftAnnualRegion.value = annualRegions[index].id;
  regionScrollLeft.value = index * REGION_ITEM_STEP;
};

const handleRegionScroll = (e: { detail: { scrollLeft: number } }) => {
  const index = Math.round(e.detail.scrollLeft / REGION_ITEM_STEP);
  const clamped = Math.max(0, Math.min(annualRegions.length - 1, index));
  if (clamped === focusedRegionIndex.value) return;
  focusedRegionIndex.value = clamped;
  draftAnnualRegion.value = annualRegions[clamped].id;
};

const handleApply = () => {
  emit('apply', {
    productType: draftProductType.value,
    annualRegion: draftAnnualRegion.value,
  });
};

const handleAfterLeave = () => {
  emit('closed');
};

defineExpose({
  duration: MODAL_DURATION_MS,
  easing: MODAL_EASING,
});
</script>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 280ms cubic-bezier(0.32, 0.72, 0, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

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
  padding: 0 32px;
  box-sizing: border-box;
}

.filter-modal-dim {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.filter-modal-panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 340px;
  border-radius: 24px;
  overflow: hidden;
}

.filter-modal-glass {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  box-sizing: border-box;
  pointer-events: none;
}

.filter-modal-content {
  position: relative;
  z-index: 1;
  padding: 24px 20px 20px;
  box-sizing: border-box;
}

.filter-modal-title {
  display: block;
  text-align: center;
  font-size: 17px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 20px;
}

.product-toggle {
  width: 100%;
}

.toggle-track {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 4px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.72);
  box-sizing: border-box;
}

.toggle-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  border-radius: 999px;
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
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
  line-height: 1;
  transition: color 280ms cubic-bezier(0.32, 0.72, 0, 1);
  white-space: nowrap;
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
  max-height: 120px;
  opacity: 1;
  margin-top: 20px;
  overflow: visible;
}

.region-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 12px;
}

.region-scroll-wrap {
  position: relative;
  overflow: hidden;
  margin-left: -2px;
  margin-right: -2px;
  width: calc(100% + 4px);
  transform: translateZ(0);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.45) 8%,
    rgba(0, 0, 0, 1) 24%,
    rgba(0, 0, 0, 1) 76%,
    rgba(0, 0, 0, 0.45) 92%,
    rgba(0, 0, 0, 0) 100%
  );
  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.45) 8%,
    rgba(0, 0, 0, 1) 24%,
    rgba(0, 0, 0, 1) 76%,
    rgba(0, 0, 0, 0.45) 92%,
    rgba(0, 0, 0, 0) 100%
  );
}

.region-scroll {
  width: 100%;
  white-space: nowrap;
  border: none;
  outline: none;
}

.region-scroll-inner {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 4px;
}

.region-edge-spacer {
  width: 96px;
  flex-shrink: 0;
}

.region-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 44px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.72);
  flex-shrink: 0;
  transition:
    transform 280ms cubic-bezier(0.32, 0.72, 0, 1),
    background-color 280ms ease,
    box-shadow 280ms ease;
  transform: scale(0.92);
}

.region-item.centered {
  transform: scale(1.06);
  background-color: #ffffff;
  box-shadow: 0 4px 14px rgba(22, 51, 0, 0.1);
}

.region-item-text {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.region-item.centered .region-item-text {
  color: #163300;
  font-weight: 700;
}

.filter-modal-action {
  margin-top: 22px;
  height: 48px;
  border-radius: 999px;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-modal-action-text {
  font-size: 15px;
  font-weight: 700;
  color: #163300;
}
</style>
