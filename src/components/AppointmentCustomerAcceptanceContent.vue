<template>
  <SheetPageLayout :title="t('acceptance.imageTitle')" @back="handleBack">
    <FileAttachmentCard :files="files" :title="t('common.attachments')" :empty-text="t('acceptance.noAttachments')" />

    <template #footer>
      <view
        class="confirm-btn"
        :class="{ done: accepted }"
        @click="handleConfirm"
      >
        <text class="confirm-btn-text">{{ accepted ? t('acceptance.accepted') : t('acceptance.confirmAcceptance') }}</text>
      </view>
    </template>
  </SheetPageLayout>
</template>

<script setup lang="ts">
import SheetPageLayout from '@/components/SheetPageLayout.vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useLanguage();

const props = withDefaults(
  defineProps<{
    files?: string[];
    accepted?: boolean;
  }>(),
  {
    files: () => [],
    accepted: false,
  },
);

const emit = defineEmits<{
  back: [];
  confirm: [];
}>();

const handleBack = () => emit('back');

const handleConfirm = () => {
  if (props.accepted) return;
  emit('confirm');
};
</script>

<style scoped>
.confirm-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-btn.done {
  background-color: #e5e7eb;
  pointer-events: none;
}

.confirm-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1;
}

.confirm-btn.done .confirm-btn-text {
  color: #4b5563;
}
</style>
