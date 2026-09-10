<template>
  <view class="map-picker">
    <view class="page-header">
      <view
        class="icon-btn"
        hover-class="icon-btn-hover"
        :hover-stay-time="80"
        @click.stop="handleBack"
      >
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
      <view class="search-bar">
        <image src="/static/icons/search.svg" mode="aspectFit" class="search-icon" />
        <input
          class="search-input"
          type="text"
          v-model="keyword"
          placeholder="输入小区/写字楼等"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="map-card">
      <MapScene
        :label="selectedPoi?.name ?? ''"
        :shift-x="selectedPoi?.shiftX ?? 0"
        :shift-y="selectedPoi?.shiftY ?? 0"
      />
      <view class="locate-btn" @click="resetToNearest">
        <view class="locate-ring" />
        <view class="locate-dot" />
      </view>
    </view>

    <view class="poi-card">
      <scroll-view class="poi-list" scroll-y>
        <view
          v-for="item in visiblePois"
          :key="item.id"
          class="poi-item"
          @click="selectPoi(item)"
        >
          <image
            :src="item.id === selectedId ? '/static/icons/map-pin-green.svg' : '/static/icons/map-pin-gray.svg'"
            mode="aspectFit"
            class="poi-icon"
          />
          <view class="poi-main">
            <text class="poi-name" :class="{ active: item.id === selectedId }">{{ item.name }}</text>
            <text class="poi-address">{{ item.address }}</text>
          </view>
          <text class="poi-distance">{{ item.distance }}</text>
        </view>

        <view v-if="visiblePois.length === 0" class="poi-empty">
          <text class="poi-empty-text">未找到相关地点</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import MapScene from '@/components/MapScene.vue';
import {
  getPoisByCity,
  resolveMapCity,
  type MapPoi,
} from '@/composables/useMapLocations';
import { usePageBack } from '@/composables/usePageBack';

const props = defineProps<{
  city?: string;
  selectedName?: string;
}>();

const emit = defineEmits<{
  back: [];
  select: [poi: MapPoi];
}>();

const keyword = ref('');
const activeCity = ref(resolveMapCity(props.city));
const selectedId = ref('');

const pois = computed(() => getPoisByCity(activeCity.value));

const visiblePois = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return pois.value;
  return pois.value.filter(
    (item) =>
      item.name.toLowerCase().includes(q) || item.address.toLowerCase().includes(q),
  );
});

const selectedPoi = computed(
  () => visiblePois.value.find((item) => item.id === selectedId.value) ?? visiblePois.value[0] ?? null,
);

const syncSelection = () => {
  const list = getPoisByCity(activeCity.value);
  const byName = props.selectedName
    ? list.find((item) => item.name === props.selectedName)
    : null;
  selectedId.value = (byName ?? list[0])?.id ?? '';
};

watch(
  () => [props.city, props.selectedName],
  () => {
    activeCity.value = resolveMapCity(props.city);
    syncSelection();
  },
  { immediate: true },
);

watch(visiblePois, (list) => {
  if (!list.some((item) => item.id === selectedId.value)) {
    selectedId.value = list[0]?.id ?? '';
  }
});

const handleBack = usePageBack(() => emit('back'));

const resetToNearest = () => {
  keyword.value = '';
  selectedId.value = pois.value[0]?.id ?? '';
};

const selectPoi = (item: MapPoi) => {
  selectedId.value = item.id;
  emit('select', item);
};
</script>

<style scoped>
.map-picker {
  height: 100%;
  min-height: 100%;
  padding-top: var(--page-safe-top);
  background-color: #f4f5f7;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}

.page-header {
  padding: 0 48rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
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

.icon-btn-hover {
  opacity: 0.85;
}

.header-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.search-bar {
  flex: 1;
  min-width: 0;
  height: 88rpx;
  background-color: #ffffff;
  border-radius: 1998rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.search-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #111827;
  height: 100%;
}

.search-placeholder {
  color: #9ca3af;
  font-size: 28rpx;
}

.map-card {
  position: relative;
  height: 42%;
  min-height: 420rpx;
  margin: 0 48rpx;
  border-radius: 40rpx;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #ececec;
}

.locate-btn {
  position: absolute;
  left: 24rpx;
  bottom: 24rpx;
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  background-color: #ffffff;
  box-shadow: 0 6rpx 16rpx rgba(15, 23, 42, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.locate-ring {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  border: 4rpx solid #4b5563;
}

.locate-dot {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background-color: #4b5563;
}

.poi-card {
  flex: 1;
  min-height: 0;
  margin: 24rpx 48rpx 40rpx;
  border-radius: 40rpx;
  overflow: hidden;
  background-color: #ffffff;
}

.poi-list {
  height: 100%;
}

.poi-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f3f4f6;
}

.poi-icon {
  width: 36rpx;
  height: 36rpx;
  margin-top: 4rpx;
  flex-shrink: 0;
}

.poi-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.poi-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
  line-height: 1.35;
}

.poi-name.active {
  color: #3d8c0f;
}

.poi-address {
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.poi-distance {
  flex-shrink: 0;
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.4;
  padding-top: 6rpx;
}

.poi-empty {
  padding: 80rpx 32rpx;
  display: flex;
  justify-content: center;
}

.poi-empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}
</style>
