<template>
  <view class="product-detail">
    <view class="hero-section">
      <view class="detail-header">
        <view
          class="icon-btn"
          hover-class="icon-btn-hover"
          :hover-stay-time="80"
          @click.stop="handleBack"
        >
          <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
        </view>
        <view
          class="icon-btn"
          hover-class="icon-btn-hover"
          :hover-stay-time="80"
          @click.stop="openConsultFlow"
        >
          <image src="/static/icons/message-circle.svg" mode="aspectFit" class="header-icon" />
        </view>
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
      <view class="hero-meta-bar frosted-glass" :style="headerGlassStyle">
        <view class="hero-meta-side hero-meta-side-left">
          <view class="hero-rating-block">
            <view class="hero-rating-row">
              <text class="hero-star">★</text>
              <text class="hero-rating-value">{{ product.rating.toFixed(1) }}</text>
            </view>
            <text class="hero-rating-label">{{ t('store.recommendation') }}</text>
          </view>
        </view>
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

      <view class="info-block">
        <view class="info-heading-wrap">
          <text class="info-heading">{{ t('store.productParameters') }}</text>
          <view class="info-heading-bar" />
        </view>
        <view class="param-list">
          <view v-for="group in paramGroups" :key="group.key" class="param-row">
            <text class="param-label">{{ group.label }}</text>
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
          </view>
        </view>
      </view>

      <view class="info-block">
        <view class="info-heading-wrap">
          <text class="info-heading">{{ t('store.details') }}</text>
          <view class="info-heading-bar" />
        </view>
        <view class="detail-list">
          <view v-for="item in detailItems" :key="item.label" class="detail-row">
            <text class="detail-label">{{ item.label }}</text>
            <text class="detail-value">{{ item.value }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="detail-footer">
      <view class="action-bar">
        <view class="qty-counter">
          <view class="qty-btn" @click="decreaseQty">
            <text class="qty-btn-text">−</text>
          </view>
          <FlipQty :value="quantity" size="lg" />
          <view class="qty-btn" @click="increaseQty">
            <text class="qty-btn-text">+</text>
          </view>
        </view>
        <view class="cart-btn" @click="openCartSuccessModal">
          <text class="cart-btn-text">{{ t('store.addToCart') }}</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="consultFlowVisible"
      content-safe-top
      @closed="resetConsultFlow"
    >
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
      :title="t('store.addedToCart')"
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
import { ref, computed, watch, onUnmounted } from 'vue';
import { getFrostedGlassStyle } from '@/utils/frostedGlass';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import ConsultFormContent from '@/components/ConsultFormContent.vue';
import ConsultSuccessContent from '@/components/ConsultSuccessContent.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import FrostedConfirmModal from '@/components/FrostedConfirmModal.vue';
import FlipQty from '@/components/FlipQty.vue';
import { useSlideOver } from '@/composables/useSlideOver';
import { useCart } from '@/composables/useCart';
import { usePageBack } from '@/composables/usePageBack';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useLanguage();

const headerGlassStyle = getFrostedGlassStyle('default');

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

type ParamKey = 'brand' | 'model' | 'spec' | 'color';

const paramGroups = computed(() => [
  {
    key: 'brand' as ParamKey,
    label: t('store.brand'),
    options: [props.product.brand, 'H&M', 'Uniqlo', 'P&B', 'Gap', 'Nike', 'Adidas', 'COS', 'Mango'],
  },
  {
    key: 'model' as ParamKey,
    label: t('store.model'),
    options: ['标准款', '修身款', '宽松款', '短款', '长款', '加厚款', '薄款'],
  },
  {
    key: 'spec' as ParamKey,
    label: t('store.specification'),
    options: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  },
  {
    key: 'color' as ParamKey,
    label: t('store.color'),
    options: ['黑色', '驼色', '灰色', '藏青', '白色', '米色', '棕色', '酒红', '卡其'],
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
  { label: t('store.brand'), value: props.product.brand },
  { label: t('store.material'), value: '羊毛混纺' },
  { label: t('store.season'), value: '秋冬' },
  { label: t('store.fit'), value: '标准版型' },
  { label: t('store.origin'), value: '中国' },
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

const handleBack = usePageBack(() => emit('back'));
</script>

<style scoped>
.product-detail {
  min-height: 100%;
  padding-bottom: 280rpx;
  box-sizing: border-box;
}

.detail-header {
  position: absolute;
  /* 与全局返回按钮对齐：page-safe-top + 左右 48rpx；扣掉 edge-to-edge 面板已有顶距 */
  top: calc(var(--page-safe-top) - 16rpx - env(safe-area-inset-top, 0px));
  left: 0;
  right: 0;
  z-index: 2;
  padding: 0 48rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  pointer-events: none;
}

.icon-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  pointer-events: auto;
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
  display: flex;
  align-items: stretch;
  gap: 12rpx;
  padding: 12rpx;
  box-sizing: border-box;
}

.hero-meta-side {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  background-color: #ffffff;
  border-radius: 1998rpx;
  padding: 16rpx 24rpx;
  box-sizing: border-box;
}

.hero-meta-side-left {
  flex: 0 0 38%;
}

.hero-meta-side-right {
  flex: 1;
  min-width: 264rpx;
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
  color: #111827;
  line-height: 1;
  white-space: nowrap;
}

.hero-star {
  font-size: 36rpx;
  color: #111827;
  line-height: 1;
}

.hero-rating-value {
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.hero-meta-price {
  font-size: 40rpx;
  font-weight: 800;
  color: #111827;
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

.info-block {
  margin-top: 40rpx;
}

.info-heading-wrap {
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.info-heading {
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}

.info-heading-bar {
  height: 6rpx;
  border-radius: 4rpx;
  background-color: #9fe870;
}

.param-list {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.param-row {
  display: flex;
  align-items: flex-start;
  gap: 32rpx;
}

.param-label {
  width: 80rpx;
  flex-shrink: 0;
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
  padding-top: 20rpx;
}

.param-options {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 16rpx;
  row-gap: 12rpx;
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
  border-width: 4rpx;
  border-color: #111827;
  background-color: #ffffff;
}

.param-chip-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  line-height: 1;
}

.param-chip.active .param-chip-text {
  color: #111827;
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
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  box-sizing: border-box;
}

.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32rpx;
  background-color: #ffffff;
  border-radius: 80rpx 80rpx 0 0;
  padding: 32rpx 40rpx calc(24rpx + env(safe-area-inset-bottom, 0px));
  min-height: 176rpx;
  box-sizing: border-box;
  box-shadow: 0 -16rpx 48rpx rgba(15, 23, 42, 0.1);
}

.qty-counter {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-shrink: 0;
}

.qty-btn {
  width: 56rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn-text {
  font-size: 40rpx;
  line-height: 1;
  color: #111827;
  font-weight: 400;
}

.cart-btn {
  height: 88rpx;
  padding: 0 48rpx;
  border-radius: 999rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cart-btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
}
</style>
