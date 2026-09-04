<template>
  <view
    v-if="show"
    class="image-preview"
    @click="emit('close')"
  >
    <image
      :src="src"
      mode="aspectFit"
      class="image-preview-img"
    />
    <view class="preview-close" @click.stop="emit('close')">
      <image
        src="/static/icons/x.svg"
        mode="aspectFit"
        class="preview-close-icon"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  src: string;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<style scoped>
.image-preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f4f5f7;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview-img {
  width: 100%;
  height: 100%;
}

.preview-close {
  position: absolute;
  top: var(--page-safe-top);
  right: 48rpx;
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  z-index: 2;
}

.preview-close-icon {
  width: 40rpx;
  height: 40rpx;
}
</style>
