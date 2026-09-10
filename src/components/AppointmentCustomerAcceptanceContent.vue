<template>
  <SheetPageLayout title="验收图片" @back="handleBack">
    <FileAttachmentCard :files="files" title="附件" empty-text="暂无验收附件" />

    <template #footer>
      <view
        class="confirm-btn"
        :class="{ done: accepted }"
        @click="handleConfirm"
      >
        <text class="confirm-btn-text">{{ accepted ? '已验收' : '确认验收' }}</text>
      </view>
    </template>
  </SheetPageLayout>
</template>

<script setup lang="ts">
import SheetPageLayout from '@/components/SheetPageLayout.vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';

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
