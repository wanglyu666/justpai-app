<template>
  <view class="tab-root">
    <scroll-view
      scroll-y
      :show-scrollbar="false"
      class="container store-scroll"
      :class="{ 'is-searching': searchMode }"
      @scroll="handleStoreScroll"
    >
    <view class="store-safe-top-spacer" />
    <!-- Header -->
    <view class="header">
      <view
        class="search-back"
        :class="{ visible: searchMode }"
        hover-class="search-back-hover"
        :hover-stay-time="80"
        @click="closeSearch"
      >
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
      </view>
      <text class="page-title store-fade" :class="{ hidden: searchMode }">商店</text>
      <view class="header-actions store-fade" :class="{ hidden: searchMode }">
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
    <view class="search-row" :class="{ 'is-expanded': searchMode }">
      <view class="search-bar" @click="openSearch">
        <image src="/static/icons/search.svg" mode="aspectFit" class="search-icon" />
        <input
          class="search-input"
          type="text"
          v-model="searchQuery"
          :focus="searchFocus"
          confirm-type="search"
          placeholder="搜索商品"
          placeholder-class="search-placeholder"
          @focus="openSearch"
          @confirm="onSearchConfirm"
        />
      </view>
      <view class="filter-btn" @click="openFilterModal">
        <image src="/static/icons/filter.svg" mode="aspectFit" class="filter-icon" />
      </view>
    </view>

    <view class="search-panel" :class="{ visible: searchMode }">
      <view v-if="showSearchHistory" class="search-history">
        <text class="search-panel-heading">历史搜索</text>
        <view
          v-for="item in searchHistory"
          :key="item"
          class="search-history-row"
          hover-class="search-row-hover"
          :hover-stay-time="80"
          @click="applyHistory(item)"
        >
          <image src="/static/icons/search.svg" mode="aspectFit" class="search-history-icon" />
          <text class="search-history-text">{{ item }}</text>
        </view>
      </view>

      <view v-else-if="hasSearchQuery" class="search-results">
        <view
          v-for="product in searchResults"
          :key="product.id"
          class="search-result-row"
          hover-class="search-row-hover"
          :hover-stay-time="80"
          @click="openFromSearch(product)"
        >
          <image :src="product.image" mode="aspectFill" class="search-result-image" />
          <view class="search-result-info">
            <text class="search-result-name">{{ product.name }}</text>
            <text class="search-result-price">¥ {{ product.price }}</text>
          </view>
        </view>
        <view v-if="searchResults.length === 0" class="search-empty">
          <text class="search-empty-text">未找到相关商品</text>
        </view>
      </view>
    </view>

    <view class="store-body store-fade" :class="{ hidden: searchMode }">
    <!-- Promo Banner -->
    <view class="banner-wrap">
      <view class="banner-card">
        <image
          class="banner-image"
          src="/static/images/post2.png?v=2"
          mode="aspectFit"
        />
      </view>
    </view>

    <!-- Categories -->
    <view class="category-section">
      <scroll-view
        scroll-x
        class="category-scroll"
        :style="categoryScrollStyle"
        :show-scrollbar="false"
      >
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
        <view v-if="showSubcategories" class="subcategory-collapse-inner">
          <scroll-view
            scroll-x
            class="subcategory-scroll"
            :style="subcategoryScrollStyle"
            :show-scrollbar="false"
          >
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
            <text class="product-name">{{ product.name }}</text>
            <text class="product-price">¥ {{ product.price }}</text>
          </view>
        </view>
      </view>
    </FadeTransition>
    </view>

    <view class="store-bottom-spacer" />

    </scroll-view>

    <view
      class="sticky-header-actions frosted-glass frosted-glass--tabbar store-fade"
      :class="{ visible: stickyActionsVisible && !searchMode, hidden: searchMode }"
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

    <SlideOverPanel :show="cartVisible">
      <CartContent @back="closeCart" />
    </SlideOverPanel>

    <SlideOverPanel :show="ordersVisible">
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
import { usePageBackWhen } from '@/composables/usePageBack';
import { useStoreSearchHistory } from '@/composables/useStoreSearchHistory';
import { storeSearchActive } from '@/composables/useStoreSearchMode';
import { getFrostedGlassStyle } from '@/utils/frostedGlass';
import { rpx2px } from '@/utils/rpx';
import {
  storeProducts,
  annualProducts,
  annualRegions,
  getAnnualProductsByRegion,
  type AnnualRegionId,
} from '@/data/storeProducts';

const stickyActionsGlassStyle = getFrostedGlassStyle('tabbar');
const categoryScrollStyle = {
  width: '100%',
  height: '80rpx',
};
const subcategoryScrollStyle = {
  width: '100%',
  height: '64rpx',
};

const instance = getCurrentInstance();
const stickyActionsVisible = ref(false);
let storeScrollTop = 0;
let stickyActionsThreshold: number | null = null;
let stickyMeasureTimer: ReturnType<typeof setTimeout> | null = null;

const applyStickyActionsVisibility = () => {
  if (searchMode.value) {
    stickyActionsVisible.value = false;
    return;
  }
  if (stickyActionsThreshold === null) return;
  stickyActionsVisible.value = storeScrollTop >= stickyActionsThreshold;
};

const updateStickyActionsVisibility = (attempt = 0) => {
  if (!instance) return;
  if (stickyMeasureTimer) {
    clearTimeout(stickyMeasureTimer);
    stickyMeasureTimer = null;
  }

  uni.createSelectorQuery()
    .in(instance)
    .select('.store-scroll')
    .boundingClientRect()
    .select('#store-section-header')
    .boundingClientRect()
    .exec((result) => {
      const viewport = result?.[0] as { top?: number } | null;
      const header = result?.[1] as { top?: number } | null;
      if (
        typeof viewport?.top !== 'number' ||
        typeof header?.top !== 'number'
      ) {
        if (attempt < 4) {
          stickyMeasureTimer = setTimeout(
            () => updateStickyActionsVisibility(attempt + 1),
            64,
          );
        }
        return;
      }
      stickyActionsThreshold =
        storeScrollTop + header.top - viewport.top - rpx2px(112);
      applyStickyActionsVisibility();
    });
};

const handleStoreScroll = (event: unknown) => {
  const detail = (event as { detail?: { scrollTop?: number } })?.detail;
  storeScrollTop = Number(detail?.scrollTop ?? 0);
  if (stickyActionsThreshold === null) updateStickyActionsVisibility();
  applyStickyActionsVisibility();
};

onMounted(() => {
  nextTick(() => {
    updateStickyActionsVisibility();
  });
});

onUnmounted(() => {
  storeSearchActive.value = false;
  if (stickyMeasureTimer) clearTimeout(stickyMeasureTimer);
});

defineExpose({
  updateStickyActionsVisibility,
});

const { visible: detailVisible, open: openDetail, close: closeDetail } = useSlideOver();
const { visible: cartVisible, open: openCart, close: closeCart } = useSlideOver();
const { visible: ordersVisible, open: openOrders, close: closeOrders } = useSlideOver();
const { visible: filterVisible, open: openFilterModal, close: closeFilterModal } = useSlideOver();
const { activeTabPath } = useMainTab();
const { totalQuantity } = useCart();
const { history: searchHistory, remember: rememberSearch } = useStoreSearchHistory();

const searchMode = ref(false);
const searchFocus = ref(false);
const searchQuery = ref('');

const hasSearchQuery = computed(() => searchQuery.value.trim().length > 0);
const showSearchHistory = computed(
  () => searchMode.value && !hasSearchQuery.value && searchHistory.value.length > 0,
);

const searchableProducts = computed(() => [...storeProducts, ...annualProducts]);

const searchResults = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return [];
  return searchableProducts.value.filter((product) => {
    return (
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });
});

const openSearch = () => {
  if (searchMode.value) {
    searchFocus.value = true;
    return;
  }
  searchMode.value = true;
  storeSearchActive.value = true;
  stickyActionsVisible.value = false;
  nextTick(() => {
    searchFocus.value = true;
  });
};

const closeSearch = () => {
  if (!searchMode.value) return;
  searchMode.value = false;
  storeSearchActive.value = false;
  searchFocus.value = false;
  searchQuery.value = '';
  nextTick(() => updateStickyActionsVisibility());
};

const applyHistory = (keyword: string) => {
  searchQuery.value = keyword;
  searchFocus.value = true;
};

const onSearchConfirm = () => {
  rememberSearch(searchQuery.value);
};

usePageBackWhen(searchMode, closeSearch);

// 筛选弹层 Teleport 到 body，离开商店 Tab 时必须关掉，避免盖在其他 Tab 上
watch(activeTabPath, (path) => {
  if (path !== 'pages/store/index') {
    if (filterVisible.value) closeFilterModal();
    if (searchMode.value) closeSearch();
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

const openFromSearch = (product: ProductDetail) => {
  rememberSearch(searchQuery.value || product.name);
  openProductDetail(product);
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
.tab-root {
  height: 100%;
}

.container.store-scroll {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0;
  box-sizing: border-box;
}

.store-safe-top-spacer {
  height: var(--page-safe-top);
}

.store-bottom-spacer {
  height: 240rpx;
}

.header {
  position: relative;
  padding: 0 48rpx 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 88rpx;
  box-sizing: content-box;
}

.search-back {
  position: absolute;
  left: 48rpx;
  top: 0;
  z-index: 2;
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms cubic-bezier(0.4, 0, 0.2, 1);
}

.search-back.visible {
  opacity: 1;
  pointer-events: auto;
}

.search-back-hover {
  opacity: 0.85;
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
}

.store-fade {
  transition: opacity 160ms cubic-bezier(0.4, 0, 0.2, 1);
}

.store-fade.hidden {
  opacity: 0;
  pointer-events: none;
}

.store-body.hidden {
  height: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.page-title {
  font-size: 56rpx;
  font-weight: 900;
  color: #111827;
  letter-spacing: -1rpx;
}

.header-actions {
  display: flex;
  align-items: center;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}

.action-item {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-action {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: 8rpx;
  right: 4rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  border-radius: 1998rpx;
  background-color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.cart-badge-text {
  font-size: 20rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.action-divider {
  width: 2rpx;
  height: 40rpx;
  background-color: #e5e7eb;
}

.action-icon {
  width: 44rpx;
  height: 44rpx;
}

.sticky-header-actions {
  position: fixed;
  top: calc(max(env(safe-area-inset-top, 0px), 88rpx) + 24rpx);
  right: 48rpx;
  z-index: 900;
  display: flex;
  align-items: center;
  height: 88rpx;
  border-radius: 44rpx;
  box-sizing: border-box;
  transform: translate3d(calc(100% + 56rpx), 0, 0);
  opacity: 0;
  /* App 端 pointer-events 父子配合不可靠；藏到屏外即可 */
  visibility: hidden;
  transition:
    transform 380ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 280ms ease,
    visibility 0ms linear 380ms;
  will-change: transform, opacity;
}

.sticky-header-actions.visible {
  transform: translate3d(0, 0, 0);
  opacity: 1;
  visibility: visible;
  transition:
    transform 380ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 280ms ease,
    visibility 0ms;
}

.sticky-action-item {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sticky-action-divider {
  width: 2rpx;
  height: 40rpx;
  background-color: rgba(255, 255, 255, 0.55);
}

.search-row {
  padding: 0 48rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 48rpx;
  transition: gap 320ms cubic-bezier(0.32, 0.72, 0, 1);
}

.search-row.is-expanded {
  gap: 0;
}

.search-bar {
  flex: 1;
  min-width: 0;
  height: 104rpx;
  background-color: #ffffff;
  border-radius: 1998rpx;
  display: flex;
  align-items: center;
  padding: 0 36rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.search-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 30rpx;
  color: #111827;
  height: 100%;
}

.search-placeholder {
  color: #9ca3af;
  font-size: 30rpx;
}

.filter-btn {
  width: 104rpx;
  height: 104rpx;
  border-radius: 32rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  transition:
    width 320ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 200ms cubic-bezier(0.4, 0, 0.2, 1),
    margin 320ms cubic-bezier(0.32, 0.72, 0, 1);
}

.search-row.is-expanded .filter-btn {
  width: 0;
  opacity: 0;
  margin: 0;
  pointer-events: none;
}

.search-panel {
  padding: 0;
  box-sizing: border-box;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition:
    opacity 160ms cubic-bezier(0.4, 0, 0.2, 1),
    visibility 0ms linear 160ms;
}

.search-panel.visible {
  padding: 0 48rpx 80rpx;
  max-height: none;
  overflow: visible;
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  transition:
    opacity 160ms cubic-bezier(0.4, 0, 0.2, 1),
    visibility 0ms linear 0ms;
}

.search-panel-heading {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 8rpx;
}

.search-history-row,
.search-result-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 8rpx;
}

.search-row-hover {
  opacity: 0.72;
}

.search-history-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
  opacity: 0.45;
}

.search-history-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
}

.search-result-image {
  width: 96rpx;
  height: 96rpx;
  border-radius: 20rpx;
  background-color: #e5e7eb;
  flex-shrink: 0;
}

.search-result-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.search-result-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-result-price {
  font-size: 26rpx;
  font-weight: 700;
  color: #6b7280;
}

.search-empty {
  padding: 80rpx 0;
  display: flex;
  justify-content: center;
}

.search-empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}

.filter-icon {
  width: 44rpx;
  height: 44rpx;
}

.banner-wrap {
  padding: 0 48rpx;
  margin-bottom: 48rpx;
}

.banner-card {
  position: relative;
  height: 400rpx;
  border-radius: 48rpx;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #ffffff;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.banner-image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
}

.category-section {
  margin-bottom: 56rpx;
}

.category-scroll {
  width: 100%;
  white-space: nowrap;
}

.category-list {
  display: inline-flex;
  gap: 20rpx;
  padding: 0 48rpx;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  padding: 0 44rpx;
  border-radius: 1998rpx;
  background-color: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
  transition: background-color 180ms ease;
}

.category-chip.active {
  background-color: #111827;
}

.category-text {
  font-size: 28rpx;
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
  height: 64rpx;
  margin-top: 24rpx;
}

.subcategory-collapse-inner {
  opacity: 0;
  transform: translate3d(0, -16rpx, 0);
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
  height: 64rpx;
  width: 100%;
  white-space: nowrap;
}

.subcategory-list {
  display: inline-flex;
  gap: 16rpx;
  padding: 0 48rpx;
  animation: subcategory-swap 220ms cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes subcategory-swap {
  from {
    opacity: 0.72;
    transform: translate3d(0, 12rpx, 0);
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
  height: 64rpx;
  padding: 0 28rpx;
  border-radius: 1998rpx;
  background-color: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  transition: background-color 180ms ease, box-shadow 180ms ease;
}

.subcategory-chip.active {
  background-color: #111827;
  box-shadow: none;
}

.subcategory-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
}

.subcategory-chip.active .subcategory-text {
  color: #ffffff;
  font-weight: 700;
}

.section-header {
  padding: 0 48rpx;
  margin-bottom: 32rpx;
}

.product-section {
  min-height: 2rpx;
  animation: product-section-in 300ms ease;
}

@keyframes product-section-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.section-title {
  font-size: 40rpx;
  font-weight: 800;
  color: #111827;
}

.product-grid {
  padding: 0 48rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 32rpx;
}

.product-card {
  width: calc(50% - 16rpx);
  margin-bottom: 16rpx;
}

.product-image-wrap {
  width: 100%;
  height: 400rpx;
  border-radius: 40rpx;
  overflow: hidden;
  background-color: #e5e7eb;
  margin-bottom: 20rpx;
}

.product-image {
  width: 100%;
  height: 100%;
  display: block;
}

.product-name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
  margin-bottom: 8rpx;
}

.product-price {
  display: block;
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
}
</style>
