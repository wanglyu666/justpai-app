<template>
  <view class="container">
    <!-- Profile Card -->
    <view class="profile-section">
      <view class="profile-card">
        <!-- Banner Image -->
        <image src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop" mode="aspectFill" class="banner-img"></image>
        
        <view class="profile-info-container">
          <!-- Avatar -->
          <view class="avatar-wrap">
            <image src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=f8aba6" mode="aspectFill" class="avatar-img"></image>
          </view>
          
          <view class="profile-header">
            <view class="profile-text">
              <text class="user-name">管理员</text>
              <text class="user-role">系统管理员</text>
              
              <view class="info-list">
                <view class="info-item">
                  <text class="info-label">联系方式:</text>
                  <text class="info-value">138-0013-8000</text>
                </view>
                <view class="info-item">
                  <text class="info-label">邮箱:</text>
                  <text class="info-value">admin@justpai.com</text>
                </view>
                <view class="info-item">
                  <text class="info-label">部门:</text>
                  <text class="info-value">系统管理部</text>
                </view>
              </view>
            </view>
            <view class="edit-btn">编辑资料</view>
          </view>
        </view>
      </view>
    </view>

    <!-- Menu List -->
    <view class="menu-section">
      <view class="menu-item" v-for="item in profileMenu" :key="item.id">
        <view class="menu-left">
          <view class="menu-icon">
            <image :src="item.icon" mode="aspectFit" style="width: 20px; height: 20px;"></image>
          </view>
          <view class="menu-text">
            <text class="menu-title">{{ item.title }}</text>
            <text class="menu-subtitle">{{ item.subtitle }}</text>
          </view>
        </view>
        <text class="arrow">></text>
      </view>
    </view>
    <CustomTabBar currentPath="pages/profile/index" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import CustomTabBar from '@/components/CustomTabBar.vue';

onShow(() => {
  uni.hideTabBar({ animation: false });
});

const profileMenu = ref([
  { id: 'security', title: '账号与安全', subtitle: '密码、登录方式与安全设置', icon: '/static/icons/shield.svg' },
  { id: 'info', title: '基本信息', subtitle: '查看注册信息、开票信息、地址信息', icon: '/static/icons/file-text-gray.svg' },
  { id: 'upgrade', title: '升级企业账号', subtitle: '解锁团队协作与企业功能', icon: '/static/icons/building-2.svg' },
  { id: 'rules', title: '平台规则', subtitle: '服务条款与平台使用规范', icon: '/static/icons/book-open.svg' },
]);
</script>

<style scoped>
.container {
  padding-top: 40px;
}
.profile-section {
  padding: 0 24px;
  margin-bottom: 24px;
}
.profile-card {
  background-color: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  border: 1px solid #f0f0f0;
}
.banner-img {
  width: 100%;
  height: 128px;
}
.profile-info-container {
  padding: 0 24px 24px;
  position: relative;
}
.avatar-wrap {
  width: 72px;
  height: 72px;
  border-radius: 36px;
  border: 3px solid #ffffff;
  background-color: #f8aba6;
  margin-top: -36px;
  margin-bottom: 12px;
  overflow: hidden;
  position: relative;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.avatar-img {
  width: 100%;
  height: 100%;
}
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.profile-text {
  flex: 1;
}
.user-name {
  display: block;
  font-size: 18px;
  font-weight: 900;
  color: #111827;
}
.user-role {
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
}
.info-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.info-item {
  display: flex;
  font-size: 12px;
}
.info-label {
  color: #9ca3af;
  margin-right: 8px;
  width: 60px;
}
.info-value {
  color: #4b5563;
  font-weight: 500;
}
.edit-btn {
  background-color: #A8D5BA;
  color: #ffffff;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  margin-top: 4px;
}

.menu-section {
  padding: 0 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.menu-item {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #f9fafb;
  box-shadow: 0 2px 4px rgba(0,0,0,0.01);
}
.menu-left {
  display: flex;
  align-items: center;
}
.menu-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: #F7F8FA;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}
.menu-text {
  display: flex;
  flex-direction: column;
}
.menu-title {
  font-size: 14px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 2px;
}
.menu-subtitle {
  font-size: 11px;
  color: #6b7280;
}
.arrow {
  color: #d1d5db;
  font-weight: bold;
  font-family: monospace;
}
</style>
