<template>
  <view
    class="action-square"
    :class="{ 'action-square--with-add': showAdd }"
    hover-class="none"
    @click="emit('click')"
  >
    <image class="action-square-icon" :src="icon" mode="aspectFit" />
    <text class="action-square-text">{{ label }}</text>
    <view
      v-if="showAdd"
      class="action-square-add"
      hover-class="none"
      @click.stop="emit('add')"
    >
      <image
        src="/static/icons/plus.svg"
        mode="aspectFit"
        class="action-square-add-icon"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string;
    label: string;
    showAdd?: boolean;
  }>(),
  { showAdd: false },
);

const emit = defineEmits<{
  click: [];
  add: [];
}>();
</script>

<style>
.action-square {
  flex: 1;
  aspect-ratio: 1 / 1;
  min-height: 280rpx;
  border-radius: 40rpx;
  background-color: #ffffff;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  box-sizing: border-box;
  padding: 24rpx;
}

.action-square-icon {
  width: 56rpx;
  height: 56rpx;
  flex-shrink: 0;
}

.action-square-text {
  font-size: 28rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
  text-align: center;
}

.action-square--with-add {
  position: relative;
  overflow: hidden;
}

.action-square-add {
  position: absolute;
  top: 0;
  right: 0;
  width: 68rpx;
  height: 68rpx;
  background-color: #111827;
  border-radius: 0 40rpx 0 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.action-square-add-icon {
  width: 30rpx;
  height: 30rpx;
  filter: brightness(0) invert(1);
}
</style>
