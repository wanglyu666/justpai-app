<template>
  <view class="profile-content">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon-img"></image>
      </view>
      <view class="icon-btn" @click="handleEdit">
        <image src="/static/icons/edit.svg" mode="aspectFit" class="header-icon-img"></image>
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

    <BottomSheetPanel :show="passwordFlowVisible" :z-index="1100" @closed="resetPasswordFlow">
      <FadeTransition mode="out-in">
        <PhoneVerifyContent
          v-if="passwordStep === 'verify'"
          key="verify"
          @back="closePasswordFlow"
          @next="goPasswordStep"
        />
        <PasswordChangeContent
          v-else-if="passwordStep === 'password'"
          key="password"
          @back="backToVerify"
          @next="goSuccessStep"
        />
        <PasswordSuccessContent
          v-else
          key="success"
          @back="closePasswordFlow"
        />
      </FadeTransition>
    </BottomSheetPanel>
    <BottomSheetPanel :show="phoneFlowVisible" :z-index="1100" @closed="resetPhoneFlow">
      <FadeTransition mode="out-in">
        <PhoneVerifyContent
          v-if="phoneStep === 'verify'"
          key="phone-verify"
          @back="closePhoneFlow"
          @next="goPhoneChangeStep"
        />
        <PhoneNumberChangeContent
          v-else-if="phoneStep === 'change'"
          key="phone-change"
          @back="backPhoneToVerify"
          @next="goPhoneSuccessStep"
        />
        <PhoneChangeSuccessContent
          v-else
          key="phone-success"
          @back="closePhoneFlow"
        />
      </FadeTransition>
    </BottomSheetPanel>
    <BottomSheetPanel :show="deleteFlowVisible" :z-index="1100" @closed="resetDeleteFlow">
      <FadeTransition mode="out-in">
        <PhoneVerifyContent
          v-if="deleteStep === 'verify'"
          key="delete-verify"
          @back="closeDeleteFlow"
          @next="goDeleteConfirmStep"
        />
        <AccountDeleteConfirmContent
          v-else-if="deleteStep === 'confirm'"
          key="delete-confirm"
          @cancel="closeDeleteFlow"
          @confirm="goDeleteSuccessStep"
        />
        <AccountDeleteSuccessContent
          v-else
          key="delete-success"
          @back="closeDeleteFlow"
        />
      </FadeTransition>
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import FadeTransition from '@/components/FadeTransition.vue';
import PhoneVerifyContent from '@/components/PhoneVerifyContent.vue';
import PasswordChangeContent from '@/components/PasswordChangeContent.vue';
import PasswordSuccessContent from '@/components/PasswordSuccessContent.vue';
import PhoneNumberChangeContent from '@/components/PhoneNumberChangeContent.vue';
import PhoneChangeSuccessContent from '@/components/PhoneChangeSuccessContent.vue';
import AccountDeleteConfirmContent from '@/components/AccountDeleteConfirmContent.vue';
import AccountDeleteSuccessContent from '@/components/AccountDeleteSuccessContent.vue';
import { useSlideOver } from '@/composables/useSlideOver';

const emit = defineEmits<{
  back: [];
  edit: [];
}>();

const { visible: passwordFlowVisible, open: openPasswordFlow, close: closePasswordFlow } = useSlideOver();
const { visible: phoneFlowVisible, open: openPhoneFlow, close: closePhoneFlow } = useSlideOver();
const { visible: deleteFlowVisible, open: openDeleteFlow, close: closeDeleteFlow } = useSlideOver();
const passwordStep = ref<'verify' | 'password' | 'success'>('verify');
const phoneStep = ref<'verify' | 'change' | 'success'>('verify');
const deleteStep = ref<'verify' | 'confirm' | 'success'>('verify');

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

const handleBack = () => {
  emit('back');
};

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
</script>

<style scoped>
.profile-content {
  padding-bottom: 40px;
}

.page-header {
  padding: 0 24px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.profile-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 24px 36px;
}

.avatar-wrap {
  width: 88px;
  height: 88px;
  border-radius: 44px;
  background-color: #f3f4f6;
  overflow: hidden;
  margin-bottom: 16px;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.user-name {
  font-size: 22px;
  font-weight: 900;
  color: #111827;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.user-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.user-title {
  font-size: 14px;
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
  font-size: 13px;
  color: #9ca3af;
}

.info-value {
  font-size: 13px;
  color: #475569;
}

.sections {
  padding: 0 24px;
}

.section {
  margin-bottom: 36px;
}

.section-title {
  display: block;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 16px;
}

.section-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 14px 0;
}

.list-icon {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.list-icon-img {
  width: 20px;
  height: 20px;
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
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
}

.list-subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.list-arrow {
  font-size: 24px;
  color: #d1d5db;
  line-height: 1;
  margin-left: 12px;
  flex-shrink: 0;
}
</style>
