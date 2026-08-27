<template>
  <SheetPageLayout
    title="新增维保"
    desc="选择项目并填写报修原因后提交"
    @back="handleBack"
    @click="closeProjectDropdown"
  >
    <view class="section-card">
      <text class="section-title">项目选择</text>
      <view class="field-group" @click.stop>
        <text class="field-label">
          <text class="required">*</text>
          所属项目
        </text>
        <view class="dropdown-wrap">
          <view
            class="picker-field"
            :class="{ open: projectOpen }"
            @click="toggleProjectDropdown"
          >
            <text
              class="picker-text"
              :class="{ placeholder: !selectedProject }"
            >
              {{ selectedProject?.name || '请选择项目' }}
            </text>
            <text class="picker-arrow" :class="{ open: projectOpen }">▾</text>
          </view>

          <view v-if="projectOpen" class="dropdown-menu">
            <view
              v-for="project in projects"
              :key="project.id"
              class="dropdown-option"
              :class="{ active: selectedProjectId === project.id }"
              @click="selectProject(project.id)"
            >
              <text class="dropdown-option-text">{{ project.name }}</text>
              <image
                v-if="selectedProjectId === project.id"
                src="/static/icons/check.svg"
                mode="aspectFit"
                class="dropdown-check-icon"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="section-card" @click.stop>
      <text class="section-title">维保信息</text>
      <view class="meta-list">
        <view class="meta-row">
          <text class="meta-label">开工时间</text>
          <text class="meta-value">{{ HARDCODED_START_DATE }}</text>
        </view>
        <view class="meta-row">
          <text class="meta-label">竣工时间</text>
          <text class="meta-value">{{ HARDCODED_END_DATE }}</text>
        </view>
        <view class="meta-row">
          <text class="meta-label">质保期</text>
          <text class="meta-value">{{ HARDCODED_WARRANTY }}</text>
        </view>
        <view class="meta-row meta-row--clickable" @click="openDateSheet">
          <text class="meta-label">
            <text class="required">*</text>
            上门时间
          </text>
          <view class="meta-value-group">
            <text
              class="meta-value"
              :class="{ 'meta-value--placeholder': !visitTime }"
            >
              {{ visitTimeDisplay }}
            </text>
            <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
          </view>
        </view>
        <view class="meta-row meta-row--radio">
          <text class="meta-label">
            <text class="required">*</text>
            保修类型
          </text>
          <view class="radio-group">
            <view class="radio-option" @click="selectedType = 'normal'">
              <view class="radio-circle" :class="{ active: selectedType === 'normal' }">
                <view v-if="selectedType === 'normal'" class="radio-dot" />
              </view>
              <text class="radio-text">普通</text>
            </view>
            <view class="radio-option" @click="selectedType = 'urgent'">
              <view class="radio-circle" :class="{ active: selectedType === 'urgent' }">
                <view v-if="selectedType === 'urgent'" class="radio-dot" />
              </view>
              <text class="radio-text">紧急</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="section-card">
      <text class="section-title">报修原因</text>
      <view class="field-group">
        <text class="field-label">
          <text class="required">*</text>
          报修描述
        </text>
        <textarea
          v-model="reason"
          class="field-textarea"
          placeholder="请描述故障现象或报修需求，便于安排上门"
          placeholder-class="input-placeholder"
          :maxlength="500"
        />
      </view>
    </view>

    <view class="section-card">
      <text class="section-title">上传附件</text>
      <text class="section-hint">最多上传 {{ MAX_MEDIA }} 个文件（{{ mediaFiles.length }}/{{ MAX_MEDIA }}）</text>

      <view class="media-grid">
        <view
          v-for="(file, index) in mediaFiles"
          :key="`${file.path}-${index}`"
          class="media-item"
        >
          <image
            :src="file.path"
            mode="aspectFill"
            class="media-thumb"
          />
          <view class="media-remove" @click.stop="removeMedia(index)">
            <text class="media-remove-text">×</text>
          </view>
        </view>

        <view
          v-if="mediaFiles.length < MAX_MEDIA"
          class="media-add"
          :class="{ 'media-add-alone': mediaFiles.length === 0 }"
          @click="handleChooseMedia"
        >
          <image
            src="/static/icons/image-plus.svg"
            mode="aspectFit"
            class="media-add-icon"
          />
          <text class="media-add-text">添加</text>
        </view>
      </view>
    </view>

    <template #footer>
      <view
        class="submit-btn"
        :class="{ active: isSubmitEnabled }"
        @click="handleSubmit"
      >
        <text class="submit-text">确定</text>
      </view>
    </template>
  </SheetPageLayout>

  <CheckoutEditSheet
    :show="dateSheetOpen"
    title="上门时间"
    @close="closeDateSheet"
    @confirm="confirmDateSheet"
  >
    <DateWheelPicker v-model="draftDate" />
  </CheckoutEditSheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SheetPageLayout from '@/components/SheetPageLayout.vue';
import CheckoutEditSheet from '@/components/CheckoutEditSheet.vue';
import DateWheelPicker from '@/components/DateWheelPicker.vue';
import {
  maintenanceProjects,
  type RepairType,
} from '@/composables/useMaintenanceItems';

type MediaFile = {
  path: string;
  name: string;
};

const MAX_MEDIA = 4;
const HARDCODED_START_DATE = '2025/06/18';
const HARDCODED_END_DATE = '2025/12/30';
const HARDCODED_WARRANTY = '24个月';

const projects = maintenanceProjects;

export type MaintenanceFormPayload = {
  projectId: string;
  projectName: string;
  address: string;
  managerName: string;
  managerPhone: string;
  projectCode: string;
  repairType: RepairType;
  visitTime: string;
  reason: string;
  attachments: string[];
};

const emit = defineEmits<{
  back: [];
  submit: [payload: MaintenanceFormPayload];
}>();

const selectedProjectId = ref('');
const projectOpen = ref(false);
const visitTime = ref('');
const dateSheetOpen = ref(false);
const draftDate = ref('');
const selectedType = ref<RepairType>('normal');
const reason = ref('');
const mediaFiles = ref<MediaFile[]>([]);

const selectedProject = computed(
  () => projects.find((item) => item.id === selectedProjectId.value) ?? null,
);

const visitTimeDisplay = computed(() => {
  if (!visitTime.value) return 'yyyy/mm/dd';
  return visitTime.value.replace(/-/g, '/');
});

const isSubmitEnabled = computed(
  () =>
    !!selectedProject.value &&
    !!visitTime.value &&
    reason.value.trim().length > 0,
);

const formatDateValue = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const closeProjectDropdown = () => {
  projectOpen.value = false;
};

const toggleProjectDropdown = () => {
  projectOpen.value = !projectOpen.value;
};

const selectProject = (id: string) => {
  selectedProjectId.value = id;
  projectOpen.value = false;
};

const openDateSheet = () => {
  closeProjectDropdown();
  draftDate.value = visitTime.value || formatDateValue(new Date());
  dateSheetOpen.value = true;
};

const closeDateSheet = () => {
  dateSheetOpen.value = false;
};

const confirmDateSheet = () => {
  visitTime.value = draftDate.value;
  dateSheetOpen.value = false;
};

const handleChooseMedia = () => {
  const remain = MAX_MEDIA - mediaFiles.value.length;
  if (remain <= 0) return;

  const chooseMediaApi = (uni as any).chooseMedia as typeof uni.chooseMedia | undefined;

  if (typeof chooseMediaApi === 'function') {
    chooseMediaApi({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const next = res.tempFiles.map((file) => {
          const path = file.tempFilePath;
          const name = path.split('/').pop() || 'image.jpg';
          return { path, name };
        });
        mediaFiles.value = [...mediaFiles.value, ...next].slice(0, MAX_MEDIA);
      },
      fail: () => {
        chooseImagesFallback(remain);
      },
    });
    return;
  }

  chooseImagesFallback(remain);
};

const chooseImagesFallback = (remain: number) => {
  uni.chooseImage({
    count: remain,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const next = res.tempFilePaths.map((path) => ({
        path,
        name: path.split('/').pop() || 'image.jpg',
      }));
      mediaFiles.value = [...mediaFiles.value, ...next].slice(0, MAX_MEDIA);
    },
  });
};

const removeMedia = (index: number) => {
  mediaFiles.value = mediaFiles.value.filter((_, i) => i !== index);
};

const handleBack = () => {
  emit('back');
};

const handleSubmit = () => {
  if (!isSubmitEnabled.value || !selectedProject.value) return;
  emit('submit', {
    projectId: selectedProject.value.id,
    projectName: selectedProject.value.name,
    address: selectedProject.value.address,
    managerName: selectedProject.value.managerName,
    managerPhone: selectedProject.value.managerPhone,
    projectCode: selectedProject.value.projectCode,
    repairType: selectedType.value,
    visitTime: `${visitTime.value} 09:00`,
    reason: reason.value.trim(),
    attachments: mediaFiles.value.map((file) => file.name),
  });
};

const resetForm = () => {
  selectedProjectId.value = '';
  projectOpen.value = false;
  visitTime.value = '';
  dateSheetOpen.value = false;
  selectedType.value = 'normal';
  reason.value = '';
  mediaFiles.value = [];
};

defineExpose({ resetForm });
</script>

<style scoped>
.section-card {
  background-color: #ffffff;
  border-radius: 44rpx;
  padding: 40rpx 36rpx;
  margin-bottom: 28rpx;
  box-shadow: 0 8rpx 40rpx rgba(15, 23, 42, 0.04);
}

.section-title {
  display: block;
  font-size: 34rpx;
  font-weight: 800;
  color: #111827;
  margin-bottom: 32rpx;
}

.section-hint {
  display: block;
  margin-top: -16rpx;
  margin-bottom: 28rpx;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.meta-row--clickable:active {
  opacity: 0.72;
}

.meta-row--radio {
  align-items: center;
}

.radio-group {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 40rpx;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.radio-circle {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 3rpx solid #d1d5db;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.radio-circle.active {
  border-color: #9fe870;
}

.radio-dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background-color: #9fe870;
}

.radio-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #374151;
  line-height: 1;
}

.meta-label {
  width: 280rpx;
  font-size: 28rpx;
  color: #9ca3af;
  flex-shrink: 0;
  line-height: 1.45;
}

.meta-value-group {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12rpx;
}

.meta-value {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  font-weight: 600;
  color: #374151;
  text-align: right;
  line-height: 1.45;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta-value--placeholder {
  color: #9ca3af;
  font-weight: 500;
}

.meta-chevron {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.field-stack {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.field-group {
  margin-bottom: 0;
}

.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.field-label {
  display: block;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.field-label-row .field-label {
  margin-bottom: 0;
}

.field-count {
  font-size: 24rpx;
  color: #9ca3af;
}

.required {
  color: #ef4444;
  margin-right: 4rpx;
}

.dropdown-wrap {
  position: relative;
}

.picker-field {
  height: 96rpx;
  padding: 0 28rpx;
  border-radius: 28rpx;
  border: 2rpx solid #eef0ea;
  background-color: #f8faf9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.picker-field.open {
  border-color: #9fe870;
  background-color: #ffffff;
}

.picker-text {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 20rpx;
}

.picker-text.placeholder {
  font-weight: 500;
  color: #9ca3af;
}

.picker-arrow {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.picker-arrow.open {
  transform: rotate(180deg);
  color: #163300;
}

.dropdown-menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 16rpx);
  z-index: 20;
  background-color: #ffffff;
  border-radius: 32rpx;
  border: 2rpx solid #eef2f7;
  box-shadow: 0 24rpx 56rpx rgba(15, 23, 42, 0.1);
  overflow: hidden;
  max-height: 480rpx;
  overflow-y: auto;
}

.dropdown-option {
  min-height: 96rpx;
  padding: 24rpx 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  box-sizing: border-box;
  border-bottom: 2rpx solid #f3f4f6;
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option.active {
  background-color: #f7faf5;
}

.dropdown-option-text {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
}

.dropdown-option.active .dropdown-option-text {
  color: #163300;
}

.dropdown-check-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.field-textarea {
  width: 100%;
  min-height: 280rpx;
  padding: 24rpx 28rpx;
  background-color: #f8faf9;
  border: 2rpx solid #eef0ea;
  border-radius: 28rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #111827;
  line-height: 1.55;
  box-sizing: border-box;
}

.input-placeholder {
  color: #d1d5db;
  font-size: 28rpx;
}

.media-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.media-item {
  width: calc((100% - 40rpx) / 3);
  aspect-ratio: 1;
  border-radius: 28rpx;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  background-color: #f3f4f6;
}

.media-thumb {
  width: 100%;
  height: 100%;
  display: block;
}

.media-remove {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  width: 44rpx;
  height: 44rpx;
  border-radius: 22rpx;
  background-color: rgba(17, 24, 39, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-remove-text {
  font-size: 28rpx;
  color: #ffffff;
  line-height: 1;
}

.media-add {
  width: calc((100% - 40rpx) / 3);
  aspect-ratio: 1;
  border-radius: 28rpx;
  border: 3rpx dashed #d1d5db;
  background-color: #f8faf9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-sizing: border-box;
}

.media-add-alone {
  width: 100%;
  aspect-ratio: auto;
  height: 176rpx;
  flex-direction: row;
  gap: 16rpx;
}

.media-add-icon {
  width: 48rpx;
  height: 48rpx;
}

.media-add-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #6b7280;
}

.submit-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.submit-btn.active {
  background-color: #9fe870;
}

.submit-text {
  font-size: 32rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  line-height: 1;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
