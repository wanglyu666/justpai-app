<template>
  <view class="page-approval">
    <view class="page-approval-fab" @click.stop="openSheet">
      <text class="page-approval-fab-text">{{ resolvedFabLabel }}</text>
    </view>

    <view v-if="sheetRendered" class="page-approval-root">
      <view
        class="page-approval-mask"
        :class="sheetClosing ? 'is-closing' : ''"
        @click="closeSheet"
      />
      <view
        class="page-approval-sheet"
        :class="sheetClosing ? 'is-closing' : ''"
      >
        <SuccessPageTransition :show-success="step === 'success'">
          <view class="page-approval-page">
            <view class="page-approval-header">
              <text class="page-approval-title">{{ resolvedTitle }}</text>
              <view class="page-approval-close" @click="closeSheet">
                <image
                  src="/static/icons/x.svg"
                  mode="aspectFit"
                  class="page-approval-close-icon"
                />
              </view>
            </view>

            <view class="page-approval-body">
              <textarea
                v-model="comment"
                class="page-approval-textarea"
                :placeholder="resolvedPlaceholder"
                placeholder-class="page-approval-placeholder"
                maxlength="500"
              />
            </view>

            <view class="page-approval-footer">
              <view
                class="page-approval-confirm"
                :class="canSubmit ? 'is-active' : ''"
                @click="handleConfirm"
              >
                <text class="page-approval-confirm-text">{{ resolvedConfirmText }}</text>
              </view>
            </view>
          </view>

          <template #success>
            <view class="page-approval-page page-approval-success">
              <view class="success-content">
                <image
                  src="/static/images/check-mark.png"
                  mode="aspectFit"
                  class="success-icon"
                />
                <text class="success-title">{{ resolvedSuccessTitle }}</text>
                <text class="success-desc">{{ resolvedSuccessDesc }}</text>
              </view>
              <view class="page-approval-footer">
                <view class="page-approval-done" @click="handleDone">
                  <text class="page-approval-done-text">{{ t('common.done') }}</text>
                </view>
              </view>
            </view>
          </template>
        </SuccessPageTransition>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import { usePageBackWhen } from '@/composables/usePageBack';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useLanguage();

const CLOSE_DURATION_MS = 320;

const props = withDefaults(
  defineProps<{
    fabLabel?: string;
    title?: string;
    placeholder?: string;
    confirmText?: string;
    successTitle?: string;
    successDesc?: string;
  }>(),
  {
    fabLabel: '',
    title: '',
    placeholder: '',
    confirmText: '',
    successTitle: '',
    successDesc: '',
  },
);

const resolvedFabLabel = computed(() => props.fabLabel || t('approval.action'));
const resolvedTitle = computed(() => props.title || t('approval.opinion'));
const resolvedPlaceholder = computed(() => props.placeholder || t('approval.enterOpinion'));
const resolvedConfirmText = computed(() => props.confirmText || t('common.confirm'));
const resolvedSuccessTitle = computed(() => props.successTitle || t('approval.success'));
const resolvedSuccessDesc = computed(() => props.successDesc || t('approval.submitted'));

const emit = defineEmits<{
  submit: [comment: string];
  done: [];
}>();

const comment = ref('');
const step = ref<'form' | 'success'>('form');
const sheetRendered = ref(false);
const sheetClosing = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const canSubmit = computed(() => comment.value.trim().length > 0);

const clearCloseTimer = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const resetSheet = () => {
  comment.value = '';
  step.value = 'form';
};

const openSheet = () => {
  clearCloseTimer();
  resetSheet();
  sheetClosing.value = false;
  sheetRendered.value = true;
};

const closeSheet = () => {
  if (sheetClosing.value || !sheetRendered.value) return;
  sheetClosing.value = true;
  clearCloseTimer();
  closeTimer = setTimeout(() => {
    sheetRendered.value = false;
    sheetClosing.value = false;
    closeTimer = null;
    resetSheet();
  }, CLOSE_DURATION_MS);
};

const handleConfirm = () => {
  if (!canSubmit.value || step.value === 'success') return;
  emit('submit', comment.value.trim());
  step.value = 'success';
};

const handleDone = () => {
  if (step.value !== 'success') return;
  emit('done');
};

usePageBackWhen(sheetRendered, closeSheet);

onUnmounted(() => {
  clearCloseTimer();
});
</script>

<style scoped>
.page-approval {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  pointer-events: none;
}

.page-approval-fab {
  position: absolute;
  right: 48rpx;
  bottom: calc(64rpx + env(safe-area-inset-bottom, 0px));
  z-index: 20;
  pointer-events: auto;
  width: 160rpx;
  height: 160rpx;
  border-radius: 80rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.22);
}

.page-approval-fab-text {
  font-size: 34rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.page-approval-root {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 80;
  pointer-events: auto;
}

.page-approval-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(15, 23, 42, 0.45);
  animation: page-approval-mask-in 320ms ease forwards;
}

.page-approval-mask.is-closing {
  animation: page-approval-mask-out 320ms ease forwards;
}

.page-approval-sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50vh;
  background-color: #ffffff;
  border-radius: 40rpx 40rpx 0 0;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  animation: page-approval-slide-up 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.page-approval-sheet.is-closing {
  animation: page-approval-slide-down 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.page-approval-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.page-approval-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 104rpx;
  flex-shrink: 0;
  border-bottom: 2rpx solid #f3f4f6;
}

.page-approval-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.page-approval-close {
  position: absolute;
  right: 32rpx;
  top: 20rpx;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-approval-close-icon {
  width: 36rpx;
  height: 36rpx;
}

.page-approval-body {
  flex: 1;
  min-height: 0;
  padding: 32rpx 48rpx;
  box-sizing: border-box;
}

.page-approval-textarea {
  width: 100%;
  height: 100%;
  min-height: 240rpx;
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

.page-approval-placeholder {
  color: #d1d5db;
  font-size: 28rpx;
}

.page-approval-footer {
  flex-shrink: 0;
  padding: 24rpx 40rpx calc(24rpx + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.page-approval-confirm {
  height: 96rpx;
  border-radius: 48rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-approval-confirm.is-active {
  background-color: #9fe870;
}

.page-approval-confirm-text {
  font-size: 32rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  line-height: 1;
}

.page-approval-confirm.is-active .page-approval-confirm-text {
  color: #163300;
}

.page-approval-success {
  padding-top: 24rpx;
}

.success-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 48rpx;
}

.success-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 32rpx;
  display: block;
}

.success-title {
  font-size: 40rpx;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 16rpx;
}

.success-desc {
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.page-approval-done {
  height: 96rpx;
  border-radius: 48rpx;
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-approval-done-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

@keyframes page-approval-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes page-approval-slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes page-approval-mask-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes page-approval-mask-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
