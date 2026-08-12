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
  border-radius: 22px;
  padding: 20px 18px;
  margin-bottom: 14px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
}

.section-title {
  display: block;
  font-size: 17px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 16px;
}

.section-hint {
  display: block;
  margin-top: -8px;
  margin-bottom: 14px;
  font-size: 13px;
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
  margin-bottom: 8px;
}

.field-label {
  display: block;
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 8px;
}

.field-label-row .field-label {
  margin-bottom: 0;
}

.field-count {
  font-size: 12px;
  color: #9ca3af;
}

.required {
  color: #ef4444;
  margin-right: 2px;
}

.dropdown-wrap {
  position: relative;
}

.picker-field {
  height: 48px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid #eef0ea;
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
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 10px;
}

.picker-text.placeholder {
  font-weight: 500;
  color: #9ca3af;
}

.picker-arrow {
  font-size: 14px;
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
  top: calc(100% + 8px);
  z-index: 20;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #eef2f7;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
  overflow: hidden;
  max-height: 240px;
  overflow-y: auto;
}

.dropdown-option {
  min-height: 48px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #f3f4f6;
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
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
}

.dropdown-option.active .dropdown-option-text {
  color: #163300;
}

.dropdown-check-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.field-textarea {
  width: 100%;
  min-height: 140px;
  padding: 12px 14px;
  background-color: #f8faf9;
  border: 1px solid #eef0ea;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  line-height: 1.55;
  box-sizing: border-box;
}

.input-placeholder {
  color: #d1d5db;
  font-size: 14px;
}

.media-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.media-grid:not(:empty) {
  margin-bottom: 10px;
}

.media-item {
  width: calc((100% - 20px) / 3);
  aspect-ratio: 1;
  border-radius: 14px;
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
  font-size: 11px;
  font-weight: 800;
  color: #6d28d9;
  letter-spacing: 0.04em;
}

.media-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: rgba(17, 24, 39, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-remove-text {
  font-size: 14px;
  color: #ffffff;
  line-height: 1;
}

.media-add {
  width: 100%;
  height: 88px;
  border-radius: 14px;
  border: 1.5px dashed #d1d5db;
  background-color: #f8faf9;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
}

.media-add-alone {
  height: 108px;
}

.media-add-icon {
  width: 24px;
  height: 24px;
}

.media-add-text {
  font-size: 14px;
  font-weight: 700;
  color: #6b7280;
}

.submit-btn {
  height: 52px;
  border-radius: 999px;
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
  font-size: 16px;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  line-height: 1;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
