<template>
  <view class="address-info">
    <view v-if="step !== 'success'" class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon-img"></image>
      </view>
    </view>

    <view class="flow-body">
      <FadeTransition mode="out-in">
        <AddressListContent
          v-if="step === 'list'"
          key="address-list"
          :addresses="addresses"
          @add="goAddForm"
          @edit="handleEdit"
          @delete="handleDelete"
        />
        <AddressFormContent
          v-else-if="step === 'form'"
          :key="formKey"
          :mode="editingId ? 'edit' : 'add'"
          :initial-values="formInitialValues"
          @confirm="handleFormConfirm"
        />
        <AddressSuccessContent
          v-else
          key="address-success"
          @back="goList"
        />
      </FadeTransition>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FadeTransition from '@/components/FadeTransition.vue';
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
  display: flex;
  flex-direction: column;
}

.flow-body {
  flex: 1;
  min-height: 0;
}

.page-header {
  padding: 0 24px;
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
}

.header-icon-img {
  width: 20px;
  height: 20px;
}
</style>
