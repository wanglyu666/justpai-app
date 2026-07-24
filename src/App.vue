<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
  uni.hideTabBar({ animation: false });
});
onShow(() => {
  console.log("App Show");
  uni.hideTabBar({ animation: false });
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
/* Global styles */
page {
  background-color: #F4F5F7;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
}
.container {
  min-height: 100vh;
  padding-bottom: 120px; /* Leave space for bottom tab bar */
}
</style>
