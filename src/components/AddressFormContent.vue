<template>
  <view class="address-form">
    <text class="page-title">{{ pageTitle }}</text>

    <view class="form-grid">
      <view class="form-row form-row-2">
        <view class="field-group">
          <text class="field-label">联系人</text>
          <input
            v-model="form.contact"
            class="field-input"
            placeholder="请输入联系人"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="field-group">
          <text class="field-label">联系电话</text>
          <input
            v-model="form.phone"
            class="field-input"
            type="number"
            maxlength="11"
            placeholder="请输入联系电话"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <view class="form-row form-row-3">
        <view class="field-group">
          <text class="field-label">省</text>
          <input
            v-model="form.province"
            class="field-input"
            placeholder="请输入省份"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="field-group">
          <text class="field-label">市</text>
          <input
            v-model="form.city"
            class="field-input"
            placeholder="请输入城市"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="field-group">
          <text class="field-label">区/县</text>
          <input
            v-model="form.district"
            class="field-input"
            placeholder="请输入区/县"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <view class="form-row">
        <view class="field-group field-group-full">
          <text class="field-label">详细地址</text>
          <textarea
            v-model="form.detail"
            class="field-textarea"
            placeholder="请输入详细地址"
            placeholder-class="input-placeholder"
            :maxlength="200"
            auto-height
          />
        </view>
      </view>

      <view class="submit-wrap">
        <view class="submit-btn" :class="{ active: isConfirmEnabled }" @click="handleConfirm">
          <text class="submit-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';

export type AddressFormValues = {
  contact: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
};

const props = withDefaults(
  defineProps<{
    initialValues: AddressFormValues;
    mode?: 'add' | 'edit';
  }>(),
  {
    mode: 'add',
  },
);

const emit = defineEmits<{
  confirm: [values: AddressFormValues];
}>();

const form = reactive<AddressFormValues>({ ...props.initialValues });

watch(
  () => props.initialValues,
  (values) => {
    Object.assign(form, values);
  },
  { deep: true },
);

const pageTitle = computed(() => (props.mode === 'edit' ? '修改地址信息' : '地址信息'));

const isFormFilled = computed(() =>
  form.contact.trim() !== ''
  && form.phone.trim() !== ''
  && form.province.trim() !== ''
  && form.city.trim() !== ''
  && form.district.trim() !== ''
  && form.detail.trim() !== '',
);

const isFormChanged = computed(() =>
  form.contact !== props.initialValues.contact
  || form.phone !== props.initialValues.phone
  || form.province !== props.initialValues.province
  || form.city !== props.initialValues.city
  || form.district !== props.initialValues.district
  || form.detail !== props.initialValues.detail,
);

const isConfirmEnabled = computed(() => {
  if (!isFormFilled.value) return false;
  if (props.mode === 'edit') return isFormChanged.value;
  return true;
});

const handleConfirm = () => {
  if (!isConfirmEnabled.value) return;
  emit('confirm', { ...form });
};
</script>

<style scoped>
.address-form {
  min-height: 100%;
  padding: 64rpx 48rpx 80rpx;
  box-sizing: border-box;
}

.page-title {
  display: block;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
  margin-bottom: 56rpx;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.form-row {
  display: flex;
  gap: 24rpx;
}

.form-row-2 .field-group {
  flex: 1;
  min-width: 0;
}

.form-row-3 .field-group {
  flex: 1;
  min-width: 0;
}

.field-group-full {
  width: 100%;
}

.field-label {
  display: block;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.field-input {
  width: 100%;
  height: 96rpx;
  padding: 0 28rpx;
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
  border-radius: 24rpx;
  font-size: 28rpx;
  color: #111827;
  box-sizing: border-box;
}

.field-textarea {
  width: 100%;
  min-height: 192rpx;
  padding: 24rpx 28rpx;
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
  border-radius: 24rpx;
  font-size: 28rpx;
  color: #111827;
  line-height: 1.5;
  box-sizing: border-box;
}

.input-placeholder {
  color: #d1d5db;
  font-size: 28rpx;
}

.submit-wrap {
  padding-top: 48rpx;
}

.submit-btn {
  width: 100%;
  height: 104rpx;
  border-radius: 52rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, opacity 0.2s ease;
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
</style>
