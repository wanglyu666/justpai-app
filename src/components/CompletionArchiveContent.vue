<template>
  <view class="report-page">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">{{ t('construction.archiveTitle') }}</text>
          <text class="page-desc">{{ t('construction.archiveDescription') }}</text>
        </view>
      </view>

      <StatusCapsuleSwitch
        class="status-capsule-wrap"
        v-model="activeCategory"
        :tabs="tabs"
      />

      <FileAttachmentCard
        v-if="activeCategory === 'photos'"
        :title="t('construction.completionPhotos')"
        :files="photoFiles"
        :empty-text="t('construction.noCompletionPhotos')"
      />

      <view v-else class="report-list">
        <view v-for="item in visibleItems" :key="item.id" class="report-card">
          <view class="card-head">
            <view class="info-icon-wrap">
              <image :src="categoryIcon" mode="aspectFit" class="info-icon" />
            </view>
            <text class="card-title">{{ item.title }}</text>
          </view>
          <view class="card-foot">
            <view class="card-meta">
              <view class="meta-row">
                <image
                  src="/static/icons/calendar-gray.svg"
                  mode="aspectFit"
                  class="meta-icon"
                />
                <text class="meta-text">{{ item.date }}</text>
              </view>
              <view class="meta-row">
                <image
                  src="/static/icons/user.svg"
                  mode="aspectFit"
                  class="meta-icon"
                />
                <text class="meta-text">{{ tf('construction.owner', { name: item.owner }) }}</text>
              </view>
            </view>
            <view class="download-btn">
              <image
                src="/static/icons/download-gray.svg"
                mode="aspectFit"
                class="download-icon"
              />
            </view>
          </view>
        </view>

        <view v-if="visibleItems.length === 0" class="empty-tip">
          <text class="empty-tip-text">{{ t('construction.noData') }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';
import {
  COMPLETION_ARCHIVE_ICONS,
  useCompletionArchive,
  type CompletionArchiveCategory,
} from '@/composables/useCompletionArchive';
import { usePageBack } from '@/composables/usePageBack';
import { useLanguage } from '@/composables/useLanguage';

const emit = defineEmits<{
  back: [];
}>();

const { t, tf } = useLanguage();
const { tabs: rawTabs, getByCategory } = useCompletionArchive();
const activeCategory = ref<CompletionArchiveCategory>('photos');

const archiveTabKeys = {
  photos: 'construction.archivePhotos',
  records: 'construction.archiveAcceptance',
  documents: 'construction.archiveDocuments',
  materials: 'construction.archiveMaterials',
  handover: 'construction.archiveHandover',
} as const;
const tabs = computed(() =>
  rawTabs.map((tab) => ({ ...tab, label: t(archiveTabKeys[tab.id]) })),
);

const visibleItems = computed(() => getByCategory(activeCategory.value));
const photoFiles = computed(() =>
  getByCategory('photos').map((item) => `${item.title}.jpg`),
);
const categoryIcon = computed(
  () => COMPLETION_ARCHIVE_ICONS[activeCategory.value],
);

const handleBack = usePageBack(() => emit('back'));
</script>

<style scoped>
.report-page {
  min-height: 100%;
  padding-bottom: 80rpx;
  box-sizing: border-box;
}

.page-header {
  padding: 0 48rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
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

.header-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.content {
  padding: 64rpx 48rpx 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.title-block {
  flex: 1;
  min-width: 0;
}

.page-title {
  display: block;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.page-desc {
  display: block;
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.status-capsule-wrap {
  margin-bottom: 48rpx;
}

.report-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.report-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 36rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
}

.card-head {
  display: flex;
  align-items: center;
  gap: 20rpx;
  min-width: 0;
}

.info-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  background-color: rgba(37, 99, 235, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon {
  width: 40rpx;
  height: 40rpx;
  display: block;
}

.card-title {
  flex: 1;
  min-width: 0;
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.card-foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24rpx;
}

.card-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.meta-icon {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.meta-text {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.3;
}

.download-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.download-icon {
  width: 36rpx;
  height: 36rpx;
  display: block;
}

.empty-tip {
  padding: 96rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-tip-text {
  font-size: 28rpx;
  color: #9ca3af;
}
</style>
