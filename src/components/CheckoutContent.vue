<template>
  <view class="checkout-page">
    <view class="page-header">
      <view class="header-top-row">
        <view class="icon-btn" @click="handleBack">
          <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
        </view>
        <text class="header-title">确认订单</text>
        <view class="header-placeholder" />
      </view>
    </view>

    <scroll-view scroll-y class="detail-scroll" :show-scrollbar="false">
      <view class="address-card address-card--clickable" @click="openAddressSheet">
        <view class="address-icon-wrap">
          <image src="/static/icons/map-pin.svg" mode="aspectFit" class="address-icon" />
        </view>
        <view class="address-info" :class="{ 'is-hidden': !addressInfoVisible }">
          <text class="address-contact">{{ displayedAddress.contact }} {{ displayedAddress.phone }}</text>
          <text class="address-text">{{ displayedAddress.address }}</text>
        </view>
      </view>

      <view class="section-card">
        <view class="section-head">
          <text class="section-title">订单商品</text>
          <text class="section-hint">共 {{ totalQuantity }} 件</text>
        </view>

        <view class="product-list">
          <view v-for="item in items" :key="item.cartKey" class="checkout-item-card">
            <view class="item-image-wrap">
              <image :src="item.image" mode="aspectFill" class="item-image" />
            </view>
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-spec">{{ item.spec }}</text>
              <view class="item-price-row">
                <text class="item-price">¥{{ item.price }}</text>
                <text class="item-qty">×{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="meta-list">
          <view class="meta-row">
            <text class="meta-label">确认编号</text>
            <view class="meta-value-group">
              <text class="meta-value">{{ confirmNo }}</text>
              <view class="meta-chevron-slot" />
            </view>
          </view>

          <view class="meta-row meta-row--clickable" @click="openEditSheet('serviceDate')">
            <text class="meta-label">选择服务时间</text>
            <view class="meta-value-group">
              <text class="meta-value" :class="{ 'meta-value--placeholder': !serviceDate }">
                {{ serviceDateDisplay }}
              </text>
              <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
            </view>
          </view>

          <view class="meta-row meta-row--clickable" @click="openEditSheet('purchaser')">
            <text class="meta-label">采购方</text>
            <view class="meta-value-group">
              <text class="meta-value">{{ purchaser }}</text>
              <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
            </view>
          </view>

          <view class="meta-row">
            <text class="meta-label">支付方式</text>
            <view class="meta-value-group">
              <text class="meta-value">{{ paymentMethod }}</text>
              <view class="meta-chevron-slot" />
            </view>
          </view>

          <view class="meta-row meta-row--clickable" @click="openEditSheet('paymentTerm')">
            <text class="meta-label">支付期限</text>
            <view class="meta-value-group">
              <text class="meta-value">{{ paymentTerm }} 天</text>
              <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
            </view>
          </view>

          <view class="meta-row">
            <text class="meta-label">工期</text>
            <view class="meta-value-group">
              <text class="meta-value">{{ workDuration }} 天</text>
              <view class="meta-chevron-slot" />
            </view>
          </view>

          <view class="meta-row meta-row--clickable" @click="openEditSheet('remarks')">
            <text class="meta-label">备注</text>
            <view class="meta-value-group">
              <text class="meta-value" :class="{ 'meta-value--placeholder': !remarks }">
                {{ remarksDisplay }}
              </text>
              <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
            </view>
          </view>

          <view class="meta-row meta-row-amount">
            <text class="meta-label">订单金额</text>
            <view class="meta-value-group">
              <text class="meta-value meta-value-strong">¥{{ orderAmount }}</text>
              <view class="meta-chevron-slot" />
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-spacer" />
    </scroll-view>

    <view class="submit-footer">
      <view class="submit-btn" @click="handleSubmit">
        <text class="submit-text">提交订单</text>
      </view>
    </view>

    <CheckoutEditSheet
      :show="activeSheet !== null"
      :title="sheetTitle"
      @close="closeEditSheet"
      @confirm="confirmEditSheet"
    >
      <template v-if="activeSheet === 'serviceDate'">
        <DateWheelPicker v-model="draftServiceDate" />
      </template>

      <template v-else-if="activeSheet === 'purchaser'">
        <input
          v-model="draftPurchaser"
          class="sheet-input"
          type="text"
          placeholder="请输入采购方名称"
          placeholder-class="sheet-input-placeholder"
          :maxlength="50"
        />
      </template>

      <template v-else-if="activeSheet === 'paymentTerm'">
        <view class="sheet-option-list">
          <view
            v-for="option in paymentTermOptions"
            :key="option"
            class="sheet-option"
            :class="{ active: draftPaymentTerm === option }"
            @click="draftPaymentTerm = option"
          >
            <text class="sheet-option-text">{{ option }} 天</text>
            <image
              v-if="draftPaymentTerm === option"
              src="/static/icons/check.svg"
              mode="aspectFit"
              class="sheet-option-check"
            />
          </view>
        </view>
      </template>

      <template v-else-if="activeSheet === 'remarks'">
        <view class="sheet-textarea-wrap">
          <textarea
            v-model="draftRemarks"
            class="sheet-textarea"
            placeholder="选填，请先和商家协商一致，付款后商家可见"
            placeholder-class="sheet-textarea-placeholder"
            :maxlength="200"
          />
          <text class="sheet-textarea-count">{{ draftRemarks.length }}/200</text>
        </view>
      </template>
    </CheckoutEditSheet>

    <CheckoutAddressSheet
      :show="addressSheetVisible"
      :addresses="serviceAddresses"
      :selected-id="selectedAddressId"
      @close="closeAddressSheet"
      @select="handleAddressSelect"
      @create="handleAddressCreate"
      @update="handleAddressUpdate"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { CartItem } from '@/composables/useCart';
import CheckoutAddressSheet, {
  type CheckoutAddressFormValues,
  type CheckoutAddressItem,
} from '@/components/CheckoutAddressSheet.vue';
import CheckoutEditSheet from '@/components/CheckoutEditSheet.vue';
import DateWheelPicker from '@/components/DateWheelPicker.vue';

type EditField = 'serviceDate' | 'purchaser' | 'paymentTerm' | 'remarks';

const props = defineProps<{
  items: CartItem[];
  orderAmount: string;
}>();

const emit = defineEmits<{
  back: [];
  submit: [];
}>();

const buildConfirmNo = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const suffix = String(Math.floor(Math.random() * 900) + 100);
  return `JS-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${suffix}`;
};

const confirmNo = ref(buildConfirmNo());
const serviceDate = ref('');
const remarks = ref('');
const purchaser = ref('管理员');
const paymentMethod = '线上立即支付';
const paymentTerm = ref(7);
const workDuration = 1;

const paymentTermOptions = [3, 7, 14, 30];

const activeSheet = ref<EditField | null>(null);
const draftServiceDate = ref('');
const draftPurchaser = ref('管理员');
const draftPaymentTerm = ref(7);
const draftRemarks = ref('');

const sheetTitles: Record<EditField, string> = {
  serviceDate: '选择服务时间',
  purchaser: '采购方',
  paymentTerm: '支付期限',
  remarks: '备注',
};

const serviceAddresses = ref<CheckoutAddressItem[]>([
  {
    id: '1',
    address: '北京市海淀区中关村大街 1 号海龙大厦 3 层',
    region: '北京市海淀区',
    contact: '管理员',
    phone: '138-0013-8000',
  },
  {
    id: '2',
    address: '北京市朝阳区住邦2000商务中心4号楼5层',
    region: '北京市朝阳区',
    contact: '张伟',
    phone: '13800138000',
  },
  {
    id: '3',
    address: '北京市东城区王府井大街88号',
    region: '北京市东城区',
    contact: '李明',
    phone: '13611112222',
  },
]);

const selectedAddressId = ref('1');
const addressSheetVisible = ref(false);
const addressInfoVisible = ref(true);

const ADDRESS_FADE_MS = 200;

const displayedAddress = ref({
  contact: '',
  phone: '',
  address: '',
});

let addressFadeTimer: ReturnType<typeof setTimeout> | null = null;

const syncDisplayedAddress = (id: string) => {
  const item = serviceAddresses.value.find((address) => address.id === id);
  if (!item) return;

  displayedAddress.value = {
    contact: item.contact,
    phone: item.phone,
    address: item.address,
  };
};

const animateAddressChange = (id: string) => {
  if (addressFadeTimer) {
    clearTimeout(addressFadeTimer);
    addressFadeTimer = null;
  }

  addressInfoVisible.value = false;
  addressFadeTimer = setTimeout(() => {
    syncDisplayedAddress(id);
    addressInfoVisible.value = true;
    addressFadeTimer = null;
  }, ADDRESS_FADE_MS);
};

watch(
  selectedAddressId,
  (newId, oldId) => {
    if (!oldId || newId === oldId) {
      syncDisplayedAddress(newId);
      return;
    }

    animateAddressChange(newId);
  },
  { immediate: true },
);

watch(
  () => serviceAddresses.value.find((item) => item.id === selectedAddressId.value),
  (item) => {
    if (!item) return;

    const isSameContent =
      displayedAddress.value.contact === item.contact
      && displayedAddress.value.phone === item.phone
      && displayedAddress.value.address === item.address;

    if (!isSameContent && addressInfoVisible.value) {
      syncDisplayedAddress(item.id);
    }
  },
  { deep: true },
);

const sheetTitle = computed(() =>
  activeSheet.value ? sheetTitles[activeSheet.value] : '',
);

const serviceDateDisplay = computed(() => {
  if (!serviceDate.value) return 'yyyy/mm/dd';
  return serviceDate.value.replace(/-/g, '/');
});

const remarksDisplay = computed(() => remarks.value.trim() || '无备注');

const totalQuantity = computed(() =>
  props.items.reduce((sum, item) => sum + item.quantity, 0),
);

const formatDateValue = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const openEditSheet = (field: EditField) => {
  activeSheet.value = field;
  draftServiceDate.value = serviceDate.value || formatDateValue(new Date());
  draftPurchaser.value = purchaser.value;
  draftPaymentTerm.value = paymentTerm.value;
  draftRemarks.value = remarks.value;
};

const closeEditSheet = () => {
  activeSheet.value = null;
};

const confirmEditSheet = () => {
  if (activeSheet.value === 'serviceDate') {
    serviceDate.value = draftServiceDate.value;
  } else if (activeSheet.value === 'purchaser') {
    purchaser.value = draftPurchaser.value.trim() || '管理员';
  } else if (activeSheet.value === 'paymentTerm') {
    paymentTerm.value = draftPaymentTerm.value;
  } else if (activeSheet.value === 'remarks') {
    remarks.value = draftRemarks.value.trim();
  }
  activeSheet.value = null;
};

const handleBack = () => {
  emit('back');
};

const openAddressSheet = () => {
  addressSheetVisible.value = true;
};

const closeAddressSheet = () => {
  addressSheetVisible.value = false;
};

const handleAddressSelect = (id: string) => {
  selectedAddressId.value = id;
  addressSheetVisible.value = false;
};

const handleAddressCreate = (values: CheckoutAddressFormValues) => {
  const id = `${Date.now()}`;
  serviceAddresses.value.unshift({
    id,
    address: `${values.region}${values.detail}`,
    region: values.region,
    contact: values.contact,
    phone: values.phone,
  });
  selectedAddressId.value = id;
};

const handleAddressUpdate = (id: string, values: CheckoutAddressFormValues) => {
  const index = serviceAddresses.value.findIndex((item) => item.id === id);
  if (index === -1) return;

  serviceAddresses.value[index] = {
    id,
    address: `${values.region}${values.detail}`,
    region: values.region,
    contact: values.contact,
    phone: values.phone,
  };
  selectedAddressId.value = id;
};

const handleSubmit = () => {
  uni.showToast({
    title: '提交订单成功',
    icon: 'success',
  });
  emit('submit');
};
</script>

<style scoped>
.checkout-page {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
}

.page-header {
  padding: 0 24px 16px;
  flex-shrink: 0;
}

.header-top-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.header-icon {
  width: 20px;
  height: 20px;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  line-height: 44px;
  pointer-events: none;
}

.header-placeholder {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.detail-scroll {
  flex: 1;
  min-height: 0;
  padding: 0 24px;
  box-sizing: border-box;
}

.address-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  margin-bottom: 16px;
}

.address-card--clickable:active {
  opacity: 0.92;
}

.address-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.address-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(8%) sepia(41%) saturate(1097%) hue-rotate(62deg) brightness(98%) contrast(103%);
}

.address-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 1;
  transition: opacity 200ms ease;
}

.address-info.is-hidden {
  opacity: 0;
}

.address-contact {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
}

.address-text {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.section-card {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  margin-bottom: 16px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-title {
  font-size: 15px;
  font-weight: 800;
  color: #111827;
}

.section-hint {
  font-size: 12px;
  color: #9ca3af;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkout-item-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  background-color: #f8fafc;
  border: 1px solid #eef2f7;
  box-sizing: border-box;
}

.item-image-wrap {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f3f4f6;
  flex-shrink: 0;
}

.item-image {
  width: 100%;
  height: 100%;
  display: block;
}

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-spec {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.3;
}

.item-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
}

.item-price {
  font-size: 16px;
  font-weight: 800;
  color: #163300;
  line-height: 1.1;
}

.item-qty {
  font-size: 13px;
  color: #9ca3af;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.meta-row--clickable:active {
  opacity: 0.72;
}

.meta-row-amount {
  padding-top: 10px;
  margin-top: 6px;
  border-top: 1px solid #f3f4f6;
}

.meta-label {
  width: 112px;
  font-size: 14px;
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
  gap: 6px;
}

.meta-value {
  flex: 1;
  min-width: 0;
  font-size: 14px;
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

.meta-chevron,
.meta-chevron-slot {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.meta-chevron-slot {
  flex-shrink: 0;
}

.meta-value-strong {
  font-size: 22px;
  font-weight: 800;
  color: #163300;
  line-height: 1.1;
}

.bottom-spacer {
  height: calc(24px + env(safe-area-inset-bottom, 0px));
}

.submit-footer {
  flex-shrink: 0;
  padding: 16px 24px calc(16px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  height: 52px;
  border-radius: 26px;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-text {
  font-size: 15px;
  font-weight: 700;
  color: #163300;
  line-height: 1;
}

.sheet-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  font-size: 15px;
  color: #374151;
  box-sizing: border-box;
}

.sheet-input-placeholder {
  color: #9ca3af;
}

.sheet-option-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sheet-option {
  min-height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
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
  font-size: 15px;
  color: #374151;
  line-height: 1.3;
}

.sheet-option.active .sheet-option-text {
  font-weight: 700;
  color: #163300;
}

.sheet-option-check {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.sheet-textarea-wrap {
  position: relative;
  min-height: 160px;
  padding: 14px 14px 32px;
  border-radius: 12px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.sheet-textarea {
  width: 100%;
  min-height: 120px;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.sheet-textarea-placeholder {
  color: #9ca3af;
}

.sheet-textarea-count {
  position: absolute;
  right: 14px;
  bottom: 10px;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1;
}
</style>
