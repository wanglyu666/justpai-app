<template>
  <view class="feedback-list-page">
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
          placeholder="搜索反馈"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">意见反馈</text>
          <text class="page-desc">查看全部意见反馈</text>
        </view>
        <view class="add-btn" @click="onAdd">
          <text class="add-btn-text">新增</text>
        </view>
      </view>

      <view class="feedback-list">
        <view
          v-for="item in filteredItems"
          :key="item.id"
          class="feedback-card"
        >
          <view class="feedback-top">
            <text class="feedback-name">{{ item.name }}</text>
            <view class="status-badge" :class="`status-${item.status}`">
              <text class="status-badge-text">{{ statusLabel(item.status) }}</text>
            </view>
          </view>

          <view class="feedback-field">
            <text class="field-label">反馈时间</text>
            <text class="field-value">{{ item.time }}</text>
          </view>
        </view>

        <view v-if="filteredItems.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关反馈</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type FeedbackStatus = 'pending_reply' | 'in_progress' | 'closed';

type FeedbackItem = {
  id: number;
  name: string;
  time: string;
  status: FeedbackStatus;
};

const STATUS_LABEL: Record<FeedbackStatus, string> = {
  pending_reply: '待回复',
  in_progress: '进行中',
  closed: '已结束',
};

const emit = defineEmits<{
  back: [];
}>();

const keyword = ref('');

const items = ref<FeedbackItem[]>([
  {
    id: 1,
    name: '门店空调系统选型咨询',
    time: '2026-03-28 14:20',
    status: 'pending_reply',
  },
  {
    id: 2,
    name: '办公楼暖通方案咨询',
    time: '2026-03-26 10:05',
    status: 'pending_reply',
  },
  {
    id: 3,
    name: '机房精密空调改造咨询',
    time: '2026-03-20 16:40',
    status: 'in_progress',
  },
  {
    id: 4,
    name: '年框续约服务咨询',
    time: '2026-03-15 09:18',
    status: 'in_progress',
  },
  {
    id: 5,
    name: '冷站节能优化咨询',
    time: '2026-02-28 11:30',
    status: 'closed',
  },
  {
    id: 6,
    name: '新项目立项设备咨询',
    time: '2026-02-12 15:55',
    status: 'closed',
  },
]);

const filteredItems = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((item) => {
    const statusText = STATUS_LABEL[item.status];
    return (
      item.name.toLowerCase().includes(q) ||
      item.time.toLowerCase().includes(q) ||
      statusText.includes(q)
    );
  });
});

const statusLabel = (status: FeedbackStatus) => STATUS_LABEL[status];

const handleBack = () => {
  emit('back');
};

const onAdd = () => {
  // TODO: open create feedback form
};
</script>

<style scoped>
.feedback-list-page {
  min-height: 100%;
  padding-bottom: 40px;
  box-sizing: border-box;
}

.page-header {
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
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

.header-icon-img {
  width: 20px;
  height: 20px;
}

.search-bar {
  width: 168px;
  flex-shrink: 0;
  margin-left: auto;
  height: 44px;
  background-color: #ffffff;
  border-radius: 999px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 14px;
  color: #111827;
  height: 100%;
}

.search-placeholder {
  color: #9ca3af;
  font-size: 14px;
}

.content {
  padding: 32px 24px 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}

.title-block {
  flex: 1;
  min-width: 0;
}

.page-title {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.page-desc {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.add-btn {
  flex-shrink: 0;
  height: 44px;
  padding: 0 24px;
  border-radius: 14px;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn-text {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feedback-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 20px;
  border: 1px solid #d8f0c8;
  padding: 20px 18px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feedback-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.feedback-name {
  flex: 1;
  min-width: 0;
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.feedback-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.2;
}

.field-value {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
  line-height: 1.45;
}

.status-badge {
  height: 26px;
  padding: 0 12px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.status-badge-text {
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.status-pending_reply {
  background-color: #dbeafe;
}

.status-pending_reply .status-badge-text {
  color: #2563eb;
}

.status-in_progress {
  background-color: #dcfce7;
}

.status-in_progress .status-badge-text {
  color: #15803d;
}

.status-closed {
  background-color: #f3f4f6;
}

.status-closed .status-badge-text {
  color: #6b7280;
}

.empty-tip {
  padding: 48px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-tip-text {
  font-size: 14px;
  color: #9ca3af;
}
</style>
