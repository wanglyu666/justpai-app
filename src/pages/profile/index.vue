<template>
  <view class="container page-safe-top">
    <ProfileContent @back="goBack" />
  </view>
</template>

<script setup lang="ts">
import ProfileContent from '@/components/ProfileContent.vue';

const goBack = () => {
  uni.navigateBack();
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding-bottom: 40px;
  box-sizing: border-box;
}
</style>
