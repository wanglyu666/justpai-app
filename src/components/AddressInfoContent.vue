<template>
  <view class="address-info">
    <StepFadeTransition :step="step">
      <template #list>
        <view class="address-step">
          <view class="page-header">
            <view class="icon-btn" @click="handleBack">
              <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon-img"></image>
            </view>
          </view>
          <AddressListContent
            :addresses="addresses"
            @add="goAddForm"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </view>
      </template>
      <template #form>
        <view class="address-step">
          <view class="page-header">
            <view class="icon-btn" @click="handleBack">
              <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon-img"></image>
            </view>
          </view>
          <AddressFormContent
            :key="formKey"
            :mode="editingId ? 'edit' : 'add'"
            :initial-values="formInitialValues"
            @confirm="handleFormConfirm"
          />
        </view>
      </template>
      <template #success>
        <AddressSuccessContent @back="goList" />
      </template>
    </StepFadeTransition>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StepFadeTransition from '@/components/StepFadeTransition.vue';
import AddressListContent, { type AddressItem } from '@/components/AddressListContent.vue';
import AddressFormContent, { type AddressFormValues } from '@/components/AddressFormContent.vue';
import AddressSuccessContent from '@/components/AddressSuccessContent.vue';

const emit = defineEmits<{
  back: [];
}>();

type Step = 'list' | 'form' | 'success';

const step = ref<Step>('list');
const editingId = ref<string | null>(null);
const formKey = ref('new');

const emptyForm = (): AddressFormValues => ({
  contact: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
});

const formInitialValues = ref<AddressFormValues>(emptyForm());

const addresses = ref<AddressItem[]>([
  {
    id: '1',
    name: '住邦2000商务中心4号楼5层',
    contact: '张伟',
    phone: '138-0013-8000',
    region: '北京市 北京市 朝阳区',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '住邦2000商务中心4号楼5层',
    isDefault: true,
  },
  {
    id: '2',
    name: '陆家嘴环路1000号恒生银行大厦15层',
    contact: '李秀英',
    phone: '139-2234-5678',
    region: '上海市 上海市 浦东新区',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '陆家嘴环路1000号恒生银行大厦15层',
  },
]);

const buildRegion = (values: AddressFormValues) =>
  `${values.province} ${values.city} ${values.district}`;

const goAddForm = () => {
  editingId.value = null;
  formInitialValues.value = emptyForm();
  formKey.value = 'new';
  step.value = 'form';
};

const goList = () => {
  step.value = 'list';
  editingId.value = null;
};

const goSuccess = () => {
  step.value = 'success';
};

const handleBack = () => {
  if (step.value === 'form' || step.value === 'success') {
    goList();
    return;
  }
  emit('back');
};

const handleEdit = (id: string) => {
  const item = addresses.value.find((address) => address.id === id);
  if (!item) return;

  editingId.value = id;
  formInitialValues.value = {
    contact: item.contact,
    phone: item.phone,
    province: item.province,
    city: item.city,
    district: item.district,
    detail: item.detail,
  };
  formKey.value = id;
  step.value = 'form';
};

const handleDelete = (id: string) => {
  addresses.value = addresses.value.filter((item) => item.id !== id);
};

const handleFormConfirm = (values: AddressFormValues) => {
  const region = buildRegion(values);

  if (editingId.value) {
    addresses.value = addresses.value.map((item) =>
      item.id === editingId.value
        ? {
            ...item,
            contact: values.contact,
            phone: values.phone,
            region,
            province: values.province,
            city: values.city,
            district: values.district,
            detail: values.detail,
            name: values.detail,
          }
        : item,
    );
  } else {
    addresses.value.push({
      id: `${Date.now()}`,
      name: values.detail,
      contact: values.contact,
      phone: values.phone,
      region,
      province: values.province,
      city: values.city,
      district: values.district,
      detail: values.detail,
    });
  }

  goSuccess();
};

defineExpose({
  reset: () => {
    step.value = 'list';
    editingId.value = null;
    formInitialValues.value = emptyForm();
    formKey.value = 'new';
  },
});
</script>

<style scoped>
.address-info {
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.address-step {
  min-height: 100%;
  box-sizing: border-box;
}

.page-header {
  padding: 0 48rpx;
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
}

.header-icon-img {
  width: 40rpx;
  height: 40rpx;
}
</style>
