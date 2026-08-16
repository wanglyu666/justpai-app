<template>
  <view class="profile-content">
    <view class="page-header">
      <view
        class="icon-btn"
        hover-class="icon-btn-hover"
        :hover-stay-time="80"
        @click.stop="handleBack"
      >
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
      <view
        class="icon-btn"
        hover-class="icon-btn-hover"
        :hover-stay-time="80"
        @click.stop="handleEdit"
      >
        <image
          src="/static/icons/edit.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
    </view>

    <view class="profile-block">
      <view class="avatar-wrap">
        <image
          src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=f8aba6"
          mode="aspectFill"
          class="avatar-img"
        ></image>
      </view>
      <text class="user-name">管理员</text>
      <view class="user-info">
        <text class="user-title">系统管理员</text>
        <view class="info-row">
          <text class="info-label">联系方式：</text>
          <text class="info-value">138-0013-8000</text>
        </view>
        <view class="info-row">
          <text class="info-label">邮箱：</text>
          <text class="info-value">admin@justpai.com</text>
        </view>
        <view class="info-row">
          <text class="info-label">部门：</text>
          <text class="info-value">系统管理部</text>
        </view>
      </view>
    </view>

    <view class="sections">
      <view class="section" v-for="group in menuGroups" :key="group.id">
        <text class="section-title">{{ group.title }}</text>
        <view class="section-list">
          <view class="list-item" v-for="item in group.items" :key="item.id" @click="handleItemClick(item)">
            <view class="list-icon">
              <image :src="item.icon" mode="aspectFit" class="list-icon-img"></image>
            </view>
            <view class="list-content">
              <text class="list-title">{{ item.title }}</text>
              <text class="list-subtitle">{{ item.subtitle }}</text>
            </view>
            <text class="list-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <BottomSheetPanel :show="passwordFlowVisible" @closed="resetPasswordFlow">
      <StepFadeTransition :step="passwordStep">
        <template #verify>
          <PhoneVerifyContent
            @back="closePasswordFlow"
            @next="goPasswordStep"
          />
        </template>
        <template #password>
          <PasswordChangeContent
            @back="backToVerify"
            @next="goSuccessStep"
          />
        </template>
        <template #success>
          <PasswordSuccessContent @back="closePasswordFlow" />
        </template>
      </StepFadeTransition>
    </BottomSheetPanel>
    <BottomSheetPanel :show="phoneFlowVisible" @closed="resetPhoneFlow">
      <StepFadeTransition :step="phoneStep">
        <template #verify>
          <PhoneVerifyContent
            @back="closePhoneFlow"
            @next="goPhoneChangeStep"
          />
        </template>
        <template #change>
          <PhoneNumberChangeContent
            @back="backPhoneToVerify"
            @next="goPhoneSuccessStep"
          />
        </template>
        <template #success>
          <PhoneChangeSuccessContent @back="closePhoneFlow" />
        </template>
      </StepFadeTransition>
    </BottomSheetPanel>
    <BottomSheetPanel :show="deleteFlowVisible" @closed="resetDeleteFlow">
      <StepFadeTransition :step="deleteStep">
        <template #verify>
          <PhoneVerifyContent
            @back="closeDeleteFlow"
            @next="goDeleteConfirmStep"
          />
        </template>
        <template #confirm>
          <AccountDeleteConfirmContent
            @cancel="closeDeleteFlow"
            @confirm="goDeleteSuccessStep"
          />
        </template>
        <template #success>
          <AccountDeleteSuccessContent @back="closeDeleteFlow" />
        </template>
      </StepFadeTransition>
    </BottomSheetPanel>
    <BottomSheetPanel :show="registerFlowVisible">
      <RegisterInfoContent @back="closeRegisterFlow" />
    </BottomSheetPanel>
    <BottomSheetPanel :show="invoiceFlowVisible">
      <InvoiceInfoContent @back="closeInvoiceFlow" />
    </BottomSheetPanel>
    <BottomSheetPanel :show="addressFlowVisible" @closed="resetAddressFlow">
      <AddressInfoContent ref="addressInfoRef" @back="closeAddressFlow" />
    </BottomSheetPanel>
    <BottomSheetPanel :show="uploadFlowVisible" @closed="resetUploadFlow">
      <StepFadeTransition :step="uploadStep">
        <template #form>
          <UploadMaterialsContent
            @back="closeUploadFlow"
            @next="goUploadSuccessStep"
          />
        </template>
        <template #success>
          <UploadSuccessContent @back="closeUploadFlow" />
        </template>
      </StepFadeTransition>
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import StepFadeTransition from '@/components/StepFadeTransition.vue';
import PhoneVerifyContent from '@/components/PhoneVerifyContent.vue';
import PasswordChangeContent from '@/components/PasswordChangeContent.vue';
import PasswordSuccessContent from '@/components/PasswordSuccessContent.vue';
import PhoneNumberChangeContent from '@/components/PhoneNumberChangeContent.vue';
import PhoneChangeSuccessContent from '@/components/PhoneChangeSuccessContent.vue';
import AccountDeleteConfirmContent from '@/components/AccountDeleteConfirmContent.vue';
import AccountDeleteSuccessContent from '@/components/AccountDeleteSuccessContent.vue';
import RegisterInfoContent from '@/components/RegisterInfoContent.vue';
import InvoiceInfoContent from '@/components/InvoiceInfoContent.vue';
import AddressInfoContent from '@/components/AddressInfoContent.vue';
import UploadMaterialsContent from '@/components/UploadMaterialsContent.vue';
import UploadSuccessContent from '@/components/UploadSuccessContent.vue';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBack } from '@/composables/usePageBack';

const emit = defineEmits<{
  back: [];
  edit: [];
}>();

const { visible: passwordFlowVisible, open: openPasswordFlow, close: closePasswordFlow } = useSlideOver();
const { visible: phoneFlowVisible, open: openPhoneFlow, close: closePhoneFlow } = useSlideOver();
const { visible: deleteFlowVisible, open: openDeleteFlow, close: closeDeleteFlow } = useSlideOver();
const { visible: registerFlowVisible, open: openRegisterFlow, close: closeRegisterFlow } = useSlideOver();
const { visible: invoiceFlowVisible, open: openInvoiceFlow, close: closeInvoiceFlow } = useSlideOver();
const { visible: addressFlowVisible, open: openAddressFlow, close: closeAddressFlow } = useSlideOver();
const { visible: uploadFlowVisible, open: openUploadFlow, close: closeUploadFlow } = useSlideOver();
const addressInfoRef = ref<InstanceType<typeof AddressInfoContent> | null>(null);
const passwordStep = ref<'verify' | 'password' | 'success'>('verify');
const phoneStep = ref<'verify' | 'change' | 'success'>('verify');
const deleteStep = ref<'verify' | 'confirm' | 'success'>('verify');
const uploadStep = ref<'form' | 'success'>('form');

const menuGroups = ref([
  {
    id: 'security',
    title: '账号与安全',
    items: [
      { id: 'password', title: '密码修改', subtitle: '更改您的登录密码', icon: '/static/icons/shield.svg' },
      { id: 'phone', title: '手机号修改', subtitle: '更换绑定的手机号码', icon: '/static/icons/settings.svg' },
      { id: 'cancel', title: '注销账户', subtitle: '永久注销当前账户', icon: '/static/icons/shield.svg' },
    ],
  },
  {
    id: 'info',
    title: '基本信息',
    items: [
      { id: 'register', title: '注册信息', subtitle: '查看账户注册详情', icon: '/static/icons/file-text-gray.svg' },
      { id: 'invoice', title: '开票信息', subtitle: '管理发票与开票资料', icon: '/static/icons/receipt.svg' },
      { id: 'address', title: '地址信息', subtitle: '查看与编辑收货地址', icon: '/static/icons/file-text.svg' },
    ],
  },
  {
    id: 'upgrade',
    title: '升级企业账号',
    items: [
      { id: 'upload', title: '上传资料', subtitle: '提交企业认证所需材料', icon: '/static/icons/building-2.svg' },
    ],
  },
  {
    id: 'rules',
    title: '平台规则',
    items: [
      { id: 'guide', title: '平台操作指导', subtitle: '了解平台功能与操作流程', icon: '/static/icons/book-open.svg' },
      { id: 'manage', title: '平台管理规定', subtitle: '查看平台管理相关制度', icon: '/static/icons/book-open.svg' },
      { id: 'quality', title: '质量与技术标准', subtitle: '查阅质量与技术规范文件', icon: '/static/icons/book-open.svg' },
      { id: 'credit', title: '信用服务考核制度', subtitle: '了解信用服务考核规则', icon: '/static/icons/book-open.svg' },
      { id: 'service', title: '服务标准和环境', subtitle: '查看服务标准与环境要求', icon: '/static/icons/book-open.svg' },
      { id: 'health', title: '健康、安全、成品保护管理手册', subtitle: '查阅健康安全与保护规范', icon: '/static/icons/book-open.svg' },
    ],
  },
]);

const handleBack = usePageBack(() => emit('back'));

const handleEdit = () => {
  emit('edit');
};

const handleItemClick = (item: { id: string }) => {
  if (item.id === 'password') {
    passwordStep.value = 'verify';
    openPasswordFlow();
  }

  if (item.id === 'phone') {
    phoneStep.value = 'verify';
    openPhoneFlow();
  }

  if (item.id === 'cancel') {
    deleteStep.value = 'verify';
    openDeleteFlow();
  }

  if (item.id === 'register') {
    openRegisterFlow();
  }

  if (item.id === 'invoice') {
    openInvoiceFlow();
  }

  if (item.id === 'address') {
    openAddressFlow();
  }

  if (item.id === 'upload') {
    openUploadFlow();
  }
};

const goPasswordStep = () => {
  passwordStep.value = 'password';
};

const goSuccessStep = () => {
  passwordStep.value = 'success';
};

const backToVerify = () => {
  passwordStep.value = 'verify';
};

const resetPasswordFlow = () => {
  passwordStep.value = 'verify';
};

const goPhoneChangeStep = () => {
  phoneStep.value = 'change';
};

const goPhoneSuccessStep = () => {
  phoneStep.value = 'success';
};

const backPhoneToVerify = () => {
  phoneStep.value = 'verify';
};

const resetPhoneFlow = () => {
  phoneStep.value = 'verify';
};

const goDeleteConfirmStep = () => {
  deleteStep.value = 'confirm';
};

const goDeleteSuccessStep = () => {
  deleteStep.value = 'success';
};

const resetDeleteFlow = () => {
  deleteStep.value = 'verify';
};

const resetAddressFlow = () => {
  addressInfoRef.value?.reset();
};

const goUploadSuccessStep = () => {
  uploadStep.value = 'success';
};

const resetUploadFlow = () => {
  uploadStep.value = 'form';
};
</script>

<style scoped>
.profile-content {
  padding-bottom: 80rpx;
}

.page-header {
  padding: 0 48rpx 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.icon-btn-hover {
  opacity: 0.85;
}

.header-icon-img {
  width: 40rpx;
  height: 40rpx;
}


.profile-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 48rpx 72rpx;
}

.avatar-wrap {
  width: 176rpx;
  height: 176rpx;
  border-radius: 88rpx;
  background-color: #f3f4f6;
  overflow: hidden;
  margin-bottom: 32rpx;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.user-name {
  font-size: 44rpx;
  font-weight: 900;
  color: #111827;
  letter-spacing: 1rpx;
  margin-bottom: 20rpx;
}

.user-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.user-title {
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.4;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  line-height: 1.5;
}

.info-label {
  font-size: 26rpx;
  color: #9ca3af;
}

.info-value {
  font-size: 26rpx;
  color: #475569;
}

.sections {
  padding: 0 48rpx;
}

.section {
  margin-bottom: 72rpx;
}

.section-title {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  color: #111827;
  margin-bottom: 32rpx;
}

.section-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 28rpx 0;
}

.list-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 32rpx;
  flex-shrink: 0;
}

.list-icon-img {
  width: 40rpx;
  height: 40rpx;
  filter: brightness(0);
}

.list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.list-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
}

.list-subtitle {
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.4;
}

.list-arrow {
  font-size: 48rpx;
  color: #d1d5db;
  line-height: 1;
  margin-left: 24rpx;
  flex-shrink: 0;
}
</style>
