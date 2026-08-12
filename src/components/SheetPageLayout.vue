<template>
  <view
    class="sheet-page"
    :class="{ 'sheet-page--with-footer': showFooter }"
    @click="emit('click')"
  >
    <view v-if="showBack" class="sheet-page__header">
      <view class="sheet-page__back-btn" @click.stop="emit('back')">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="sheet-page__back-icon"
        />
      </view>
      <slot name="header-extra" />
    </view>

    <view class="sheet-page__body">
      <slot name="title">
        <text v-if="title" class="sheet-page__title">{{ title }}</text>
        <text v-if="desc" class="sheet-page__desc">{{ desc }}</text>
      </slot>
      <slot />
    </view>

    <view v-if="showFooter" class="sheet-page__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

withDefaults(
  defineProps<{
    title?: string;
    desc?: string;
    showBack?: boolean;
  }>(),
  {
    title: '',
    desc: '',
    showBack: true,
  },
);

const emit = defineEmits<{
  back: [];
  click: [];
}>();

const slots = useSlots();
const showFooter = computed(() => !!slots.footer);
</script>
