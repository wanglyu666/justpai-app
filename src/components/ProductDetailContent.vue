<template>
  <view class="product-detail">
    <view class="hero-section">
      <view
        class="icon-btn detail-header-btn detail-header-btn-left frosted-glass"
        :style="headerGlassStyle"
        hover-class="icon-btn-hover"
        :hover-stay-time="80"
        @click.stop="handleBack"
      >
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
      </view>
      <view
        class="icon-btn detail-header-btn detail-header-btn-right frosted-glass"
        :style="headerGlassStyle"
        hover-class="icon-btn-hover"
        :hover-stay-time="80"
        @click.stop="openConsultFlow"
      >
        <image src="/static/icons/message-circle.svg" mode="aspectFit" class="header-icon" />
      </view>

      <swiper
        class="hero-swiper"
        :indicator-dots="false"
        :current="currentImage"
        @change="onSwiperChange"
        circular
      >
        <swiper-item v-for="(img, index) in product.images" :key="index">
          <view class="hero-image-wrap">
            <image :src="img" mode="aspectFill" class="hero-image" />
          </view>
        </swiper-item>
      </swiper>
      <view class="hero-meta-bar">
        <view class="hero-meta-side hero-meta-side-left">
          <view class="hero-rating-block">
            <view class="hero-rating-row">
              <text class="hero-star">★</text>
              <text class="hero-rating-value">{{ product.rating.toFixed(1) }}</text>
            </view>
            <text class="hero-rating-label">推荐指数</text>
          </view>
        </view>
        <view class="hero-meta-divider" />
        <view class="hero-meta-side hero-meta-side-right">
          <text class="hero-meta-price">¥ {{ product.price }}</text>
        </view>
      </view>
      <view class="hero-dots">
        <view
          v-for="(_, index) in product.images"
          :key="index"
          class="hero-dot"
          :class="{ active: currentImage === index }"
        />
      </view>
    </view>

    <view class="info-section">
      <text class="product-title">{{ product.name }}</text>

      <view class="detail-tabs">
        <view class="tab-bar">
          <view
            v-for="tab in tabs"
            :key="tab.id"
            :id="`tab-item-${tab.id}`"
            class="tab-item"
            :class="{ active: activeTab === tab.id }"
            @click="switchTab(tab.id)"
          >
            <text class="tab-label">{{ tab.label }}</text>
          </view>
          <view class="tab-indicator-slider" :style="indicatorStyle" />
        </view>

        <view class="tab-panel">
          <view class="tab-panel-body-wrap" :style="tabPanelStyle">
            <FadeTransition mode="out-in" @after-enter="measureTabPanelHeight">
              <view v-if="activeTab === 'params'" key="params" class="param-list tab-panel-body">
                <view v-for="group in paramGroups" :key="group.key" class="param-row">
                  <text class="param-label">{{ group.label }}</text>
                  <scroll-view
                    scroll-x
                    class="param-options-scroll"
                    :style="paramScrollStyle"
                    :show-scrollbar="false"
                  >
                    <view class="param-options">
                      <view
                        v-for="option in group.options"
                        :key="option"
                        class="param-chip"
                        :class="{ active: selectedParams[group.key] === option }"
                        @click="selectParam(group.key, option)"
                      >
                        <text class="param-chip-text">{{ option }}</text>
                      </view>
                    </view>
                  </scroll-view>
                </view>
              </view>
              <view v-else key="detail" class="detail-list tab-panel-body">
                <view v-for="item in detailItems" :key="item.label" class="detail-row">
                  <text class="detail-label">{{ item.label }}</text>
                  <text class="detail-value">{{ item.value }}</text>
                </view>
              </view>
            </FadeTransition>
          </view>
        </view>
      </view>
    </view>

    <view class="detail-footer">
      <view class="action-bar frosted-glass frosted-glass--tabbar" :style="footerGlassStyle">
        <view class="qty-counter">
          <view class="qty-btn" @click="decreaseQty">
            <text class="qty-btn-text">−</text>
          </view>
          <FlipQty :value="quantity" size="md" />
          <view class="qty-btn" @click="increaseQty">
            <text class="qty-btn-text">+</text>
          </view>
        </view>
        <view class="action-buttons">
          <view class="cart-btn" @click="openCartSuccessModal">
            <text class="cart-btn-text">加入购物车</text>
          </view>
        </view>
      </view>
    </view>

    <BottomSheetPanel :show="consultFlowVisible" :z-index="1100" @closed="resetConsultFlow">
      <SuccessPageTransition :show-success="consultStep === 'success'">
        <ConsultFormContent
          @back="closeConsultFlow"
          @next="goConsultSuccessStep"
        />
        <template #success>
          <ConsultSuccessContent @back="closeConsultFlow" />
        </template>
      </SuccessPageTransition>
    </BottomSheetPanel>

    <FrostedConfirmModal
      :show="cartSuccessVisible"
      title="已加入购物车"
      icon="/static/images/check-mark.png"
      :show-cancel="false"
      :show-confirm="false"
      tone="success"
      compact
      @cancel="closeCartSuccessModal"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { getFrostedGlassStyle } from '@/utils/frostedGlass';
import { SLIDE_OVER_EASING } from '@/utils/slideOverTransition';
import FadeTransition from '@/components/FadeTransition.vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import ConsultFormContent from '@/components/ConsultFormContent.vue';
import ConsultSuccessContent from '@/components/ConsultSuccessContent.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import FrostedConfirmModal from '@/components/FrostedConfirmModal.vue';
import FlipQty from '@/components/FlipQty.vue';
import { useSlideOver } from '@/composables/useSlideOver';
import { useCart } from '@/composables/useCart';

const TAB_PANEL_HEIGHT_DURATION_MS = 320;

const headerGlassStyle = getFrostedGlassStyle('default');
const footerGlassStyle = getFrostedGlassStyle('tabbar');
const paramScrollStyle = {
  height: '72rpx',
  width: '100%',
};

const { visible: consultFlowVisible, open: openConsultFlow, close: closeConsultFlow } = useSlideOver();
const { addToCart } = useCart();
const consultStep = ref<'form' | 'success'>('form');
const cartSuccessVisible = ref(false);
let cartSuccessTimer: ReturnType<typeof setTimeout> | null = null;

const clearCartSuccessTimer = () => {
  if (cartSuccessTimer) {
    clearTimeout(cartSuccessTimer);
    cartSuccessTimer = null;
  }
};

const openCartSuccessModal = () => {
  addToCart(
    props.product,
    {
      model: selectedParams.value.model,
      spec: selectedParams.value.spec,
      color: selectedParams.value.color,
    },
    quantity.value,
  );
  clearCartSuccessTimer();
  cartSuccessVisible.value = true;
  cartSuccessTimer = setTimeout(() => {
    cartSuccessVisible.value = false;
    cartSuccessTimer = null;
  }, 1000);
};

const closeCartSuccessModal = () => {
  clearCartSuccessTimer();
  cartSuccessVisible.value = false;
};

onUnmounted(() => {
  clearCartSuccessTimer();
});

const goConsultSuccessStep = () => {
  consultStep.value = 'success';
};

const resetConsultFlow = () => {
  consultStep.value = 'form';
};

export interface ProductDetail {
  id: number;
  name: string;
  price: string;
  image: string;
  brand: string;
  brandShort: string;
  brandHandle: string;
  rating: number;
  description: string;
  fullDescription?: string;
  images: string[];
  productType?: 'ordinary' | 'annual';
  annualRegion?: 'north' | 'south' | 'east' | 'west';
}

const props = defineProps<{
  product: ProductDetail;
}>();

const tabs = [
  { id: 'params', label: '商品参数' },
  { id: 'detail', label: '详细信息' },
] as const;

type TabId = (typeof tabs)[number]['id'];
type ParamKey = 'brand' | 'model' | 'spec' | 'color';

const activeTab = ref<TabId>('params');
const instance = getCurrentInstance();

const indicatorStyle = ref({
  transform: 'translateX(0px)',
  width: '0px',
});

const panelHeight = ref(0);

const tabPanelStyle = computed(() => {
  const style: Record<string, string> = {
    overflow: 'hidden',
  };

  if (panelHeight.value > 0) {
    style.height = `${panelHeight.value}px`;
    style.transition = `height ${TAB_PANEL_HEIGHT_DURATION_MS}ms ${SLIDE_OVER_EASING}`;
  }

  return style;
});

const measureTabPanelHeight = () => {
  if (!instance) return;

  nextTick(() => {
    uni.createSelectorQuery()
      .in(instance)
      .select('.tab-panel-body')
      .boundingClientRect()
      .exec((res) => {
        const rect = res?.[0] as { height?: number } | null;
        if (rect?.height !== undefined) {
          panelHeight.value = rect.height;
        }
      });
  });
};

const updateTabIndicator = () => {
  if (!instance) return;

  nextTick(() => {
    uni.createSelectorQuery()
      .in(instance)
      .select(`#tab-item-${activeTab.value}`)
      .boundingClientRect()
      .select('.tab-bar')
      .boundingClientRect()
      .exec((res) => {
        const tabRect = res?.[0] as { left?: number; width?: number } | null;
        const barRect = res?.[1] as { left?: number } | null;
        if (!tabRect?.width || barRect?.left === undefined || tabRect.left === undefined) return;

        indicatorStyle.value = {
          transform: `translateX(${tabRect.left - barRect.left}px)`,
          width: `${tabRect.width}px`,
        };
      });
  });
};

const switchTab = (id: TabId) => {
  if (activeTab.value === id) return;
  activeTab.value = id;
  updateTabIndicator();
};

onMounted(() => {
  updateTabIndicator();
  measureTabPanelHeight();
});

const paramGroups = computed(() => [
  {
    key: 'brand' as ParamKey,
    label: '品牌',
    options: [props.product.brand, 'H&M', 'Uniqlo', 'P&B'],
  },
  {
    key: 'model' as ParamKey,
    label: '型号',
    options: ['标准款', '修身款', '宽松款'],
  },
  {
    key: 'spec' as ParamKey,
    label: '规格',
    options: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    key: 'color' as ParamKey,
    label: '颜色',
    options: ['黑色', '驼色', '灰色', '藏青'],
  },
]);

const selectedParams = ref<Record<ParamKey, string>>({
  brand: '',
  model: '',
  spec: '',
  color: '',
});

watch(
  () => props.product.id,
  () => {
    selectedParams.value = {
      brand: props.product.brand,
      model: '标准款',
      spec: 'M',
      color: '驼色',
    };
  },
  { immediate: true },
);

const selectParam = (key: ParamKey, value: string) => {
  selectedParams.value[key] = value;
};

const detailItems = computed(() => [
  { label: '品牌', value: props.product.brand },
  { label: '材质', value: '羊毛混纺' },
  { label: '适用季节', value: '秋冬' },
  { label: '版型', value: '标准版型' },
  { label: '产地', value: '中国' },
]);

const emit = defineEmits<{
  back: [];
}>();

const currentImage = ref(0);
const quantity = ref(1);

const decreaseQty = () => {
  if (quantity.value > 1) {
    quantity.value -= 1;
  }
};

const increaseQty = () => {
  quantity.value += 1;
};

const onSwiperChange = (e: { detail: { current: number } }) => {
  currentImage.value = e.detail.current;
};

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
.product-detail {
  min-height: 100%;
  padding-bottom: 240rpx;
  box-sizing: border-box;
}

.detail-header-btn {
  position: absolute;
  top: 72rpx;
  z-index: 2;
}

.detail-header-btn-left {
  left: 40rpx;
}

.detail-header-btn-right {
  right: 40rpx;
}

.icon-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.icon-btn-hover {
  opacity: 0.85;
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
}

.hero-section {
  position: relative;
  padding: 0 24rpx;
  margin-bottom: 16rpx;
}

.hero-swiper {
  height: 880rpx;
  border-radius: 56rpx;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.hero-image-wrap {
  width: 100%;
  height: 100%;
  border-radius: 56rpx;
  overflow: hidden;
  background-color: #e5e7eb;
}

.hero-image {
  width: 100%;
  height: 100%;
  display: block;
}

.hero-dots {
  position: absolute;
  bottom: 80rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12rpx;
  z-index: 2;
}

.hero-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.45);
  transition: all 0.2s ease;
}

.hero-dot.active {
  width: 16rpx;
  height: 16rpx;
  background-color: #ffffff;
}

.hero-meta-bar {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 72%;
  z-index: 4;
  min-height: 132rpx;
  border-radius: 1998rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  padding: 20rpx 28rpx;
  box-sizing: border-box;
  box-shadow: 0 8rpx 32rpx rgba(22, 51, 0, 0.12);
}

.hero-meta-side-left {
  flex: 0 0 38%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.hero-meta-side-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 264rpx;
  padding: 0 12rpx;
  box-sizing: border-box;
}

.hero-meta-divider {
  width: 2rpx;
  height: 64rpx;
  background-color: rgba(22, 51, 0, 0.18);
  flex-shrink: 0;
  margin-left: -12rpx;
  margin-right: 8rpx;
}

.hero-rating-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.hero-rating-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.hero-rating-label {
  font-size: 22rpx;
  font-weight: 600;
  color: rgba(22, 51, 0, 0.55);
  line-height: 1;
  white-space: nowrap;
}

.hero-star {
  font-size: 36rpx;
  color: #fbbf24;
  line-height: 1;
}

.hero-rating-value {
  font-size: 36rpx;
  font-weight: 800;
  color: #163300;
  line-height: 1;
}

.hero-meta-price {
  font-size: 40rpx;
  font-weight: 800;
  color: #163300;
  line-height: 1.15;
  text-align: center;
  white-space: nowrap;
  max-width: 100%;
}

.info-section {
  position: relative;
  z-index: 2;
  padding: 84rpx 48rpx 0;
}

.product-title {
  display: block;
  font-size: 44rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 8rpx;
}

.detail-tabs {
  margin-top: 32rpx;
}

.tab-bar {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 56rpx;
  border-bottom: 2rpx solid #e5e7eb;
}

.tab-item {
  position: relative;
  padding-bottom: 24rpx;
  flex-shrink: 0;
}

.tab-label {
  font-size: 32rpx;
  font-weight: 500;
  color: #9ca3af;
  line-height: 1.3;
  transition: color 200ms ease, font-weight 200ms ease;
}

.tab-item.active .tab-label {
  font-weight: 800;
  color: #111827;
}

.tab-indicator-slider {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 6rpx;
  border-radius: 4rpx;
  background-color: #9fe870;
  transition: transform 320ms cubic-bezier(0.32, 0.72, 0, 1), width 320ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform, width;
}

.tab-panel {
  padding-top: 32rpx;
}

.tab-panel-body-wrap {
  overflow: hidden;
  will-change: height;
}

.param-list {
  display: flex;
  flex-direction: column;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding: 16rpx 0;
  border-bottom: 2rpx solid #f3f4f6;
}

.param-row:last-child {
  border-bottom: none;
}

.param-label {
  width: 80rpx;
  flex-shrink: 0;
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}

.param-options-scroll {
  flex: 1;
  width: 0;
  white-space: nowrap;
}

.param-options {
  display: inline-flex;
  align-items: center;
  gap: 20rpx;
}

.param-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 72rpx;
  padding: 0 36rpx;
  border-radius: 1998rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #f9fafb;
  box-sizing: border-box;
}

.param-chip.active {
  border-color: #B0D4C5;
  background-color: #B0D4C5;
}

.param-chip-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  line-height: 1;
}

.param-chip.active .param-chip-text {
  color: #ffffff;
  font-weight: 700;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32rpx;
}

.detail-label {
  font-size: 28rpx;
  color: #9ca3af;
  flex-shrink: 0;
}

.detail-value {
  font-size: 28rpx;
  color: #111827;
  font-weight: 600;
  text-align: right;
}

.detail-footer {
  position: fixed;
  left: 48rpx;
  right: 48rpx;
  bottom: calc(48rpx + env(safe-area-inset-bottom, 0px));
  z-index: 10;
  box-sizing: border-box;
}

.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  border-radius: 64rpx;
  padding: 16rpx 20rpx 16rpx 28rpx;
  min-height: 120rpx;
  box-sizing: border-box;
}

.qty-counter {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex-shrink: 0;
}

.qty-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn-text {
  font-size: 44rpx;
  line-height: 1;
  color: #9ca3af;
  font-weight: 400;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
  justify-content: flex-end;
  min-width: 0;
}

.cart-btn {
  height: 88rpx;
  padding: 0 32rpx;
  border-radius: 44rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cart-btn-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
}
</style>
