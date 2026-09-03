<template>
  <view v-if="isRendered" class="contact-sheet-root" :style="rootStyle">
    <view class="contact-sheet-mask" :class="{ closing: isClosing }" @click="handleClose" />
    <view class="contact-sheet-panel" :class="{ closing: isClosing }">
      <view class="contact-sheet-header">
        <text class="contact-sheet-title">现场联系人</text>
        <view
          v-if="draftContacts.length < MAX_CONTACTS"
          class="contact-add-btn"
          :class="{ active: canAdd }"
          @click="addContact"
        >
          <text class="contact-add-btn-text">添加</text>
        </view>
        <view class="contact-sheet-close" @click="handleClose">
          <text class="contact-sheet-close-text">×</text>
        </view>
      </view>

      <view class="contact-sheet-body">
        <view v-if="draftContacts.length" class="contact-list">
          <view
            v-for="item in draftContacts"
            :key="item.id"
            class="contact-card"
          >
            <view class="contact-card-main">
              <text class="contact-card-name">{{ item.name }} · {{ item.position }}</text>
              <text class="contact-card-phone">{{ item.phone }}</text>
            </view>
            <view class="contact-card-remove" @click="removeContact(item.id)">
              <text class="contact-card-remove-text">删除</text>
            </view>
          </view>
        </view>

        <view v-if="draftContacts.length < MAX_CONTACTS" class="contact-form">
          <view class="contact-form-field">
            <text class="contact-form-label">
              <text class="required">*</text>
              姓名
            </text>
            <input
              v-model="form.name"
              class="contact-form-input"
              type="text"
              placeholder="请输入姓名"
              placeholder-class="contact-form-placeholder"
              :maxlength="20"
            />
          </view>
          <view class="contact-form-field">
            <text class="contact-form-label">
              <text class="required">*</text>
              职位
            </text>
            <input
              v-model="form.position"
              class="contact-form-input"
              type="text"
              placeholder="请输入职位"
              placeholder-class="contact-form-placeholder"
              :maxlength="20"
            />
          </view>
          <view class="contact-form-field">
            <text class="contact-form-label">
              <text class="required">*</text>
              手机号
            </text>
            <input
              v-model="form.phone"
              class="contact-form-input"
              type="number"
              placeholder="请输入手机号"
              placeholder-class="contact-form-placeholder"
              :maxlength="11"
            />
          </view>
        </view>

        <text class="contact-sheet-hint">最多添加 3 人</text>
      </view>

      <view class="contact-sheet-footer">
        <view class="contact-sheet-confirm" @click="handleConfirm">
          <text class="contact-sheet-confirm-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { SiteContact } from '@/composables/useProcessAcceptance';

const MAX_CONTACTS = 3;
const PHONE_PATTERN = /^1\d{10}$/;

const props = withDefaults(
  defineProps<{
    show: boolean;
    contacts: SiteContact[];
    zIndex?: number;
  }>(),
  {
    zIndex: 2500,
  },
);

const emit = defineEmits<{
  close: [];
  confirm: [contacts: SiteContact[]];
}>();

const CLOSE_DURATION_MS = 320;
const isRendered = ref(false);
const isClosing = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const draftContacts = ref<SiteContact[]>([]);
const form = reactive({
  name: '',
  position: '',
  phone: '',
});

const rootStyle = computed(() => ({
  zIndex: props.zIndex,
}));

const canAdd = computed(() => {
  if (draftContacts.value.length >= MAX_CONTACTS) return false;
  return (
    form.name.trim().length > 0 &&
    form.position.trim().length > 0 &&
    PHONE_PATTERN.test(form.phone.trim())
  );
});

const resetForm = () => {
  form.name = '';
  form.position = '';
  form.phone = '';
};

const syncDraft = () => {
  draftContacts.value = props.contacts.map((item) => ({ ...item }));
  resetForm();
};

const clearCloseTimer = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const finishClose = (event: 'close' | 'confirm') => {
  isRendered.value = false;
  isClosing.value = false;
  closeTimer = null;
  if (event === 'confirm') {
    emit('confirm', draftContacts.value.map((item) => ({ ...item })));
    return;
  }
  emit('close');
};

const startClose = (event: 'close' | 'confirm') => {
  if (isClosing.value) return;
  isClosing.value = true;
  clearCloseTimer();
  closeTimer = setTimeout(() => finishClose(event), CLOSE_DURATION_MS);
};

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      clearCloseTimer();
      syncDraft();
      isRendered.value = true;
      isClosing.value = false;
      return;
    }
    if (isRendered.value) {
      startClose('close');
    }
  },
);

const removeContact = (id: string) => {
  draftContacts.value = draftContacts.value.filter((item) => item.id !== id);
};

const invalidContactMessage = () => {
  if (
    !form.name.trim() ||
    !form.position.trim() ||
    !form.phone.trim()
  ) {
    return '请填写完整联系人信息';
  }
  return '请输入正确的手机号';
};

const addContact = () => {
  if (!canAdd.value) {
    uni.showToast({
      title: invalidContactMessage(),
      icon: 'none',
    });
    return;
  }
  draftContacts.value = [
    ...draftContacts.value,
    {
      id: `contact-${Date.now()}`,
      name: form.name.trim(),
      position: form.position.trim(),
      phone: form.phone.trim(),
    },
  ];
  resetForm();
};

const tryAddPending = () => {
  const hasPending =
    form.name.trim() || form.position.trim() || form.phone.trim();
  if (!hasPending) return true;
  if (!canAdd.value) {
    uni.showToast({
      title: invalidContactMessage(),
      icon: 'none',
    });
    return false;
  }
  addContact();
  return true;
};

const handleClose = () => {
  startClose('close');
};

const handleConfirm = () => {
  if (!tryAddPending()) return;
  startClose('confirm');
};
</script>

<style scoped>
.contact-sheet-root {
  position: fixed;
  inset: 0;
}

.contact-sheet-mask {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  opacity: 1;
  animation: contact-sheet-mask-in 320ms ease forwards;
}

.contact-sheet-mask.closing {
  animation: contact-sheet-mask-out 320ms ease forwards;
}

.contact-sheet-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 72vh;
  min-height: 48vh;
  background-color: #ffffff;
  border-radius: 40rpx 40rpx 0 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  animation: contact-sheet-slide-up 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.contact-sheet-panel.closing {
  animation: contact-sheet-slide-down 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.contact-sheet-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 104rpx;
  flex-shrink: 0;
  border-bottom: 2rpx solid #f3f4f6;
}

.contact-sheet-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.contact-sheet-close {
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

.contact-sheet-close-text {
  font-size: 48rpx;
  line-height: 1;
  color: #9ca3af;
}

.contact-add-btn {
  position: absolute;
  left: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  height: 56rpx;
  padding: 0 28rpx;
  border-radius: 1998rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-sheet-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 28rpx 40rpx 16rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.contact-sheet-hint {
  display: block;
  margin-top: auto;
  padding-top: 24rpx;
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 28rpx;
}

.contact-card {
  padding: 24rpx 28rpx;
  border-radius: 24rpx;
  background-color: #f8faf9;
  border: 2rpx solid #eef0ea;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.contact-card-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.contact-card-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
}

.contact-card-phone {
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.3;
}

.contact-card-remove {
  flex-shrink: 0;
  padding: 8rpx 4rpx;
}

.contact-card-remove-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #ef4444;
  line-height: 1;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.contact-form-field {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.contact-form-label {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.required {
  color: #ef4444;
  margin-right: 4rpx;
}

.contact-form-input {
  width: 100%;
  height: 88rpx;
  padding: 0 28rpx;
  border-radius: 24rpx;
  border: 2rpx solid #eef0ea;
  background-color: #f8faf9;
  font-size: 28rpx;
  color: #111827;
  box-sizing: border-box;
}

.contact-form-placeholder {
  color: #d1d5db;
}

.contact-add-btn.active {
  background-color: #9fe870;
}

.contact-add-btn-text {
  font-size: 28rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  line-height: 1;
}

.contact-add-btn.active .contact-add-btn-text {
  color: #163300;
}

.contact-sheet-footer {
  flex-shrink: 0;
  padding: 24rpx 40rpx calc(24rpx + env(safe-area-inset-bottom, 0px));
  border-top: 2rpx solid #f3f4f6;
  box-sizing: border-box;
}

.contact-sheet-confirm {
  height: 96rpx;
  border-radius: 48rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-sheet-confirm-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1;
}

@keyframes contact-sheet-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes contact-sheet-slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes contact-sheet-mask-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes contact-sheet-mask-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
