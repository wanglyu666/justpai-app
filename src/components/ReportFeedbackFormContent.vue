<template>
  <SheetPageLayout
    :title="t('reportFeedback.title')"
    :desc="mode === 'view' ? t('reportFeedback.viewDescription') : t('reportFeedback.createDescription')"
    @back="emit('back')"
  >
    <view class="section-card">
      <text class="section-title">{{ t('reportFeedback.content') }}</text>
      <textarea
        v-if="mode === 'view'"
        class="field-textarea"
        :value="draft"
        disabled
        auto-height
      />
      <textarea
        v-else
        v-model="draft"
        class="field-textarea"
        :placeholder="t('reportFeedback.placeholder')"
        placeholder-class="input-placeholder"
        maxlength="500"
      />
    </view>

    <template v-if="mode === 'create'" #footer>
      <view
        class="submit-btn"
        :class="canSubmit ? 'active' : ''"
        @click="handleSubmit"
      >
        <text class="submit-text">{{ t('common.done') }}</text>
      </view>
    </template>
  </SheetPageLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import SheetPageLayout from '@/components/SheetPageLayout.vue';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useLanguage();

const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'view';
    content?: string;
  }>(),
  {
    mode: 'create',
    content: '',
  },
);

const emit = defineEmits<{
  back: [];
  'update:content': [value: string];
  submit: [content: string];
}>();

const draft = ref(props.content);

watch(
  () => props.content,
  (value) => {
    draft.value = value;
  },
);

watch(draft, (value) => {
  emit('update:content', value);
});

const canSubmit = computed(() => draft.value.trim().length > 0);

const handleSubmit = () => {
  if (!canSubmit.value) return;
  emit('submit', draft.value.trim());
};
</script>

<style scoped>
.section-card {
  background-color: #ffffff;
  border-radius: 44rpx;
  padding: 40rpx 36rpx;
  margin-bottom: 28rpx;
  box-shadow: 0 8rpx 40rpx rgba(15, 23, 42, 0.04);
}

.section-title {
  display: block;
  font-size: 34rpx;
  font-weight: 800;
  color: #111827;
  margin-bottom: 32rpx;
}

.field-textarea {
  width: 100%;
  min-height: 280rpx;
  padding: 24rpx 28rpx;
  background-color: #f8faf9;
  border: 2rpx solid #eef0ea;
  border-radius: 28rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #111827;
  line-height: 1.55;
  box-sizing: border-box;
}

.input-placeholder {
  color: #d1d5db;
  font-size: 28rpx;
}

.submit-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn.active {
  background-color: #9fe870;
}

.submit-text {
  font-size: 32rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  line-height: 1;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
