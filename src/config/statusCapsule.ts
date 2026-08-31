/** 状态胶囊滑块统一参数，供 StatusCapsuleSwitch 及样式复用 */
export const STATUS_CAPSULE = {
  height: 88,
  innerPadding: 8,
  itemGap: 8,
  itemHeight: 72,
  itemPaddingX: 28,
  /** 非等分横滑内边距：第 5 项约露出两个字，提示可侧滑 */
  scrollItemPaddingX: 24,
  /**
   * 非等分时，右侧裁在第 5 项（如「保修中」）上，露出约两个字，提示可侧滑。
   * 项少时作为最小溢出。
   */
  peekNext: 96,
  /** 第 5 项露出的宽度比例（含内边距；0.7 大约露出「保修」） */
  peekItemFraction: 0.7,
  fontSize: 28,
  fontWeight: 600,
  activeFontWeight: 700,
  radius: 999,
  background: '#ffffff',
  thumbColor: '#9fe870',
  textColor: '#9ca3af',
  activeTextColor: '#163300',
  shadow: '0 4rpx 16rpx rgba(15, 23, 42, 0.06)',
  transition: '280ms cubic-bezier(0.32, 0.72, 0, 1)',
} as const;

export type StatusCapsuleTab = {
  id: string;
  label: string;
};

export type StatusCapsuleConfig = typeof STATUS_CAPSULE;
