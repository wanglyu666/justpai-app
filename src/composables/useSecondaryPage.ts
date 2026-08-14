import { computed, onUnmounted, ref, watch, type Ref } from 'vue';

const secondaryPageCount = ref(0);

/** 是否有二级全屏页盖在一级 Tab 上（商品详情、个人中心等） */
export const hasSecondaryPage = computed(() => secondaryPageCount.value > 0);

/** 侧滑 / 底部全屏面板挂载期间登记，让一级菜单栏被盖住 */
export const registerSecondaryPage = (rendered: Ref<boolean>) => {
  let registered = false;

  const sync = (isOpen: boolean) => {
    if (isOpen && !registered) {
      secondaryPageCount.value += 1;
      registered = true;
      return;
    }
    if (!isOpen && registered) {
      secondaryPageCount.value = Math.max(0, secondaryPageCount.value - 1);
      registered = false;
    }
  };

  watch(rendered, (isOpen) => sync(isOpen), { immediate: true });

  onUnmounted(() => sync(false));
};
