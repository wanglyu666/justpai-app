<template>
  <view class="approval-flow-page">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
    </view>

    <view class="content">
      <view class="hero">
        <text class="page-title">审批流</text>
        <view class="hero-tag">
          <text class="hero-tag-text">{{ title }}</text>
        </view>
      </view>

      <view class="timeline">
        <view
          v-for="(step, index) in steps"
          :key="step.id"
          class="timeline-item"
        >
          <view class="timeline-left">
            <view class="avatar">
              <text class="avatar-text">{{ step.name.slice(0, 1) }}</text>
            </view>
            <view
              v-if="index < steps.length - 1"
              class="timeline-line"
            />
          </view>

          <view class="step-card" :class="`card-${step.result}`">
            <view class="step-top">
              <view class="step-person">
                <text class="person-name">{{ step.name }}</text>
                <text class="person-role">{{ step.role }}</text>
              </view>
              <view class="result-badge" :class="`result-${step.result}`">
                <text class="result-badge-text">{{ resultLabel(step.result) }}</text>
              </view>
            </view>

            <view class="step-meta">
              <text class="meta-label">审批时间</text>
              <text class="meta-value">{{ step.time || '—' }}</text>
            </view>

            <view class="comment-box">
              <text class="comment-label">审批意见</text>
              <text class="comment-text">{{ step.comment }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
export type ApprovalResult = 'approved' | 'pending' | 'not_started';

export type ApprovalFlowStep = {
  id: number;
  name: string;
  role: string;
  time: string;
  result: ApprovalResult;
  comment: string;
};

defineProps<{
  title: string;
  steps: ApprovalFlowStep[];
}>();

const emit = defineEmits<{
  back: [];
}>();

const RESULT_LABEL: Record<ApprovalResult, string> = {
  approved: '同意',
  pending: '待审批',
  not_started: '未开始',
};

const resultLabel = (result: ApprovalResult) => RESULT_LABEL[result];

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
.approval-flow-page {
  min-height: 100%;
  padding-bottom: 40px;
  box-sizing: border-box;
  background-color: #f4f5f7;
}

.page-header {
  padding: 0 24px;
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

.content {
  padding: 24px 24px 0;
}

.hero {
  margin-bottom: 28px;
}

.page-title {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
}

.hero-tag {
  display: inline-flex;
  margin-top: 12px;
  height: 30px;
  padding: 0 14px;
  border-radius: 999px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  align-items: center;
}

.hero-tag-text {
  font-size: 13px;
  font-weight: 700;
  color: #163300;
  line-height: 1;
}

.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  align-items: stretch;
  gap: 14px;
}

.timeline-left {
  width: 44px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #b2c4d7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.avatar-text {
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.timeline-line {
  width: 2px;
  flex: 1;
  min-height: 20px;
  margin: 8px 0;
  border-radius: 999px;
  background-color: #e5e7eb;
}

.step-card {
  flex: 1;
  min-width: 0;
  background-color: #ffffff;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  border: 1px solid #eef0f3;
}

.timeline-item:last-child .step-card {
  margin-bottom: 0;
}

.card-approved {
  border-color: #e5f6d8;
}

.card-pending {
  border-color: #f3e7c8;
}

.step-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.step-person {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.person-name {
  font-size: 17px;
  font-weight: 800;
  color: #111827;
  line-height: 1.25;
}

.person-role {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.3;
}

.result-badge {
  height: 26px;
  padding: 0 12px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.result-badge-text {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.result-approved {
  background-color: #6f9b4f;
}

.result-pending {
  background-color: #c4a35a;
}

.result-not_started {
  background-color: #9ca3af;
}

.step-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.meta-label {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.2;
}

.meta-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
}

.comment-box {
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.comment-label {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.3;
}

.comment-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.55;
}
</style>
