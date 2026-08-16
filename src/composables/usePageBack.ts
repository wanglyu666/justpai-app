import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';

type BackEntry = {
  handler: () => void;
};

const stack: BackEntry[] = [];
const stackSize = ref(0);

const sync = () => {
  stackSize.value = stack.length;
};

const push = (entry: BackEntry) => {
  stack.push(entry);
  sync();
};

const remove = (entry: BackEntry) => {
  const index = stack.lastIndexOf(entry);
  if (index >= 0) stack.splice(index, 1);
  sync();
};

/** 当前是否有可返回的页面（有返回按钮的二级/三级页） */
export const hasPageBack = computed(() => stackSize.value > 0);

/** 触发最上层返回，效果与点返回按钮相同 */
export const triggerPageBack = () => {
  stack[stack.length - 1]?.handler();
};

/** 系统 Back（安卓手势 / 返回键）有二级页时吃掉并关最上层。返回 true 表示已处理。 */
export const consumePageBack = () => {
  if (!hasPageBack.value) return false;
  triggerPageBack();
  return true;
};

/**
 * 当前页有返回按钮时登记。组件卸载后自动取消。
 * 多层叠开时，右滑只关掉最上面那一层。
 */
export const usePageBack = (handler: () => void) => {
  const entry: BackEntry = { handler };
  onMounted(() => push(entry));
  onUnmounted(() => remove(entry));
  return () => handler();
};

/** 同一组件里后打开的详情/子页，仅在显示时盖在返回栈顶 */
export const usePageBackWhen = (active: Ref<boolean>, handler: () => void) => {
  const entry: BackEntry = { handler };
  watch(
    active,
    (isActive) => {
      if (isActive) {
        if (!stack.includes(entry)) push(entry);
        return;
      }
      remove(entry);
    },
    { immediate: true },
  );
  onUnmounted(() => remove(entry));
};
