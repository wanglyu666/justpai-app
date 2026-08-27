<template>
  <view class="project-list-page">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
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
          placeholder="搜索维保项目"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">维保项目管理</text>
          <text class="page-desc">查看全部维保项目信息</text>
        </view>
      </view>

      <StatusCapsuleSwitch
        class="status-capsule-wrap"
        v-model="activeStatus"
        :tabs="statusTabs"
        equal
      />

      <view class="ticket-list">
        <view
          v-for="item in filteredProjects"
          :key="item.id"
          class="ticket-card"
          @click="openDetail(item)"
        >
          <view class="card-heading-block">
            <text class="card-title">{{ item.name }}</text>
            <text class="card-code">{{ item.code }}</text>
          </view>

          <view class="info-row">
            <view class="info-field">
              <text class="info-label">项目负责人</text>
              <text class="info-value">{{ item.managerName }}</text>
            </view>
            <view class="info-field">
              <text class="info-label">联系方式</text>
              <text class="info-value">{{ formatPhone(item.managerPhone) }}</text>
            </view>
          </view>
        </view>

        <view v-if="filteredProjects.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关维保项目</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="detailVisible"
      :z-index="2200"
      @closed="resetDetail"
    >
      <view class="sheet-page" v-if="selectedItem">
        <view class="sheet-page__header">
          <view class="sheet-page__back-btn" @click="closeDetail">
            <image
              src="/static/icons/chevron-left.svg"
              mode="aspectFit"
              class="sheet-page__back-icon"
            />
          </view>
        </view>

        <view class="sheet-page__body">
          <text class="sheet-page__title">项目详情</text>

          <view class="info-card">
            <view class="card-heading-block">
              <text class="card-title">{{ selectedItem.name }}</text>
              <text class="card-code">{{ selectedItem.code }}</text>
            </view>

            <view class="info-row">
              <view class="info-field">
                <text class="info-label">项目负责人</text>
                <text class="info-value">{{ selectedItem.managerName }}</text>
              </view>
              <view class="info-field">
                <text class="info-label">联系方式</text>
                <text class="info-value">{{ formatPhone(selectedItem.managerPhone) }}</text>
              </view>
            </view>
          </view>

          <FileAttachmentCard :files="selectedItem.attachments" />
        </view>
      </view>
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';
import {
  useMaintenanceProjects,
  type MaintenanceProjectItem,
  type MaintenanceProjectStatus,
} from '@/composables/useMaintenanceProjects';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';

const props = withDefaults(
  defineProps<{
    initialStatus?: MaintenanceProjectStatus;
  }>(),
  {
    initialStatus: 'completed',
  },
);

const emit = defineEmits<{
  back: [];
}>();

const { projects } = useMaintenanceProjects();
const keyword = ref('');
const activeStatus = ref<MaintenanceProjectStatus>(props.initialStatus);
const selectedItem = ref<MaintenanceProjectItem | null>(null);
const {
  visible: detailVisible,
  open: openDetailPanel,
  close: closeDetail,
} = useSlideOver();
usePageBackWhen(detailVisible, closeDetail);

const statusTabs: { id: MaintenanceProjectStatus; label: string }[] = [
  { id: 'pending_start', label: '待开工' },
  { id: 'in_progress', label: '施工中' },
  { id: 'completed', label: '已完工' },
];

const filteredProjects = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  return projects.value.filter((item) => {
    if (item.status !== activeStatus.value) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.managerName.toLowerCase().includes(q) ||
      item.startDate.includes(q) ||
      item.endDate.includes(q)
    );
  });
});

const openDetail = (item: MaintenanceProjectItem) => {
  selectedItem.value = { ...item, attachments: [...item.attachments] };
  openDetailPanel();
};

const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  return phone;
};

const resetDetail = () => {
  selectedItem.value = null;
};

const handleBack = usePageBack(() => emit('back'));
</script>

<style scoped>
.project-list-page {
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

.search-bar {
  width: 336rpx;
  flex-shrink: 0;
  margin-left: auto;
  height: 88rpx;
  background-color: #ffffff;
  border-radius: 1998rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
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

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.ticket-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 36rpx;
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

.sheet-page__body {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.info-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 36rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
}

.card-heading-block {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.card-title {
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.card-code {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.info-row {
  display: flex;
  gap: 32rpx;
}

.info-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-field-full {
  flex: 1 1 100%;
}

.info-label {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.info-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
  word-break: break-all;
}
</style>
