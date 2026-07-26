import { ref } from 'vue';

/** 控制 SlideOverPanel 显隐 */
export function useSlideOver(initial = false) {
  const visible = ref(initial);

  const open = () => {
    visible.value = true;
  };

  const close = () => {
    visible.value = false;
  };

  const toggle = () => {
    visible.value = !visible.value;
  };

  return {
    visible,
    open,
    close,
    toggle,
  };
}
