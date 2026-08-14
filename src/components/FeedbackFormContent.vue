<template>
  <SheetPageLayout
    title="新增反馈"
    desc="选择项目并填写反馈内容后提交"
    @back="handleBack"
    @click="closeProjectDropdown"
  >
    <view class="section-card">
      <text class="section-title">项目选择</text>
      <view class="field-group" @click.stop>
        <text class="field-label">
          <text class="required">*</text>
          所属项目
        </text>
        <view class="dropdown-wrap">
          <view
            class="picker-field"
            :class="{ open: projectOpen }"
            @click="toggleProjectDropdown"
          >
            <text
              class="picker-text"
              :class="{ placeholder: !selectedProject }"
            >
              {{ selectedProject?.name || '请选择项目' }}
            </text>
            <text class="picker-arrow" :class="{ open: projectOpen }">▾</text>
          </view>

          <view v-if="projectOpen" class="dropdown-menu">
            <view
              v-for="project in projects"
              :key="project.id"
              class="dropdown-option"
              :class="{ active: selectedProjectId === project.id }"
              @click="selectProject(project.id)"
            >
              <text class="dropdown-option-text">{{ project.name }}</text>
              <image
                v-if="selectedProjectId === project.id"
                src="/static/icons/check.svg"
                mode="aspectFit"
                class="dropdown-check-icon"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="section-card">
      <text class="section-title">反馈信息</text>
      <view class="field-group">
        <view class="field-label-row">
          <text class="field-label">
            <text class="required">*</text>
            反馈内容
          </text>
          <text class="field-count">{{ content.length }}/500</text>
        </view>
        <textarea
          v-model="content"
          class="field-textarea"
          placeholder="请描述您的问题或建议，便于我们更快处理"
          placeholder-class="input-placeholder"
          :maxlength="500"
        />
      </view>
    </view>

    <view class="section-card">
      <text class="section-title">上传附件</text>
      <text class="section-hint">支持图片与视频，最多 6 个</text>

      <view class="media-grid">
        <view
          v-for="(file, index) in mediaFiles"
          :key="`${file.path}-${index}`"
          class="media-item"
        >
          <image
            v-if="file.type === 'image'"
            :src="file.path"
            mode="aspectFill"
            class="media-thumb"
          />
          <view v-else class="media-video">
            <text class="media-video-badge">VIDEO</text>
          </view>
          <view class="media-remove" @click.stop="removeMedia(index)">
            <text class="media-remove-text">×</text>
          </view>
        </view>
      </view>

      <view
        v-if="mediaFiles.length < MAX_MEDIA"
        class="media-add"
        :class="{ 'media-add-alone': mediaFiles.length === 0 }"
        @click="handleChooseMedia"
      >
        <image
          src="/static/icons/image-plus.svg"
          mode="aspectFit"
          class="media-add-icon"
        />
        <text class="media-add-text">添加</text>
      </view>
    </view>

    <template #footer>
      <view
        class="submit-btn"
        :class="{ active: isSubmitEnabled }"
        @click="handleSubmit"
      >
        <text class="submit-text">确定</text>
      </view>
    </template>
  </SheetPageLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SheetPageLayout from '@/components/SheetPageLayout.vue';

type ProjectOption = {
  id: string;
  name: string;
};

type MediaFile = {
  path: string;
  type: 'image' | 'video';
  name: string;
};

const MAX_MEDIA = 6;

const projects: ProjectOption[] = [
  { id: 'p1', name: '精装房改造工期与进场条件' },
  { id: 'p2', name: '办公楼暖通方案咨询' },
  { id: 'p3', name: '机房精密空调改造咨询' },
  { id: 'p4', name: '年框续约服务咨询' },
  { id: 'p5', name: '冷站节能优化咨询' },
  { id: 'p6', name: '新项目立项设备咨询' },
];

const emit = defineEmits<{
  back: [];
  submit: [
    payload: {
      projectId: string;
      projectName: string;
      content: string;
      attachments: string[];
    },
  ];
}>();

const selectedProjectId = ref('');
const projectOpen = ref(false);
const content = ref('');
const mediaFiles = ref<MediaFile[]>([]);

const selectedProject = computed(
  () => projects.find((item) => item.id === selectedProjectId.value) ?? null,
);

const isSubmitEnabled = computed(
  () => !!selectedProject.value && content.value.trim().length > 0,
);

const closeProjectDropdown = () => {
  projectOpen.value = false;
};

const toggleProjectDropdown = () => {
  projectOpen.value = !projectOpen.value;
};

const selectProject = (id: string) => {
  selectedProjectId.value = id;
  projectOpen.value = false;
};

const handleChooseMedia = () => {
  const remain = MAX_MEDIA - mediaFiles.value.length;
  if (remain <= 0) return;

  const chooseMediaApi = (uni as any).chooseMedia as typeof uni.chooseMedia | undefined;

  if (typeof chooseMediaApi === 'function') {
    chooseMediaApi({
      count: remain,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const next = res.tempFiles.map((file) => {
          const isVideo = file.fileType === 'video';
          const path = file.tempFilePath;
          const name = path.split('/').pop() || (isVideo ? 'video.mp4' : 'image.jpg');
          return {
            path,
            type: (isVideo ? 'video' : 'image') as MediaFile['type'],
            name,
          };
        });
        mediaFiles.value = [...mediaFiles.value, ...next].slice(0, MAX_MEDIA);
      },
      fail: () => {
        chooseImagesFallback(remain);
      },
    });
    return;
  }

  chooseImagesFallback(remain);
};

const chooseImagesFallback = (remain: number) => {
  uni.chooseImage({
    count: remain,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const next = res.tempFilePaths.map((path) => ({
        path,
        type: 'image' as const,
        name: path.split('/').pop() || 'image.jpg',
      }));
      mediaFiles.value = [...mediaFiles.value, ...next].slice(0, MAX_MEDIA);
    },
  });
};

const removeMedia = (index: number) => {
  mediaFiles.value = mediaFiles.value.filter((_, i) => i !== index);
};

const handleBack = () => {
  emit('back');
};

const handleSubmit = () => {
  if (!isSubmitEnabled.value || !selectedProject.value) return;
  emit('submit', {
    projectId: selectedProject.value.id,
    projectName: selectedProject.value.name,
    content: content.value.trim(),
    attachments: mediaFiles.value.map((file) => file.name),
  });
};

const resetForm = () => {
  selectedProjectId.value = '';
  projectOpen.value = false;
  content.value = '';
  mediaFiles.value = [];
};

defineExpose({ resetForm });
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

.section-hint {
  display: block;
  margin-top: -16rpx;
  margin-bottom: 28rpx;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.field-group {
  margin-bottom: 0;
}

.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.field-label {
  display: block;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.field-label-row .field-label {
  margin-bottom: 0;
}

.field-count {
  font-size: 24rpx;
  color: #9ca3af;
}

.required {
  color: #ef4444;
  margin-right: 4rpx;
}

.dropdown-wrap {
  position: relative;
}

.picker-field {
  height: 96rpx;
  padding: 0 28rpx;
  border-radius: 28rpx;
  border: 2rpx solid #eef0ea;
  background-color: #f8faf9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.picker-field.open {
  border-color: #9fe870;
  background-color: #ffffff;
}

.picker-text {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 20rpx;
}

.picker-text.placeholder {
  font-weight: 500;
  color: #9ca3af;
}

.picker-arrow {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.picker-arrow.open {
  transform: rotate(180deg);
  color: #163300;
}

.dropdown-menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 16rpx);
  z-index: 20;
  background-color: #ffffff;
  border-radius: 32rpx;
  border: 2rpx solid #eef2f7;
  box-shadow: 0 24rpx 56rpx rgba(15, 23, 42, 0.1);
  overflow: hidden;
  max-height: 480rpx;
  overflow-y: auto;
}

.dropdown-option {
  min-height: 96rpx;
  padding: 24rpx 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  box-sizing: border-box;
  border-bottom: 2rpx solid #f3f4f6;
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option.active {
  background-color: #f7faf5;
}

.dropdown-option-text {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
}

.dropdown-option.active .dropdown-option-text {
  color: #163300;
}

.dropdown-check-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
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

.media-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.media-grid:not(:empty) {
  margin-bottom: 20rpx;
}

.media-item {
  width: calc((100% - 40rpx) / 3);
  aspect-ratio: 1;
  border-radius: 28rpx;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}

.media-thumb {
  width: 100%;
  height: 100%;
  display: block;
  background-color: #f3f4f6;
}

.media-video {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #ede9fe 0%, #ddd6fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-video-badge {
  font-size: 22rpx;
  font-weight: 800;
  color: #6d28d9;
  letter-spacing: 0.04em;
}

.media-remove {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  width: 44rpx;
  height: 44rpx;
  border-radius: 22rpx;
  background-color: rgba(17, 24, 39, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-remove-text {
  font-size: 28rpx;
  color: #ffffff;
  line-height: 1;
}

.media-add {
  width: 100%;
  height: 176rpx;
  border-radius: 28rpx;
  border: 3rpx dashed #d1d5db;
  background-color: #f8faf9;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  box-sizing: border-box;
}

.media-add-alone {
  height: 216rpx;
}

.media-add-icon {
  width: 48rpx;
  height: 48rpx;
}

.media-add-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #6b7280;
}

.submit-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
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
