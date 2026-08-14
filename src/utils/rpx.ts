/** 设计稿按 375 宽：1px = 2rpx。把 rpx 转成当前设备 CSS 像素。 */
export const rpx2px = (rpx: number) => {
  try {
    return uni.upx2px(rpx);
  } catch {
    return rpx / 2;
  }
};
