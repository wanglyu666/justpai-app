<template>
  <view class="cart-page">
    <view class="page-header">
      <view class="header-top-row">
        <view class="icon-btn" @click="handleBack">
          <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
        </view>
        <text class="header-title">购物车</text>
        <view class="header-actions">
          <view
            class="icon-btn icon-btn--consult"
            :class="{ active: hasSelection }"
            @click="handleConsult"
          >
            <image src="/static/icons/message-circle.svg" mode="aspectFit" class="header-icon" />
          </view>
          <view class="icon-btn icon-btn--delete" :class="{ active: hasSelection }" @click="handleDeleteSelected">
            <image
              :src="hasSelection ? '/static/icons/trash-red.svg' : '/static/icons/trash.svg'"
              mode="aspectFit"
              class="header-icon"
            />
          </view>
        </view>
      </view>
      <view class="product-toggle">
        <view class="toggle-track">
          <view class="toggle-thumb" :class="{ right: activeProductType === 'annual' }" />
          <view
            class="toggle-item"
            :class="{ active: activeProductType === 'ordinary' }"
            @click="activeProductType = 'ordinary'"
          >
            <text class="toggle-text">普通产品</text>
          </view>
          <view
            class="toggle-item"
            :class="{ active: activeProductType === 'annual' }"
            @click="activeProductType = 'annual'"
          >
            <text class="toggle-text">年框产品</text>
          </view>
        </view>
      </view>
    </view>

    <view class="cart-body">
      <view class="list-wrap">
        <scroll-view scroll-y class="cart-list" :show-scrollbar="false">
          <view class="list-top-spacer" />
          <FadeTransition mode="out-in">
            <view :key="activeProductType" class="cart-list-group">
              <view
                v-for="item in visibleCartItems"
                :key="item.cartKey"
                class="cart-item-shell"
                :class="{ 'cart-item-shell--removing': removingKeys.includes(item.cartKey) }"
              >
            <view class="cart-card">
              <view
                class="select-circle"
                :class="{ selected: item.selected }"
                @click.stop="toggleSelect(item.cartKey)"
              >
                <image
                  v-if="item.selected"
                  src="/static/icons/check.svg"
                  mode="aspectFit"
                  class="select-check-icon"
                />
              </view>

              <view class="card-image-wrap">
                <image :src="item.image" mode="aspectFill" class="card-image" />
              </view>

              <view class="card-info">
                <text class="card-name">{{ item.name }}</text>
                <view class="card-meta">
                  <text class="meta-star">★</text>
                  <text class="meta-text">{{ item.rating.toFixed(1) }}</text>
                  <text class="meta-dot">·</text>
                  <text class="meta-text">{{ item.spec }}</text>
                </view>
                <text class="card-price">¥ {{ item.price }}</text>
              </view>

              <view class="qty-col">
                <view class="qty-circle qty-minus" @click.stop="decreaseQty(item.cartKey)">
                  <text class="qty-symbol">−</text>
                </view>
                <FlipQty :value="item.quantity" />
                <view class="qty-circle qty-plus" @click.stop="increaseQty(item.cartKey)">
                  <text class="qty-symbol">+</text>
                </view>
              </view>
            </view>
          </view>

              <view v-if="visibleCartItems.length === 0" class="empty-state">
                <image src="/static/icons/shopping-cart.svg" mode="aspectFit" class="empty-icon" />
                <text class="empty-text">{{ emptyText }}</text>
              </view>
            </view>
          </FadeTransition>
        </scroll-view>
        <view class="list-mask list-mask-top" />
        <view class="list-mask list-mask-bottom" />
      </view>

      <view class="cart-test-actions">
        <view class="test-btn" @click="handleTestPurchasePay">
          <text class="test-btn-text">产品采购单支付</text>
        </view>
        <view class="test-btn" @click="handleTestSignContract">
          <text class="test-btn-text">签署产品采购合同</text>
        </view>
      </view>

      <view class="checkout-bar" :class="{ 'actions-disabled': !hasSelection }">
        <view class="total-block">
          <text class="total-label">总计 (TOTAL)</text>
          <text class="total-value">¥ {{ orderAmount }}</text>
        </view>
        <view class="footer-actions">
          <view class="footer-btn" @click="handleCheckout">
            <text class="footer-btn-text">去结算 →</text>
          </view>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="checkoutFlowVisible"
      :z-index="1300"
      content-safe-top
      @closed="resetCheckoutFlow"
    >
      <CheckoutContent
        :items="checkoutItems"
        :order-amount="checkoutOrderAmount"
        :flow-mode="checkoutMode"
        @back="closeCheckoutFlow"
        @submit="handleCheckoutSubmit"
      />
    </BottomSheetPanel>

    <BottomSheetPanel :show="paymentFlowVisible" :z-index="1400" @closed="resetPaymentFlow">
      <PaymentSelectContent @confirm="handlePaymentConfirm" />
    </BottomSheetPanel>

    <BottomSheetPanel :show="consultFlowVisible" :z-index="1100" @closed="resetConsultFlow">
      <FadeTransition mode="out-in">
        <ConsultFormContent
          v-if="consultStep === 'form'"
          key="consult-form"
          @back="closeConsultFlow"
          @next="goConsultSuccessStep"
        />
        <ConsultSuccessContent
          v-else
          key="consult-success"
          @back="closeConsultFlow"
        />
      </FadeTransition>
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCart, type CartProductType } from '@/composables/useCart';
import { useSlideOver } from '@/composables/useSlideOver';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import FadeTransition from '@/components/FadeTransition.vue';
import ConsultFormContent from '@/components/ConsultFormContent.vue';
import ConsultSuccessContent from '@/components/ConsultSuccessContent.vue';
import CheckoutContent from '@/components/CheckoutContent.vue';
import PaymentSelectContent from '@/components/PaymentSelectContent.vue';
import FlipQty from '@/components/FlipQty.vue';
import { FADE_DURATION_MS } from '@/utils/fadeTransition';

const emit = defineEmits<{
  back: [];
}>();

const { cartItems, increaseQty, decreaseQty, removeByKeys, toggleSelect } = useCart();
const removingKeys = ref<string[]>([]);
const isDeleting = ref(false);
const activeProductType = ref<CartProductType>('ordinary');
const checkoutMode = ref<'payment' | 'contract' | 'purchase-pay'>('payment');
const { visible: consultFlowVisible, open: openConsultFlow, close: closeConsultFlow } = useSlideOver();
const consultStep = ref<'form' | 'success'>('form');
const { visible: checkoutFlowVisible, open: openCheckoutFlow, close: closeCheckoutFlow } = useSlideOver();
const { visible: paymentFlowVisible, open: openPaymentFlow, close: closePaymentFlow } = useSlideOver();

const goConsultSuccessStep = () => {
  consultStep.value = 'success';
};

const resetConsultFlow = () => {
  consultStep.value = 'form';
};

const visibleCartItems = computed(() =>
  cartItems.value.filter((item) => item.productType === activeProductType.value),
);

const emptyText = computed(() =>
  activeProductType.value === 'ordinary' ? '暂无普通产品' : '暂无年框产品',
);

const orderAmount = computed(() => {
  const total = visibleCartItems.value.reduce(
    (sum, item) => {
      if (!item.selected) return sum;
      return sum + Number(item.price) * item.quantity;
    },
    0,
  );
  return total.toFixed(2);
});

const hasSelection = computed(() => visibleCartItems.value.some((item) => item.selected));

const handleBack = () => {
  emit('back');
};

const handleDeleteSelected = async () => {
  if (!hasSelection.value || isDeleting.value) return;

  const keys = visibleCartItems.value
    .filter((item) => item.selected)
    .map((item) => item.cartKey);

  isDeleting.value = true;
  removingKeys.value = keys;

  await new Promise((resolve) => setTimeout(resolve, FADE_DURATION_MS));

  removeByKeys(keys);
  removingKeys.value = [];
  isDeleting.value = false;
};

const handleConsult = () => {
  if (!hasSelection.value) return;
  openConsultFlow();
};

const handleCheckout = () => {
  if (!hasSelection.value) return;
  checkoutMode.value = 'payment';
  openCheckoutFlow();
};

const handleTestPurchasePay = () => {
  if (!hasSelection.value) return;
  checkoutMode.value = 'purchase-pay';
  openCheckoutFlow();
};

const handleTestSignContract = () => {
  if (!hasSelection.value) return;
  checkoutMode.value = 'contract';
  openCheckoutFlow();
};

const checkoutItems = computed(() =>
  visibleCartItems.value.filter((item) => item.selected),
);

const checkoutOrderAmount = computed(() => orderAmount.value);

const resetCheckoutFlow = () => {
  checkoutMode.value = 'payment';
};

const resetPaymentFlow = () => {
  // no-op, panel will unmount after close
};

const handleCheckoutSubmit = () => {
  if (checkoutMode.value === 'contract' || checkoutMode.value === 'purchase-pay') {
    closeCheckoutFlow();
    uni.showToast({
      title: '提交成功',
      icon: 'success',
    });
    return;
  }

  openPaymentFlow();
};

const handlePaymentConfirm = () => {
  closePaymentFlow();
  closeCheckoutFlow();
  uni.showToast({
    title: '订单已提交',
    icon: 'success',
  });
};
</script>

<style scoped>
.cart-page {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.page-header {
  padding: 0 48rpx 32rpx;
  flex-shrink: 0;
}

.header-top-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 88rpx;
  pointer-events: none;
}

.product-toggle {
  width: 312rpx;
  margin-top: 32rpx;
}

.toggle-track {
  position: relative;
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 8rpx;
  border-radius: 1998rpx;
  background-color: #ffffff;
  box-shadow: 0 4rpx 16rpx rgba(15, 23, 42, 0.06);
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
  font-size: 24rpx;
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

.cart-list-group {
  min-height: 2rpx;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
}

.icon-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.icon-btn.disabled {
  opacity: 0.4;
}

.icon-btn--consult:not(.active),
.icon-btn--delete:not(.active) {
  opacity: 0.4;
}

.icon-btn--consult.active,
.icon-btn--delete.active {
  opacity: 1;
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
}

.cart-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0 48rpx calc(40rpx + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.list-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.cart-list {
  height: 100%;
  box-sizing: border-box;
}

.list-top-spacer {
  height: 40rpx;
  flex-shrink: 0;
}

.list-mask {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;
  height: 72rpx;
  pointer-events: none;
}

.list-mask-top {
  top: 0;
  background: linear-gradient(
    to bottom,
    #f4f5f7 0%,
    rgba(244, 245, 247, 0.85) 35%,
    rgba(244, 245, 247, 0.35) 70%,
    rgba(244, 245, 247, 0) 100%
  );
}

.list-mask-bottom {
  bottom: 0;
  background: linear-gradient(
    to top,
    #f4f5f7 0%,
    rgba(244, 245, 247, 0.85) 35%,
    rgba(244, 245, 247, 0.35) 70%,
    rgba(244, 245, 247, 0) 100%
  );
}

.cart-test-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20rpx;
  padding: 16rpx 0 28rpx;
  flex-shrink: 0;
}

.test-btn {
  height: 80rpx;
  padding: 0 32rpx;
  border-radius: 40rpx;
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.test-btn-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #374151;
  line-height: 1;
  white-space: nowrap;
}

.cart-item-shell {
  margin-bottom: 28rpx;
  border-radius: 44rpx;
  transition:
    opacity 300ms ease,
    transform 300ms ease,
    max-height 300ms ease,
    margin-bottom 300ms ease;
  max-height: 280rpx;
  overflow: hidden;
}

.cart-item-shell--removing {
  opacity: 0;
  transform: translateY(-12rpx) scale(0.98);
  max-height: 0;
  margin-bottom: 0;
  pointer-events: none;
}

.cart-item-shell:last-child {
  margin-bottom: 16rpx;
}

.cart-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 44rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.card-image-wrap {
  position: relative;
  width: 176rpx;
  height: 176rpx;
  border-radius: 36rpx;
  overflow: hidden;
  background-color: #f3f4f6;
  flex-shrink: 0;
}

.card-image {
  width: 100%;
  height: 100%;
  display: block;
}

.select-circle {
  width: 44rpx;
  height: 44rpx;
  border-radius: 22rpx;
  border: 4rpx solid #d1d5db;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
}

.select-circle.selected {
  border-color: #9fe870;
  background-color: #9fe870;
}

.select-check-icon {
  width: 24rpx;
  height: 24rpx;
}

.card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12rpx;
}

.card-name {
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.meta-star {
  font-size: 24rpx;
  color: #fbbf24;
  line-height: 1;
}

.meta-text {
  font-size: 24rpx;
  color: #9ca3af;
}

.meta-dot {
  font-size: 24rpx;
  color: #d1d5db;
}

.card-price {
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
}

.qty-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
  padding-right: 4rpx;
}

.qty-circle {
  width: 56rpx;
  height: 56rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-minus {
  background-color: #f3f4f6;
}

.qty-plus {
  background-color: #111827;
}

.qty-symbol {
  font-size: 32rpx;
  line-height: 1;
  font-weight: 500;
}

.qty-minus .qty-symbol {
  color: #6b7280;
}

.qty-plus .qty-symbol {
  color: #ffffff;
}

.empty-state {
  padding: 128rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.empty-icon {
  width: 80rpx;
  height: 80rpx;
  opacity: 0.35;
}

.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}

.checkout-bar {
  margin-top: 24rpx;
  min-height: 128rpx;
  border-radius: 1998rpx;
  background-color: #9fe870;
  padding: 20rpx 20rpx 20rpx 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  box-shadow: 0 16rpx 48rpx rgba(22, 51, 0, 0.12);
  flex-shrink: 0;
  box-sizing: border-box;
}

.checkout-bar.actions-disabled .footer-btn {
  opacity: 0.45;
}

.total-block {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  min-width: 0;
}

.total-label {
  font-size: 22rpx;
  font-weight: 600;
  color: rgba(22, 51, 0, 0.55);
  line-height: 1.2;
}

.total-value {
  font-size: 44rpx;
  font-weight: 800;
  color: #163300;
  line-height: 1.1;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
}

.footer-btn {
  height: 88rpx;
  padding: 0 32rpx;
  border-radius: 1998rpx;
  background-color: #163300;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-btn-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  line-height: 1;
}
</style>
