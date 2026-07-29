<template>
  <view class="cart-page">
    <view class="page-header">
      <view class="header-top-row">
        <view class="icon-btn" @click="handleBack">
          <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
        </view>
        <text class="header-title">购物车</text>
        <view class="icon-btn icon-btn--delete" :class="{ active: hasSelection }" @click="handleDeleteSelected">
          <image
            :src="hasSelection ? '/static/icons/trash-red.svg' : '/static/icons/trash.svg'"
            mode="aspectFit"
            class="header-icon"
          />
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

      <view class="checkout-bar" :class="{ 'actions-disabled': !hasSelection }">
        <view class="total-block">
          <text class="total-label">总计 (TOTAL)</text>
          <text class="total-value">¥ {{ orderAmount }}</text>
        </view>
        <view class="footer-actions">
          <view class="footer-btn" @click="handleConsult">
            <text class="footer-btn-text">咨询</text>
          </view>
          <view class="footer-btn" @click="handleCheckout">
            <text class="footer-btn-text">去结算 →</text>
          </view>
        </view>
      </view>
    </view>

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
import FlipQty from '@/components/FlipQty.vue';
import { FADE_DURATION_MS } from '@/utils/fadeTransition';

const emit = defineEmits<{
  back: [];
}>();

const { cartItems, increaseQty, decreaseQty, removeByKeys, toggleSelect } = useCart();
const removingKeys = ref<string[]>([]);
const isDeleting = ref(false);
const activeProductType = ref<CartProductType>('ordinary');
const { visible: consultFlowVisible, open: openConsultFlow, close: closeConsultFlow } = useSlideOver();
const consultStep = ref<'form' | 'success'>('form');

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
  uni.showToast({
    title: '结算功能开发中',
    icon: 'none',
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
  padding: 0 24px 16px;
  flex-shrink: 0;
}

.header-top-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  line-height: 44px;
  pointer-events: none;
}

.product-toggle {
  width: 156px;
  margin-top: 16px;
}

.toggle-track {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 4px;
  border-radius: 999px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
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
  font-size: 12px;
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
  min-height: 1px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.icon-btn.disabled {
  opacity: 0.4;
}

.icon-btn--delete:not(.active) {
  opacity: 0.4;
}

.icon-btn--delete.active {
  opacity: 1;
}

.header-icon {
  width: 20px;
  height: 20px;
}

.cart-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0 24px calc(20px + env(safe-area-inset-bottom, 0px));
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
  height: 20px;
  flex-shrink: 0;
}

.list-mask {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;
  height: 36px;
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

.cart-item-shell {
  margin-bottom: 14px;
  border-radius: 22px;
  transition:
    opacity 300ms ease,
    transform 300ms ease,
    max-height 300ms ease,
    margin-bottom 300ms ease;
  max-height: 140px;
  overflow: hidden;
}

.cart-item-shell--removing {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
  max-height: 0;
  margin-bottom: 0;
  pointer-events: none;
}

.cart-item-shell:last-child {
  margin-bottom: 8px;
}

.cart-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background-color: #ffffff;
  border-radius: 22px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.card-image-wrap {
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: 18px;
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
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border: 2px solid #d1d5db;
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
  width: 12px;
  height: 12px;
}

.card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.card-name {
  font-size: 15px;
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
  gap: 4px;
}

.meta-star {
  font-size: 12px;
  color: #fbbf24;
  line-height: 1;
}

.meta-text {
  font-size: 12px;
  color: #9ca3af;
}

.meta-dot {
  font-size: 12px;
  color: #d1d5db;
}

.card-price {
  font-size: 16px;
  font-weight: 800;
  color: #111827;
}

.qty-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding-right: 2px;
}

.qty-circle {
  width: 28px;
  height: 28px;
  border-radius: 14px;
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
  font-size: 16px;
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
  padding: 64px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  width: 40px;
  height: 40px;
  opacity: 0.35;
}

.empty-text {
  font-size: 14px;
  color: #9ca3af;
}

.checkout-bar {
  margin-top: 12px;
  min-height: 64px;
  border-radius: 999px;
  background-color: #9fe870;
  padding: 10px 10px 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(22, 51, 0, 0.12);
  flex-shrink: 0;
  box-sizing: border-box;
}

.checkout-bar.actions-disabled .footer-btn {
  opacity: 0.45;
}

.total-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.total-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(22, 51, 0, 0.55);
  line-height: 1.2;
}

.total-value {
  font-size: 22px;
  font-weight: 800;
  color: #163300;
  line-height: 1.1;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.footer-btn {
  height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  background-color: #163300;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-btn-text {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  line-height: 1;
}
</style>
