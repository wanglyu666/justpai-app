<template>
  <view class="feedback-action">
    <view class="add-btn" @click.stop="openFeedback">
      <text class="add-btn-text">{{ t('reportFeedback.title') }}</text>
    </view>

    <SlideOverPanel
      :show="panelVisible"
      :z-index="2500"
      content-safe-top
      @closed="resetFlow"
    >
      <SuccessPageTransition :show-success="step === 'success'">
        <ReportFeedbackFormContent
          :mode="formMode"
          :content="draft"
          @update:content="draft = $event"
          @back="closePanel"
          @submit="handleSubmit"
        />
        <template #success>
          <FeedbackSuccessContent
            :desc="t('reportFeedback.submitted')"
            :back-text="t('reportFeedback.back')"
            @back="closePanel"
          />
        </template>
      </SuccessPageTransition>
    </SlideOverPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import FeedbackSuccessContent from '@/components/FeedbackSuccessContent.vue';
import ReportFeedbackFormContent from '@/components/ReportFeedbackFormContent.vue';
import { useReportFeedback } from '@/composables/useReportFeedback';
import { useSlideOver } from '@/composables/useSlideOver';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useLanguage();

const props = defineProps<{
  reportId: string;
}>();

const { getNote, hasNote, saveNote } = useReportFeedback();
const {
  visible: panelVisible,
  open: openPanel,
  close: closePanel,
} = useSlideOver();

const step = ref<'form' | 'success'>('form');
const draft = ref('');
const viewingSubmitted = ref(false);

const formMode = computed(() => (viewingSubmitted.value ? 'view' : 'create'));

const openFeedback = () => {
  const submitted = hasNote(props.reportId);
  viewingSubmitted.value = submitted;
  draft.value = getNote(props.reportId);
  step.value = 'form';
  openPanel();
};

const handleSubmit = (content: string) => {
  saveNote(props.reportId, content);
  viewingSubmitted.value = true;
  step.value = 'success';
};

const resetFlow = () => {
  step.value = 'form';
  viewingSubmitted.value = hasNote(props.reportId);
  draft.value = getNote(props.reportId);
};
</script>

<style scoped>
.feedback-action {
  flex-shrink: 0;
}

.add-btn {
  height: 88rpx;
  padding: 0 48rpx;
  border-radius: 28rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}
</style>
