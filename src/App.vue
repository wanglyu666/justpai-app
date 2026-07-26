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
page,
html,
body,
#app,
uni-page-body,
.uni-page-body {
  --safe-area-top: env(safe-area-inset-top, 0px);
  --page-top-offset: 12px;
  /* H5 预览时 safe-area 为 0，用 44px 模拟状态栏/灵动岛高度 */
  --page-safe-top: calc(max(var(--safe-area-top), 44px) + var(--page-top-offset));
  background-color: #F4F5F7;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
}

.container {
  min-height: 100vh;
  padding-bottom: 120px; /* Leave space for bottom tab bar */
  box-sizing: border-box;
}

.page-safe-top {
  padding-top: var(--page-safe-top) !important;
}
</style>