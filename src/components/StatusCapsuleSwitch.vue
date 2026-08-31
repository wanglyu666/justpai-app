<template>
  <view class="status-capsule" :style="capsuleStyle">
    <scroll-view
      scroll-x
      enable-flex
      class="status-scroll"
      :style="scrollViewStyle"
      :show-scrollbar="false"
      :scroll-left="scrollLeft"
      scroll-with-animation
    >
      <view
        class="status-scroll-inner"
        :class="{ 'is-equal': equal }"
        :style="innerStyle"
      >
        <view class="status-thumb" :style="thumbMergedStyle" />
        <view
          v-for="tab in tabs"
          :key="tab.id"
          class="status-item"
          :class="{ active: modelValue === tab.id, 'is-equal': equal }"
          :style="itemStyle"
          @click="selectTab(tab.id)"
        >
          <text class="status-text" :style="textStyle(modelValue === tab.id)">
            {{ tab.label }}
          </text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue';
import {
  STATUS_CAPSULE,
  type StatusCapsuleTab,
} from '@/config/statusCapsule';
import { rpx2px } from '@/utils/rpx';

const props = withDefaults(
  defineProps<{
    tabs: StatusCapsuleTab[];
    modelValue: string;
    /** 等分宽度（适合项数较少且无需横向滚动的场景） */
    equal?: boolean;
  }>(),
  {
    equal: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [id: string];
  change: [id: string];
}>();

const instance = getCurrentInstance();
const scrollLeft = ref(0);
const innerWidthPx = ref<number | null>(null);
const itemMinWidthPx = ref<number | null>(null);
const thumbStyle = ref({
  transform: 'translateX(0px)',
  width: '0px',
});

const capsuleStyle = {
  height: `${STATUS_CAPSULE.height}rpx`,
  borderRadius: `${STATUS_CAPSULE.radius}rpx`,
  backgroundColor: STATUS_CAPSULE.background,
  boxShadow: STATUS_CAPSULE.shadow,
};

const scrollViewStyle = {
  width: '100%',
  height: `${STATUS_CAPSULE.height}rpx`,
};

const itemPadX = computed(() =>
  props.equal ? STATUS_CAPSULE.itemPaddingX : STATUS_CAPSULE.scrollItemPaddingX,
);

const innerStyle = computed(() => ({
  gap: `${STATUS_CAPSULE.itemGap}rpx`,
  height: `${STATUS_CAPSULE.height}rpx`,
  padding: `${STATUS_CAPSULE.innerPadding}rpx`,
  ...(innerWidthPx.value ? { width: `${innerWidthPx.value}px` } : {}),
}));

const itemStyle = computed(() => ({
  height: `${STATUS_CAPSULE.itemHeight}rpx`,
  padding: `0 ${itemPadX.value}rpx`,
  ...(itemMinWidthPx.value ? { minWidth: `${itemMinWidthPx.value}px` } : {}),
}));

const thumbMergedStyle = computed(() => ({
  transform: thumbStyle.value.transform,
  width: thumbStyle.value.width,
  top: `${STATUS_CAPSULE.innerPadding}rpx`,
  height: `calc(100% - ${STATUS_CAPSULE.innerPadding * 2}rpx)`,
  borderRadius: `${STATUS_CAPSULE.radius}rpx`,
  backgroundColor: STATUS_CAPSULE.thumbColor,
  transition: `transform ${STATUS_CAPSULE.transition}, width ${STATUS_CAPSULE.transition}`,
}));

const textStyle = (active: boolean) => ({
  fontSize: `${STATUS_CAPSULE.fontSize}rpx`,
  fontWeight: active ? STATUS_CAPSULE.activeFontWeight : STATUS_CAPSULE.fontWeight,
  color: active ? STATUS_CAPSULE.activeTextColor : STATUS_CAPSULE.textColor,
  transition: `color ${STATUS_CAPSULE.transition}`,
});

type ItemRect = { width: number };

const measureScrollLayout = () =>
  new Promise<{
    viewportWidth: number;
    innerWidth: number;
    items: ItemRect[];
  } | null>((resolve) => {
    if (!instance) {
      resolve(null);
      return;
    }

    uni.createSelectorQuery()
      .in(instance)
      .select('.status-scroll')
      .boundingClientRect()
      .select('.status-scroll-inner')
      .boundingClientRect()
      .selectAll('.status-item')
      .boundingClientRect()
      .exec((res) => {
        const viewport = res?.[0] as { width?: number } | null;
        const inner = res?.[1] as { width?: number } | null;
        const items = res?.[2] as ItemRect[] | null;

        if (!viewport?.width || !inner?.width || !items?.length) {
          resolve(null);
          return;
        }

        resolve({
          viewportWidth: viewport.width,
          innerWidth: inner.width,
          items,
        });
      });
  });

const getTabContentLeft = (items: ItemRect[], index: number) => {
  let left = rpx2px(STATUS_CAPSULE.innerPadding);
  for (let i = 0; i < index; i += 1) {
    left += items[i].width + rpx2px(STATUS_CAPSULE.itemGap);
  }
  return left;
};

const contentWidthFromItems = (items: ItemRect[]) => {
  const pad = rpx2px(STATUS_CAPSULE.innerPadding) * 2;
  const gaps = rpx2px(STATUS_CAPSULE.itemGap) * Math.max(0, items.length - 1);
  const itemsWidth = items.reduce((sum, item) => sum + item.width, 0);
  return pad + gaps + itemsWidth;
};

/** 右侧露出半截下一项，间距更松，并提示可侧滑 */
const ensurePeek = async () => {
  if (props.equal || props.tabs.length < 2) {
    innerWidthPx.value = null;
    itemMinWidthPx.value = null;
    return;
  }

  itemMinWidthPx.value = null;
  innerWidthPx.value = null;
  await nextTick();

  const layout = await measureScrollLayout();
  if (!layout) return;

  const pad = rpx2px(STATUS_CAPSULE.innerPadding);
  const gap = rpx2px(STATUS_CAPSULE.itemGap);
  const peekPx = rpx2px(STATUS_CAPSULE.peekNext);
  const naturalWidth = contentWidthFromItems(layout.items);
  const needWidth = layout.viewportWidth + peekPx;

  // 6 项时：前 4 项完整，「保修中」约露出两个字；宽屏不强制拉大
  const peekIndex = Math.min(4, props.tabs.length - 2);
  const peekFraction = STATUS_CAPSULE.peekItemFraction;
  if (peekIndex >= 1 && props.tabs.length >= 5) {
    const targetWidth =
      (layout.viewportWidth - pad - peekIndex * gap) /
      (peekIndex + peekFraction);
    const maxNatural = Math.max(...layout.items.map((item) => item.width));
    if (targetWidth > maxNatural && targetWidth <= maxNatural * 1.4) {
      itemMinWidthPx.value = Math.ceil(targetWidth);
      await nextTick();
    }
  } else if (naturalWidth < needWidth) {
    const padBoth = pad * 2;
    const gaps = gap * Math.max(0, layout.items.length - 1);
    itemMinWidthPx.value = Math.ceil(
      (needWidth - padBoth - gaps) / layout.items.length,
    );
    await nextTick();
  }

  const nextLayout = await measureScrollLayout();
  if (!nextLayout) return;
  innerWidthPx.value = Math.ceil(contentWidthFromItems(nextLayout.items));
};

const updateThumb = async () => {
  const layout = await measureScrollLayout();
  if (!layout) return;

  const index = props.tabs.findIndex((tab) => tab.id === props.modelValue);
  if (index < 0 || !layout.items[index]) return;

  const left = getTabContentLeft(layout.items, index);
  thumbStyle.value = {
    transform: `translateX(${left}px)`,
    width: `${layout.items[index].width}px`,
  };
};

const scrollToTab = async (index: number) => {
  const layout = await measureScrollLayout();
  if (!layout) return;

  const maxScroll = Math.max(0, layout.innerWidth - layout.viewportWidth);

  if (index <= 0) {
    scrollLeft.value = 0;
    return;
  }

  if (index >= props.tabs.length - 1) {
    scrollLeft.value = maxScroll;
    return;
  }

  const tabLeft = getTabContentLeft(layout.items, index);
  const tabWidth = layout.items[index].width;
  const target = tabLeft + tabWidth / 2 - layout.viewportWidth / 2;
  scrollLeft.value = Math.max(0, Math.min(target, maxScroll));
};

const selectTab = async (id: string) => {
  if (id === props.modelValue) return;
  emit('update:modelValue', id);
  emit('change', id);
  const index = props.tabs.findIndex((tab) => tab.id === id);
  await nextTick();
  await scrollToTab(index);
  await updateThumb();
};

watch(
  () => props.modelValue,
  async () => {
    await nextTick();
    await updateThumb();
  },
);

watch(
  () => props.tabs.map((t) => t.id).join(','),
  async () => {
    await nextTick();
    await ensurePeek();
    await updateThumb();
  },
);

watch(
  () => props.equal,
  async () => {
    await nextTick();
    await ensurePeek();
    await updateThumb();
  },
);

onMounted(async () => {
  await nextTick();
  await ensurePeek();
  await updateThumb();
});
</script>

<style scoped>
.status-capsule {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.status-scroll {
  width: 100%;
  height: 100%;
  white-space: nowrap;
}

.status-scroll-inner {
  position: relative;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  min-width: max-content;
}

.status-scroll-inner.is-equal {
  display: flex;
  width: 100%;
  min-width: 100%;
}

.status-thumb {
  position: absolute;
  left: 0;
  z-index: 0;
}

.status-item {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-item.is-equal {
  flex: 1;
}

.status-text {
  line-height: 1;
  white-space: nowrap;
}
</style>
