import { ref } from 'vue';
import { SUCCESS_PAGE_FADE_DURATION_MS } from '@/utils/successPageTransition';

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const HOLD_MS = 1000;

export function useAuthSuccessSequence() {
  const faded = ref(false);
  const helloVisible = ref(false);
  const welcomeVisible = ref(false);

  const play = async () => {
    faded.value = true;
    await wait(SUCCESS_PAGE_FADE_DURATION_MS);
    helloVisible.value = true;
    await wait(SUCCESS_PAGE_FADE_DURATION_MS + HOLD_MS);
    helloVisible.value = false;
    await wait(SUCCESS_PAGE_FADE_DURATION_MS);
    welcomeVisible.value = true;
    await wait(SUCCESS_PAGE_FADE_DURATION_MS + HOLD_MS);
  };

  return {
    faded,
    helloVisible,
    welcomeVisible,
    play,
  };
}
