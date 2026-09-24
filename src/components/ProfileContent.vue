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
          :src="profile.avatar"
          mode="aspectFill"
          class="avatar-img"
        ></image>
      </view>
      <text class="user-name">{{ profile.name }}</text>
      <view class="user-info">
        <text class="user-title">{{ profile.title }}</text>
        <view class="info-row">
          <text class="info-label">{{ t('profile.contact') }}</text>
          <text class="info-value">{{ profile.phone }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">{{ t('profile.email') }}</text>
          <text class="info-value">{{ profile.email }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">{{ t('profile.department') }}</text>
          <text class="info-value">{{ profile.department }}</text>
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

    <LanguageSheet
      :show="languageSheetOpen"
      :title="t('profile.language')"
      :current="currentLanguage"
      :options="languageOptions"
      @close="closeLanguageSheet"
      @select="handleLanguageSelect"
    />

    <ProfileEditSheet
      :show="editSheetOpen"
      :avatar="profile.avatar"
      :name="profile.name"
      :email="profile.email"
      @close="closeEditSheet"
      @confirm="handleEditConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
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
import ProfileEditSheet, {
  type ProfileEditPayload,
} from '@/components/ProfileEditSheet.vue';
import LanguageSheet from '@/components/LanguageSheet.vue';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';
import { useLanguage } from '@/composables/useLanguage';

const emit = defineEmits<{
  back: [];
}>();

const { currentLanguage, currentLanguageName, languageOptions, setLanguage, t } = useLanguage();

const DEFAULT_AVATAR =
  'https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=f8aba6';

const profile = reactive({
  avatar: DEFAULT_AVATAR,
  name: '管理员',
  title: '系统管理员',
  phone: '138-0013-8000',
  email: 'admin@justpai.com',
  department: '系统管理部',
});

const editSheetOpen = ref(false);
const languageSheetOpen = ref(false);

const closeLanguageSheet = () => {
  languageSheetOpen.value = false;
};

const openLanguageSheet = () => {
  languageSheetOpen.value = true;
};

usePageBackWhen(languageSheetOpen, closeLanguageSheet);

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

const menuGroups = computed(() => [
  {
    id: 'security',
    title: t('profile.group.security'),
    items: [
      { id: 'password', title: t('profile.password'), subtitle: t('profile.passwordDescription'), icon: '/static/icons/shield.svg' },
      { id: 'phone', title: t('profile.phone'), subtitle: t('profile.phoneDescription'), icon: '/static/icons/settings.svg' },
      { id: 'cancel', title: t('profile.cancelAccount'), subtitle: t('profile.cancelAccountDescription'), icon: '/static/icons/shield.svg' },
    ],
  },
  {
    id: 'info',
    title: t('profile.group.basic'),
    items: [
      { id: 'register', title: t('profile.registration'), subtitle: t('profile.registrationDescription'), icon: '/static/icons/file-text-gray.svg' },
      { id: 'invoice', title: t('profile.invoice'), subtitle: t('profile.invoiceDescription'), icon: '/static/icons/receipt.svg' },
      { id: 'address', title: t('profile.address'), subtitle: t('profile.addressDescription'), icon: '/static/icons/file-text.svg' },
    ],
  },
  {
    id: 'upgrade',
    title: t('profile.group.upgrade'),
    items: [
      { id: 'upload', title: t('profile.upload'), subtitle: t('profile.uploadDescription'), icon: '/static/icons/building-2.svg' },
    ],
  },
  {
    id: 'language',
    title: t('profile.group.language'),
    items: [
      { id: 'language', title: t('profile.language'), subtitle: currentLanguageName.value, icon: '/static/icons/settings.svg' },
    ],
  },
  {
    id: 'rules',
    title: t('profile.group.rules'),
    items: [
      { id: 'guide', title: t('profile.guide'), subtitle: t('profile.guideDescription'), icon: '/static/icons/book-open.svg' },
      { id: 'manage', title: t('profile.managementRules'), subtitle: t('profile.managementRulesDescription'), icon: '/static/icons/book-open.svg' },
      { id: 'quality', title: t('profile.qualityStandards'), subtitle: t('profile.qualityStandardsDescription'), icon: '/static/icons/book-open.svg' },
      { id: 'credit', title: t('profile.creditRules'), subtitle: t('profile.creditRulesDescription'), icon: '/static/icons/book-open.svg' },
      { id: 'service', title: t('profile.serviceStandards'), subtitle: t('profile.serviceStandardsDescription'), icon: '/static/icons/book-open.svg' },
      { id: 'health', title: t('profile.safetyManual'), subtitle: t('profile.safetyManualDescription'), icon: '/static/icons/book-open.svg' },
    ],
  },
]);

const handleBack = usePageBack(() => emit('back'));

const openEditSheet = () => {
  editSheetOpen.value = true;
};

const closeEditSheet = () => {
  editSheetOpen.value = false;
};

const handleEdit = () => {
  openEditSheet();
};

const handleEditConfirm = (payload: ProfileEditPayload) => {
  profile.avatar = payload.avatar;
  profile.name = payload.name;
  profile.email = payload.email;
  editSheetOpen.value = false;
};

usePageBackWhen(editSheetOpen, closeEditSheet);

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

  if (item.id === 'language') {
    openLanguageSheet();
  }
};

const handleLanguageSelect = (code: (typeof languageOptions)[number]['code']) => {
  const changed = currentLanguage.value !== code;
  setLanguage(code);
  closeLanguageSheet();
  if (!changed) return;
  uni.showToast({
    title: t('profile.languageChanged'),
    icon: 'none',
  });
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
