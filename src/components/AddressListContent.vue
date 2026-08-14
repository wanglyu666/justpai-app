<template>
  <view class="address-list">
    <view class="toolbar">
      <text class="page-title">地址信息</text>
      <view class="add-btn" @click="handleAdd">
        <image src="/static/icons/plus.svg" mode="aspectFit" class="add-icon"></image>
        <text class="add-text">新增</text>
      </view>
    </view>

    <TransitionGroup name="address-card" tag="view" class="card-list">
      <view v-for="item in visibleAddresses" :key="item.id" class="address-card">
        <view class="card-header">
          <view class="card-title-row">
            <text class="card-title">{{ item.name }}</text>
            <text v-if="item.isDefault" class="default-tag">默认</text>
          </view>
          <view class="card-actions">
            <view class="action-btn" @click="handleEdit(item.id)">
              <image src="/static/icons/edit.svg" mode="aspectFit" class="action-icon"></image>
            </view>
            <view class="action-btn" @click="openDeleteModal(item.id)">
              <image src="/static/icons/trash.svg" mode="aspectFit" class="action-icon"></image>
            </view>
          </view>
        </view>

        <view class="card-body">
          <view class="info-col">
            <text class="info-label">联系人</text>
            <text class="info-value">{{ item.contact }}</text>
          </view>
          <view class="info-col">
            <text class="info-label">联系电话</text>
            <text class="info-value">{{ item.phone }}</text>
          </view>
        </view>

        <view class="card-region">
          <text class="info-label">所在地区</text>
          <text class="info-value">{{ item.region }}</text>
        </view>
      </view>
    </TransitionGroup>

    <FrostedConfirmModal
      :show="deleteModalVisible"
      title="确定删除该地址吗？"
      message="删除后将无法恢复"
      @cancel="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import FrostedConfirmModal from '@/components/FrostedConfirmModal.vue';

export type AddressItem = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  region: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault?: boolean;
};

const props = defineProps<{
  addresses: AddressItem[];
}>();

const emit = defineEmits<{
  add: [];
  edit: [id: string];
  delete: [id: string];
}>();

const deleteModalVisible = ref(false);
const pendingDeleteId = ref<string | null>(null);
const removingIds = ref<string[]>([]);

const visibleAddresses = computed(() =>
  props.addresses.filter((item) => !removingIds.value.includes(item.id)),
);

watch(
  () => props.addresses.map((item) => item.id).join(','),
  () => {
    removingIds.value = removingIds.value.filter((id) =>
      props.addresses.some((item) => item.id === id),
    );
  },
);

const handleAdd = () => {
  emit('add');
};

const handleEdit = (id: string) => {
  emit('edit', id);
};

const openDeleteModal = (id: string) => {
  pendingDeleteId.value = id;
  deleteModalVisible.value = true;
};

const closeDeleteModal = () => {
  deleteModalVisible.value = false;
  pendingDeleteId.value = null;
};

const confirmDelete = () => {
  const id = pendingDeleteId.value;
  deleteModalVisible.value = false;

  if (!id) return;

  removingIds.value = [...removingIds.value, id];

  setTimeout(() => {
    emit('delete', id);
    removingIds.value = removingIds.value.filter((itemId) => itemId !== id);
    pendingDeleteId.value = null;
  }, 300);
};
</script>

<style scoped>
.address-list {
  padding: 64rpx 48rpx 80rpx;
  box-sizing: border-box;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48rpx;
}

.page-title {
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  height: 72rpx;
  padding: 0 28rpx;
  border-radius: 36rpx;
  background-color: #9fe870;
}

.add-icon {
  width: 32rpx;
  height: 32rpx;
}

.add-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #163300;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  position: relative;
}

.address-card {
  padding: 40rpx;
  border-radius: 32rpx;
  background-color: #ffffff;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 36rpx;
}

.card-title-row {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16rpx;
  min-width: 0;
}

.card-title {
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.4;
}

.default-tag {
  padding: 4rpx 16rpx;
  border-radius: 12rpx;
  background-color: rgba(159, 232, 112, 0.35);
  font-size: 24rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1.4;
  flex-shrink: 0;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
}

.action-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon {
  width: 36rpx;
  height: 36rpx;
}

.card-body {
  display: flex;
  gap: 32rpx;
  margin-bottom: 32rpx;
}

.info-col {
  flex: 1;
  min-width: 0;
}

.card-region {
  width: 100%;
}

.info-label {
  display: block;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.info-value {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.45;
}

.address-card-enter-active,
.address-card-leave-active {
  transition: opacity 300ms ease;
}

.address-card-enter-from,
.address-card-leave-to {
  opacity: 0;
}
</style>
