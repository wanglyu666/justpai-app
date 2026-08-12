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
          placeholder="搜索咨询单"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">咨询单</text>
          <text class="page-desc">查看全部咨询单信息</text>
        </view>
        <view class="add-btn" @click="onAdd">
          <text class="add-btn-text">新增</text>
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
        >
          <text class="ticket-name">{{ item.name }}</text>

          <view class="ticket-field">
            <text class="field-label">咨询时间</text>
            <text class="field-value">{{ item.time }}</text>
          </view>

          <view class="ticket-field">
            <text class="field-label">需求</text>
            <text class="field-value field-value-demand">{{ item.demand }}</text>
          </view>
        </view>

        <view v-if="filteredTickets.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关咨询单</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';

type ConsultStatus = 'pending_reply' | 'in_progress' | 'closed';

type ConsultTicket = {
  id: number;
  name: string;
  time: string;
  demand: string;
  status: ConsultStatus;
};

const emit = defineEmits<{
  back: [];
}>();

const keyword = ref('');
const activeStatus = ref<ConsultStatus>('pending_reply');

const statusTabs: { id: ConsultStatus; label: string }[] = [
  { id: 'pending_reply', label: '待回复' },
  { id: 'in_progress', label: '进行中' },
  { id: 'closed', label: '已结束' },
];

const tickets = ref<ConsultTicket[]>([
  {
    id: 1,
    name: '门店空调系统选型咨询',
    time: '2026-03-28 14:20',
    demand: '需要了解多联机与风冷模块机在本项目中的适用性，并给出大致造价区间供立项参考。',
    status: 'pending_reply',
  },
  {
    id: 2,
    name: '办公楼暖通方案咨询',
    time: '2026-03-26 10:05',
    demand: '希望评估集中式与分体式方案的能耗差异，并提供设备选型清单与交付周期建议。',
    status: 'pending_reply',
  },
  {
    id: 3,
    name: '机房精密空调改造咨询',
    time: '2026-03-20 16:40',
    demand: '现有机房制冷能力不足，需要改造方案，包含冗余设计、施工窗口与预算评估。',
    status: 'in_progress',
  },
  {
    id: 4,
    name: '年框续约服务咨询',
    time: '2026-03-15 09:18',
    demand: '了解续约后的服务范围、响应时效及驻场支持是否可按需增减。',
    status: 'in_progress',
  },
  {
    id: 5,
    name: '冷站节能优化咨询',
    time: '2026-02-28 11:30',
    demand: '希望针对现有冷站进行能效诊断，并输出可落地的优化措施与预期节省测算。',
    status: 'closed',
  },
  {
    id: 6,
    name: '新项目立项设备咨询',
    time: '2026-02-12 15:55',
    demand: '项目处于立项阶段，需要设备配置建议、关键参数说明及大致投资区间。',
    status: 'closed',
  },
]);

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

const handleBack = () => {
  emit('back');
};

const onAdd = () => {
  // TODO: open create consult form
};
</script>

<style scoped>
.consult-ticket {
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

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.title-block {
  flex: 1;
  min-width: 0;
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

.add-btn {
  flex-shrink: 0;
  height: 44px;
  padding: 0 24px;
  border-radius: 14px;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn-text {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.status-capsule-wrap {
  margin-bottom: 24px;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ticket-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 20px;
  border: 1px solid #d8f0c8;
  padding: 20px 18px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ticket-name {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.ticket-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.2;
}

.field-value {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
  line-height: 1.45;
}

.field-value-demand {
  font-weight: 400;
  color: #374151;
  line-height: 1.55;
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
