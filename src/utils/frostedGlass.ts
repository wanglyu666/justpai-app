/** 半透明磨砂玻璃效果配置，供弹窗、底部导航等组件统一复用 */

export type FrostedGlassPreset = 'default' | 'tabbar' | 'modalPanel';

export interface FrostedGlassOptions {
  /** 背景色，建议带 alpha */
  background: string;
  /** 边框色，建议带 alpha */
  borderColor: string;
  /** 模糊半径（px） */
  blurPx: number;
  /** 饱和度（%） */
  saturatePercent: number;
  /** 可选阴影 */
  shadow?: string;
}

/** 遮罩层配置（弹窗背景 dim） */
export interface FrostedOverlayOptions {
  background: string;
}

/** 预设：修改此处参数即可全局生效 */
export const FROSTED_GLASS_PRESETS: Record<FrostedGlassPreset, FrostedGlassOptions> = {
  default: {
    background: 'rgba(255, 255, 255, 0.28)',
    borderColor: 'rgba(255, 255, 255, 0.45)',
    blurPx: 32,
    saturatePercent: 170,
    shadow: '0 20px 48px rgba(15, 23, 42, 0.12)',
  },
  tabbar: {
    background: 'rgba(255, 255, 255, 0.38)',
    borderColor: 'rgba(255, 255, 255, 0.45)',
    blurPx: 24,
    saturatePercent: 180,
    shadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
  },
  modalPanel: {
    background: 'rgba(255, 255, 255, 0.28)',
    borderColor: 'rgba(255, 255, 255, 0.45)',
    blurPx: 32,
    saturatePercent: 170,
    shadow: '0 20px 48px rgba(15, 23, 42, 0.12)',
  },
};

export const FROSTED_OVERLAY_PRESET: FrostedOverlayOptions = {
  background: 'rgba(15, 23, 42, 0.16)',
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
  });

  return vars;
}

/** H5 环境下将 CSS 变量注入到 documentElement */
export function injectFrostedGlassCssVars() {
  // #ifdef H5
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const vars = getFrostedGlassCssVars();

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  // #endif
}
