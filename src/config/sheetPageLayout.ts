/**
 * BottomSheet / 详情页布局约定：
 * - 顶部返回与标题随页面滚动（不固定）
 * - 底部操作栏固定，上方用渐隐过渡，避免硬裁切
 *
 * 优先使用 <SheetPageLayout>；也可直接用 sheet-page* 全局类。
 */

export const SHEET_PAGE_BG = '#f4f5f7';

/** 有底部栏时，内容区预留高度，避免被按钮遮挡 */
export const SHEET_PAGE_FOOTER_CLEARANCE = 240;

/** 底部渐隐：透明 → 半透明 → 实色背景 */
export const SHEET_PAGE_FOOTER_FADE =
  'linear-gradient(180deg, rgba(244, 245, 247, 0) 0%, rgba(244, 245, 247, 0.72) 36%, #f4f5f7 68%)';

export const SHEET_PAGE_FOOTER_PADDING_TOP = 56;
