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

      <view class="map-card" @click.stop="openMapPicker">
        <MapScene
          compact
          :label="selectedLocationName"
          :shift-x="selectedShift.x"
          :shift-y="selectedShift.y"
        />
        <view v-if="!selectedLocationName" class="map-card-mask">
          <text class="map-card-hint">点击地图选择位置</text>
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

    <SlideOverPanel :show="mapPickerVisible" :z-index="2500" content-safe-top>
      <MapLocationPickerContent
        :city="form.city"
        :selected-name="selectedLocationName"
        @back="closeMapPicker"
        @select="handleMapSelect"
      />
    </SlideOverPanel>
  </view>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch } from 'vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import MapScene from '@/components/MapScene.vue';
import MapLocationPickerContent from '@/components/MapLocationPickerContent.vue';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBackWhen } from '@/composables/usePageBack';
import { findPoiByName, type MapPoi } from '@/composables/useMapLocations';

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
const {
  visible: mapPickerVisible,
  open: openMapPicker,
  close: closeMapPicker,
} = useSlideOver();
usePageBackWhen(mapPickerVisible, closeMapPicker);

const selectedLocationName = ref(props.initialValues.detail.trim());
const selectedShift = ref({ x: 0, y: 0 });

const syncSelectedPoi = (name: string, city?: string) => {
  const poi = findPoiByName(name, city);
  selectedLocationName.value = poi?.name || name;
  selectedShift.value = {
    x: poi?.shiftX ?? 0,
    y: poi?.shiftY ?? 0,
  };
};

syncSelectedPoi(props.initialValues.detail, props.initialValues.city);

watch(
  () => props.initialValues,
  (values) => {
    Object.assign(form, values);
    syncSelectedPoi(values.detail, values.city);
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

const handleMapSelect = (poi: MapPoi) => {
  form.province = poi.province;
  form.city = poi.city;
  form.district = poi.district;
  form.detail = poi.name;
  syncSelectedPoi(poi.name, poi.city);
  closeMapPicker();
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

.map-card {
  position: relative;
  width: 100%;
  height: 280rpx;
  border-radius: 24rpx;
  overflow: hidden;
  background-color: #ececec;
  box-sizing: border-box;
}

.map-card-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 48rpx 24rpx 20rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.92) 62%);
  z-index: 3;
}

.map-card-hint {
  font-size: 26rpx;
  font-weight: 600;
  color: #4b5563;
  line-height: 1.3;
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
