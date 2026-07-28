<template>
  <view class="container page-safe-top">
    <!-- Header -->
    <view class="header">
      <text class="page-title">商店</text>
      <view class="header-actions">
        <view class="action-item">
          <image src="/static/icons/shopping-cart.svg" mode="aspectFit" class="action-icon" />
        </view>
        <view class="action-divider"></view>
        <view class="action-item">
          <image src="/static/icons/heart-outline.svg" mode="aspectFit" class="action-icon" />
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
      <view class="filter-btn">
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
    <view class="section-header">
      <text class="section-title">普通商品</text>
    </view>

    <view class="product-grid">
      <view
        v-for="product in products"
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

    <CustomTabBar currentPath="pages/store/index" />

    <SlideOverPanel :show="detailVisible" edge-to-edge>
      <ProductDetailContent
        v-if="selectedProduct"
        :product="selectedProduct"
        @back="closeProductDetail"
      />
    </SlideOverPanel>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import CustomTabBar from '@/components/CustomTabBar.vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import ProductDetailContent, { type ProductDetail } from '@/components/ProductDetailContent.vue';
import { useSlideOver } from '@/composables/useSlideOver';

onShow(() => {
  uni.hideTabBar({ animation: false });
});

const { visible: detailVisible, open: openDetail, close: closeDetail } = useSlideOver();
const selectedProduct = ref<ProductDetail | null>(null);

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

const products = ref<ProductDetail[]>([
  {
    id: 1,
    name: 'Pull & Bear 男士都市秋季系列',
    price: '189.00',
    image: 'https://images.unsplash.com/photo-1551028711-00167b16eac5?q=80&w=600&auto=format&fit=crop',
    brand: 'P&B',
    brandShort: 'P&B',
    brandHandle: '@pull&bearofficial',
    rating: 4.8,
    description: '可调节抽绳设计的 Kandinsky 风格许可夹克，罗纹袖口与下摆，搭配对比色图形细节，适合都市日常穿搭。',
    images: [
      'https://images.unsplash.com/photo-1551028711-00167b16eac5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490114538077-9a67f2532570?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93b0?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 2,
    name: 'Zara 经典羊毛大衣系列',
    price: '299.00',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=600&auto=format&fit=crop',
    brand: 'Zara',
    brandShort: 'ZR',
    brandHandle: '@zaraofficial',
    rating: 4.6,
    description: '经典剪裁羊毛混纺大衣，挺括肩线与简约翻领设计，兼顾保暖与商务休闲场景。',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036492-050f511a5b82?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 3,
    name: 'Uniqlo 轻薄羽绒外套',
    price: '399.00',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop',
    brand: 'Uniqlo',
    brandShort: 'UQ',
    brandHandle: '@uniqlo',
    rating: 4.7,
    description: '超轻量羽绒填充，便携收纳设计，防风面料与简洁外观，适合换季与旅行穿着。',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551028711-00167b16eac5?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 4,
    name: 'H&M 复古牛仔夹克',
    price: '159.00',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93b0?q=80&w=600&auto=format&fit=crop',
    brand: 'H&M',
    brandShort: 'HM',
    brandHandle: '@hm',
    rating: 4.5,
    description: '复古水洗牛仔面料，经典版型与金属纽扣细节，轻松搭配 T 恤或卫衣打造休闲造型。',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93b0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490114538077-9a67f2532570?q=80&w=800&auto=format&fit=crop',
    ],
  },
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
