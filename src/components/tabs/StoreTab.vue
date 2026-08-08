<template>
  <view class="container page-safe-top">
    <!-- Header -->
    <view class="header">
      <text class="page-title">商店</text>
      <view class="header-actions">
        <view class="action-item cart-action" @click="openCart">
          <image src="/static/icons/shopping-cart.svg" mode="aspectFit" class="action-icon" />
          <view v-if="cartCount > 0" class="cart-badge">
            <text class="cart-badge-text">{{ cartBadgeText }}</text>
          </view>
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
        <view class="banner-glass frosted-glass" :style="bannerGlassStyle" />
        <image
          class="banner-image"
          src="/static/images/post2.png"
          mode="aspectFit"
        />
      </view>
    </view>

    <!-- Categories -->
    <view class="category-section">
      <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
        <view class="category-list">
          <view
            v-for="cat in categories"
            :key="cat.id"
            class="category-chip"
            :class="{ active: activeCategory === cat.id }"
            @click="selectCategory(cat.id)"
          >
            <text class="category-text">{{ cat.name }}</text>
          </view>
        </view>
      </scroll-view>

      <view class="subcategory-collapse" :class="{ 'is-expanded': showSubcategories }">
        <view class="subcategory-collapse-inner">
          <scroll-view scroll-x class="subcategory-scroll" :show-scrollbar="false">
            <view :key="activeCategory" class="subcategory-list">
              <view
                v-for="sub in activeSubcategories"
                :key="sub.id"
                class="subcategory-chip"
                :class="{ active: activeSubCategory === sub.id }"
                @click="selectSubCategory(sub.id)"
              >
                <text class="subcategory-text">{{ sub.name }}</text>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>

    <!-- Products -->
    <FadeTransition mode="out-in">
      <view :key="productListKey" class="product-section">
        <view id="store-section-header" class="section-header">
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

    <view
      class="sticky-header-actions frosted-glass frosted-glass--tabbar"
      :class="{ visible: stickyActionsVisible }"
      :style="stickyActionsGlassStyle"
    >
      <view class="sticky-action-item cart-action" @click="openCart">
        <image src="/static/icons/shopping-cart.svg" mode="aspectFit" class="action-icon" />
        <view v-if="cartCount > 0" class="cart-badge">
          <text class="cart-badge-text">{{ cartBadgeText }}</text>
        </view>
      </view>
      <view class="sticky-action-divider" />
      <view class="sticky-action-item" @click="openOrders">
        <image src="/static/icons/order.svg" mode="aspectFit" class="action-icon" />
      </view>
    </view>

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
import { ref, computed, watch, nextTick, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import ProductDetailContent, { type ProductDetail } from '@/components/ProductDetailContent.vue';
import CartContent from '@/components/CartContent.vue';
import OrderContent from '@/components/OrderContent.vue';
import StoreFilterModal, { type StoreFilterResult } from '@/components/StoreFilterModal.vue';
import FadeTransition from '@/components/FadeTransition.vue';
import { useSlideOver } from '@/composables/useSlideOver';
import { useMainTab } from '@/composables/useMainTab';
import { useCart } from '@/composables/useCart';
import { getFrostedGlassStyle } from '@/utils/frostedGlass';
import {
  storeProducts,
  annualRegions,
  getAnnualProductsByRegion,
  type AnnualRegionId,
} from '@/data/storeProducts';

const bannerGlassStyle = getFrostedGlassStyle('default');
const stickyActionsGlassStyle = getFrostedGlassStyle('tabbar');

const instance = getCurrentInstance();
const stickyActionsVisible = ref(false);
const STICKY_TRIGGER_TOP = 56;
let stickyScrollFrame = 0;

const updateStickyActionsVisibility = () => {
  if (!instance) return;

  uni.createSelectorQuery()
    .in(instance)
    .select('#store-section-header')
    .boundingClientRect((rect) => {
      const info = Array.isArray(rect) ? rect[0] : rect;
      if (!info || typeof info.top !== 'number') return;
      stickyActionsVisible.value = info.top <= STICKY_TRIGGER_TOP;
    })
    .exec();
};

const scheduleStickyActionsUpdate = () => {
  if (stickyScrollFrame) return;

  stickyScrollFrame = requestAnimationFrame(() => {
    stickyScrollFrame = 0;
    updateStickyActionsVisibility();
  });
};

onMounted(() => {
  nextTick(() => {
    updateStickyActionsVisibility();
  });
});

onUnmounted(() => {
  if (stickyScrollFrame) {
    cancelAnimationFrame(stickyScrollFrame);
    stickyScrollFrame = 0;
  }
});

defineExpose({
  updateStickyActionsVisibility,
  scheduleStickyActionsUpdate,
});

const { visible: detailVisible, open: openDetail, close: closeDetail } = useSlideOver();
const { visible: cartVisible, open: openCart, close: closeCart } = useSlideOver();
const { visible: ordersVisible, open: openOrders, close: closeOrders } = useSlideOver();
const { visible: filterVisible, open: openFilterModal, close: closeFilterModal } = useSlideOver();
const { activeTabPath } = useMainTab();
const { totalQuantity } = useCart();

// 筛选弹层 Teleport 到 body，离开商店 Tab 时必须关掉，避免盖在其他 Tab 上
watch(activeTabPath, (path) => {
  if (path !== 'pages/store/index' && filterVisible.value) {
    closeFilterModal();
  }
});
const selectedProduct = ref<ProductDetail | null>(null);

const cartCount = computed(() => totalQuantity.value);

const cartBadgeText = computed(() => {
  if (cartCount.value > 99) return '99+';
  return String(cartCount.value);
});

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

const activeCategory = ref('all');
const activeSubCategory = ref<string | null>(null);

type StoreSubCategory = {
  id: string;
  name: string;
};

type StoreCategory = {
  id: string;
  name: string;
  subcategories: StoreSubCategory[];
};

const categories: StoreCategory[] = [
  { id: 'all', name: '全部商品', subcategories: [] },
  {
    id: 'jacket',
    name: '夹克',
    subcategories: [
      { id: 'jacket-casual', name: '休闲夹克' },
      { id: 'jacket-denim', name: '牛仔夹克' },
      { id: 'jacket-leather', name: '皮夹克' },
      { id: 'jacket-wind', name: '防风夹克' },
    ],
  },
  {
    id: 'jumpers',
    name: '卫衣',
    subcategories: [
      { id: 'jumpers-hoodie', name: '连帽卫衣' },
      { id: 'jumpers-crew', name: '圆领卫衣' },
      { id: 'jumpers-zip', name: '拉链卫衣' },
      { id: 'jumpers-fleece', name: '抓绒卫衣' },
    ],
  },
  {
    id: 'shoes',
    name: '鞋靴',
    subcategories: [
      { id: 'shoes-sneaker', name: '运动鞋' },
      { id: 'shoes-boots', name: '靴子' },
      { id: 'shoes-loafers', name: '乐福鞋' },
      { id: 'shoes-sandals', name: '凉鞋' },
    ],
  },
  {
    id: 'jeans',
    name: '牛仔裤',
    subcategories: [
      { id: 'jeans-straight', name: '直筒' },
      { id: 'jeans-slim', name: '修身' },
      { id: 'jeans-wide', name: '阔腿' },
      { id: 'jeans-cropped', name: '九分' },
    ],
  },
  {
    id: 'accessories',
    name: '配饰',
    subcategories: [
      { id: 'accessories-bag', name: '包袋' },
      { id: 'accessories-belt', name: '腰带' },
      { id: 'accessories-hat', name: '帽子' },
      { id: 'accessories-scarf', name: '围巾' },
    ],
  },
];

const showSubcategories = computed(() => activeCategory.value !== 'all');

const activeSubcategories = computed(() => {
  const category = categories.find((item) => item.id === activeCategory.value);
  return category?.subcategories ?? [];
});

const selectCategory = (categoryId: string) => {
  activeCategory.value = categoryId;
  activeSubCategory.value = null;
};

const selectSubCategory = (subCategoryId: string) => {
  activeSubCategory.value = subCategoryId;
};

watch([showSubcategories, productListKey], () => {
  nextTick(() => {
    setTimeout(updateStickyActionsVisibility, 320);
  });
});
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

.cart-action {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: 4px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background-color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.cart-badge-text {
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
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

.sticky-header-actions {
  position: fixed;
  top: calc(max(env(safe-area-inset-top, 0px), 44px) + 12px);
  right: 24px;
  z-index: 900;
  display: flex;
  align-items: center;
  height: 44px;
  border-radius: 22px;
  box-sizing: border-box;
  transform: translate3d(calc(100% + 28px), 0, 0);
  opacity: 0;
  pointer-events: none;
  transition:
    transform 380ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 280ms ease;
  will-change: transform, opacity;
}

.sticky-header-actions.visible {
  transform: translate3d(0, 0, 0);
  opacity: 1;
  pointer-events: auto;
}

.sticky-action-item {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sticky-action-divider {
  width: 1px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.55);
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
  box-sizing: border-box;
}

.banner-glass {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.banner-image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
}

.category-section {
  margin-bottom: 28px;
}

.category-scroll {
  width: 100%;
  white-space: nowrap;
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
  transition: background-color 180ms ease;
}

.category-chip.active {
  background-color: #b0d4c5;
}

.category-text {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.category-chip.active .category-text {
  color: #ffffff;
  font-weight: 700;
}

.subcategory-collapse {
  height: 0;
  margin-top: 0;
  overflow: hidden;
  transition:
    height 280ms cubic-bezier(0.32, 0.72, 0, 1),
    margin-top 280ms cubic-bezier(0.32, 0.72, 0, 1);
}

.subcategory-collapse.is-expanded {
  height: 32px;
  margin-top: 12px;
}

.subcategory-collapse-inner {
  opacity: 0;
  transform: translate3d(0, -8px, 0);
  transition:
    opacity 220ms ease,
    transform 280ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform, opacity;
}

.subcategory-collapse.is-expanded .subcategory-collapse-inner {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.subcategory-scroll {
  height: 32px;
  width: 100%;
  white-space: nowrap;
}

.subcategory-list {
  display: inline-flex;
  gap: 8px;
  padding: 0 24px;
  animation: subcategory-swap 220ms cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes subcategory-swap {
  from {
    opacity: 0.72;
    transform: translate3d(0, 6px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.subcategory-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: background-color 180ms ease, box-shadow 180ms ease;
}

.subcategory-chip.active {
  background-color: #b0d4c5;
  box-shadow: inset 0 0 0 1px rgba(176, 212, 197, 0.85);
}

.subcategory-text {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
}

.subcategory-chip.active .subcategory-text {
  color: #ffffff;
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
