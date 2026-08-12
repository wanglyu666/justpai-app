<template>
  <view class="approval-config-page">
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
          placeholder="搜索审批"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-block">
        <text class="page-title">审批配置</text>
        <text class="page-desc">查看全部审批配置</text>
      </view>

      <view class="approval-list">
        <view
          v-for="item in filteredItems"
          :key="item.id"
          class="approval-card"
          @click="openFlow(item)"
        >
          <view class="card-header">
            <view class="card-header-main">
              <text class="type-label">审批类型</text>
              <text class="type-title">{{ item.type }}</text>
            </view>
          </view>

          <view class="meta-row">
            <view class="meta-item">
              <view class="avatar">
                <text class="avatar-text">{{ item.initiator.slice(0, 1) }}</text>
              </view>
              <view class="meta-text">
                <text class="meta-label">发起人</text>
                <text class="meta-value">{{ item.initiator }}</text>
              </view>
            </view>
            <view class="meta-divider" />
            <view class="meta-item meta-item-time">
              <view class="meta-text">
                <text class="meta-label">发起时间</text>
                <text class="meta-value">{{ item.time }}</text>
              </view>
            </view>
          </view>

          <view class="card-footer">
            <view v-if="item.status === 'in_progress'" class="flow-section">
              <view class="flow-node flow-node-edge">
                <text class="flow-node-text">开始</text>
              </view>
              <view class="flow-connector">
                <view class="flow-dot" />
                <view class="flow-line" />
                <view class="flow-dot" />
              </view>
              <view class="flow-node flow-node-current">
                <text class="flow-current-name">{{ item.currentApprover }}</text>
                <text class="flow-current-label">当前</text>
              </view>
              <view class="flow-connector">
                <view class="flow-dot" />
                <view class="flow-line" />
                <view class="flow-dot" />
              </view>
              <view class="flow-node flow-node-edge">
                <text class="flow-node-text">结束</text>
              </view>
            </view>

            <view v-else class="done-section">
              <view class="done-badge">
                <text class="done-badge-text">已完成</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="filteredItems.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关审批配置</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="flowVisible"
      :z-index="1300"
      @closed="resetFlow"
    >
      <ApprovalFlowContent
        v-if="selectedItem"
        :title="selectedItem.type"
        :steps="selectedItem.steps"
        @back="closeFlow"
      />
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import ApprovalFlowContent, {
  type ApprovalFlowStep,
} from '@/components/ApprovalFlowContent.vue';
import { useSlideOver } from '@/composables/useSlideOver';

type ApprovalStatus = 'in_progress' | 'done';

type ApprovalItem = {
  id: number;
  type: string;
  initiator: string;
  time: string;
  status: ApprovalStatus;
  currentApprover?: string;
  steps: ApprovalFlowStep[];
};

const emit = defineEmits<{
  back: [];
}>();

const keyword = ref('');
const selectedItem = ref<ApprovalItem | null>(null);
const {
  visible: flowVisible,
  open: openFlowPanel,
  close: closeFlow,
} = useSlideOver();

const items = ref<ApprovalItem[]>([
  {
    id: 1,
    type: '下单审批',
    initiator: '张伟',
    time: '2026年4月10日',
    status: 'in_progress',
    currentApprover: '王强',
    steps: [
      {
        id: 1,
        name: '李秀英',
        role: '部门主管',
        time: '2026-04-10 10:10:33',
        result: 'approved',
        comment: '资料完整，符合采购流程，同意申请。',
      },
      {
        id: 2,
        name: '王强',
        role: '财务主管',
        time: '',
        result: 'pending',
        comment: '等待财务主管审批。',
      },
      {
        id: 3,
        name: '赵敏',
        role: '总经理',
        time: '',
        result: 'not_started',
        comment: '前一环节通过后将流转至总经理。',
      },
    ],
  },
  {
    id: 2,
    type: '结算审批',
    initiator: '刘洋',
    time: '2026年4月13日',
    status: 'done',
    steps: [
      {
        id: 1,
        name: '李秀英',
        role: '部门主管',
        time: '2026-04-13 09:20:11',
        result: 'approved',
        comment: '结算材料齐全，同意提交。',
      },
      {
        id: 2,
        name: '王强',
        role: '财务主管',
        time: '2026-04-13 11:05:42',
        result: 'approved',
        comment: '金额核对无误，同意结算。',
      },
      {
        id: 3,
        name: '赵敏',
        role: '总经理',
        time: '2026-04-13 15:30:08',
        result: 'approved',
        comment: '同意结算申请。',
      },
    ],
  },
  {
    id: 3,
    type: '采购审批',
    initiator: '陈晨',
    time: '2026年4月8日',
    status: 'in_progress',
    currentApprover: '赵敏',
    steps: [
      {
        id: 1,
        name: '李秀英',
        role: '部门主管',
        time: '2026-04-08 14:12:09',
        result: 'approved',
        comment: '采购需求合理，同意进入财务审核。',
      },
      {
        id: 2,
        name: '王强',
        role: '财务主管',
        time: '2026-04-09 10:02:55',
        result: 'approved',
        comment: '预算充足，同意继续流转。',
      },
      {
        id: 3,
        name: '赵敏',
        role: '总经理',
        time: '',
        result: 'pending',
        comment: '等待总经理审批。',
      },
    ],
  },
  {
    id: 4,
    type: '合同审批',
    initiator: '李华',
    time: '2026年4月5日',
    status: 'done',
    steps: [
      {
        id: 1,
        name: '李秀英',
        role: '部门主管',
        time: '2026-04-05 09:40:21',
        result: 'approved',
        comment: '合同条款已核对，同意。',
      },
      {
        id: 2,
        name: '王强',
        role: '财务主管',
        time: '2026-04-05 13:18:47',
        result: 'approved',
        comment: '付款节奏可接受，同意。',
      },
      {
        id: 3,
        name: '赵敏',
        role: '总经理',
        time: '2026-04-05 17:05:16',
        result: 'approved',
        comment: '同意签署本合同。',
      },
    ],
  },
]);

const filteredItems = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((item) => {
    const statusText = item.status === 'done' ? '已完成' : '进行中';
    return (
      item.type.toLowerCase().includes(q) ||
      item.initiator.toLowerCase().includes(q) ||
      item.time.toLowerCase().includes(q) ||
      (item.currentApprover || '').toLowerCase().includes(q) ||
      statusText.includes(q)
    );
  });
});

const openFlow = (item: ApprovalItem) => {
  selectedItem.value = item;
  openFlowPanel();
};

const resetFlow = () => {
  selectedItem.value = null;
};

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
.approval-config-page {
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

.title-block {
  margin-bottom: 24px;
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
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.approval-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.approval-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
  border: 1px solid rgba(229, 231, 235, 0.9);
}

.card-header {
  display: flex;
  align-items: flex-start;
  padding: 20px 18px 0;
}

.card-header-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.type-label {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.2;
}

.type-title {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  line-height: 1.25;
}

.meta-row {
  margin: 18px 18px 0;
  padding: 14px 14px;
  border-radius: 16px;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-item {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta-item-time {
  justify-content: flex-start;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: #b2c4d7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.meta-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.meta-label {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.2;
}

.meta-value {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  line-height: 1.25;
}

.meta-divider {
  width: 1px;
  height: 28px;
  background-color: #e5e7eb;
  flex-shrink: 0;
}

.card-footer {
  margin-top: 16px;
  padding: 16px 18px 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  border-top: 1px solid #f1f5f9;
}

.flow-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.flow-node-edge {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.flow-node-text {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  line-height: 1;
}

.flow-connector {
  flex: 1;
  min-width: 10px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.flow-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #d1d5db;
  flex-shrink: 0;
}

.flow-line {
  flex: 1;
  height: 0;
  border-top: 1.5px dashed #d1d5db;
}

.flow-node-current {
  min-width: 76px;
  padding: 10px 14px;
  border-radius: 16px;
  background-color: #111827;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-shrink: 0;
}

.flow-current-name {
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
}

.flow-current-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1;
}

.done-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.done-badge {
  min-width: 140px;
  height: 42px;
  padding: 0 24px;
  border-radius: 999px;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
}

.done-badge-text {
  font-size: 15px;
  font-weight: 800;
  color: #163300;
  line-height: 1;
}

.empty-tip {
  padding: 48px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-tip-text {
  font-size: 14px;
  color: #9ca3af;
}
</style>
