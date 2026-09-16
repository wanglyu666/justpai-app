<template>
  <view class="auth-success-layer">
    <view class="auth-success-body" :class="{ 'is-faded': faded }">
      <slot />
    </view>
    <view class="auth-success-hello" :class="{ 'is-visible': helloVisible }">
      <text class="auth-success-word">欢迎！</text>
    </view>
    <view class="auth-success-hello" :class="{ 'is-visible': welcomeVisible }">
      <text class="auth-success-word is-en">Welcome!</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  faded: boolean;
  helloVisible: boolean;
  welcomeVisible: boolean;
}>();
</script>

<style scoped>
.auth-success-layer {
  position: relative;
  /* 父级 slide-over-scroll 有 page-safe-top padding，100% 会少一截顶距，底边露出灰条 */
  min-height: calc(100% + var(--page-safe-top));
  height: calc(100% + var(--page-safe-top));
  background-color: #ffffff;
  box-sizing: border-box;
}

.auth-success-body {
  min-height: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity 300ms ease;
}

.auth-success-body.is-faded {
  opacity: 0;
  pointer-events: none;
}

.auth-success-hello {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms ease;
}

.auth-success-hello.is-visible {
  opacity: 1;
}

.auth-success-word {
  font-size: 72rpx;
  font-weight: 800;
  color: #111827;
  letter-spacing: 8rpx;
}

.auth-success-word.is-en {
  letter-spacing: 2rpx;
}
</style>
