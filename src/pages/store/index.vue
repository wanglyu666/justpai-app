<template>
  <view class="container page-safe-top">
    <!-- Header -->
    <view class="header">
      <text class="page-title">商店</text>
      <view class="header-actions">
        <view class="action-item" @click="openCart">
          <image src="/static/icons/shopping-cart.svg" mode="aspectFit" class="action-icon" />
        </view>
        <view class="action-divider"></view>
        <view class="action-item" @click="openOrders">
          <image src="/static/icons/order.svg" mode="aspectFit" class="action-icon" />
        </view>
      </view>
    </view>

    <!-- Search -->
    <view class="search-row">
      <view class="search-bar">
        <image src="/static/icons/search.svg" mode="aspectFit" class="search-icon" />
        <input
          class="search-input"
          type="text"
          placeholder="搜索商品"
          placeholder-class="search-placeholder"
        />
      </view>
      <view class="filter-btn" @click="openFilterModal">
        <image src="/static/icons/filter.svg" mode="aspectFit" class="filter-icon" />
      </view>
    </view>

    <!-- Promo Banner -->
    <view class="banner-wrap">
      <view class="banner-card">
        <view class="banner-content">
          <text class="banner-title">男士时尚系列</text>
          <text class="banner-subtitle">最高 60% 折扣</text>
        </view>
        <image
          class="banner-image"
          src="https://images.unsplash.com/photo-1490114538077-9a67f2532570?q=80&w=800&auto=format&fit=crop"
          mode="aspectFill"
        />
      </view>
    </view>

    <!-- Categories -->
    <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
      <view class="category-list">
        <view
          v-for="cat in categories"
          :key="cat.id"
          class="category-chip"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <text class="category-text">{{ cat.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- Products -->
    <FadeTransition mode="out-in">
      <view :key="productListKey" class="product-section">
        <view class="section-header">
          <text class="section-title">{{ sectionTitle }}</text>
        </view>

        <view class="product-grid">
          <view
            v-for="product in displayedProducts"
            :key="product.id"
            class="product-card"
            @click="openProductDetail(product)"
          >
            <view class="product-image-wrap">
              <image :src="product.image" mode="aspectFill" class="product-image" />
            </view>
            <view class="product-meta">
              <text class="product-price">¥ {{ product.price }}</text>
              <view class="wishlist-btn" @click.stop>
                <image src="/static/icons/heart-outline.svg" mode="aspectFit" class="heart-icon" />
              </view>
            </view>
            <text class="product-name">{{ product.name }}</text>
          </view>
        </view>
      </view>
    </FadeTransition>

    <CustomTabBar currentPath="pages/store/index" />

    <SlideOverPanel :show="detailVisible" edge-to-edge>
      <ProductDetailContent
        v-if="selectedProduct"
        :product="selectedProduct"
        @back="closeProductDetail"
      />
    </SlideOverPanel>

    <SlideOverPanel :show="cartVisible" :z-index="1100">
      <CartContent @back="closeCart" />
    </SlideOverPanel>

    <SlideOverPanel :show="ordersVisible" :z-index="1100">
      <OrderContent @back="closeOrders" />
    </SlideOverPanel>

    <StoreFilterModal
      :show="filterVisible"
      :product-type="displayProductType"
      :annual-region="displayAnnualRegion"
      @apply="handleFilterApply"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import CustomTabBar from '@/components/CustomTabBar.vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import ProductDetailContent, { type ProductDetail } from '@/components/ProductDetailContent.vue';
import CartContent from '@/components/CartContent.vue';
import OrderContent from '@/components/OrderContent.vue';
import StoreFilterModal, { type StoreFilterResult } from '@/components/StoreFilterModal.vue';
import FadeTransition from '@/components/FadeTransition.vue';
import { useSlideOver } from '@/composables/useSlideOver';
import {
  storeProducts,
  annualRegions,
  getAnnualProductsByRegion,
  type AnnualRegionId,
} from '@/data/storeProducts';

onShow(() => {
  uni.hideTabBar({ animation: false });
});

const { visible: detailVisible, open: openDetail, close: closeDetail } = useSlideOver();
const { visible: cartVisible, open: openCart, close: closeCart } = useSlideOver();
const { visible: ordersVisible, open: openOrders, close: closeOrders } = useSlideOver();
const { visible: filterVisible, open: openFilterModal, close: closeFilterModal } = useSlideOver();
const selectedProduct = ref<ProductDetail | null>(null);

const displayProductType = ref<'ordinary' | 'annual'>('ordinary');
const displayAnnualRegion = ref<AnnualRegionId>('north');

const displayedProducts = computed(() => {
  if (displayProductType.value === 'ordinary') {
    return storeProducts;
  }
  return getAnnualProductsByRegion(displayAnnualRegion.value);
});

const sectionTitle = computed(() => {
  if (displayProductType.value === 'ordinary') {
    return '普通商品';
  }
  const region = annualRegions.find((item) => item.id === displayAnnualRegion.value);
  return region ? `${region.name}商品` : '年框商品';
});

const productListKey = computed(
  () => `${displayProductType.value}-${displayAnnualRegion.value}`,
);

const handleFilterApply = (result: StoreFilterResult) => {
  displayProductType.value = result.productType;
  displayAnnualRegion.value = result.annualRegion;
  closeFilterModal();
};

const openProductDetail = (product: ProductDetail) => {
  selectedProduct.value = product;
  openDetail();
};

const closeProductDetail = () => {
  closeDetail();
};

const activeCategory = ref('jacket');

const categories = ref([
  { id: 'jacket', name: '夹克' },
  { id: 'jumpers', name: '卫衣' },
  { id: 'shoes', name: '鞋靴' },
  { id: 'jeans', name: '牛仔裤' },
  { id: 'accessories', name: '配饰' },
]);
</script>

<style scoped>
.header {
  padding: 0 24px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 28px;
  font-weight: 900;
  color: #111827;
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  align-items: center;
  height: 44px;
  border-radius: 22px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.action-item {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-divider {
  width: 1px;
  height: 20px;
  background-color: #e5e7eb;
}

.action-icon {
  width: 22px;
  height: 22px;
}

.search-row {
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.search-bar {
  flex: 1;
  height: 52px;
  background-color: #ffffff;
  border-radius: 999px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 15px;
  color: #111827;
  height: 100%;
}

.search-placeholder {
  color: #9ca3af;
  font-size: 15px;
}

.filter-btn {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.filter-icon {
  width: 22px;
  height: 22px;
}

.banner-wrap {
  padding: 0 24px;
  margin-bottom: 24px;
}

.banner-card {
  position: relative;
  height: 200px;
  border-radius: 24px;
  overflow: hidden;
  background-color: #1a1a1a;
}

.banner-content {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 55%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 24px;
  background: linear-gradient(90deg, #111827 0%, rgba(17, 24, 39, 0.85) 70%, transparent 100%);
}

.banner-title {
  display: block;
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.25;
  margin-bottom: 8px;
}

.banner-subtitle {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}

.banner-image {
  position: absolute;
  right: 0;
  top: 0;
  width: 55%;
  height: 100%;
}

.category-scroll {
  width: 100%;
  white-space: nowrap;
  margin-bottom: 28px;
}

.category-list {
  display: inline-flex;
  gap: 10px;
  padding: 0 24px;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 22px;
  border-radius: 999px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.category-chip.active {
  background-color: #9fe870;
}

.category-text {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.category-chip.active .category-text {
  color: #163300;
  font-weight: 700;
}

.section-header {
  padding: 0 24px;
  margin-bottom: 16px;
}

.product-section {
  min-height: 1px;
}

.section-title {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.product-grid {
  padding: 0 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.product-card {
  width: calc(50% - 8px);
  margin-bottom: 8px;
}

.product-image-wrap {
  width: 100%;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  background-color: #e5e7eb;
  margin-bottom: 10px;
}

.product-image {
  width: 100%;
  height: 100%;
  display: block;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.product-price {
  font-size: 16px;
  font-weight: 800;
  color: #111827;
}

.wishlist-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heart-icon {
  width: 18px;
  height: 18px;
}

.product-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
