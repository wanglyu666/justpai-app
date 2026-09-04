import { ref } from 'vue';
import { usePageBackWhen } from '@/composables/usePageBack';
import { attachmentPreviewSrc } from '@/utils/fileDisplay';

/** 附件卡片点击图片后的全屏预览，确认验收等页共用 */
export function useAttachmentPreview() {
  const visible = ref(false);
  const src = ref('');

  const close = () => {
    visible.value = false;
  };

  usePageBackWhen(visible, close);

  const open = (file: string) => {
    const next = attachmentPreviewSrc(file);
    if (!next) return false;
    src.value = next;
    visible.value = true;
    return true;
  };

  return {
    visible,
    src,
    open,
    close,
  };
}
