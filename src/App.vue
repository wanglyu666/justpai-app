<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import { injectFrostedGlassCssVars } from '@/utils/frostedGlass';
import { preloadTabPages } from '@/utils/pageFadeTransition';

onLaunch(() => {
  injectFrostedGlassCssVars();
  // 初始化 H5 切换遮罩（单页壳下不再依赖 preloadPage / 系统 tabBar）
  setTimeout(() => {
    preloadTabPages();
  }, 0);
});
</script>
<style>
@import '@/styles/frostedGlass.css';
@import '@/styles/sheetPageLayout.css';

/* Global styles */
page,
html,
body,
#app,
uni-page-body,
.uni-page-body,
uni-page,
.uni-page,
.uni-tabbar-bottom,
uni-tabbar {
  --safe-area-top: env(safe-area-inset-top, 0px);
  --page-top-offset: 12px;
  /* H5 预览时 safe-area 为 0，用 44px 模拟状态栏/灵动岛高度 */
  --page-safe-top: calc(max(var(--safe-area-top), 44px) + var(--page-top-offset));
  background-color: #f4f5f7 !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
}

.container {
  min-height: 100vh;
  padding-bottom: 120px; /* Leave space for bottom tab bar */
  box-sizing: border-box;
  background-color: #f4f5f7;
}

.page-safe-top {
  padding-top: var(--page-safe-top) !important;
}
</style>
