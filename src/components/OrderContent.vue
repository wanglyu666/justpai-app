<template>
  <view class="order-page">
    <view class="page-header">
      <view class="header-top-row">
        <view class="icon-btn" @click="handleBack">
          <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
        </view>
        <text class="header-title">订单</text>
        <view class="header-placeholder" />
      </view>

      <view class="status-capsule">
        <scroll-view
          scroll-x
          class="status-scroll"
          :show-scrollbar="false"
          :scroll-left="scrollLeft"
          scroll-with-animation
        >
          <view class="status-scroll-inner">
            <view class="status-thumb" :style="thumbStyle" />
            <view
              v-for="tab in statusTabs"
              :key="tab.id"
              :id="`status-tab-${tab.id}`"
              class="status-item"
              :class="{ active: activeStatus === tab.id }"
              @click="selectStatus(tab.id)"
            >
              <text class="status-text">{{ tab.label }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <view class="order-body">
      <scroll-view scroll-y class="order-list" :show-scrollbar="false">
        <view class="list-top-spacer" />
        <template v-if="visibleOrders.length">
          <template v-for="order in visibleOrders" :key="order.id">
            <OrderPendingCard
              v-if="order.status === 'pending'"
              :order="order"
              class="order-card-item"
              @detail="handleOrderDetail"
              @pay="handleOrderPay"
            />
            <OrderSignedCard
              v-else-if="order.status === 'signed'"
              :order="order"
              class="order-card-item"
              @detail="handleSignedDetail"
              @refund="handleOrderRefund"
            />
          </template>
        </template>
        <view v-else class="empty-state">
          <text class="empty-text">暂无订单</text>
        </view>
        <view class="list-bottom-spacer" />
      </scroll-view>
    </view>

    <BottomSheetPanel :show="refundFlowVisible" :z-index="1200" @closed="resetRefundFlow">
      <FadeTransition mode="out-in">
        <RefundFormContent
          v-if="refundStep === 'form'"
          key="refund-form"
          :order="refundOrder"
          @back="closeRefundFlow"
          @submit="goRefundSuccessStep"
        />
        <RefundSuccessContent
          v-else
          key="refund-success"
          @back="closeRefundFlow"
        />
      </FadeTransition>
    </BottomSheetPanel>

    <BottomSheetPanel :show="detailFlowVisible" :z-index="1200" @closed="resetDetailFlow">
      <OrderDetailContent
        v-if="detailOrder"
        :order="detailOrder"
        @back="closeDetailFlow"
      />
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance, nextTick } from 'vue';
import OrderPendingCard from '@/components/OrderPendingCard.vue';
import OrderSignedCard from '@/components/OrderSignedCard.vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import FadeTransition from '@/components/FadeTransition.vue';
import RefundFormContent from '@/components/RefundFormContent.vue';
import RefundSuccessContent from '@/components/RefundSuccessContent.vue';
import OrderDetailContent from '@/components/OrderDetailContent.vue';
import { useSlideOver } from '@/composables/useSlideOver';
import { getOrdersByStatus, getOrderById, type OrderRecord, type OrderStatusId } from '@/data/orders';

type OrderStatusTabId = OrderStatusId;

const statusTabs: { id: OrderStatusTabId; label: string }[] = [
  { id: 'all', label: '全部订单' },
  { id: 'pending', label: '待支付' },
  { id: 'signed', label: '已签约' },
  { id: 'service', label: '服务中' },
  { id: 'completed', label: '已完工' },
  { id: 'cancelled', label: '已取消' },
  { id: 'reviewed', label: '已评价' },
];

const INNER_PADDING = 4;
const ITEM_GAP = 4;

const emit = defineEmits<{
  back: [];
}>();

const instance = getCurrentInstance();
const activeStatus = ref<OrderStatusTabId>('all');
const visibleOrders = computed(() => getOrdersByStatus(activeStatus.value));
const { visible: refundFlowVisible, open: openRefundFlow, close: closeRefundFlow } = useSlideOver();
const refundOrder = ref<OrderRecord | null>(null);
const refundStep = ref<'form' | 'success'>('form');
const { visible: detailFlowVisible, open: openDetailFlow, close: closeDetailFlow } = useSlideOver();
const detailOrder = ref<OrderRecord | null>(null);
const scrollLeft = ref(0);
const thumbStyle = ref({
  transform: 'translateX(0px)',
  width: '0px',
});

type ItemRect = { width: number };

const measureScrollLayout = () =>
  new Promise<{
    viewportWidth: number;
    innerWidth: number;
    items: ItemRect[];
  } | null>((resolve) => {
    if (!instance) {
      resolve(null);
      return;
    }

    uni.createSelectorQuery()
      .in(instance)
      .select('.status-scroll')
      .boundingClientRect()
      .select('.status-scroll-inner')
      .boundingClientRect()
      .selectAll('.status-item')
      .boundingClientRect()
      .exec((res) => {
        const viewport = res?.[0] as { width?: number } | null;
        const inner = res?.[1] as { width?: number } | null;
        const items = res?.[2] as ItemRect[] | null;

        if (!viewport?.width || !inner?.width || !items?.length) {
          resolve(null);
          return;
        }

        resolve({
          viewportWidth: viewport.width,
          innerWidth: inner.width,
          items,
        });
      });
  });

const getTabContentLeft = (items: ItemRect[], index: number) => {
  let left = INNER_PADDING;
  for (let i = 0; i < index; i += 1) {
    left += items[i].width + ITEM_GAP;
  }
  return left;
};

const updateThumb = async () => {
  const layout = await measureScrollLayout();
  if (!layout) return;

  const index = statusTabs.findIndex((tab) => tab.id === activeStatus.value);
  if (index < 0 || !layout.items[index]) return;

  const left = getTabContentLeft(layout.items, index);

  thumbStyle.value = {
    transform: `translateX(${left}px)`,
    width: `${layout.items[index].width}px`,
  };
};

const scrollToTab = async (index: number) => {
  const layout = await measureScrollLayout();
  if (!layout) return;

  const maxScroll = Math.max(0, layout.innerWidth - layout.viewportWidth);

  if (index <= 0) {
    scrollLeft.value = 0;
    return;
  }

  if (index >= statusTabs.length - 1) {
    scrollLeft.value = maxScroll;
    return;
  }

  const tabLeft = getTabContentLeft(layout.items, index);
  const tabWidth = layout.items[index].width;
  const target = tabLeft + tabWidth / 2 - layout.viewportWidth / 2;

  scrollLeft.value = Math.max(0, Math.min(target, maxScroll));
};

const selectStatus = async (id: OrderStatusTabId) => {
  activeStatus.value = id;
  const index = statusTabs.findIndex((tab) => tab.id === id);
  await scrollToTab(index);
  await nextTick();
  await updateThumb();
};

onMounted(async () => {
  await nextTick();
  await updateThumb();
});

const handleBack = () => {
  emit('back');
};

const handleOrderDetail = (orderId: string) => {
  const order = getOrderById(orderId);
  if (!order) return;
  detailOrder.value = order;
  openDetailFlow();
};

const resetDetailFlow = () => {
  detailOrder.value = null;
};

const handleOrderPay = (orderId: string) => {
  uni.showToast({
    title: `前往支付 ${orderId}`,
    icon: 'none',
  });
};

const handleSignedDetail = (orderId: string) => {
  uni.showToast({
    title: `签约详情 ${orderId}`,
    icon: 'none',
  });
};

const handleOrderRefund = (orderId: string) => {
  const order = getOrderById(orderId);
  if (!order) return;
  refundOrder.value = order;
  openRefundFlow();
};

const resetRefundFlow = () => {
  refundOrder.value = null;
  refundStep.value = 'form';
};

const goRefundSuccessStep = () => {
  refundStep.value = 'success';
};
</script>

<style scoped>
.order-page {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.page-header {
  padding: 0 24px 16px;
  flex-shrink: 0;
}

.header-top-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.header-icon {
  width: 20px;
  height: 20px;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  line-height: 44px;
  pointer-events: none;
}

.header-placeholder {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.status-capsule {
  width: 100%;
  margin-top: 16px;
  height: 40px;
  border-radius: 999px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  box-sizing: border-box;
}

.status-scroll {
  width: 100%;
  height: 100%;
  white-space: nowrap;
}

.status-scroll-inner {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  padding: 4px;
  box-sizing: border-box;
}

.status-thumb {
  position: absolute;
  top: 4px;
  left: 0;
  height: calc(100% - 8px);
  border-radius: 999px;
  background-color: #9fe870;
  transition:
    transform 280ms cubic-bezier(0.32, 0.72, 0, 1),
    width 280ms cubic-bezier(0.32, 0.72, 0, 1);
  z-index: 0;
}

.status-item {
  position: relative;
  z-index: 1;
  height: 32px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-text {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  line-height: 1;
  white-space: nowrap;
  transition: color 280ms cubic-bezier(0.32, 0.72, 0, 1);
}

.status-item.active .status-text {
  color: #163300;
  font-weight: 700;
}

.order-body {
  flex: 1;
  min-height: 0;
  padding: 0 24px calc(20px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.order-list {
  height: 100%;
  box-sizing: border-box;
}

.list-top-spacer {
  height: 4px;
}

.list-bottom-spacer {
  height: 12px;
}

.order-card-item {
  display: block;
  margin-bottom: 14px;
}

.order-card-item:last-child {
  margin-bottom: 0;
}

.empty-state {
  padding: 64px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-text {
  font-size: 14px;
  color: #9ca3af;
}
</style>
