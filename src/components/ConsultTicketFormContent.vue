<template>
  <view class="consult-ticket-form">
    <SheetPageLayout
      title="新增咨询"
      desc="填写服务信息后提交，顾问将尽快与您联系"
      @back="handleBack"
    >
    <view class="section-card">
      <text class="section-title">其余内容</text>
      <view class="meta-list">
        <view class="meta-row meta-row--clickable" @click="openEditSheet('address')">
          <text class="meta-label">
            <text class="required">*</text>
            服务地址
          </text>
          <view class="meta-value-group">
            <text
              class="meta-value meta-value--wrap"
              :class="{ 'meta-value--placeholder': !form.address.trim() }"
            >
              {{ addressDisplay }}
            </text>
            <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
          </view>
        </view>

        <view class="meta-row meta-row--clickable" @click="openEditSheet('contact')">
          <text class="meta-label">联系人</text>
          <view class="meta-value-group">
            <text
              class="meta-value"
              :class="{ 'meta-value--placeholder': !form.contact.trim() }"
            >
              {{ contactDisplay }}
            </text>
            <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
          </view>
        </view>

        <view class="meta-row meta-row--clickable" @click="openEditSheet('phone')">
          <text class="meta-label">联系电话</text>
          <view class="meta-value-group">
            <text
              class="meta-value"
              :class="{ 'meta-value--placeholder': !form.phone.trim() }"
            >
              {{ phoneDisplay }}
            </text>
            <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
          </view>
        </view>

        <view class="meta-row meta-row--clickable" @click="openEditSheet('surveyDate')">
          <text class="meta-label">期望探勘时间</text>
          <view class="meta-value-group">
            <text
              class="meta-value"
              :class="{ 'meta-value--placeholder': !form.surveyDate }"
            >
              {{ surveyDateDisplay }}
            </text>
            <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
          </view>
        </view>

        <view class="meta-row meta-row--clickable" @click="openEditSheet('serviceStartDate')">
          <text class="meta-label">
            <text class="required">*</text>
            期望服务开始时间
          </text>
          <view class="meta-value-group">
            <text
              class="meta-value"
              :class="{ 'meta-value--placeholder': !form.serviceStartDate }"
            >
              {{ serviceStartDateDisplay }}
            </text>
            <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
          </view>
        </view>

        <view class="meta-row meta-row--clickable" @click="openEditSheet('duration')">
          <text class="meta-label">期望工期</text>
          <view class="meta-value-group">
            <text class="meta-value">{{ form.duration }} 天</text>
            <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
          </view>
        </view>

        <view class="meta-row meta-row--radio">
          <text class="meta-label">
            <text class="required">*</text>
            是否需要报价
          </text>
          <view class="radio-group">
            <view
              class="radio-option"
              @click="form.needQuote = true"
            >
              <view class="radio-circle" :class="{ active: form.needQuote === true }">
                <view v-if="form.needQuote === true" class="radio-dot" />
              </view>
              <text class="radio-text">是</text>
            </view>
            <view
              class="radio-option"
              @click="form.needQuote = false"
            >
              <view class="radio-circle" :class="{ active: form.needQuote === false }">
                <view v-if="form.needQuote === false" class="radio-dot" />
              </view>
              <text class="radio-text">否</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="section-card">
      <view class="field-label-row">
        <text class="field-label">
          <text class="required">*</text>
          需求
        </text>
        <text class="field-count">{{ form.demand.length }}/500</text>
      </view>
      <textarea
        v-model="form.demand"
        class="field-textarea"
        placeholder="请描述您的需求"
        placeholder-class="input-placeholder"
        :maxlength="500"
      />
    </view>

    <view class="section-card">
      <text class="section-title">相关资料</text>
      <text class="section-hint">最多上传 {{ MAX_FILES }} 个文件（{{ mediaFiles.length }}/{{ MAX_FILES }}）</text>

      <view class="media-grid">
        <view
          v-for="(file, index) in mediaFiles"
          :key="`${file.path}-${index}`"
          class="media-item"
        >
          <image
            v-if="file.type === 'image'"
            :src="file.path"
            mode="aspectFill"
            class="media-thumb"
          />
          <view v-else class="media-file">
            <text class="media-file-badge">{{ fileExt(file.name) }}</text>
          </view>
          <view class="media-remove" @click.stop="removeMedia(index)">
            <text class="media-remove-text">×</text>
          </view>
        </view>

        <view
          v-if="mediaFiles.length < MAX_FILES"
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
    :show="activeSheet !== null"
    :title="sheetTitle"
    @close="closeEditSheet"
    @confirm="confirmEditSheet"
  >
    <template v-if="activeSheet === 'surveyDate' || activeSheet === 'serviceStartDate'">
      <DateWheelPicker v-model="draftDate" />
    </template>

    <template v-else-if="activeSheet === 'duration'">
      <view class="duration-stepper">
        <view class="stepper-btn" @click="adjustDuration(-1)">
          <text class="stepper-btn-text">−</text>
        </view>
        <view class="stepper-value-wrap">
          <text class="stepper-value">{{ draftDuration }}</text>
          <text class="stepper-unit">天</text>
        </view>
        <view class="stepper-btn" @click="adjustDuration(1)">
          <text class="stepper-btn-text">+</text>
        </view>
      </view>
    </template>

    <template v-else-if="activeSheet === 'address'">
      <view class="sheet-textarea-wrap">
        <textarea
          v-model="draftText"
          class="sheet-textarea"
          placeholder="请输入服务地址"
          placeholder-class="sheet-textarea-placeholder"
          :maxlength="120"
        />
        <text class="sheet-textarea-count">{{ draftText.length }}/120</text>
      </view>
    </template>

    <template v-else-if="activeSheet">
      <input
        v-model="draftText"
        class="sheet-input"
        type="text"
        :placeholder="textFieldPlaceholder"
        placeholder-class="sheet-input-placeholder"
        :maxlength="textFieldMaxLength"
      />
    </template>
  </CheckoutEditSheet>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import SheetPageLayout from '@/components/SheetPageLayout.vue';
import CheckoutEditSheet from '@/components/CheckoutEditSheet.vue';
import DateWheelPicker from '@/components/DateWheelPicker.vue';

type EditField =
  | 'address'
  | 'contact'
  | 'phone'
  | 'surveyDate'
  | 'serviceStartDate'
  | 'duration';

type MediaFile = {
  path: string;
  type: 'image' | 'file';
  name: string;
};

export type ConsultTicketFormPayload = {
  address: string;
  contact: string;
  phone: string;
  surveyDate: string;
  serviceStartDate: string;
  duration: number;
  needQuote: boolean;
  demand: string;
  attachments: string[];
};

const MAX_FILES = 4;

const emit = defineEmits<{
  back: [];
  submit: [payload: ConsultTicketFormPayload];
}>();

const form = reactive({
  address: '',
  contact: '',
  phone: '',
  surveyDate: '',
  serviceStartDate: '',
  duration: 0,
  needQuote: null as boolean | null,
  demand: '',
});

const mediaFiles = ref<MediaFile[]>([]);
const activeSheet = ref<EditField | null>(null);
const draftText = ref('');
const draftDate = ref('');
const draftDuration = ref(0);

const sheetTitles: Record<EditField, string> = {
  address: '服务地址',
  contact: '联系人',
  phone: '联系电话',
  surveyDate: '期望探勘时间',
  serviceStartDate: '期望服务开始时间',
  duration: '期望工期',
};

const sheetTitle = computed(() =>
  activeSheet.value ? sheetTitles[activeSheet.value] : '',
);

const textFieldPlaceholder = computed(() => {
  if (activeSheet.value === 'contact') return '请输入联系人';
  if (activeSheet.value === 'phone') return '请输入联系电话';
  return '';
});

const textFieldMaxLength = computed(() => {
  if (activeSheet.value === 'phone') return 11;
  if (activeSheet.value === 'contact') return 20;
  return 50;
});

const formatDateDisplay = (value: string) => {
  if (!value) return 'yyyy/mm/dd';
  return value.replace(/-/g, '/');
};

const addressDisplay = computed(() => form.address.trim() || '请输入服务地址');
const contactDisplay = computed(() => form.contact.trim() || '请输入联系人');
const phoneDisplay = computed(() => form.phone.trim() || '请输入联系电话');
const surveyDateDisplay = computed(() => formatDateDisplay(form.surveyDate));
const serviceStartDateDisplay = computed(() => formatDateDisplay(form.serviceStartDate));

const isSubmitEnabled = computed(
  () =>
    form.address.trim() !== ''
    && form.serviceStartDate !== ''
    && form.needQuote !== null
    && form.demand.trim() !== '',
);

const formatDateValue = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const openEditSheet = (field: EditField) => {
  activeSheet.value = field;
  draftText.value = '';
  draftDate.value = formatDateValue(new Date());
  draftDuration.value = form.duration;

  if (field === 'address') draftText.value = form.address;
  if (field === 'contact') draftText.value = form.contact;
  if (field === 'phone') draftText.value = form.phone;
  if (field === 'surveyDate') {
    draftDate.value = form.surveyDate || formatDateValue(new Date());
  }
  if (field === 'serviceStartDate') {
    draftDate.value = form.serviceStartDate || formatDateValue(new Date());
  }
};

const closeEditSheet = () => {
  activeSheet.value = null;
};

const adjustDuration = (delta: number) => {
  draftDuration.value = Math.max(0, Math.min(365, draftDuration.value + delta));
};

const confirmEditSheet = () => {
  const field = activeSheet.value;
  if (!field) return;

  if (field === 'address') {
    form.address = draftText.value.trim();
  } else if (field === 'contact') {
    form.contact = draftText.value.trim();
  } else if (field === 'phone') {
    form.phone = draftText.value.trim();
  } else if (field === 'surveyDate') {
    form.surveyDate = draftDate.value;
  } else if (field === 'serviceStartDate') {
    form.serviceStartDate = draftDate.value;
  } else if (field === 'duration') {
    form.duration = draftDuration.value;
  }

  activeSheet.value = null;
};

const fileExt = (name: string) => {
  const index = name.lastIndexOf('.');
  if (index < 0) return 'FILE';
  return name.slice(index + 1).toUpperCase();
};

const handleChooseMedia = () => {
  const remain = MAX_FILES - mediaFiles.value.length;
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
          return {
            path,
            type: 'image' as const,
            name,
          };
        });
        mediaFiles.value = [...mediaFiles.value, ...next].slice(0, MAX_FILES);
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
        type: 'image' as const,
        name: path.split('/').pop() || 'image.jpg',
      }));
      mediaFiles.value = [...mediaFiles.value, ...next].slice(0, MAX_FILES);
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
  if (!isSubmitEnabled.value || form.needQuote === null) return;
  emit('submit', {
    address: form.address.trim(),
    contact: form.contact.trim(),
    phone: form.phone.trim(),
    surveyDate: form.surveyDate,
    serviceStartDate: form.serviceStartDate,
    duration: form.duration,
    needQuote: form.needQuote,
    demand: form.demand.trim(),
    attachments: mediaFiles.value.map((file) => file.name),
  });
};

const resetForm = () => {
  form.address = '';
  form.contact = '';
  form.phone = '';
  form.surveyDate = '';
  form.serviceStartDate = '';
  form.duration = 0;
  form.needQuote = null;
  form.demand = '';
  mediaFiles.value = [];
  activeSheet.value = null;
};

defineExpose({ resetForm });
</script>

<style scoped>
.consult-ticket-form {
  height: 100%;
  min-height: 100%;
}

.section-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 36rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
  margin-bottom: 28rpx;
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

.required {
  color: #ef4444;
  margin-right: 4rpx;
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

.meta-value--wrap {
  overflow: visible;
  text-overflow: unset;
  white-space: normal;
  word-break: break-all;
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

.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.field-label {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.field-count {
  font-size: 24rpx;
  color: #9ca3af;
}

.field-textarea {
  width: 100%;
  min-height: 264rpx;
  padding: 24rpx 28rpx;
  background-color: #f8faf9;
  border: 2rpx solid #eef0ea;
  border-radius: 28rpx;
  font-size: 28rpx;
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
  background-color: #f3f4f6;
  box-sizing: border-box;
  position: relative;
}

.media-thumb {
  width: 100%;
  height: 100%;
  display: block;
}

.media-file {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eef2ff;
}

.media-file-badge {
  font-size: 24rpx;
  font-weight: 700;
  color: #4338ca;
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
  border-radius: 52rpx;
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
  transition: color 0.2s ease;
}

.submit-btn.active .submit-text {
  color: #163300;
}

.sheet-input {
  width: 100%;
  height: 96rpx;
  padding: 0 32rpx;
  border-radius: 24rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #f9fafb;
  font-size: 30rpx;
  color: #374151;
  box-sizing: border-box;
}

.sheet-input-placeholder {
  color: #9ca3af;
}

.sheet-option-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.sheet-option {
  min-height: 96rpx;
  padding: 0 32rpx;
  border-radius: 24rpx;
  background-color: #f9fafb;
  border: 2rpx solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.sheet-option.active {
  border-color: #9fe870;
  background-color: #f0fdf4;
}

.sheet-option-text {
  font-size: 30rpx;
  color: #374151;
  line-height: 1.3;
}

.sheet-option.active .sheet-option-text {
  font-weight: 700;
  color: #163300;
}

.sheet-option-check {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.sheet-textarea-wrap {
  position: relative;
  min-height: 320rpx;
  padding: 28rpx 28rpx 64rpx;
  border-radius: 24rpx;
  background-color: #f9fafb;
  border: 2rpx solid #e5e7eb;
  box-sizing: border-box;
}

.sheet-textarea {
  width: 100%;
  min-height: 240rpx;
  font-size: 28rpx;
  color: #374151;
  line-height: 1.5;
}

.sheet-textarea-placeholder {
  color: #9ca3af;
}

.sheet-textarea-count {
  position: absolute;
  right: 28rpx;
  bottom: 20rpx;
  font-size: 22rpx;
  color: #9ca3af;
}

.duration-stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32rpx;
  padding: 40rpx 0;
}

.stepper-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepper-btn:active {
  opacity: 0.75;
}

.stepper-btn-text {
  font-size: 44rpx;
  font-weight: 600;
  color: #374151;
  line-height: 1;
}

.stepper-value-wrap {
  min-width: 180rpx;
  height: 96rpx;
  padding: 0 28rpx;
  border-radius: 24rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  box-sizing: border-box;
}

.stepper-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.stepper-unit {
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1;
}
</style>
