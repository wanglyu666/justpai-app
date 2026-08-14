<template>
  <view class="delete-confirm">
    <view class="confirm-content">
      <text class="confirm-title">您确定注销账户吗？</text>
      <text class="confirm-subtitle">此操作不可撤回</text>
    </view>

    <view class="action-wrap">
      <view class="cancel-btn" @click="handleCancel">
        <text class="cancel-btn-text">取消</text>
      </view>
      <view class="confirm-btn" @click="handleConfirm">
        <text class="confirm-btn-text">确认</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();

const handleCancel = () => {
  emit('cancel');
};

const handleConfirm = () => {
  emit('confirm');
};
</script>

<style scoped>
.delete-confirm {
  min-height: 100%;
  height: 100%;
  padding: 0 48rpx 80rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.confirm-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 24rpx;
}

.confirm-title {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.confirm-subtitle {
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 16rpx;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.action-wrap {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.cancel-btn {
  height: 104rpx;
  border-radius: 52rpx;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #374151;
}

.confirm-btn {
  height: 104rpx;
  border-radius: 52rpx;
  background-color: #ff3b30;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
}
</style>
