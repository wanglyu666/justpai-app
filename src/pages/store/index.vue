<template>
  <view class="redirect-page" />
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';

/** 兼容旧路径：商店已并入单页壳 */
onLoad(() => {
  uni.reLaunch({ url: '/pages/index/index?tab=store' });
});
</script>

<style scoped>
.redirect-page {
  min-height: 100vh;
  background-color: #f4f5f7;
}
</style>
