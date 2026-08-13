<template>
  <view class="sheet-page">
    <view class="sheet-page__header">
      <view class="sheet-page__back-btn" @click="handleBack">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="sheet-page__back-icon"
        />
      </view>
    </view>

    <view class="sheet-page__body">
      <view class="title-row">
        <view class="title-block">
          <text class="sheet-page__title">询价</text>
        </view>
        <view class="add-btn" @click="onShortChat">
          <text class="add-btn-text">短交流</text>
        </view>
      </view>

      <view
        v-for="item in messages"
        :key="item.id"
        class="inquiry-card"
      >
        <view class="meta-row">
          <view class="avatar">
            <text class="avatar-text">{{ senderInitial(item.sender) }}</text>
          </view>
          <view class="meta-main">
            <view class="meta-field">
              <text class="card-label">发送人</text>
              <text class="card-value">{{ item.sender }}</text>
            </view>
            <view class="meta-field meta-field-time">
              <text class="card-label">发送时间</text>
              <text class="card-value card-value-time">{{ item.sendTime }}</text>
            </view>
          </view>
        </view>

        <view class="content-panel">
          <view class="content-head">
            <view class="content-bar" />
            <text class="content-title">交流内容</text>
          </view>
          <text class="card-body">{{ item.content }}</text>
        </view>

        <view v-if="item.attachmentName" class="attach-panel">
          <view class="attach-file">
            <view class="attach-ext" :class="`ext-${fileKind(item.attachmentName)}`">
              <text class="attach-ext-text">{{ fileExt(item.attachmentName) }}</text>
            </view>
            <view class="attach-meta">
              <text class="card-label">附件</text>
              <text class="attach-name">{{ item.attachmentName }}</text>
            </view>
          </view>
          <view class="download-btn" @click="onDownload(item)">
            <image
              src="/static/icons/download.svg"
              mode="aspectFit"
              class="download-icon"
            />
            <text class="download-btn-text">下载附件</text>
          </view>
        </view>
      </view>

      <view v-if="messages.length === 0" class="empty-tip">
        <text class="empty-tip-text">暂无询价交流记录</text>
      </view>
    </view>

    <ShortChatSheet
      :show="shortChatVisible"
      @close="closeShortChat"
      @confirm="handleShortChatConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ShortChatSheet from '@/components/ShortChatSheet.vue';

export type InquiryMessage = {
  id: number;
  sender: string;
  sendTime: string;
  content: string;
  attachmentName: string;
};

withDefaults(
  defineProps<{
    messages?: InquiryMessage[];
  }>(),
  {
    messages: () => [],
  },
);

const emit = defineEmits<{
  back: [];
  download: [item: InquiryMessage];
  shortChatSubmit: [payload: { content: string; attachments: string[] }];
}>();

const shortChatVisible = ref(false);

const senderInitial = (name: string) => (name ? name.slice(0, 1) : '?');

const fileExt = (name: string) => {
  const index = name.lastIndexOf('.');
  if (index < 0) return 'FILE';
  return name.slice(index + 1).toUpperCase();
};

const fileKind = (name: string) => {
  const ext = fileExt(name).toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'avi'].includes(ext)) return 'video';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'sheet';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  return 'file';
};

const handleBack = () => {
  emit('back');
};

const onShortChat = () => {
  shortChatVisible.value = true;
};

const closeShortChat = () => {
  shortChatVisible.value = false;
};

const handleShortChatConfirm = (payload: {
  content: string;
  attachments: string[];
}) => {
  shortChatVisible.value = false;
  emit('shortChatSubmit', payload);
};

const onDownload = (item: InquiryMessage) => {
  emit('download', item);
  uni.showToast({
    title: '开始下载',
    icon: 'none',
  });
};
</script>

<style scoped>
.sheet-page__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}

.title-block {
  flex: 1;
  min-width: 0;
}

.sheet-page__title {
  display: block;
  margin-bottom: 0;
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

.inquiry-card {
  background-color: #ffffff;
  border-radius: 22px;
  padding: 18px;
  box-sizing: border-box;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.meta-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #b2c4d7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.avatar-text {
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.meta-main {
  flex: 1;
  min-width: 0;
  display: flex;
  gap: 12px;
}

.meta-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-field-time {
  flex: 1.2;
}

.card-label {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.2;
}

.card-value {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
  word-break: break-all;
}

.card-value-time {
  font-size: 14px;
  font-weight: 700;
  color: #374151;
}

.content-panel {
  padding: 14px;
  border-radius: 16px;
  background-color: #f8fafc;
  border: 1px solid #eef2f7;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
}

.content-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-bar {
  width: 4px;
  height: 14px;
  border-radius: 2px;
  background-color: #9fe870;
  flex-shrink: 0;
}

.content-title {
  font-size: 13px;
  font-weight: 800;
  color: #163300;
  line-height: 1.2;
}

.card-body {
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.65;
  word-break: break-word;
}

.attach-panel {
  padding: 12px;
  border-radius: 16px;
  background-color: #f8fafc;
  border: 1px solid #eef2f7;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
}

.attach-file {
  display: flex;
  align-items: center;
  gap: 10px;
}

.attach-ext {
  width: 42px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #e5e7eb;
}

.attach-ext-text {
  font-size: 10px;
  font-weight: 800;
  color: #374151;
  line-height: 1;
}

.ext-pdf {
  background-color: #fee2e2;
}

.ext-pdf .attach-ext-text {
  color: #b91c1c;
}

.ext-image {
  background-color: #dbeafe;
}

.ext-image .attach-ext-text {
  color: #1d4ed8;
}

.ext-sheet {
  background-color: #dcfce7;
}

.ext-sheet .attach-ext-text {
  color: #15803d;
}

.ext-doc {
  background-color: #dbeafe;
}

.ext-doc .attach-ext-text {
  color: #1d4ed8;
}

.attach-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.attach-name {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.download-btn {
  width: 100%;
  height: 44px;
  border-radius: 999px;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
}

.download-icon {
  width: 16px;
  height: 16px;
}

.download-btn-text {
  font-size: 14px;
  font-weight: 800;
  color: #163300;
  line-height: 1;
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
