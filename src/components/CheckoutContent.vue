<template>
  <view class="checkout-page">
    <scroll-view scroll-y class="detail-scroll" :show-scrollbar="false">
      <view class="page-top-spacer" />

      <view class="page-header">
        <view class="header-top-row">
          <view class="icon-btn" @click="handleBack">
            <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
          </view>
          <text class="header-title">确认订单</text>
          <view class="header-placeholder" />
        </view>
      </view>

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
          <view v-for="item in primaryItems" :key="item.cartKey" class="checkout-item-card">
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

          <view
            v-if="showProductToggle"
            class="product-list-extra"
            :class="{ expanded: productListExpanded }"
            :style="extraListStyle"
          >
            <view v-for="item in extraItems" :key="item.cartKey" class="checkout-item-card">
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

        <view v-if="showProductToggle" class="product-list-toggle" @click="toggleProductList">
          <image
            src="/static/icons/chevron-right.svg"
            mode="aspectFit"
            class="product-list-chevron"
            :class="{ expanded: productListExpanded }"
          />
        </view>
      </view>

      <view class="section-card" :class="{ 'section-card--purchase-growing': showPurchaseOrderDetails }">
        <view class="meta-list">
          <view
            v-if="showPurchaseOrderDetails"
            class="purchase-expand-slot purchase-expand-slot--top"
            :class="{ expanded: purchaseExpandActive }"
          >
            <view class="purchase-expand-inner purchase-expand-inner--top">
              <view class="purchase-content" :class="{ visible: purchaseContentVisible }">
                <view class="meta-row">
                  <text class="meta-label">确认单编号</text>
                  <view class="meta-value-group">
                    <text class="meta-value">{{ confirmationOrderNo }}</text>
                    <view class="meta-chevron-slot" />
                  </view>
                </view>
              </view>
            </view>
          </view>

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

          <view
            v-if="showPurchaseOrderDetails"
            class="purchase-expand-slot purchase-expand-slot--bottom"
            :class="{ expanded: purchaseExpandActive }"
          >
            <view class="purchase-expand-inner purchase-expand-inner--bottom">
              <view class="purchase-content" :class="{ visible: purchaseContentVisible }">
                <text class="meta-section-title">采购方信息</text>

                <view class="meta-row meta-row--clickable" @click="openEditSheet('buyerCompanyName')">
              <text class="meta-label">公司名称</text>
              <view class="meta-value-group">
                <text
                  class="meta-value"
                  :class="{ 'meta-value--placeholder': !buyerInfo.companyName.trim() }"
                >
                  {{ buyerCompanyDisplay }}
                </text>
                <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
              </view>
            </view>

            <view class="meta-row meta-row--wrap meta-row--clickable" @click="openEditSheet('buyerRegisteredAddress')">
              <text class="meta-label">注册地址</text>
              <view class="meta-value-group">
                <text
                  class="meta-value meta-value--wrap"
                  :class="{ 'meta-value--placeholder': !buyerInfo.registeredAddress.trim() }"
                >
                  {{ buyerAddressDisplay }}
                </text>
                <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
              </view>
            </view>

            <view class="meta-row meta-row--clickable" @click="openEditSheet('buyerContact')">
              <text class="meta-label">联系人</text>
              <view class="meta-value-group">
                <text
                  class="meta-value"
                  :class="{ 'meta-value--placeholder': !buyerInfo.contact.trim() }"
                >
                  {{ buyerContactDisplay }}
                </text>
                <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
              </view>
            </view>

            <view class="meta-row meta-row--clickable" @click="openEditSheet('buyerContactPhone')">
              <text class="meta-label">联系电话</text>
              <view class="meta-value-group">
                <text
                  class="meta-value"
                  :class="{ 'meta-value--placeholder': !buyerInfo.phone.trim() }"
                >
                  {{ buyerPhoneDisplay }}
                </text>
                <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
              </view>
            </view>

            <text class="meta-section-title meta-section-title--supplier">供应商信息</text>

            <view class="meta-row">
              <text class="meta-label">公司名称</text>
              <view class="meta-value-group">
                <text class="meta-value">{{ supplierInfo.companyName }}</text>
                <view class="meta-chevron-slot" />
              </view>
            </view>

            <view class="meta-row meta-row--wrap">
              <text class="meta-label">注册地址</text>
              <view class="meta-value-group">
                <text class="meta-value meta-value--wrap">{{ supplierInfo.registeredAddress }}</text>
                <view class="meta-chevron-slot" />
              </view>
            </view>

            <view class="meta-row">
              <text class="meta-label">联系人</text>
              <view class="meta-value-group">
                <text class="meta-value">{{ supplierInfo.contact }}</text>
                <view class="meta-chevron-slot" />
              </view>
            </view>

            <view class="meta-row">
              <text class="meta-label">联系电话</text>
              <view class="meta-value-group">
                <text class="meta-value">{{ supplierInfo.phone }}</text>
                <view class="meta-chevron-slot" />
              </view>
            </view>
              </view>
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

      <view class="submit-footer">
        <view class="terms-agreement" @click="toggleTermsAgreed">
          <view class="terms-checkbox" :class="{ checked: termsAgreed }">
            <image
              v-if="termsAgreed"
              src="/static/icons/check.svg"
              mode="aspectFit"
              class="terms-check-icon"
            />
          </view>
          <view class="terms-text-wrap">
            <text class="terms-text">我已阅读并同意产品与服务确认单的 </text>
            <text class="terms-link" @click.stop="handleOpenTerms">通用条款</text>
          </view>
        </view>

        <view class="submit-btn" :class="{ disabled: !termsAgreed }" @click="handleSubmit">
          <text class="submit-text">提交订单</text>
        </view>
      </view>
    </scroll-view>

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

      <template v-else-if="isBuyerEditSheet">
        <input
          v-model="draftBuyerField"
          class="sheet-input"
          type="text"
          :placeholder="buyerFieldPlaceholder"
          placeholder-class="sheet-input-placeholder"
          :maxlength="buyerFieldMaxLength"
        />
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

    <CheckoutEditSheet
      :show="contractConfirmVisible"
      title="确认信息"
      @close="closeContractConfirm"
      @confirm="handleContractConfirm"
    >
      <view class="sheet-textarea-wrap contract-message-wrap">
        <text class="contract-message-text">
          您好，根据这么派平台规则中订单支付的规则，您的订单已优享先服务后支付的优惠政策，平台会在与您沟通后创建一份产品采购合同，请根据提示前往合同管理中「签约管理」进行签约，给您带来的不便敬请谅解，如有其它问题请您拨打客服热线
          <text class="contract-hotline">400-688-1997</text>
        </text>
      </view>
    </CheckoutEditSheet>

    <PurchasePayConfirmSheet
      :show="purchasePayConfirmVisible"
      @close="closePurchasePayConfirm"
      @confirm="handlePurchasePayConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import type { CartItem } from '@/composables/useCart';
import CheckoutAddressSheet, {
  type CheckoutAddressFormValues,
  type CheckoutAddressItem,
} from '@/components/CheckoutAddressSheet.vue';
import CheckoutEditSheet from '@/components/CheckoutEditSheet.vue';
import DateWheelPicker from '@/components/DateWheelPicker.vue';
import PurchasePayConfirmSheet, {
  type PurchasePayConfirmAction,
} from '@/components/PurchasePayConfirmSheet.vue';

type EditField =
  | 'serviceDate'
  | 'purchaser'
  | 'paymentTerm'
  | 'remarks'
  | 'buyerCompanyName'
  | 'buyerRegisteredAddress'
  | 'buyerContact'
  | 'buyerContactPhone';

type BuyerEditField = Extract<
  EditField,
  'buyerCompanyName' | 'buyerRegisteredAddress' | 'buyerContact' | 'buyerContactPhone'
>;

type BuyerInfo = {
  companyName: string;
  registeredAddress: string;
  contact: string;
  phone: string;
};
type CheckoutFlowMode = 'payment' | 'contract' | 'purchase-pay';

const props = withDefaults(
  defineProps<{
    items: CartItem[];
    orderAmount: string;
    flowMode?: CheckoutFlowMode;
  }>(),
  {
    flowMode: 'payment',
  },
);

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
const confirmationOrderNo = 'QRD-20260806-001';
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

const buyerInfo = reactive<BuyerInfo>({
  companyName: '',
  registeredAddress: '',
  contact: '',
  phone: '',
});

const draftBuyerField = ref('');

const supplierInfo = {
  companyName: '北京这么派科技有限公司',
  registeredAddress: '北京市海淀区中关村大街1号海龙大厦3层',
  contact: '王工程师',
  phone: '400-688-1997',
};

const buyerFieldConfig: Record<
  BuyerEditField,
  { title: string; placeholder: string; key: keyof BuyerInfo; maxLength: number }
> = {
  buyerCompanyName: {
    title: '公司名称',
    placeholder: '请输入公司名称',
    key: 'companyName',
    maxLength: 50,
  },
  buyerRegisteredAddress: {
    title: '注册地址',
    placeholder: '请输入注册地址',
    key: 'registeredAddress',
    maxLength: 100,
  },
  buyerContact: {
    title: '联系人',
    placeholder: '请输入联系人',
    key: 'contact',
    maxLength: 20,
  },
  buyerContactPhone: {
    title: '联系电话',
    placeholder: '请输入联系电话',
    key: 'phone',
    maxLength: 11,
  },
};

const sheetTitles: Record<Exclude<EditField, BuyerEditField>, string> = {
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

const sheetTitle = computed(() => {
  if (!activeSheet.value) return '';
  if (activeSheet.value in sheetTitles) {
    return sheetTitles[activeSheet.value as Exclude<EditField, BuyerEditField>];
  }
  if (activeSheet.value in buyerFieldConfig) {
    return buyerFieldConfig[activeSheet.value as BuyerEditField].title;
  }
  return '';
});

const buyerFieldPlaceholder = computed(() => {
  if (!activeSheet.value || !(activeSheet.value in buyerFieldConfig)) return '';
  return buyerFieldConfig[activeSheet.value as BuyerEditField].placeholder;
});

const buyerFieldMaxLength = computed(() => {
  if (!activeSheet.value || !(activeSheet.value in buyerFieldConfig)) return 50;
  return buyerFieldConfig[activeSheet.value as BuyerEditField].maxLength;
});

const buyerCompanyDisplay = computed(() => buyerInfo.companyName.trim() || '请填写');
const buyerAddressDisplay = computed(() => buyerInfo.registeredAddress.trim() || '请填写');
const buyerContactDisplay = computed(() => buyerInfo.contact.trim() || '请填写');
const buyerPhoneDisplay = computed(() => buyerInfo.phone.trim() || '请填写');

const isBuyerEditSheet = computed(
  () => activeSheet.value !== null && activeSheet.value in buyerFieldConfig,
);

const serviceDateDisplay = computed(() => {
  if (!serviceDate.value) return 'yyyy/mm/dd';
  return serviceDate.value.replace(/-/g, '/');
});

const remarksDisplay = computed(() => remarks.value.trim() || '无备注');

const totalQuantity = computed(() =>
  props.items.reduce((sum, item) => sum + item.quantity, 0),
);

const PRODUCT_COLLAPSE_LIMIT = 3;
const EXTRA_ITEM_HEIGHT = 180;
const productListExpanded = ref(false);

const showProductToggle = computed(() => props.items.length > PRODUCT_COLLAPSE_LIMIT);

const primaryItems = computed(() => {
  if (!showProductToggle.value) {
    return props.items;
  }
  return props.items.slice(0, PRODUCT_COLLAPSE_LIMIT);
});

const extraItems = computed(() => {
  if (!showProductToggle.value) {
    return [];
  }
  return props.items.slice(PRODUCT_COLLAPSE_LIMIT);
});

const extraListStyle = computed(() => ({
  '--extra-max-height': `${extraItems.value.length * EXTRA_ITEM_HEIGHT}rpx`,
}));

const toggleProductList = () => {
  productListExpanded.value = !productListExpanded.value;
};

const termsAgreed = ref(false);
const contractConfirmVisible = ref(false);
const purchasePayConfirmVisible = ref(false);
const showPurchaseOrderDetails = ref(false);
const purchaseExpandActive = ref(false);
const purchaseContentVisible = ref(false);

const PURCHASE_EXPAND_MS = 360;
const PURCHASE_CONTENT_FADE_MS = 280;

let purchaseRevealTimer: ReturnType<typeof setTimeout> | null = null;

const toggleTermsAgreed = () => {
  termsAgreed.value = !termsAgreed.value;
};

const handleOpenTerms = () => {
  uni.showToast({
    title: '通用条款',
    icon: 'none',
  });
};

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

  if (field in buyerFieldConfig) {
    const config = buyerFieldConfig[field as BuyerEditField];
    draftBuyerField.value = buyerInfo[config.key];
  }
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
  } else if (activeSheet.value && activeSheet.value in buyerFieldConfig) {
    const config = buyerFieldConfig[activeSheet.value as BuyerEditField];
    buyerInfo[config.key] = draftBuyerField.value.trim();
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
  if (!termsAgreed.value) {
    uni.showToast({
      title: '请先阅读并同意通用条款',
      icon: 'none',
    });
    return;
  }

  if (props.flowMode === 'contract') {
    contractConfirmVisible.value = true;
    return;
  }

  if (props.flowMode === 'purchase-pay') {
    if (!showPurchaseOrderDetails.value) {
      purchasePayConfirmVisible.value = true;
      return;
    }
    emit('submit');
    return;
  }

  emit('submit');
};

const clearPurchaseRevealTimer = () => {
  if (purchaseRevealTimer) {
    clearTimeout(purchaseRevealTimer);
    purchaseRevealTimer = null;
  }
};

const revealPurchaseOrderDetails = async () => {
  clearPurchaseRevealTimer();
  showPurchaseOrderDetails.value = true;
  purchaseExpandActive.value = false;
  purchaseContentVisible.value = false;

  await nextTick();
  requestAnimationFrame(() => {
    purchaseExpandActive.value = true;
  });

  purchaseRevealTimer = setTimeout(() => {
    purchaseContentVisible.value = true;
    purchaseRevealTimer = null;
  }, PURCHASE_EXPAND_MS);
};

const closeContractConfirm = () => {
  contractConfirmVisible.value = false;
};

const closePurchasePayConfirm = () => {
  purchasePayConfirmVisible.value = false;
};

const handleContractConfirm = () => {
  contractConfirmVisible.value = false;
  emit('submit');
};

const handlePurchasePayConfirm = (action: PurchasePayConfirmAction) => {
  purchasePayConfirmVisible.value = false;
  if (action === 'self') {
    revealPurchaseOrderDetails();
    return;
  }
  emit('submit');
};
</script>

<style scoped>
.checkout-page {
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
}

.page-top-spacer {
  height: var(--page-safe-top);
  flex-shrink: 0;
}

.page-header {
  padding-bottom: 32rpx;
}

.detail-scroll {
  height: 100%;
  padding: 0 48rpx;
  box-sizing: border-box;
}

.header-top-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
}

.icon-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 88rpx;
  pointer-events: none;
}

.header-placeholder {
  width: 88rpx;
  height: 88rpx;
  flex-shrink: 0;
}

.address-card {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 36rpx;
  background-color: #ffffff;
  border-radius: 40rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
  margin-bottom: 32rpx;
}

.address-card--clickable:active {
  opacity: 0.92;
}

.address-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.address-icon {
  width: 40rpx;
  height: 40rpx;
  filter: brightness(0) saturate(100%) invert(8%) sepia(41%) saturate(1097%) hue-rotate(62deg) brightness(98%) contrast(103%);
}

.address-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  opacity: 1;
  transition: opacity 200ms ease;
}

.address-info.is-hidden {
  opacity: 0;
}

.address-contact {
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
}

.address-text {
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.5;
}

.section-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 36rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
  margin-bottom: 32rpx;
  transition: box-shadow 360ms cubic-bezier(0.32, 0.72, 0, 1);
}

.section-card--purchase-growing {
  box-shadow: 0 8rpx 36rpx rgba(15, 23, 42, 0.06);
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
}

.section-hint {
  font-size: 24rpx;
  color: #9ca3af;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-list-extra {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  margin-top: -20rpx;
  transition:
    max-height 0.32s cubic-bezier(0.32, 0.72, 0, 1),
    opacity 0.24s ease,
    margin-top 0.32s cubic-bezier(0.32, 0.72, 0, 1);
}

.product-list-extra.expanded {
  max-height: var(--extra-max-height, 800rpx);
  opacity: 1;
  margin-top: 0;
}

.product-list-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20rpx;
  margin-top: 4rpx;
}

.product-list-chevron {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
  transform: rotate(90deg);
  transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
}

.product-list-chevron.expanded {
  transform: rotate(-90deg);
}

.checkout-item-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  border-radius: 32rpx;
  background-color: #f8fafc;
  border: 2rpx solid #eef2f7;
  box-sizing: border-box;
}

.item-image-wrap {
  width: 128rpx;
  height: 128rpx;
  border-radius: 24rpx;
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
  gap: 8rpx;
}

.item-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-spec {
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.3;
}

.item-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4rpx;
}

.item-price {
  font-size: 32rpx;
  font-weight: 800;
  color: #163300;
  line-height: 1.1;
}

.item-qty {
  font-size: 26rpx;
  color: #9ca3af;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.purchase-expand-slot {
  max-height: 0;
  overflow: hidden;
  transition: max-height 360ms cubic-bezier(0.32, 0.72, 0, 1);
}

.purchase-expand-slot.expanded.purchase-expand-slot--top {
  max-height: 88rpx;
}

.purchase-expand-slot.expanded.purchase-expand-slot--bottom {
  max-height: 1120rpx;
}

.purchase-expand-inner--bottom {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.purchase-content {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
  opacity: 0;
  transition: opacity 280ms ease;
}

.purchase-content.visible {
  opacity: 1;
}

.meta-section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.4;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.meta-row--wrap {
  align-items: flex-start;
}

.meta-row--wrap .meta-value-group {
  align-items: flex-start;
}

.meta-row--clickable:active {
  opacity: 0.72;
}

.meta-row-amount {
  padding-top: 20rpx;
  margin-top: 12rpx;
  border-top: 2rpx solid #f3f4f6;
}

.meta-label {
  width: 224rpx;
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

.meta-chevron,
.meta-chevron-slot {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.meta-chevron-slot {
  flex-shrink: 0;
}

.meta-value-strong {
  font-size: 44rpx;
  font-weight: 800;
  color: #163300;
  line-height: 1.1;
}

.submit-footer {
  padding: 32rpx 0 calc(32rpx + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.terms-agreement {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 28rpx;
}

.terms-checkbox {
  width: 36rpx;
  height: 36rpx;
  border-radius: 8rpx;
  border: 3rpx solid #d1d5db;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4rpx;
  box-sizing: border-box;
}

.terms-checkbox.checked {
  border-color: #9fe870;
  background-color: #9fe870;
}

.terms-check-icon {
  width: 24rpx;
  height: 24rpx;
}

.terms-text-wrap {
  flex: 1;
  min-width: 0;
  line-height: 1.5;
}

.terms-text,
.terms-link {
  font-size: 26rpx;
  color: #374151;
}

.terms-link {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  height: 104rpx;
  border-radius: 52rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.submit-btn.disabled {
  opacity: 0.45;
}

.submit-text {
  font-size: 30rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1;
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
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1;
}

.contract-message-wrap {
  padding-bottom: 28rpx;
}

.contract-message-text {
  display: block;
  font-size: 28rpx;
  color: #374151;
  line-height: 1.6;
}

.contract-hotline {
  color: #163300;
  font-weight: 700;
}
</style>
