# 全平台视觉与交互一致（强制）

JustPai 是 **H5 / Android / iOS** 同一套代码的 App。验收标准不是「浏览器里好看」，而是：

> **安卓真机、iOS 真机上的显示、间距、异形、动效、触控，必须与浏览器（H5）预览一致。**

浏览器能显示、真机没有，一律视为缺陷，不能靠「App WebView 限制」带过。

## 验收时必须对的端

- H5（Chrome / 手机浏览器预览）
- Android 真机（系统 WebView，不是只看模拟器）
- iOS 真机

同一页面、同一操作，三端观感应对齐。

## 禁止（浏览器有、App 常失效）

这些写法在 H5 正常，在 Android / iOS WebView 上经常整块消失、点不了、关不掉：

| 禁止 | 原因 | 应用做法 |
|------|------|----------|
| 模板里写 `<svg>` / `<path>` | uni-app App 不会当 HTML 渲染，异形卡片会整块空白 | 做成 `static` 里的 svg/png，用 `<image>` |
| 父级 `filter: drop-shadow()` | 部分安卓机会把整层（含文字）滤没 | 用 `box-shadow`，或把阴影画进图片 |
| `clip-path: path()` 作为唯一造型 | 旧 WebView 不支持 | 图片造型 + 普通圆角白底兜底 |
| `Teleport to="body"` | App 端不稳定 | 页面内 `position: fixed` |
| `pointer-events: none` 父级再给子级 `auto` | 真机触摸经常点不到 | 不要这样挡点击 |
| 成功页用 Vue `<Transition>` out-in | App 上 leave 结束不了，表单不切到成功页 | 用 `SuccessPageTransition`：当前页渐隐后再渐显成功页 |
| 磨砂层盖在按钮上（`pointer-events: none` + `backdrop-filter`） | 安卓仍会把点击吃掉 | 磨砂样式打在面板自己身上 |
| 横向 `scroll-view` 不写死高度 | App 上是原生组件，会撑满父级并挡住下面的按钮；`overflow: hidden` 也裁不掉 | 用 **行内 style** 写死宽高；收起时用 `v-if` 卸载，不要只靠 CSS 折叠 |
| 仅用 `px` 做间距 | 不同宽度安卓机卡片缝隙会乱 | 布局用 `rpx`（375 设计稿 `1px = 2rpx`） |

## 异形卡片（如工作台「合同档案」）

1. 形状用静态 **PNG**：`/static/images/work-card/contract-banner.png`（安卓对 SVG 不稳定）
2. 用 `<image mode="scaleToFill">` 铺满，不要内联 SVG，不要用两块矩形硬拼缺口
3. 造型必须是左侧文件夹签 + 右侧平滑落肩（原设计路径），不能是直角台阶
4. 改完必须在 **安卓真机** 打开工作台，确认文件夹轮廓、数字「36」都在

管理页钱包顶边异形同样用 PNG：`wallet-front.png`。

## 开发自检

每做一块 UI，至少过一遍：

- [ ] H5 与安卓真机对照，形状/间距/字号一致
- [ ] iOS 真机对照（有条件时）
- [ ] 底部 Tab、侧滑返回、按钮在真机可点
- [ ] 没有内联 SVG、没有容器级 `filter`

真机与浏览器不一致时，优先改成真机也能画出来的实现，而不是只优化 H5。
