<template>
  <SheetPageLayout
    title="预约验收"
    :desc="item.name"
    @back="handleBack"
  >
    <view class="section-card">
      <text class="section-title" :style="infoCardTitleStyle">验收信息</text>
      <view class="meta-list">
        <view class="meta-row">
          <text class="meta-label" :style="infoCardLabelStyle">计划时间</text>
          <text class="meta-value" :style="infoCardValueStyle">{{ plannedDisplay }}</text>
        </view>
        <view class="meta-row meta-row--clickable" @click="openDateSheet">
          <text class="meta-label" :style="infoCardLabelStyle">
            <text class="required">*</text>
            预约验收时间
          </text>
          <view class="meta-value-group">
            <text
              class="meta-value"
              :class="{ 'meta-value--placeholder': !bookedAt }"
              :style="bookedAt ? infoCardValueStyle : infoCardPlaceholderStyle"
            >
              {{ bookedDisplay }}
            </text>
            <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
          </view>
        </view>
        <view
          v-if="!hideAcceptType"
          class="meta-row meta-row--radio"
        >
          <text class="meta-label" :style="infoCardLabelStyle">
            <text class="required">*</text>
            验收类型
          </text>
          <view class="radio-group">
            <view
              v-for="type in PROGRESS_ACCEPT_TYPES"
              :key="type"
              class="radio-option"
              @click="acceptType = type"
            >
              <view class="radio-circle" :class="{ active: acceptType === type }">
                <view v-if="acceptType === type" class="radio-dot" />
              </view>
              <text class="radio-text" :style="infoCardValueStyle">{{ type }}</text>
            </view>
          </view>
        </view>
        <view class="meta-row meta-row--clickable" @click="openContactSheet">
          <text class="meta-label" :style="infoCardLabelStyle">现场联系人</text>
          <view class="meta-value-group">
            <text
              class="meta-value"
              :class="{ 'meta-value--placeholder': contacts.length === 0 }"
              :style="contacts.length ? infoCardValueStyle : infoCardPlaceholderStyle"
            >
              {{ contactsDisplay }}
            </text>
            <image src="/static/icons/chevron-right.svg" mode="aspectFit" class="meta-chevron" />
          </view>
        </view>
      </view>
    </view>

    <template #footer>
      <view
        class="submit-btn"
        :class="{ active: isSubmitEnabled }"
        @click="handleSubmit"
      >
        <text class="submit-text">确定</text>
      </view>
    </template>
  </SheetPageLayout>

  <CheckoutEditSheet
    :show="dateSheetOpen"
    title="预约验收时间"
    :z-index="2500"
    @close="closeDateSheet"
    @confirm="confirmDateSheet"
  >
    <DateWheelPicker v-model="draftDate" />
  </CheckoutEditSheet>

  <SiteContactSheet
    :show="contactSheetOpen"
    :contacts="contacts"
    :z-index="2500"
    @close="closeContactSheet"
    @confirm="confirmContacts"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SheetPageLayout from '@/components/SheetPageLayout.vue';
import CheckoutEditSheet from '@/components/CheckoutEditSheet.vue';
import DateWheelPicker from '@/components/DateWheelPicker.vue';
import SiteContactSheet from '@/components/SiteContactSheet.vue';
import {
  infoCardLabelStyle,
  infoCardTitleStyle,
  infoCardValueStyle,
} from '@/config/infoCard';
import {
  PROGRESS_ACCEPT_TYPES,
  normalizeProgressAcceptType,
  type ProgressAcceptType,
  type SiteContact,
} from '@/composables/useProcessAcceptance';
import { usePageBackWhen } from '@/composables/usePageBack';

const props = withDefaults(
  defineProps<{
    item: {
      name: string;
      plannedAt?: string;
      bookedAt?: string;
      acceptType?: string;
      contacts?: SiteContact[];
    };
    hideAcceptType?: boolean;
  }>(),
  {
    hideAcceptType: false,
  },
);

const emit = defineEmits<{
  back: [];
  submit: [
    payload: {
      bookedAt: string;
      acceptType: ProgressAcceptType;
      contacts: SiteContact[];
    },
  ];
}>();

const formatSlashDate = (value?: string) => {
  if (!value) return '—';
  return value.replace(/-/g, '/');
};

const formatDateValue = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const bookedAt = ref(props.item.bookedAt || '');
const acceptType = ref<ProgressAcceptType>(
  normalizeProgressAcceptType(props.item.acceptType),
);
const contacts = ref<SiteContact[]>(
  (props.item.contacts || []).map((item) => ({ ...item })),
);
const dateSheetOpen = ref(false);
const draftDate = ref('');
const contactSheetOpen = ref(false);

const plannedDisplay = computed(() => formatSlashDate(props.item.plannedAt));
const bookedDisplay = computed(() =>
  bookedAt.value ? formatSlashDate(bookedAt.value) : 'yyyy/mm/dd',
);
const contactsDisplay = computed(() => {
  if (!contacts.value.length) return '点击添加联系人';
  return contacts.value.map((item) => item.name).join('、');
});
const infoCardPlaceholderStyle = {
  ...infoCardLabelStyle,
  textAlign: 'right' as const,
};
const isSubmitEnabled = computed(() => !!bookedAt.value);

const openDateSheet = () => {
  draftDate.value = bookedAt.value || formatDateValue(new Date());
  dateSheetOpen.value = true;
};

const closeDateSheet = () => {
  dateSheetOpen.value = false;
};
usePageBackWhen(dateSheetOpen, closeDateSheet);

const confirmDateSheet = () => {
  bookedAt.value = draftDate.value;
  dateSheetOpen.value = false;
};

const openContactSheet = () => {
  contactSheetOpen.value = true;
};

const closeContactSheet = () => {
  contactSheetOpen.value = false;
};
usePageBackWhen(contactSheetOpen, closeContactSheet);

const confirmContacts = (next: SiteContact[]) => {
  contacts.value = next;
  contactSheetOpen.value = false;
};

const handleBack = () => {
  emit('back');
};

const handleSubmit = () => {
  if (!isSubmitEnabled.value) return;
  emit('submit', {
    bookedAt: bookedAt.value,
    acceptType: acceptType.value,
    contacts: contacts.value.map((item) => ({ ...item })),
  });
};
</script>

<style scoped>
.section-card {
  background-color: #ffffff;
  border-radius: 44rpx;
  padding: 40rpx 36rpx;
  margin-bottom: 28rpx;
  box-shadow: 0 8rpx 40rpx rgba(15, 23, 42, 0.04);
}

.section-title {
  display: block;
  margin-bottom: 32rpx;
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.meta-row--clickable:active {
  opacity: 0.72;
}

.meta-row--radio {
  align-items: center;
}

.radio-group {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 24rpx;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.radio-circle {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 3rpx solid #d1d5db;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.radio-circle.active {
  border-color: #9fe870;
}

.radio-dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background-color: #9fe870;
}

.radio-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
}

.meta-label {
  flex-shrink: 0;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.required {
  color: #ef4444;
  margin-right: 4rpx;
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
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
}

.meta-value--placeholder {
  font-size: 26rpx;
  font-weight: 400;
  color: #9ca3af;
  line-height: 1.2;
}

.meta-chevron {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.submit-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn.active {
  background-color: #9fe870;
}

.submit-text {
  font-size: 32rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  line-height: 1;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
