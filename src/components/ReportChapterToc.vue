<template>
  <view
    class="report-toc"
    :class="{
      'is-visible': visible,
      'is-frosted': frosted,
      'frosted-glass frosted-glass--tabbar': frosted,
    }"
    :style="frosted ? glassStyle : undefined"
  >
    <view
      v-for="chapter in chapters"
      :key="chapter.id"
      class="report-toc-item"
      :class="{ 'is-active': activeId === chapter.id }"
      @click.stop="emit('select', chapter.id)"
    >
      <text class="report-toc-text">{{ chapter.label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { ReportChapterTab } from '@/composables/useReportChapterNav';

defineProps<{
  chapters: ReportChapterTab[];
  activeId: string;
  visible: boolean;
  frosted: boolean;
  glassStyle?: Record<string, string>;
}>();

const emit = defineEmits<{
  select: [id: string];
}>();
</script>
