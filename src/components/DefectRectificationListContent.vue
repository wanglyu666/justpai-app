<template>
  <view class="defect-list-page">
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
          placeholder="搜索整改"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">缺陷整改</text>
          <text class="page-desc">查看全部缺陷整改</text>
        </view>
        <view class="add-btn" @click="onAdd">
          <text class="add-btn-text">新增</text>
        </view>
      </view>

      <view class="defect-list">
        <view
          v-for="item in filteredItems"
          :key="item.id"
          class="defect-card"
          @click="openDetail(item)"
        >
          <view class="defect-top">
            <text class="defect-name" :style="infoCardTitleStyle">{{ item.name }}</text>
            <StatusBadge :status="item.status" :label="statusLabel(item.status)" />
          </view>

          <view class="defect-field" :style="infoCardFieldStyle">
            <text class="field-label" :style="infoCardLabelStyle">汇报时间</text>
            <text class="field-value" :style="infoCardValueStyle">{{ item.time }}</text>
          </view>
        </view>

        <view v-if="filteredItems.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关缺陷整改</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="detailVisible"
      :z-index="2500"
      @closed="resetDetail"
    >
      <view class="detail-page">
        <view class="detail-header">
          <view class="icon-btn" @click="closeDetail">
            <image
              src="/static/icons/chevron-left.svg"
              mode="aspectFit"
              class="header-icon-img"
            />
          </view>
        </view>

        <view class="detail-content" v-if="selectedItem">
          <view class="detail-title-row">
            <text class="detail-title">整改详情</text>
            <view class="end-btn" @click="openDeleteModal">
              <text class="end-btn-text">删除记录</text>
            </view>
          </view>

          <view class="info-card">
            <view class="info-block" :style="infoCardFieldStyle">
              <text class="info-label" :style="infoCardLabelStyle">缺陷名称</text>
              <text class="info-value" :style="infoCardTitleStyle">{{ selectedItem.name }}</text>
            </view>
            <view class="info-divider" />
            <view class="info-block" :style="infoCardFieldStyle">
              <text class="info-label" :style="infoCardLabelStyle">缺陷内容</text>
              <text class="info-value" :style="infoCardValueStyle">{{ selectedItem.content }}</text>
            </view>
            <view class="info-divider" />
            <view class="info-meta-row">
              <view class="info-block info-block-grow" :style="infoCardFieldStyle">
                <text class="info-label" :style="infoCardLabelStyle">汇报时间</text>
                <text class="info-value" :style="infoCardValueStyle">{{ selectedItem.time }}</text>
              </view>
              <view class="info-block info-block-status" :style="infoCardFieldStyle">
                <text class="info-label" :style="infoCardLabelStyle">状态</text>
                <StatusBadge
                  :status="selectedItem.status"
                  :label="statusLabel(selectedItem.status)"
                />
              </view>
            </view>
            <view class="info-divider" />
            <view class="info-meta-row">
              <view class="info-block info-block-grow" :style="infoCardFieldStyle">
                <text class="info-label" :style="infoCardLabelStyle">计划完成时间</text>
                <text class="info-value" :style="infoCardValueStyle">{{ displayTime(selectedItem.plannedAt) }}</text>
              </view>
              <view class="info-block info-block-grow" :style="infoCardFieldStyle">
                <text class="info-label" :style="infoCardLabelStyle">实际完成时间</text>
                <text class="info-value" :style="infoCardValueStyle">{{ displayTime(selectedItem.actualAt) }}</text>
              </view>
            </view>
          </view>

          <view class="file-card">
            <view class="file-card-head">
              <view class="file-card-bar" />
              <text class="file-card-title">附件</text>
            </view>

            <view class="attach-group">
              <text class="attach-group-title">缺陷照片</text>
              <view v-if="selectedItem.defectPhotos.length" class="file-card-list">
                <FileAttachmentItem
                  v-for="(file, index) in selectedItem.defectPhotos"
                  :key="`defect-${file}-${index}`"
                  :name="file"
                />
              </view>
              <text v-else class="file-card-empty">暂无缺陷照片</text>
            </view>

            <view class="attach-group">
              <text class="attach-group-title">整改完成照片</text>
              <view v-if="selectedItem.fixPhotos.length" class="file-card-list">
                <FileAttachmentItem
                  v-for="(file, index) in selectedItem.fixPhotos"
                  :key="`fix-${file}-${index}`"
                  :name="file"
                />
              </view>
              <text v-else class="file-card-empty">暂无整改完成照片</text>
            </view>
          </view>
        </view>
      </view>
    </BottomSheetPanel>

    <BottomSheetPanel
      :show="formVisible"
      :z-index="2600"
      content-safe-top
      @closed="resetFormFlow"
    >
      <SuccessPageTransition :show-success="formStep === 'success'">
        <DefectReportFormContent
          ref="formRef"
          title="新增整改"
          desc="填写整改信息后提交"
          @back="closeForm"
          @submit="handleFormSubmit"
        />
        <template #success>
          <FeedbackSuccessContent
            desc="您的缺陷整改已提交，我们将尽快处理"
            back-text="返回缺陷整改"
            @back="closeForm"
          />
        </template>
      </SuccessPageTransition>
    </BottomSheetPanel>

    <FrostedConfirmModal
      :show="deleteModalVisible"
      title="确定删除该记录吗？"
      message="删除后将无法恢复"
      @cancel="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import FileAttachmentItem from '@/components/FileAttachmentItem.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import DefectReportFormContent from '@/components/DefectReportFormContent.vue';
import FeedbackSuccessContent from '@/components/FeedbackSuccessContent.vue';
import FrostedConfirmModal from '@/components/FrostedConfirmModal.vue';
import {
  infoCardFieldStyle,
  infoCardLabelStyle,
  infoCardTitleStyle,
  infoCardValueStyle,
} from '@/config/infoCard';
import {
  DEFECT_RECTIFICATION_STATUS_LABEL,
  useDefectRectifications,
  type DefectRectificationItem,
  type DefectRectificationStatus,
} from '@/composables/useDefectRectifications';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';

const props = defineProps<{
  acceptanceItemId: string;
}>();

const emit = defineEmits<{
  back: [];
}>();

const keyword = ref('');
const selectedItem = ref<DefectRectificationItem | null>(null);
const formRef = ref<InstanceType<typeof DefectReportFormContent> | null>(null);
const formStep = ref<'form' | 'success'>('form');
const deleteModalVisible = ref(false);
const { items, addRectification, removeRectification } = useDefectRectifications();

const {
  visible: detailVisible,
  open: openDetailPanel,
  close: closeDetail,
} = useSlideOver();
const {
  visible: formVisible,
  open: openFormPanel,
  close: closeFormPanel,
} = useSlideOver();
usePageBackWhen(detailVisible, closeDetail);

const acceptanceItems = computed(() =>
  items.value.filter((item) => item.acceptanceItemId === props.acceptanceItemId),
);

const filteredItems = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return acceptanceItems.value;
  return acceptanceItems.value.filter((item) => {
    const statusText = DEFECT_RECTIFICATION_STATUS_LABEL[item.status];
    return (
      item.name.toLowerCase().includes(q) ||
      item.time.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.plannedAt.includes(q) ||
      item.actualAt.includes(q) ||
      statusText.includes(q)
    );
  });
});

const statusLabel = (status: DefectRectificationStatus) =>
  DEFECT_RECTIFICATION_STATUS_LABEL[status];

const displayTime = (value: string) => value || '—';

const openDetail = (item: DefectRectificationItem) => {
  selectedItem.value = {
    ...item,
    defectPhotos: [...item.defectPhotos],
    fixPhotos: [...item.fixPhotos],
  };
  openDetailPanel();
};

const resetDetail = () => {
  selectedItem.value = null;
};

const openDeleteModal = () => {
  deleteModalVisible.value = true;
};

const closeDeleteModal = () => {
  deleteModalVisible.value = false;
};
usePageBackWhen(deleteModalVisible, closeDeleteModal);

const confirmDelete = () => {
  const id = selectedItem.value?.id;
  deleteModalVisible.value = false;
  if (id == null) return;
  removeRectification(id);
  closeDetail();
};

const handleBack = usePageBack(() => emit('back'));

const onAdd = () => {
  formStep.value = 'form';
  openFormPanel();
};

const closeForm = () => {
  closeFormPanel();
};

const resetFormFlow = () => {
  formStep.value = 'form';
  formRef.value?.resetForm();
};

const handleFormSubmit = (payload: {
  content: string;
  attachments: string[];
}) => {
  addRectification({
    acceptanceItemId: props.acceptanceItemId,
    content: payload.content,
    attachments: payload.attachments,
  });
  formStep.value = 'success';
};
</script>

<style scoped>
.defect-list-page {
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
  border-radius: 1998rpx;
  background-color: #ffffff;
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
  margin-bottom: 48rpx;
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

.add-btn {
  flex-shrink: 0;
  height: 88rpx;
  padding: 0 48rpx;
  border-radius: 28rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.defect-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.defect-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.defect-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.defect-name {
  flex: 1;
  min-width: 0;
}

.defect-field {
  display: flex;
  flex-direction: column;
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

.detail-page {
  min-height: 100%;
  padding-bottom: 80rpx;
  box-sizing: border-box;
}

.detail-header {
  padding: 0 48rpx;
}

.detail-content {
  padding: 48rpx 48rpx 0;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.detail-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 12rpx;
}

.detail-title {
  flex: 1;
  min-width: 0;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
}

.end-btn {
  flex-shrink: 0;
  height: 88rpx;
  padding: 0 48rpx;
  border-radius: 28rpx;
  background-color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
}

.end-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.info-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
}

.info-block {
  display: flex;
  flex-direction: column;
}

.info-block-grow {
  flex: 1;
  min-width: 0;
}

.info-block-status {
  flex-shrink: 0;
  align-items: flex-start;
}

.info-divider {
  height: 2rpx;
  background-color: #eef2f7;
  margin: 12rpx 0;
}

.info-meta-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32rpx;
}

.info-label,
.field-label {
  flex-shrink: 0;
}

.info-value,
.field-value {
  word-break: break-all;
}

.file-card {
  background-color: #ffffff;
  border-radius: 44rpx;
  padding: 36rpx;
  box-sizing: border-box;
  box-shadow: 0 16rpx 48rpx rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.file-card-head {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.file-card-bar {
  width: 8rpx;
  height: 28rpx;
  border-radius: 4rpx;
  background-color: #9fe870;
  flex-shrink: 0;
}

.file-card-title {
  font-size: 28rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.attach-group {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.attach-group-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #6b7280;
  line-height: 1.3;
}

.file-card-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.file-card-empty {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.4;
}
</style>
