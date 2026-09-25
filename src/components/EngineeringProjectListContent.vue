<template>
  <view class="project-list-page" @click="closeMenu">
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
          :placeholder="t('engineering.search')"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">{{ t('engineering.title') }}</text>
          <text class="page-desc">{{ t('engineering.description') }}</text>
        </view>
      </view>

      <StatusCapsuleSwitch
        class="status-capsule-wrap"
        v-model="activeStatus"
        :tabs="statusTabs"
      />

      <view class="ticket-list">
        <view
          v-for="item in filteredProjects"
          :key="item.id"
          class="ticket-card"
          :class="menuOpenId === item.id ? 'is-menu-open' : ''"
          @click="openDetail(item)"
        >
          <view class="card-heading list-card-heading">
            <view class="list-card-title-block">
              <text class="card-title">{{ item.name }}</text>
              <text class="card-code">{{ item.code }}</text>
            </view>
            <view class="card-menu-btn" @click.stop="toggleMenu(item.id)">
              <image
                src="/static/icons/caret-down.svg"
                mode="aspectFit"
                class="card-menu-icon"
                :class="menuOpenId === item.id ? 'is-open' : ''"
              />
            </view>
            <view
              v-if="menuOpenId === item.id"
              class="card-dropdown"
              @click.stop
            >
              <view
                v-for="entry in actionEntries"
                :key="entry.id"
                class="card-dropdown-item"
                @click.stop="openMenuAction(item, entry.id)"
              >
                <image
                  :src="entry.icon"
                  mode="aspectFit"
                  class="card-dropdown-icon"
                />
                <text class="card-dropdown-text">{{ entry.label }}</text>
              </view>
            </view>
          </view>

          <view class="list-card-metrics">
            <view class="metric-amount-block">
              <text class="metric-label">{{ t('engineering.contractAmount') }}</text>
              <text class="metric-amount">{{ formatAmount(item.amount) }}</text>
            </view>
            <view class="metric-divider" />
            <view class="metric-date-block">
              <text class="metric-label">{{ t('engineering.startDate') }}</text>
              <text class="metric-date">{{ item.startDate }}</text>
            </view>
          </view>

          <view class="list-card-footer">
            <view class="manager-avatar">
              <text class="manager-avatar-text">{{ item.managerName.slice(0, 1) }}</text>
            </view>
            <view class="manager-meta">
              <text class="footer-label">{{ t('engineering.manager') }}</text>
              <text class="footer-value">{{ item.managerName }}</text>
            </view>
            <view class="contact-meta">
              <text class="footer-label">{{ t('engineering.contact') }}</text>
              <text class="footer-value">{{ formatPhone(item.managerPhone) }}</text>
            </view>
          </view>
        </view>

        <view v-if="filteredProjects.length === 0" class="empty-tip">
          <text class="empty-tip-text">{{ t('engineering.empty') }}</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="detailVisible"
      :z-index="2200"
      @closed="resetDetail"
    >
      <view class="sheet-page" v-if="selectedItem">
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
          <text class="sheet-page__title">{{ t('engineering.details') }}</text>

          <view class="info-card">
            <view class="card-heading">
              <view class="card-heading-block">
                <text class="card-title">{{ selectedItem.name }}</text>
              </view>
              <StatusBadge
                :status="selectedItem.status"
                :label="statusLabel(selectedItem.status)"
              />
            </view>

            <view class="info-grid">
              <view class="info-row">
                <view class="info-field">
                  <text class="info-label">{{ t('engineering.contractAmount') }}</text>
                  <text class="info-value">{{ formatAmount(selectedItem.amount) }}</text>
                </view>
                <view class="info-field">
                  <text class="info-label">{{ t('engineering.manager') }}</text>
                  <text class="info-value">{{ selectedItem.managerName }}</text>
                </view>
              </view>
              <view class="info-row">
                <view class="info-field">
                  <text class="info-label">{{ t('engineering.contact') }}</text>
                  <text class="info-value">{{ formatPhone(selectedItem.managerPhone) }}</text>
                </view>
                <view class="info-field">
                  <text class="info-label">{{ t('engineering.startDate') }}</text>
                  <text class="info-value">{{ selectedItem.startDate }}</text>
                </view>
              </view>
              <view class="info-row">
                <view class="info-field">
                  <text class="info-label">{{ t('engineering.projectNumber') }}</text>
                  <text class="info-value">{{ selectedItem.code }}</text>
                </view>
              </view>
            </view>
          </view>

          <view class="action-card-grid">
            <ActionSquareCard
              v-for="entry in actionEntries"
              :key="entry.id"
              :icon="entry.icon"
              :label="entry.label"
              :show-add="entry.id === 'defect'"
              @click="handleActionClick(entry.id)"
              @add="onDefectAdd"
            />
          </view>
        </view>
      </view>
    </BottomSheetPanel>

    <SlideOverPanel
      :show="reviewVisible"
      :z-index="2300"
      @closed="resetReviewFlow"
    >
      <SuccessPageTransition :show-success="reviewStep === 'success'">
        <OrderReviewContent
          v-if="reviewSubject"
          :subject="reviewSubject"
          :form-title="t('engineering.review')"
          :editable="reviewStep === 'form'"
          :existing-rating="reviewRecord?.rating"
          :existing-content="reviewRecord?.content"
          :submitted-at="reviewRecord?.submittedAt"
          @back="closeReview"
          @submit="handleReviewSubmit"
        />
        <template #success>
          <OrderReviewSuccessContent :back-text="t('engineering.backToProject')" @back="closeReview" />
        </template>
      </SuccessPageTransition>
    </SlideOverPanel>

    <SlideOverPanel :show="standardVisible" :z-index="2300">
      <ConstructionStandardContent @back="closeStandard" />
    </SlideOverPanel>

    <SlideOverPanel :show="reportVisible" :z-index="2300">
      <ConstructionReportContent @back="closeReport" />
    </SlideOverPanel>

    <SlideOverPanel :show="archiveVisible" :z-index="2300">
      <CompletionArchiveContent @back="closeArchive" />
    </SlideOverPanel>

    <SlideOverPanel :show="afterSalesVisible" :z-index="2300">
      <AfterSalesPlanContent @back="closeAfterSales" />
    </SlideOverPanel>

    <SlideOverPanel :show="acceptanceVisible" :z-index="2300">
      <ProcessAcceptanceContent @back="closeAcceptance" />
    </SlideOverPanel>

    <SlideOverPanel :show="defectVisible" :z-index="2300">
      <DefectReportListContent
        v-if="selectedItem"
        :project-id="selectedItem.id"
        @back="closeDefect"
      />
    </SlideOverPanel>

    <SlideOverPanel
      :show="defectCreateVisible"
      :z-index="2300"
      content-safe-top
      @closed="resetDefectCreate"
    >
      <SuccessPageTransition :show-success="defectCreateStep === 'success'">
        <DefectReportFormContent
          ref="defectFormRef"
          @back="closeDefectCreate"
          @submit="handleDefectCreateSubmit"
        />
        <template #success>
          <FeedbackSuccessContent
            :desc="t('engineering.defectSubmitted')"
            :back-text="t('engineering.backToProject')"
            @back="closeDefectCreate"
          />
        </template>
      </SuccessPageTransition>
    </SlideOverPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import ActionSquareCard from '@/components/ActionSquareCard.vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import OrderReviewContent from '@/components/OrderReviewContent.vue';
import OrderReviewSuccessContent from '@/components/OrderReviewSuccessContent.vue';
import ConstructionStandardContent from '@/components/ConstructionStandardContent.vue';
import ConstructionReportContent from '@/components/ConstructionReportContent.vue';
import CompletionArchiveContent from '@/components/CompletionArchiveContent.vue';
import AfterSalesPlanContent from '@/components/AfterSalesPlanContent.vue';
import ProcessAcceptanceContent from '@/components/ProcessAcceptanceContent.vue';
import DefectReportListContent from '@/components/DefectReportListContent.vue';
import DefectReportFormContent from '@/components/DefectReportFormContent.vue';
import FeedbackSuccessContent from '@/components/FeedbackSuccessContent.vue';
import {
  ENGINEERING_PROJECT_STATUS_TABS,
  useEngineeringProjects,
  type EngineeringProjectItem,
  type EngineeringProjectStatus,
} from '@/composables/useEngineeringProjects';
import { useOrderReviews } from '@/composables/useOrderReviews';
import { useDefectReports } from '@/composables/useDefectReports';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useLanguage();

const emit = defineEmits<{
  back: [];
}>();

const { projects } = useEngineeringProjects();
const { addDefect } = useDefectReports();
const keyword = ref('');
const activeStatus = ref<EngineeringProjectStatus>('pending_start');
const selectedItem = ref<EngineeringProjectItem | null>(null);
const menuOpenId = ref<number | null>(null);
const defectCreateStep = ref<'form' | 'success'>('form');
const defectFormRef = ref<InstanceType<typeof DefectReportFormContent> | null>(null);
const {
  visible: detailVisible,
  open: openDetailPanel,
  close: closeDetail,
} = useSlideOver();
usePageBackWhen(detailVisible, closeDetail);

const {
  visible: reviewVisible,
  open: openReviewPanel,
  close: closeReview,
} = useSlideOver();
const reviewStep = ref<'form' | 'view' | 'success'>('form');
const { hasReview, getReview, submitReview } = useOrderReviews();

const {
  visible: standardVisible,
  open: openStandardPanel,
  close: closeStandard,
} = useSlideOver();

const {
  visible: reportVisible,
  open: openReportPanel,
  close: closeReport,
} = useSlideOver();

const {
  visible: archiveVisible,
  open: openArchivePanel,
  close: closeArchive,
} = useSlideOver();

const {
  visible: afterSalesVisible,
  open: openAfterSalesPanel,
  close: closeAfterSales,
} = useSlideOver();

const {
  visible: acceptanceVisible,
  open: openAcceptancePanel,
  close: closeAcceptance,
} = useSlideOver();

const {
  visible: defectVisible,
  open: openDefectPanel,
  close: closeDefect,
} = useSlideOver();

const {
  visible: defectCreateVisible,
  open: openDefectCreatePanel,
  close: closeDefectCreate,
} = useSlideOver();

const projectReviewId = (projectId: number) => `engineering-${projectId}`;

const reviewSubject = computed(() =>
  selectedItem.value
    ? {
        id: projectReviewId(selectedItem.value.id),
        name: selectedItem.value.name,
        code: selectedItem.value.code,
        codeLabel: t('engineering.projectNumber'),
      }
    : null,
);

const reviewRecord = computed(() =>
  selectedItem.value ? getReview(projectReviewId(selectedItem.value.id)) : null,
);

const statusTabs = computed(() => ENGINEERING_PROJECT_STATUS_TABS.map((tab) => ({
  id: tab.id,
  label: statusLabel(tab.id),
})));

type EngineeringActionId = 'report' | 'defect' | 'acceptance' | 'review' | 'after-sales' | 'archive' | 'standard';

const actionEntries = computed<Array<{ id: EngineeringActionId; label: string; icon: string }>>(() => [
  { id: 'report', label: t('engineering.report'), icon: '/static/icons/file-text-blue.svg' },
  { id: 'defect', label: t('engineering.defect'), icon: '/static/icons/triangle-alert-rose.svg' },
  { id: 'acceptance', label: t('engineering.acceptance'), icon: '/static/icons/clipboard-check-orange.svg' },
  { id: 'review', label: t('engineering.review'), icon: '/static/icons/star-yellow.svg' },
  { id: 'after-sales', label: t('engineering.afterSales'), icon: '/static/icons/headset-pink.svg' },
  { id: 'archive', label: t('engineering.archive'), icon: '/static/icons/folder-check-indigo.svg' },
  { id: 'standard', label: t('engineering.standard'), icon: '/static/icons/shield-check-green.svg' },
]);

const engineeringStatusKeys = {
  pending_start: 'engineering.pendingStart',
  in_progress: 'engineering.inProgress',
  completed: 'engineering.completed',
  settled: 'engineering.settled',
  in_warranty: 'engineering.inWarranty',
  out_of_warranty: 'engineering.outOfWarranty',
} as const;
const statusLabel = (status: EngineeringProjectStatus) =>
  t(engineeringStatusKeys[status]);

const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  return phone;
};

const formatAmount = (amount: number) =>
  `¥ ${amount.toLocaleString('en-US')}`;

const filteredProjects = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  return projects.value.filter((item) => {
    if (item.status !== activeStatus.value) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.managerName.toLowerCase().includes(q) ||
      item.startDate.includes(q) ||
      formatAmount(item.amount).toLowerCase().includes(q)
    );
  });
});

const openDetail = (item: EngineeringProjectItem) => {
  closeMenu();
  selectedItem.value = item;
  openDetailPanel();
};

const closeMenu = () => {
  menuOpenId.value = null;
};

const toggleMenu = (id: number) => {
  menuOpenId.value = menuOpenId.value === id ? null : id;
};

watch(activeStatus, closeMenu);

const openMenuAction = (
  item: EngineeringProjectItem,
  id: EngineeringActionId,
) => {
  closeMenu();
  selectedItem.value = item;
  handleActionClick(id);
};

const resetDetail = () => {
  selectedItem.value = null;
  closeReview();
  closeStandard();
  closeReport();
  closeArchive();
  closeAfterSales();
  closeAcceptance();
  closeDefect();
  closeDefectCreate();
};

const handleActionClick = (id: EngineeringActionId) => {
  if (id === 'review') openReview();
  if (id === 'standard') openStandard();
  if (id === 'report') openReport();
  if (id === 'archive') openArchive();
  if (id === 'after-sales') openAfterSales();
  if (id === 'acceptance') openAcceptance();
  if (id === 'defect') openDefect();
};

const openStandard = () => {
  if (!selectedItem.value) return;
  openStandardPanel();
};

const openReport = () => {
  if (!selectedItem.value) return;
  openReportPanel();
};

const openArchive = () => {
  if (!selectedItem.value) return;
  openArchivePanel();
};

const openAfterSales = () => {
  if (!selectedItem.value) return;
  openAfterSalesPanel();
};

const openAcceptance = () => {
  if (!selectedItem.value) return;
  openAcceptancePanel();
};

const openDefect = () => {
  if (!selectedItem.value) return;
  openDefectPanel();
};

const onDefectAdd = () => {
  if (!selectedItem.value) return;
  defectCreateStep.value = 'form';
  openDefectCreatePanel();
};

const resetDefectCreate = () => {
  defectCreateStep.value = 'form';
  defectFormRef.value?.resetForm();
};

const handleDefectCreateSubmit = (payload: {
  content: string;
  attachments: string[];
}) => {
  if (!selectedItem.value) return;
  addDefect({
    projectId: selectedItem.value.id,
    content: payload.content,
    attachments: payload.attachments,
  });
  defectCreateStep.value = 'success';
};

const openReview = () => {
  if (!selectedItem.value) return;
  reviewStep.value = hasReview(projectReviewId(selectedItem.value.id)) ? 'view' : 'form';
  openReviewPanel();
};

const resetReviewFlow = () => {
  reviewStep.value = 'form';
};

const handleReviewSubmit = (payload: { id: string; rating: number; content: string }) => {
  submitReview(payload.id, {
    rating: payload.rating,
    content: payload.content,
  });
  reviewStep.value = 'success';
};

const handleBack = usePageBack(() => emit('back'));
</script>

<style scoped>
.project-list-page {
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

.status-capsule-wrap {
  margin-bottom: 48rpx;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  overflow: visible;
}

.ticket-card {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 0 32rpx 30rpx;
  box-shadow: 0 8rpx 28rpx rgba(15, 23, 42, 0.045);
  display: flex;
  flex-direction: column;
  overflow: visible;
}

.ticket-card:active {
  opacity: 0.9;
}

.ticket-card.is-menu-open {
  z-index: 8;
}

.list-card-heading {
  align-items: flex-start;
  padding: 30rpx 0 28rpx;
}

.list-card-title-block {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.card-menu-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background-color: #f4f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-menu-icon {
  width: 36rpx;
  height: 36rpx;
  transition: transform 180ms ease;
}

.card-menu-icon.is-open {
  transform: rotate(180deg);
}

.card-dropdown {
  position: absolute;
  top: calc(100% + 8rpx);
  right: -20rpx;
  z-index: 30;
  width: max-content;
  min-width: 268rpx;
  padding: 8rpx 0;
  background-color: #ffffff;
  border-radius: 28rpx;
  box-shadow: 0 16rpx 48rpx rgba(15, 23, 42, 0.14);
  border: 2rpx solid #f3f4f6;
  box-sizing: border-box;
}

.card-dropdown-item {
  min-height: 88rpx;
  margin: 0 22rpx;
  padding: 0 6rpx;
  display: flex;
  align-items: center;
  gap: 18rpx;
  box-sizing: border-box;
  border-bottom: 2rpx solid #eef2f7;
}

.card-dropdown-item:last-child {
  border-bottom: none;
}

.card-dropdown-icon {
  width: 44rpx;
  height: 44rpx;
  flex-shrink: 0;
}

.card-dropdown-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  white-space: nowrap;
}

.list-card-metrics {
  min-height: 132rpx;
  padding: 24rpx 28rpx;
  border-radius: 28rpx;
  background-color: #f8fafc;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.metric-amount-block,
.metric-date-block {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  min-width: 0;
}

.metric-amount-block {
  flex: 1;
}

.metric-date-block {
  flex-shrink: 0;
}

.metric-label {
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.metric-amount {
  font-size: 40rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.metric-date {
  font-size: 27rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.metric-divider {
  width: 2rpx;
  height: 64rpx;
  background-color: #e8edf2;
  flex-shrink: 0;
}

.list-card-footer {
  margin-top: 26rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.manager-avatar {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background-color: #b2c4d7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.manager-avatar-text {
  font-size: 28rpx;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.manager-meta,
.contact-meta {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.manager-meta {
  flex: 1;
  min-width: 0;
}

.contact-meta {
  align-items: flex-end;
  flex-shrink: 0;
}

.footer-label {
  font-size: 22rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.footer-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
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

.action-card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
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
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.card-heading-block {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.card-title {
  flex: 1;
  min-width: 0;
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.card-code {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
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
</style>
