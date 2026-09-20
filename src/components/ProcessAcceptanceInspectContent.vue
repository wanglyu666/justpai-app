<template>
  <SheetPageLayout
    title="验收"
    :desc="item.name"
    @back="handleBack"
  >
    <FileAttachmentCard
      class="attach-card"
      :files="item.attachments || []"
      empty-text="暂无附件"
    />

    <view class="section-card">
      <text class="section-title">其余内容</text>
      <view class="meta-list">
        <view class="meta-row">
          <text class="meta-label">计划验收时间</text>
          <text class="meta-value">{{ plannedDisplay }}</text>
        </view>
        <view class="meta-row">
          <text class="meta-label">预约验收时间</text>
          <text class="meta-value">{{ bookedDisplay }}</text>
        </view>
        <view class="meta-row meta-row--radio">
          <text class="meta-label">
            <text class="required">*</text>
            验收评价
          </text>
          <view class="radio-group">
            <view class="radio-option" @click="result = 'pass'">
              <view class="radio-circle" :class="result === 'pass' ? 'is-active' : ''">
                <view v-if="result === 'pass'" class="radio-dot" />
              </view>
              <text class="radio-text">通过</text>
            </view>
            <view class="radio-option" @click="result = 'fail'">
              <view class="radio-circle" :class="result === 'fail' ? 'is-active' : ''">
                <view v-if="result === 'fail'" class="radio-dot" />
              </view>
              <text class="radio-text">不通过</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <template #footer>
      <view
        class="submit-btn"
        :class="canSubmit ? 'is-active' : ''"
        @click="handleSubmit"
      >
        <text class="submit-text">确定</text>
      </view>
    </template>
  </SheetPageLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SheetPageLayout from '@/components/SheetPageLayout.vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';
import type {
  ProcessAcceptanceItem,
  ProgressAcceptStatus,
} from '@/composables/useProcessAcceptance';

const props = defineProps<{
  item: ProcessAcceptanceItem;
}>();

const emit = defineEmits<{
  back: [];
  submit: [status: ProgressAcceptStatus];
}>();

const result = ref<'pass' | 'fail' | ''>('');

const displayText = (value?: string) => {
  const text = (value || '').trim();
  return !text || text === '-' ? '—' : text;
};

const plannedDisplay = computed(() => displayText(props.item.plannedAt));
const bookedDisplay = computed(() => displayText(props.item.bookedAt));
const canSubmit = computed(() => result.value === 'pass' || result.value === 'fail');

const handleBack = () => emit('back');

const handleSubmit = () => {
  if (!canSubmit.value) return;
  emit('submit', result.value === 'pass' ? 'completed' : 'rejected');
};
</script>

<style scoped>
.attach-card {
  margin-bottom: 28rpx;
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

.radio-circle.is-active {
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

.meta-value {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  font-weight: 600;
  color: #374151;
  text-align: right;
  line-height: 1.45;
}

.submit-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn.is-active {
  background-color: #9fe870;
}

.submit-text {
  font-size: 32rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  line-height: 1;
}

.submit-btn.is-active .submit-text {
  color: #163300;
}
</style>
