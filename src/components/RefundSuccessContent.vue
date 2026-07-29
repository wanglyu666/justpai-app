<template>
  <view class="refund-success">
    <view class="success-content">
      <image
        src="/static/images/check-mark.png"
        mode="aspectFit"
        class="success-icon"
      />
      <text class="success-title">已完成提交</text>
      <text class="success-desc">您的退款申请已提交，我们将尽快处理</text>
    </view>

    <view class="action-wrap">
      <view class="back-btn" @click="handleBack">
        <text class="back-btn-text">返回订单</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  back: [];
}>();

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
.refund-success {
  min-height: 100%;
  height: 100%;
  padding: 0 24px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.success-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.success-icon {
  width: 200px;
  height: 200px;
  margin-bottom: 32px;
  display: block;
}

.success-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
}

.success-desc {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.5;
}

.action-wrap {
  flex-shrink: 0;
}

.back-btn {
  height: 52px;
  border-radius: 26px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn-text {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}
</style>
