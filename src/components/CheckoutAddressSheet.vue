<template>
  <view v-if="isRendered" class="address-sheet-root">
    <view class="address-sheet-mask" :class="{ closing: isClosing }" @click="handleCancel" />
    <view class="address-sheet-panel" :class="{ closing: isClosing }">
      <view class="address-sheet-content" :class="{ 'is-hidden': !contentVisible }">
        <view v-if="viewMode === 'list'" class="address-sheet-header">
          <text class="address-sheet-title">选择服务方地址</text>
          <view class="address-sheet-add" @click="handleAdd">
            <image src="/static/icons/plus.svg" mode="aspectFit" class="address-sheet-add-icon" />
            <text class="address-sheet-add-text">新增</text>
          </view>
        </view>

        <view v-else class="address-sheet-header">
          <text class="address-sheet-title">{{ formTitle }}</text>
          <text class="address-sheet-back" @click="handleBackToList">返回列表</text>
        </view>

        <view class="address-sheet-body">
          <view v-if="viewMode === 'list'" class="address-sheet-list">
            <view
              v-for="item in addresses"
              :key="item.id"
              class="address-option-card"
              :class="{ active: item.id === draftSelectedId }"
              @click="selectAddress(item.id)"
            >
              <view class="address-option-top">
                <view class="address-option-icon-wrap">
                  <image src="/static/icons/map-pin.svg" mode="aspectFit" class="address-option-icon" />
                </view>
                <text class="address-option-title">{{ item.address }}</text>
                <view class="address-option-edit" @click.stop="handleEdit(item.id)">
                  <image src="/static/icons/edit.svg" mode="aspectFit" class="address-option-edit-icon" />
                </view>
              </view>

              <view class="address-option-grid">
                <view class="address-option-field">
                  <text class="address-option-label">所在地区</text>
                  <text class="address-option-value">{{ item.region }}</text>
                </view>
                <view class="address-option-field">
                  <text class="address-option-label">联系人</text>
                  <text class="address-option-value">{{ item.contact }}</text>
                </view>
              </view>

              <view class="address-option-field">
                <text class="address-option-label">联系电话</text>
                <text class="address-option-value">{{ item.phone }}</text>
              </view>
            </view>
          </view>

          <view v-else class="address-form">
            <view class="address-form-row address-form-row-2">
              <view class="address-form-field">
                <text class="address-form-label">联系人</text>
                <input
                  v-model="form.contact"
                  class="address-form-input"
                  type="text"
                  placeholder="请输入联系人"
                  placeholder-class="address-form-placeholder"
                  :maxlength="20"
                />
              </view>
              <view class="address-form-field">
                <text class="address-form-label">联系电话</text>
                <input
                  v-model="form.phone"
                  class="address-form-input"
                  type="number"
                  placeholder="请输入联系电话"
                  placeholder-class="address-form-placeholder"
                  :maxlength="11"
                />
              </view>
            </view>

            <view class="address-form-field">
              <text class="address-form-label">所在地区</text>
              <input
                v-model="form.region"
                class="address-form-input"
                type="text"
                placeholder="请输入所在地区"
                placeholder-class="address-form-placeholder"
                :maxlength="50"
              />
            </view>

            <view class="address-form-field">
              <text class="address-form-label">详细地址</text>
              <input
                v-model="form.detail"
                class="address-form-input"
                type="text"
                placeholder="请输入详细地址"
                placeholder-class="address-form-placeholder"
                :maxlength="100"
              />
            </view>
          </view>
        </view>
      </view>

      <view class="address-sheet-footer">
        <view
          class="address-sheet-confirm"
          :class="{ active: isConfirmEnabled }"
          @click="handleConfirm"
        >
          <text class="address-sheet-confirm-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';

export interface CheckoutAddressItem {
  id: string;
  address: string;
  region: string;
  contact: string;
  phone: string;
}

export interface CheckoutAddressFormValues {
  contact: string;
  phone: string;
  region: string;
  detail: string;
}

const props = defineProps<{
  show: boolean;
  addresses: CheckoutAddressItem[];
  selectedId: string;
}>();

const emit = defineEmits<{
  close: [];
  select: [id: string];
  create: [values: CheckoutAddressFormValues];
  update: [id: string, values: CheckoutAddressFormValues];
}>();

const CLOSE_DURATION_MS = 320;
const CONTENT_FADE_MS = 200;

type ViewMode = 'list' | 'add' | 'edit';

const emptyForm = (): CheckoutAddressFormValues => ({
  contact: '',
  phone: '',
  region: '',
  detail: '',
});

const isRendered = ref(false);
const isClosing = ref(false);
const viewMode = ref<ViewMode>('list');
const contentVisible = ref(true);
const draftSelectedId = ref('');
const editingId = ref('');
const initialForm = ref<CheckoutAddressFormValues>(emptyForm());
const form = reactive<CheckoutAddressFormValues>(emptyForm());

let closeTimer: ReturnType<typeof setTimeout> | null = null;
let contentTimer: ReturnType<typeof setTimeout> | null = null;

const clearCloseTimer = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const clearContentTimer = () => {
  if (contentTimer) {
    clearTimeout(contentTimer);
    contentTimer = null;
  }
};

const resetForm = () => {
  Object.assign(form, emptyForm());
  initialForm.value = emptyForm();
  editingId.value = '';
};

const toFormValues = (item: CheckoutAddressItem): CheckoutAddressFormValues => {
  const detail = item.address.startsWith(item.region)
    ? item.address.slice(item.region.length)
    : item.address;

  return {
    contact: item.contact,
    phone: item.phone,
    region: item.region,
    detail,
  };
};

const setFormValues = (values: CheckoutAddressFormValues) => {
  form.contact = values.contact;
  form.phone = values.phone;
  form.region = values.region;
  form.detail = values.detail;
  initialForm.value = { ...values };
};

const resetSheetState = () => {
  clearContentTimer();
  viewMode.value = 'list';
  contentVisible.value = true;
  resetForm();
};

const switchView = (mode: ViewMode) => {
  if (viewMode.value === mode) return;

  clearContentTimer();
  contentVisible.value = false;
  contentTimer = setTimeout(() => {
    viewMode.value = mode;
    contentVisible.value = true;
    contentTimer = null;
  }, CONTENT_FADE_MS);
};

const formTitle = computed(() => (viewMode.value === 'edit' ? '修改地址' : '新增地址'));

const normalizedForm = computed(() => ({
  contact: form.contact.trim(),
  phone: form.phone.trim(),
  region: form.region.trim(),
  detail: form.detail.trim(),
}));

const isFormFilled = computed(() =>
  normalizedForm.value.contact !== ''
  && normalizedForm.value.phone !== ''
  && normalizedForm.value.region !== ''
  && normalizedForm.value.detail !== '',
);

const isFormChanged = computed(() =>
  normalizedForm.value.contact !== initialForm.value.contact.trim()
  || normalizedForm.value.phone !== initialForm.value.phone.trim()
  || normalizedForm.value.region !== initialForm.value.region.trim()
  || normalizedForm.value.detail !== initialForm.value.detail.trim(),
);

const isConfirmEnabled = computed(() => {
  if (viewMode.value === 'add') {
    return isFormFilled.value;
  }
  if (viewMode.value === 'edit') {
    return isFormFilled.value && isFormChanged.value;
  }
  return true;
});

const startClose = (event: 'close' | 'select') => {
  if (isClosing.value) return;

  isClosing.value = true;
  clearCloseTimer();
  closeTimer = setTimeout(() => {
    isRendered.value = false;
    isClosing.value = false;
    closeTimer = null;
    resetSheetState();
    if (event === 'select') {
      emit('select', draftSelectedId.value);
    } else {
      emit('close');
    }
  }, CLOSE_DURATION_MS);
};

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      clearCloseTimer();
      isRendered.value = true;
      isClosing.value = false;
      resetSheetState();
      draftSelectedId.value = props.selectedId;
      return;
    }

    if (isRendered.value && !isClosing.value) {
      startClose('close');
    }
  },
);

watch(
  () => props.selectedId,
  (id) => {
    draftSelectedId.value = id;
  },
);

const selectAddress = (id: string) => {
  draftSelectedId.value = id;
};

const handleConfirm = () => {
  if (!isConfirmEnabled.value) return;

  if (viewMode.value === 'add') {
    emit('create', { ...normalizedForm.value });
    resetForm();
    switchView('list');
    return;
  }

  if (viewMode.value === 'edit') {
    emit('update', editingId.value, { ...normalizedForm.value });
    resetForm();
    switchView('list');
    return;
  }

  startClose('select');
};

const handleCancel = () => {
  if (viewMode.value === 'add' || viewMode.value === 'edit') {
    resetForm();
    switchView('list');
    return;
  }

  startClose('close');
};

const handleAdd = () => {
  resetForm();
  switchView('add');
};

const handleBackToList = () => {
  resetForm();
  switchView('list');
};

const handleEdit = (id: string) => {
  const item = props.addresses.find((address) => address.id === id);
  if (!item) return;

  editingId.value = id;
  setFormValues(toFormValues(item));
  switchView('edit');
};
</script>

<style scoped>
.address-sheet-root {
  position: fixed;
  inset: 0;
  z-index: 1400;
}

.address-sheet-mask {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  animation: address-sheet-mask-in 320ms ease forwards;
}

.address-sheet-mask.closing {
  animation: address-sheet-mask-out 320ms ease forwards;
}

.address-sheet-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 72vh;
  max-height: 72vh;
  background-color: #ffffff;
  border-radius: 40rpx 40rpx 0 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  animation: address-sheet-slide-up 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.address-sheet-panel.closing {
  animation: address-sheet-slide-down 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.address-sheet-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  opacity: 1;
  transition: opacity 200ms ease;
}

.address-sheet-content.is-hidden {
  opacity: 0;
}

.address-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 36rpx 40rpx 28rpx;
  flex-shrink: 0;
  border-bottom: 2rpx solid #f3f4f6;
}

.address-sheet-title {
  flex: 1;
  min-width: 0;
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}

.address-sheet-back {
  flex-shrink: 0;
  font-size: 28rpx;
  font-weight: 600;
  color: #9ca3af;
  line-height: 1;
}

.address-sheet-add {
  height: 72rpx;
  padding: 0 28rpx;
  border-radius: 36rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
}

.address-sheet-add-icon {
  width: 32rpx;
  height: 32rpx;
}

.address-sheet-add-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1;
}

.address-sheet-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.address-sheet-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 32rpx 40rpx;
  box-sizing: border-box;
}

.address-option-card {
  padding: 32rpx;
  border-radius: 32rpx;
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
  box-sizing: border-box;
}

.address-option-card.active {
  background-color: #f0fdf4;
  border-color: #9fe870;
}

.address-option-top {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.address-option-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background-color: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.address-option-card.active .address-option-icon-wrap {
  background-color: #dcfce7;
}

.address-option-icon {
  width: 36rpx;
  height: 36rpx;
  filter: brightness(0) saturate(100%) invert(8%) sepia(41%) saturate(1097%) hue-rotate(62deg) brightness(98%) contrast(103%);
}

.address-option-title {
  flex: 1;
  min-width: 0;
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.45;
}

.address-option-edit {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.address-option-edit-icon {
  width: 36rpx;
  height: 36rpx;
  opacity: 0.45;
}

.address-option-grid {
  display: flex;
  gap: 32rpx;
  margin-bottom: 24rpx;
}

.address-option-field {
  flex: 1;
  min-width: 0;
}

.address-option-label {
  display: block;
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.3;
  margin-bottom: 8rpx;
}

.address-option-value {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding: 40rpx;
  box-sizing: border-box;
}

.address-form-row {
  display: flex;
  gap: 24rpx;
}

.address-form-row-2 .address-form-field {
  flex: 1;
  min-width: 0;
}

.address-form-field {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.address-form-label {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.address-form-input {
  width: 100%;
  height: 88rpx;
  padding: 0 28rpx;
  border-radius: 24rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #ffffff;
  font-size: 28rpx;
  color: #111827;
  box-sizing: border-box;
}

.address-form-placeholder {
  color: #d1d5db;
  font-size: 28rpx;
}

.address-sheet-footer {
  flex-shrink: 0;
  padding: 24rpx 40rpx calc(24rpx + env(safe-area-inset-bottom, 0px));
  border-top: 2rpx solid #f3f4f6;
  box-sizing: border-box;
}

.address-sheet-confirm {
  height: 96rpx;
  border-radius: 48rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.address-sheet-confirm.active {
  background-color: #9fe870;
}

.address-sheet-confirm-text {
  font-size: 32rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  line-height: 1;
  transition: color 0.2s ease;
}

.address-sheet-confirm.active .address-sheet-confirm-text {
  color: #163300;
}

@keyframes address-sheet-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes address-sheet-slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes address-sheet-mask-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes address-sheet-mask-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
