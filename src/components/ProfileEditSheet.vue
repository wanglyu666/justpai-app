<template>
  <view v-if="isRendered" class="profile-edit-root">
    <view class="profile-edit-mask" :class="{ closing: isClosing }" @click="handleClose" />
    <view class="profile-edit-panel" :class="{ closing: isClosing }">
      <view class="profile-edit-header">
        <text class="profile-edit-title">编辑资料</text>
        <view class="profile-edit-close" @click="handleClose">
          <text class="profile-edit-close-text">×</text>
        </view>
      </view>

      <view class="profile-edit-body">
        <view class="avatar-block" @click="chooseAvatar">
          <view class="avatar-ring">
            <image :src="draft.avatar" mode="aspectFill" class="avatar-img" />
          </view>
          <text class="avatar-hint">点击头像更换</text>
        </view>

        <view class="field">
          <text class="field-label">名称</text>
          <input
            v-model="draft.name"
            class="field-input"
            type="text"
            placeholder="请输入名称"
            placeholder-class="field-placeholder"
            :maxlength="20"
          />
        </view>

        <view class="field">
          <text class="field-label">邮箱</text>
          <input
            v-model="draft.email"
            class="field-input"
            type="text"
            placeholder="请输入邮箱"
            placeholder-class="field-placeholder"
            :maxlength="50"
          />
        </view>
      </view>

      <view class="profile-edit-footer">
        <view class="profile-edit-confirm" @click="handleConfirm">
          <text class="profile-edit-confirm-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

export type ProfileEditPayload = {
  avatar: string;
  name: string;
  email: string;
};

const props = defineProps<{
  show: boolean;
  avatar: string;
  name: string;
  email: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [payload: ProfileEditPayload];
}>();

const CLOSE_DURATION_MS = 320;

const isRendered = ref(false);
const isClosing = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | null = null;
let pendingPayload: ProfileEditPayload | null = null;

const draft = reactive<ProfileEditPayload>({
  avatar: props.avatar,
  name: props.name,
  email: props.email,
});

const syncDraft = () => {
  draft.avatar = props.avatar;
  draft.name = props.name;
  draft.email = props.email;
};

const clearCloseTimer = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const startClose = (event: 'close' | 'confirm') => {
  if (isClosing.value) return;

  isClosing.value = true;
  clearCloseTimer();
  closeTimer = setTimeout(() => {
    isRendered.value = false;
    isClosing.value = false;
    closeTimer = null;
    if (event === 'confirm' && pendingPayload) {
      emit('confirm', pendingPayload);
      pendingPayload = null;
    } else {
      pendingPayload = null;
      emit('close');
    }
  }, CLOSE_DURATION_MS);
};

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      clearCloseTimer();
      syncDraft();
      isRendered.value = true;
      isClosing.value = false;
      pendingPayload = null;
      return;
    }

    if (isRendered.value && !isClosing.value) {
      startClose('close');
    }
  },
);

const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const path = res.tempFilePaths[0];
      if (path) draft.avatar = path;
    },
  });
};

const handleClose = () => {
  startClose('close');
};

const handleConfirm = () => {
  pendingPayload = {
    avatar: draft.avatar,
    name: draft.name.trim() || props.name,
    email: draft.email.trim() || props.email,
  };
  startClose('confirm');
};
</script>

<style scoped>
.profile-edit-root {
  position: fixed;
  inset: 0;
  z-index: 2500;
}

.profile-edit-mask {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  animation: profile-edit-mask-in 320ms ease forwards;
}

.profile-edit-mask.closing {
  animation: profile-edit-mask-out 320ms ease forwards;
}

.profile-edit-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 78vh;
  background-color: #f4f5f7;
  border-radius: 40rpx 40rpx 0 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  animation: profile-edit-slide-up 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.profile-edit-panel.closing {
  animation: profile-edit-slide-down 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.profile-edit-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 104rpx;
  flex-shrink: 0;
}

.profile-edit-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.profile-edit-close {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-edit-close-text {
  font-size: 48rpx;
  line-height: 1;
  color: #9ca3af;
}

.profile-edit-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8rpx 48rpx 24rpx;
  box-sizing: border-box;
}

.avatar-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48rpx;
}

.avatar-ring {
  width: 168rpx;
  height: 168rpx;
  border-radius: 50%;
  padding: 6rpx;
  background-color: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.08);
  box-sizing: border-box;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
  background-color: #f8aba6;
}

.avatar-hint {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.field {
  margin-bottom: 32rpx;
}

.field-label {
  display: block;
  margin-bottom: 12rpx;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.field-input {
  width: 100%;
  height: 96rpx;
  padding: 0 32rpx;
  border-radius: 28rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #ffffff;
  font-size: 30rpx;
  color: #111827;
  box-sizing: border-box;
}

.field-placeholder {
  color: #d1d5db;
}

.profile-edit-footer {
  flex-shrink: 0;
  padding: 16rpx 48rpx calc(24rpx + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.profile-edit-confirm {
  height: 96rpx;
  border-radius: 48rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-edit-confirm-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1;
}

@keyframes profile-edit-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes profile-edit-slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes profile-edit-mask-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes profile-edit-mask-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
