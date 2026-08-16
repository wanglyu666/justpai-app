/** 左缘右滑返回。阈值用 px，对应 touch 的 clientX（真机 WebView 可用）。 */

/** 只从屏幕最左侧这条带起手，避免和页面横向滑动冲突 */
export const EDGE_SWIPE_EDGE_PX = 32;

/** 向右滑过该距离才算返回 */
export const EDGE_SWIPE_DISTANCE_PX = 56;

/** 水平位移需明显大于垂直，避免当成列表滚动 */
export const EDGE_SWIPE_HORIZONTAL_RATIO = 1.25;
