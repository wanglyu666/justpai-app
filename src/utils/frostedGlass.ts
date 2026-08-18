/** 半透明磨砂玻璃效果配置，供弹窗、底部导航等组件统一复用 */

export type FrostedGlassPreset = 'default' | 'tabbar' | 'modalPanel';

export interface FrostedGlassOptions {
  /** 背景色，建议带 alpha */
  background: string;
  /** 边框色，建议带 alpha */
  borderColor: string;
  /**
   * 模糊半径，必须用 CSS px，不要用 rpx。
   * rpx 会随屏宽放大，1080 宽安卓上 64rpx 会变成 ~90px 模糊，弹窗一出来就卡。
   */
  blurPx: number;
  /** 饱和度（%） */
  saturatePercent: number;
  /** 可选阴影（含 inset 高光） */
  shadow?: string;
  /** 顶部高光渐变，模拟 iOS 玻璃反光；不要另铺一层挡点击 */
  sheen?: string;
}

/** 遮罩层配置（弹窗背景 dim） */
export interface FrostedOverlayOptions {
  background: string;
}

/**
 * 预设：修改此处参数即可全局生效。
 * 弹窗走接近 iOS Liquid Glass 的分层：较透填充 + 中等模糊 + 饱和 + 内高光。
 * 系统原生 glassEffect / 折射高光 WebView 做不到，这是 CSS 能稳定做到的上限。
 */
export const FROSTED_GLASS_PRESETS: Record<FrostedGlassPreset, FrostedGlassOptions> = {
  default: {
    background: 'rgba(255, 255, 255, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.52)',
    blurPx: 20,
    saturatePercent: 180,
    shadow: '0 16rpx 48rpx rgba(15, 23, 42, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.62)',
  },
  tabbar: {
    background: 'rgba(255, 255, 255, 0.32)',
    borderColor: 'rgba(255, 255, 255, 0.48)',
    blurPx: 20,
    saturatePercent: 180,
    shadow: '0 16rpx 64rpx rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.55)',
  },
  modalPanel: {
    background: 'rgba(255, 255, 255, 0.16)',
    borderColor: 'rgba(255, 255, 255, 0.62)',
    blurPx: 22,
    saturatePercent: 190,
    shadow:
      '0 28rpx 80rpx rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.78), inset 0 -1px 0 rgba(255, 255, 255, 0.16)',
    sheen:
      'linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.08) 34%, rgba(255, 255, 255, 0) 72%)',
  },
};

export const FROSTED_OVERLAY_PRESET: FrostedOverlayOptions = {
  background: 'rgba(15, 23, 42, 0.18)',
};

/** 全局 CSS 变量名前缀 */
export const FROSTED_GLASS_CSS_VAR_PREFIX = '--frosted-glass';

/** 磨砂玻璃 utility class */
export const FROSTED_GLASS_CLASS = 'frosted-glass';

export const FROSTED_GLASS_PRESET_CLASS: Record<FrostedGlassPreset, string> = {
  default: 'frosted-glass',
  tabbar: 'frosted-glass frosted-glass--tabbar',
  modalPanel: 'frosted-glass frosted-glass--modal-panel',
};

const buildBackdropFilter = (blurPx: number, saturatePercent: number) =>
  `blur(${blurPx}px) saturate(${saturatePercent}%)`;

/** 生成 inline style，适用于 :style 绑定 */
export function getFrostedGlassStyle(preset: FrostedGlassPreset = 'default'): Record<string, string> {
  const config = FROSTED_GLASS_PRESETS[preset];
  const backdrop = buildBackdropFilter(config.blurPx, config.saturatePercent);

  return {
    backgroundColor: config.background,
    borderColor: config.borderColor,
    backdropFilter: backdrop,
    WebkitBackdropFilter: backdrop,
    ...(config.shadow ? { boxShadow: config.shadow } : {}),
    ...(config.sheen ? { backgroundImage: config.sheen } : {}),
  };
}

/** 生成遮罩层 inline style */
export function getFrostedOverlayStyle(): Record<string, string> {
  return {
    backgroundColor: FROSTED_OVERLAY_PRESET.background,
  };
}

/** 生成注入到 :root 的 CSS 变量，供全局样式类引用 */
export function getFrostedGlassCssVars(): Record<string, string> {
  const vars: Record<string, string> = {
    [`${FROSTED_GLASS_CSS_VAR_PREFIX}-overlay-bg`]: FROSTED_OVERLAY_PRESET.background,
  };

  (Object.keys(FROSTED_GLASS_PRESETS) as FrostedGlassPreset[]).forEach((preset) => {
    const config = FROSTED_GLASS_PRESETS[preset];
    const prefix = `${FROSTED_GLASS_CSS_VAR_PREFIX}-${preset}`;
    vars[`${prefix}-bg`] = config.background;
    vars[`${prefix}-border`] = config.borderColor;
    vars[`${prefix}-backdrop`] = buildBackdropFilter(config.blurPx, config.saturatePercent);
    if (config.shadow) {
      vars[`${prefix}-shadow`] = config.shadow;
    }
    if (config.sheen) {
      vars[`${prefix}-sheen`] = config.sheen;
    }
  });

  return vars;
}

/** H5 / App WebView 将 CSS 变量注入到 documentElement */
export function injectFrostedGlassCssVars() {
  // #ifdef H5 || APP-PLUS
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const vars = getFrostedGlassCssVars();

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  // #endif
}
