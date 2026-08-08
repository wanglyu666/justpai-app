<template>
  <view class="contract-archive">
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
          placeholder="搜索合同"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <text class="page-title">合同档案</text>
      <text class="page-desc">查看全部合同信息</text>

      <view class="contract-list">
        <view
          v-for="item in filteredContracts"
          :key="item.id"
          class="contract-card"
          @click="openDetail(item)"
        >
          <text class="contract-name">{{ item.name }}</text>
          <view class="contract-meta-row">
            <view class="contract-meta">
              <text class="meta-label">合同编号</text>
              <text class="meta-value">{{ item.no }}</text>
            </view>
            <view class="contract-meta contract-meta-amount">
              <text class="meta-label">合同金额</text>
              <text class="meta-amount">{{ item.amountText }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="detailVisible"
      :z-index="1200"
      @closed="resetDetail"
    >
      <view class="detail-page">
        <view class="detail-header">
          <view class="icon-btn" @click="closeDetail">
            <image
              src="/static/icons/chevron-left.svg"
              mode="aspectFit"
              class="header-icon-img"
            />
          </view>
        </view>

        <view class="detail-content" v-if="selectedContract">
          <text class="detail-title">合同详情</text>

          <view class="detail-card">
            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">合同类型</text>
                <text class="detail-value">{{ selectedContract.type }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">合同编号</text>
                <text class="detail-value">{{ selectedContract.no }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field detail-field-full">
                <text class="detail-label">合同名称</text>
                <text class="detail-value">{{ selectedContract.fullName }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">联系人</text>
                <text class="detail-value">{{ selectedContract.contact }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">联系电话</text>
                <text class="detail-value">{{ selectedContract.phone }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">合同金额</text>
                <text class="detail-value">{{ selectedContract.amount }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">合同开始日期</text>
                <text class="detail-value">{{ selectedContract.startDate }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">合同结束日期</text>
                <text class="detail-value">{{ selectedContract.endDate }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">签订日期</text>
                <text class="detail-value">{{ selectedContract.signDate }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="detail-footer">
          <view class="preview-btn" @click="onPreview">
            <text class="preview-btn-text">预览</text>
          </view>
        </view>
      </view>
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import { useSlideOver } from '@/composables/useSlideOver';

type ContractItem = {
  id: number;
  name: string;
  fullName: string;
  no: string;
  type: string;
  amount: string;
  amountText: string;
  contact: string;
  phone: string;
  startDate: string;
  endDate: string;
  signDate: string;
};

const emit = defineEmits<{
  back: [];
}>();

const keyword = ref('');
const selectedContract = ref<ContractItem | null>(null);
const {
  visible: detailVisible,
  open: openDetailPanel,
  close: closeDetail,
} = useSlideOver();

const contracts = ref<ContractItem[]>([
  {
    id: 1,
    name: '年框服务合同',
    fullName: '2026年度设施维保年框合同',
    no: 'HT20260112144812',
    type: '年框合同',
    amount: '60000.00',
    amountText: '¥60,000',
    contact: '冷雪松',
    phone: '18513204939',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    signDate: '2026-01-12',
  },
  {
    id: 2,
    name: '普通采购合同',
    fullName: '办公设备采购合同',
    no: 'HT20260111103205',
    type: '普通合同',
    amount: '10000.00',
    amountText: '¥10,000',
    contact: '王敏',
    phone: '13800138001',
    startDate: '2026-01-11',
    endDate: '2026-06-30',
    signDate: '2026-01-11',
  },
  {
    id: 3,
    name: '技术咨询合同',
    fullName: '系统架构技术咨询合同',
    no: 'HT20260110121548',
    type: '普通合同',
    amount: '0.00',
    amountText: '¥0',
    contact: '李华',
    phone: '13900139002',
    startDate: '2026-01-10',
    endDate: '2026-03-31',
    signDate: '2026-01-10',
  },
  {
    id: 4,
    name: '年框续约合同',
    fullName: '2026年度运维年框续约合同',
    no: 'HT20251222190533',
    type: '年框合同',
    amount: '128000.00',
    amountText: '¥128,000',
    contact: '赵强',
    phone: '13700137003',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    signDate: '2025-12-22',
  },
  {
    id: 5,
    name: '运维服务合同',
    fullName: '机房运维服务合同',
    no: 'HT20251215143022',
    type: '普通合同',
    amount: '36000.00',
    amountText: '¥36,000',
    contact: '陈晨',
    phone: '13600136004',
    startDate: '2025-12-15',
    endDate: '2026-12-14',
    signDate: '2025-12-15',
  },
  {
    id: 6,
    name: '软件授权合同',
    fullName: '企业软件授权使用合同',
    no: 'HT20251208110917',
    type: '普通合同',
    amount: '88000.00',
    amountText: '¥88,000',
    contact: '周杰',
    phone: '13500135005',
    startDate: '2025-12-08',
    endDate: '2026-12-07',
    signDate: '2025-12-08',
  },
]);

const filteredContracts = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return contracts.value;
  return contracts.value.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.no.toLowerCase().includes(q) ||
      item.fullName.toLowerCase().includes(q),
  );
});

const handleBack = () => {
  emit('back');
};

const openDetail = (item: ContractItem) => {
  selectedContract.value = item;
  openDetailPanel();
};

const resetDetail = () => {
  selectedContract.value = null;
};

const onPreview = () => {
  // TODO: open contract preview
};
</script>

<style scoped>
.contract-archive {
  min-height: 100%;
  padding-bottom: 40px;
  box-sizing: border-box;
}

.page-header {
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
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
  flex-shrink: 0;
}

.header-icon-img {
  width: 20px;
  height: 20px;
}

.search-bar {
  width: 168px;
  flex-shrink: 0;
  margin-left: auto;
  height: 44px;
  background-color: #ffffff;
  border-radius: 999px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 14px;
  color: #111827;
  height: 100%;
}

.search-placeholder {
  color: #9ca3af;
  font-size: 14px;
}

.content {
  padding: 32px 24px 0;
}

.page-title {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.page-desc {
  display: block;
  margin-top: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.contract-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contract-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 18px 18px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.contract-name {
  font-size: 18px;
  font-weight: 800;
  color: #163300;
  line-height: 1.3;
}

.contract-meta-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.contract-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contract-meta-amount {
  flex: 0 0 auto;
  align-items: flex-end;
  text-align: right;
}

.meta-label {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.2;
}

.meta-value {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.3;
  word-break: break-all;
}

.meta-amount {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.detail-page {
  min-height: 100%;
  padding-bottom: 120px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.detail-header {
  padding: 0 24px;
}

.detail-content {
  padding: 24px 24px 0;
  flex: 1;
}

.detail-title {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 20px;
}

.detail-card {
  background-color: #ffffff;
  border-radius: 24px;
  padding: 28px 22px;
  min-height: 420px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 22px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.detail-row {
  display: flex;
  gap: 18px;
}

.detail-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-field-full {
  flex: 1 1 100%;
}

.detail-label {
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.2;
}

.detail-value {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
  word-break: break-all;
}

.detail-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px 24px calc(16px + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(180deg, rgba(244, 245, 247, 0) 0%, #f4f5f7 28%);
  z-index: 2;
}

.preview-btn {
  height: 52px;
  border-radius: 16px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.preview-btn-text {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}
</style>
