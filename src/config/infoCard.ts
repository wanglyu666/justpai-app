/**
 * 信息卡片字号规范（375 设计稿，2rpx = 1px）。
 * 新做的列表卡 / 详情信息卡用这里的 token，不要在组件里再写死字号。
 * 已有页面未接入前不要改，后续新卡按本文件控制。
 */
export const INFO_CARD = {
  title: {
    fontSize: 36,
    fontWeight: 800,
    color: '#111827',
    lineHeight: 1.35,
  },
  label: {
    fontSize: 26,
    fontWeight: 400,
    color: '#9ca3af',
    lineHeight: 1.2,
  },
  value: {
    fontSize: 32,
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1.4,
  },
  /** 标签与数值的垂直间距 */
  fieldGap: 16,
} as const;

type InfoCardTextToken = {
  fontSize: number;
  fontWeight: number;
  color: string;
  lineHeight: number;
};

const toTextStyle = (token: InfoCardTextToken) => ({
  fontSize: `${token.fontSize}rpx`,
  fontWeight: token.fontWeight,
  color: token.color,
  lineHeight: String(token.lineHeight),
});

export const infoCardTitleStyle = toTextStyle(INFO_CARD.title);
export const infoCardLabelStyle = toTextStyle(INFO_CARD.label);
export const infoCardValueStyle = toTextStyle(INFO_CARD.value);
export const infoCardFieldStyle = {
  gap: `${INFO_CARD.fieldGap}rpx`,
};

export type InfoCardConfig = typeof INFO_CARD;
