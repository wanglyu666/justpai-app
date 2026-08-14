<template>
  <view class="bill-management">
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
          placeholder="搜索账单"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <text class="page-title">账单管理</text>
      <text class="page-desc">查看全部账单信息</text>

      <StatusCapsuleSwitch
        class="status-capsule-wrap"
        v-model="activeStatus"
        :tabs="statusTabs"
        equal
      />

      <view class="bill-list">
        <view
          v-for="item in filteredBills"
          :key="item.id"
          class="bill-card"
          @click="openDetail(item)"
        >
          <text class="bill-name">{{ item.name }}</text>
          <view class="bill-meta-row">
            <view class="bill-meta">
              <text class="meta-label">账单编号</text>
              <text class="meta-value">{{ item.no }}</text>
            </view>
            <view class="bill-meta bill-meta-amount">
              <text class="meta-label">账单金额</text>
              <text class="meta-amount">{{ item.amountText }}</text>
            </view>
          </view>
        </view>

        <view v-if="filteredBills.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关账单</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="detailVisible"
      :z-index="2200"
      @closed="resetDetail"
    >
      <view class="detail-page sheet-page sheet-page--with-footer">
        <view class="detail-header sheet-page__header">
          <view class="icon-btn sheet-page__back-btn" @click="closeDetail">
            <image
              src="/static/icons/chevron-left.svg"
              mode="aspectFit"
              class="header-icon-img sheet-page__back-icon"
            />
          </view>
        </view>

        <view class="detail-content sheet-page__body" v-if="selectedBill">
          <text class="detail-title sheet-page__title">账单详情</text>

          <view class="detail-card">
            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">订单编号</text>
                <text class="detail-value">{{ selectedBill.orderNo }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">合同编号</text>
                <text class="detail-value">{{ selectedBill.contractNo }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">合同金额</text>
                <text class="detail-value">{{ selectedBill.contractAmount }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">已付金额</text>
                <text class="detail-value">{{ selectedBill.paidAmount }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">未付金额</text>
                <text class="detail-value">{{ selectedBill.unpaidAmount }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">项目编号</text>
                <text class="detail-value">{{ selectedBill.projectNo }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">付款批次</text>
                <text class="detail-value">{{ selectedBill.paymentBatch }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">申请时间</text>
                <text class="detail-value">{{ selectedBill.applyDate }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">本次支付批次</text>
                <text class="detail-value">{{ selectedBill.currentBatch }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">本次比例</text>
                <text class="detail-value">{{ selectedBill.currentRatio }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field detail-field-full">
                <text class="detail-label">本次支付说明</text>
                <text class="detail-value">{{ selectedBill.paymentNote }}</text>
              </view>
            </view>
          </view>

          <view
            v-if="selectedBill.status === 'pending_pay' && selectedBill.invoice"
            class="detail-card invoice-card"
          >
            <view class="card-section-title">
              <view class="card-section-bar" />
              <text class="card-section-title-text">发票信息</text>
            </view>

            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">发票类型</text>
                <text class="detail-value">{{ selectedBill.invoice.type }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">发票编号</text>
                <text class="detail-value">{{ selectedBill.invoice.no }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">开票日期</text>
                <text class="detail-value">{{ selectedBill.invoice.issueDate }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">支付日期</text>
                <text class="detail-value">{{ selectedBill.invoice.payDate }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">不含税金额</text>
                <text class="detail-value">{{ selectedBill.invoice.amountExTax }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">含税金额</text>
                <text class="detail-value">{{ selectedBill.invoice.amountInTax }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field detail-field-full">
                <text class="detail-label">备注</text>
                <text class="detail-value">{{ selectedBill.invoice.remark }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="detail-footer sheet-page__footer">
          <view class="footer-btn footer-btn-secondary" @click="onViewRequestFile">
            <text class="footer-btn-text footer-btn-text-secondary">查看请款文件</text>
          </view>
          <view class="footer-btn footer-btn-primary" @click="onConfirm">
            <text class="footer-btn-text footer-btn-text-primary">确认</text>
          </view>
        </view>
      </view>
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import { useSlideOver } from '@/composables/useSlideOver';

type BillStatus = 'pending_confirm' | 'pending_pay' | 'paid';

type InvoiceInfo = {
  type: string;
  no: string;
  issueDate: string;
  payDate: string;
  amountExTax: string;
  amountInTax: string;
  remark: string;
};

type BillItem = {
  id: number;
  name: string;
  no: string;
  amountText: string;
  orderNo: string;
  contractNo: string;
  contractAmount: string;
  paidAmount: string;
  unpaidAmount: string;
  projectNo: string;
  paymentBatch: string;
  applyDate: string;
  currentBatch: string;
  currentRatio: string;
  paymentNote: string;
  status: BillStatus;
  invoice?: InvoiceInfo;
};

const emit = defineEmits<{
  back: [];
}>();

const keyword = ref('');
const activeStatus = ref<BillStatus>('pending_confirm');
const selectedBill = ref<BillItem | null>(null);
const {
  visible: detailVisible,
  open: openDetailPanel,
  close: closeDetail,
} = useSlideOver();

const statusTabs: { id: BillStatus; label: string }[] = [
  { id: 'pending_confirm', label: '待确认' },
  { id: 'pending_pay', label: '待支付' },
  { id: 'paid', label: '已支付' },
];

const bills = ref<BillItem[]>([
  {
    id: 1,
    name: '设施维保服务费',
    no: 'ZD20260112144812',
    amountText: '¥120,000',
    orderNo: 'ORD-2024001',
    contractNo: 'HT-2024-0001',
    contractAmount: '¥120,000',
    paidAmount: '¥0',
    unpaidAmount: '¥120,000',
    projectNo: 'PRJ-001',
    paymentBatch: '第1批',
    applyDate: '2026-04-17',
    currentBatch: '第1批',
    currentRatio: '100%',
    paymentNote: '全额请款，按合同节点一次性支付。',
    status: 'pending_confirm',
  },
  {
    id: 2,
    name: '办公设备采购费',
    no: 'ZD20260111103205',
    amountText: '¥10,000',
    orderNo: 'ORD-2024002',
    contractNo: 'HT-2024-0002',
    contractAmount: '¥10,000',
    paidAmount: '¥0',
    unpaidAmount: '¥10,000',
    projectNo: 'PRJ-002',
    paymentBatch: '第1批',
    applyDate: '2026-01-11',
    currentBatch: '第1批',
    currentRatio: '100%',
    paymentNote: '设备采购款一次性结算。',
    status: 'pending_confirm',
  },
  {
    id: 3,
    name: '技术咨询服务费',
    no: 'ZD20260110121548',
    amountText: '¥8,000',
    orderNo: 'ORD-2024003',
    contractNo: 'HT-2024-0003',
    contractAmount: '¥16,000',
    paidAmount: '¥8,000',
    unpaidAmount: '¥8,000',
    projectNo: 'PRJ-003',
    paymentBatch: '第2批',
    applyDate: '2026-01-10',
    currentBatch: '第2批',
    currentRatio: '50%',
    paymentNote: '按咨询里程碑支付第二期费用。',
    status: 'pending_pay',
    invoice: {
      type: '增值税专用发票',
      no: 'FP2026041400001',
      issueDate: '2026-04-14',
      payDate: '2026-04-20',
      amountExTax: '¥35,840',
      amountInTax: '¥38,000',
      remark: '按合同约定节点支付尾款。',
    },
  },
  {
    id: 4,
    name: '年框续约账单',
    no: 'ZD20251222190533',
    amountText: '¥128,000',
    orderNo: 'ORD-2024004',
    contractNo: 'HT-2024-0004',
    contractAmount: '¥128,000',
    paidAmount: '¥0',
    unpaidAmount: '¥128,000',
    projectNo: 'PRJ-004',
    paymentBatch: '第1批',
    applyDate: '2025-12-22',
    currentBatch: '第1批',
    currentRatio: '100%',
    paymentNote: '年框续约全额请款。',
    status: 'pending_pay',
    invoice: {
      type: '增值税专用发票',
      no: 'FP2025122200004',
      issueDate: '2025-12-22',
      payDate: '2026-01-05',
      amountExTax: '¥120,755',
      amountInTax: '¥128,000',
      remark: '年框续约全额开票支付。',
    },
  },
  {
    id: 5,
    name: '机房运维服务费',
    no: 'ZD20251215143022',
    amountText: '¥36,000',
    orderNo: 'ORD-2024005',
    contractNo: 'HT-2024-0005',
    contractAmount: '¥36,000',
    paidAmount: '¥36,000',
    unpaidAmount: '¥0',
    projectNo: 'PRJ-005',
    paymentBatch: '第1批',
    applyDate: '2025-12-15',
    currentBatch: '第1批',
    currentRatio: '100%',
    paymentNote: '机房运维服务费已结清。',
    status: 'paid',
  },
  {
    id: 6,
    name: '软件授权年费',
    no: 'ZD20251208110917',
    amountText: '¥88,000',
    orderNo: 'ORD-2024006',
    contractNo: 'HT-2024-0006',
    contractAmount: '¥88,000',
    paidAmount: '¥88,000',
    unpaidAmount: '¥0',
    projectNo: 'PRJ-006',
    paymentBatch: '第1批',
    applyDate: '2025-12-08',
    currentBatch: '第1批',
    currentRatio: '100%',
    paymentNote: '软件授权年费全额支付。',
    status: 'paid',
  },
]);

const filteredBills = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  return bills.value.filter((item) => {
    if (item.status !== activeStatus.value) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.no.toLowerCase().includes(q) ||
      item.orderNo.toLowerCase().includes(q) ||
      item.contractNo.toLowerCase().includes(q)
    );
  });
});

const openDetail = (item: BillItem) => {
  selectedBill.value = item;
  openDetailPanel();
};

const resetDetail = () => {
  selectedBill.value = null;
};

const handleBack = () => {
  emit('back');
};

const onViewRequestFile = () => {
  // TODO: open payment request file
};

const onConfirm = () => {
  // TODO: confirm bill
};
</script>

<style scoped>
.bill-management {
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
  margin-bottom: 32rpx;
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.status-capsule-wrap {
  margin-bottom: 48rpx;
}

.bill-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.bill-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 36rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.bill-name {
  font-size: 36rpx;
  font-weight: 800;
  color: #163300;
  line-height: 1.3;
}

.bill-meta-row {
  display: flex;
  align-items: flex-start;
  gap: 32rpx;
}

.bill-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.bill-meta-amount {
  flex: 0 0 auto;
  align-items: flex-end;
  text-align: right;
}

.meta-label {
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.meta-value {
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.3;
  word-break: break-all;
}

.meta-amount {
  font-size: 40rpx;
  font-weight: 700;
  color: #111827;
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

.detail-page {
  display: flex;
  flex-direction: column;
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.detail-title {
  margin-bottom: 8rpx;
}

.detail-card {
  background-color: #ffffff;
  border-radius: 48rpx;
  padding: 56rpx 44rpx;
  min-height: 840rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 44rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
}

.invoice-card {
  min-height: 0;
  justify-content: flex-start;
}

.card-section-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 4rpx;
}

.card-section-bar {
  width: 8rpx;
  height: 32rpx;
  border-radius: 4rpx;
  background-color: #9fe870;
  flex-shrink: 0;
}

.card-section-title-text {
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.detail-row {
  display: flex;
  gap: 36rpx;
}

.detail-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.detail-field-full {
  flex: 1 1 100%;
}

.detail-label {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.detail-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
  word-break: break-all;
}

.detail-footer {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.footer-btn {
  flex: 1;
  height: 104rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-btn-secondary {
  background-color: #ffffff;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.footer-btn-primary {
  background-color: #9fe870;
}

.footer-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1;
}

.footer-btn-text-secondary {
  color: #111827;
}

.footer-btn-text-primary {
  color: #163300;
}
</style>
