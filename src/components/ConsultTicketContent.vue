<template>
  <view class="consult-ticket">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
      <view class="search-bar">
        <image src="/static/icons/search.svg" mode="aspectFit" class="search-icon" />
        <input
          class="search-input"
          type="text"
          v-model="keyword"
          :placeholder="t('consultTicket.search')"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">{{ t('consultTicket.title') }}</text>
          <text class="page-desc">{{ t('consultTicket.description') }}</text>
        </view>
        <view class="add-btn" @click="onAdd">
          <text class="add-btn-text">{{ t('common.add') }}</text>
        </view>
      </view>

      <StatusCapsuleSwitch
        class="status-capsule-wrap"
        v-model="activeStatus"
        :tabs="statusTabs"
        equal
      />

      <view class="ticket-list">
        <view
          v-for="item in filteredTickets"
          :key="item.id"
          class="ticket-card"
          @click="openDetail(item)"
        >
          <text class="ticket-name" :style="infoCardTitleStyle">{{ item.name }}</text>

          <view class="ticket-field" :style="infoCardFieldStyle">
            <text class="field-label" :style="infoCardLabelStyle">{{ t('consultTicket.time') }}</text>
            <text class="field-value" :style="infoCardValueStyle">{{ item.time }}</text>
          </view>

          <view class="ticket-field" :style="infoCardFieldStyle">
            <text class="field-label" :style="infoCardLabelStyle">{{ t('consultTicket.requirement') }}</text>
            <view class="demand-box">
              <text class="field-value" :style="infoCardValueStyle">{{ item.demand }}</text>
            </view>
          </view>
        </view>

        <view v-if="filteredTickets.length === 0" class="empty-tip">
          <text class="empty-tip-text">{{ t('consultTicket.empty') }}</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="detailVisible"
      :z-index="2200"
      @closed="resetDetail"
    >
      <view class="sheet-page" v-if="selectedTicket">
        <view class="sheet-page__header">
          <view class="sheet-page__back-btn" @click="closeDetail">
            <image
              src="/static/icons/chevron-left.svg"
              mode="aspectFit"
              class="sheet-page__back-icon"
            />
          </view>
        </view>

        <view class="sheet-page__body">
          <view class="detail-title-row">
            <text class="sheet-page__title">{{ t('consultTicket.details') }}</text>
            <view
              v-if="selectedTicket.status !== 'closed'"
              class="end-btn"
              @click="onEndConsult"
            >
              <text class="end-btn-text">{{ t('consultTicket.end') }}</text>
            </view>
          </view>

          <view class="info-card">
            <view class="info-row">
              <view class="info-field">
                <text class="info-label">{{ t('consultTicket.surveyTime') }}</text>
                <text class="info-value">{{ selectedTicket.surveyDate }}</text>
              </view>
              <view class="info-field">
                <text class="info-label">{{ t('consultTicket.serviceStart') }}</text>
                <text class="info-value">{{ selectedTicket.serviceStartDate }}</text>
              </view>
            </view>

            <view class="info-row">
              <view class="info-field">
                <text class="info-label">{{ t('consultTicket.duration') }}</text>
                <text class="info-value">{{ displayDuration(selectedTicket.duration) }}</text>
              </view>
              <view class="info-field">
                <text class="info-label">{{ t('consultTicket.quote') }}</text>
                <text class="info-value">{{ displayQuote(selectedTicket.quote) }}</text>
              </view>
            </view>

            <view class="info-row">
              <view class="info-field info-field-full">
                <text class="info-label">{{ t('consultTicket.serviceAddress') }}</text>
                <text class="info-value">{{ selectedTicket.address }}</text>
              </view>
            </view>

            <view class="info-row">
              <view class="info-field info-field-full">
                <text class="info-label">{{ t('consultTicket.requirement') }}</text>
                <view class="demand-box">
                  <text class="info-value info-value-body">{{ selectedTicket.demand }}</text>
                </view>
              </view>
            </view>
          </view>

          <view class="action-bar-row">
            <view class="action-bar" hover-class="none" @click="onChecklist">
              <image
                class="action-bar-icon"
                src="/static/icons/order-blue.svg"
                mode="aspectFit"
              />
              <text class="action-bar-text">{{ t('consultTicket.checklist') }}</text>
            </view>
            <view class="action-bar" hover-class="none" @click="onInquiry">
              <image
                class="action-bar-icon"
                src="/static/icons/message-circle-pink.svg"
                mode="aspectFit"
              />
              <text class="action-bar-text">{{ t('consultTicket.inquiry') }}</text>
            </view>
          </view>

          <view class="info-card">
            <text class="card-heading">{{ t('consultTicket.quoteConfirmation') }}</text>
            <view class="info-row">
              <view class="info-field">
                <text class="info-label">{{ t('consultTicket.needsQuote') }}</text>
                <text class="info-value">{{ displayNeedQuote(selectedTicket.needQuote) }}</text>
              </view>
              <view class="info-field">
                <text class="info-label">{{ t('consultTicket.quoteTime') }}</text>
                <text class="info-value">{{ displayQuoteTime(selectedTicket.quoteTime) }}</text>
              </view>
            </view>
          </view>

          <FileAttachmentCard
            :files="selectedTicket.attachments"
            :title="t('common.attachments')"
            :empty-text="t('common.noAttachments')"
          />
        </view>
      </view>
    </BottomSheetPanel>

    <BottomSheetPanel
      :show="inquiryVisible"
      :z-index="2300"
      @closed="resetInquiry"
    >
      <ConsultInquiryContent
        v-if="selectedTicket"
        :messages="inquiryMessages"
        @back="closeInquiry"
        @short-chat-submit="handleShortChatSubmit"
      />
    </BottomSheetPanel>

    <BottomSheetPanel
      :show="checklistVisible"
      :z-index="2300"
      @closed="resetChecklist"
    >
      <ConsultChecklistContent
        v-if="selectedTicket"
        :checklist="checklistDetail"
        @back="closeChecklist"
      />
    </BottomSheetPanel>

    <BottomSheetPanel
      :show="formVisible"
      :z-index="2300"
      content-safe-top
      @closed="resetFormFlow"
    >
      <SuccessPageTransition :show-success="formStep === 'success'">
        <ConsultTicketFormContent
          ref="formRef"
          @back="closeForm"
          @submit="handleFormSubmit"
        />
        <template #success>
          <ConsultTicketSuccessContent @back="closeForm" />
        </template>
      </SuccessPageTransition>
    </BottomSheetPanel>

    <FrostedConfirmModal
      :show="endModalVisible"
      :title="t('consultTicket.endTitle')"
      :message="t('consultTicket.endMessage')"
      :cancel-text="t('common.cancel')"
      :confirm-text="t('common.confirm')"
      @cancel="closeEndModal"
      @confirm="confirmEndConsult"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import ConsultInquiryContent, {
  type InquiryMessage,
} from '@/components/ConsultInquiryContent.vue';
import ConsultChecklistContent, {
  type ChecklistDetail,
} from '@/components/ConsultChecklistContent.vue';
import ConsultTicketFormContent, {
  type ConsultTicketFormPayload,
} from '@/components/ConsultTicketFormContent.vue';
import ConsultTicketSuccessContent from '@/components/ConsultTicketSuccessContent.vue';
import FrostedConfirmModal from '@/components/FrostedConfirmModal.vue';
import {
  useConsultTickets,
  type ConsultStatus,
  type ConsultTicket,
} from '@/composables/useConsultTickets';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';
import { useLanguage } from '@/composables/useLanguage';
import {
  infoCardFieldStyle,
  infoCardLabelStyle,
  infoCardTitleStyle,
  infoCardValueStyle,
} from '@/config/infoCard';

const { t, tf } = useLanguage();

const emit = defineEmits<{
  back: [];
}>();

const { tickets, addConsultTicket, closeConsultTicket } = useConsultTickets();

const keyword = ref('');
const activeStatus = ref<ConsultStatus>('pending_reply');
const selectedTicket = ref<ConsultTicket | null>(null);
const formRef = ref<InstanceType<typeof ConsultTicketFormContent> | null>(null);
const formStep = ref<'form' | 'success'>('form');
const endModalVisible = ref(false);
const {
  visible: detailVisible,
  open: openDetailPanel,
  close: closeDetail,
} = useSlideOver();
const {
  visible: inquiryVisible,
  open: openInquiryPanel,
  close: closeInquiry,
} = useSlideOver();
const {
  visible: checklistVisible,
  open: openChecklistPanel,
  close: closeChecklist,
} = useSlideOver();
const {
  visible: formVisible,
  open: openFormPanel,
  close: closeFormPanel,
} = useSlideOver();
usePageBackWhen(detailVisible, closeDetail);
usePageBackWhen(inquiryVisible, closeInquiry);
usePageBackWhen(checklistVisible, closeChecklist);

const inquiryMessages = computed(
  () => selectedTicket.value?.inquiryMessages ?? [],
);

const checklistDetail = computed<ChecklistDetail>(() => {
  const quoteTime = selectedTicket.value?.quoteTime;
  return {
    quoter: '—',
    contact: '—',
    quoteTime:
      quoteTime && quoteTime !== '暂无' ? quoteTime : '2026-01-04',
    remark: '—',
    items: [
      {
        id: 1,
        specialty: '产品',
        subjectCode: '1001',
        subjectName: '测试1001',
        brand: '测试1001',
        series: '测试1001',
        quantity: 100,
        materialFee: 0,
        installFee: 20,
        unitPrice: 20,
        totalPrice: 2000,
      },
    ],
    summary: {
      specialty: '产品',
      price: 2000,
      taxRate: 9,
      tax: 180,
      totalPrice: 2000,
      priceInclTax: 2180,
    },
    attachments: ['报价清单附图.png'],
  };
});

const statusTabs = computed<{ id: ConsultStatus; label: string }[]>(() => [
  { id: 'pending_reply', label: t('consultTicket.pendingReply') },
  { id: 'in_progress', label: t('consultTicket.inProgress') },
  { id: 'closed', label: t('consultTicket.closed') },
]);

const displayDuration = (value: string) => {
  const match = value.match(/^(\d+)\s*天$/);
  return match ? tf('checkout.days', { count: match[1] }) : value;
};

const displayNeedQuote = (value: string) => {
  if (value === '是') return t('consultTicket.yes');
  if (value === '否') return t('consultTicket.no');
  return value;
};

const displayQuote = (value: string) => {
  if (value === '暂无报价') return t('consultTicket.noQuote');
  if (value === '待报价') return t('consultTicket.awaitingQuote');
  if (value === '不需要') return t('consultTicket.notRequired');
  return value;
};

const displayQuoteTime = (value: string) => value === '暂无' ? t('review.none') : value;

const filteredTickets = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  return tickets.value.filter((item) => {
    if (item.status !== activeStatus.value) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.demand.toLowerCase().includes(q) ||
      item.time.toLowerCase().includes(q)
    );
  });
});


const openDetail = (item: ConsultTicket) => {
  selectedTicket.value = item;
  openDetailPanel();
};

const resetDetail = () => {
  selectedTicket.value = null;
  endModalVisible.value = false;
};

const handleBack = usePageBack(() => emit('back'));

const onAdd = () => {
  formStep.value = 'form';
  openFormPanel();
};

const closeForm = () => {
  closeFormPanel();
};

const resetFormFlow = () => {
  formStep.value = 'form';
  formRef.value?.resetForm();
};

const handleFormSubmit = (payload: ConsultTicketFormPayload) => {
  addConsultTicket(payload);
  activeStatus.value = 'pending_reply';
  formStep.value = 'success';
};

const onChecklist = () => {
  openChecklistPanel();
};

const resetChecklist = () => {
  // keep selectedTicket for detail page underneath
};

const onInquiry = () => {
  openInquiryPanel();
};

const resetInquiry = () => {
  // keep selectedTicket for detail page underneath
};

const handleShortChatSubmit = (payload: {
  content: string;
  attachments: string[];
}) => {
  if (!selectedTicket.value) return;

  const pad = (n: number) => String(n).padStart(2, '0');
  const d = new Date();
  const sendTime = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const nextId =
    Math.max(0, ...selectedTicket.value.inquiryMessages.map((item) => item.id)) + 1;

  const nextMessage: InquiryMessage = {
    id: nextId,
    sender: '我',
    sendTime,
    content: payload.content,
    attachmentName: payload.attachments[0] || '',
  };

  selectedTicket.value = {
    ...selectedTicket.value,
    inquiryMessages: [nextMessage, ...selectedTicket.value.inquiryMessages],
  };

  tickets.value = tickets.value.map((item) =>
    item.id === selectedTicket.value?.id ? selectedTicket.value! : item,
  );
};

const onEndConsult = () => {
  endModalVisible.value = true;
};

const closeEndModal = () => {
  endModalVisible.value = false;
};
usePageBackWhen(endModalVisible, closeEndModal);

const confirmEndConsult = () => {
  const id = selectedTicket.value?.id;
  endModalVisible.value = false;
  if (id == null) return;
  const updated = closeConsultTicket(id);
  if (updated) selectedTicket.value = updated;
};
</script>

<style scoped>
.consult-ticket {
  min-height: 100%;
  padding-bottom: 80rpx;
  box-sizing: border-box;
}

.page-header {
  padding: 0 48rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
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

.header-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.search-bar {
  width: 336rpx;
  flex-shrink: 0;
  margin-left: auto;
  height: 88rpx;
  background-color: #ffffff;
  border-radius: 1998rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}

.search-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #111827;
  height: 100%;
}

.search-placeholder {
  color: #9ca3af;
  font-size: 28rpx;
}

.content {
  padding: 64rpx 48rpx 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.title-block {
  flex: 1;
  min-width: 0;
}

.page-title {
  display: block;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.page-desc {
  display: block;
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.add-btn {
  flex-shrink: 0;
  height: 88rpx;
  padding: 0 48rpx;
  border-radius: 28rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.status-capsule-wrap {
  margin-bottom: 48rpx;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.ticket-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.ticket-field {
  display: flex;
  flex-direction: column;
}

.demand-box {
  width: 100%;
  padding: 24rpx 28rpx;
  border-radius: 28rpx;
  background-color: #f8faf9;
  border: 2rpx solid #eef0ea;
  box-sizing: border-box;
}

.demand-box .field-value,
.demand-box .info-value {
  display: block;
  word-break: break-all;
}

.empty-tip {
  padding: 96rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-tip-text {
  font-size: 28rpx;
  color: #9ca3af;
}

.sheet-page__body {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.detail-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.detail-title-row .sheet-page__title {
  flex: 1;
  min-width: 0;
}

.info-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 36rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
}

.card-heading {
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}

.info-row {
  display: flex;
  gap: 32rpx;
}

.info-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-field-full {
  flex: 1 1 100%;
}

.info-label {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.info-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
  word-break: break-all;
}

.info-value-body {
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.55;
}

.action-bar-row {
  display: flex;
  gap: 24rpx;
}

.action-bar {
  flex: 1;
  min-width: 0;
  height: 112rpx;
  padding: 0 28rpx;
  border-radius: 40rpx;
  background-color: #ffffff;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  box-sizing: border-box;
}

.action-bar-icon {
  width: 44rpx;
  height: 44rpx;
  flex-shrink: 0;
}

.action-bar-text {
  font-size: 28rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.end-btn {
  flex-shrink: 0;
  height: 88rpx;
  padding: 0 48rpx;
  border-radius: 28rpx;
  background-color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
}

.end-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}
</style>
