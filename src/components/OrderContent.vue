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

      <StatusCapsuleSwitch
        class="status-capsule-wrap"
        v-model="activeStatus"
        :tabs="statusTabs"
      />
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
              :refund-submitted="hasRefund(order.id)"
              class="order-card-item"
              @detail="handleSignedDetail"
              @refund="handleOrderRefund"
            />
            <OrderServiceCard
              v-else-if="order.status === 'service'"
              :order="order"
              class="order-card-item"
              @detail="handleOrderDetail"
            />
            <OrderCompletedCard
              v-else-if="order.status === 'completed'"
              :order="order"
              :review-submitted="hasReview(order.id)"
              class="order-card-item"
              @detail="handleOrderDetail"
              @review="handleOrderReview"
            />
            <OrderCancelledCard
              v-else-if="order.status === 'cancelled'"
              :order="order"
              class="order-card-item"
              @detail="handleOrderDetail"
              @reorder="handleOrderReorder"
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
      <SuccessPageTransition :show-success="refundStep === 'success'">
        <RefundFormContent
          :order="refundOrder"
          @back="closeRefundFlow"
          @submit="handleRefundSubmit"
        />
        <template #success>
          <RefundSuccessContent @back="closeRefundFlow" />
        </template>
      </SuccessPageTransition>
    </BottomSheetPanel>

    <BottomSheetPanel :show="refundDetailFlowVisible" :z-index="1200" @closed="resetRefundDetailFlow">
      <RefundDetailContent
        v-if="refundDetailOrder && refundDetailRecord"
        :order="refundDetailOrder"
        :refund="refundDetailRecord"
        @back="closeRefundDetailFlow"
      />
    </BottomSheetPanel>

    <BottomSheetPanel :show="detailFlowVisible" :z-index="1200" @closed="resetDetailFlow">
      <OrderDetailContent
        v-if="detailOrder"
        :order="detailOrder"
        @back="closeDetailFlow"
      />
    </BottomSheetPanel>

    <BottomSheetPanel :show="reviewFlowVisible" :z-index="1200" @closed="resetReviewFlow">
      <SuccessPageTransition :show-success="reviewStep === 'success'">
        <OrderReviewContent
          v-if="reviewOrder"
          :order="reviewOrder"
          :editable="reviewStep === 'form'"
          :existing-rating="reviewRecord?.rating"
          :existing-content="reviewRecord?.content"
          :submitted-at="reviewRecord?.submittedAt"
          @back="closeReviewFlow"
          @submit="handleReviewSubmit"
        />
        <template #success>
          <OrderReviewSuccessContent @back="closeReviewFlow" />
        </template>
      </SuccessPageTransition>
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import OrderPendingCard from '@/components/OrderPendingCard.vue';
import OrderSignedCard from '@/components/OrderSignedCard.vue';
import OrderServiceCard from '@/components/OrderServiceCard.vue';
import OrderCompletedCard from '@/components/OrderCompletedCard.vue';
import OrderCancelledCard from '@/components/OrderCancelledCard.vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import RefundFormContent from '@/components/RefundFormContent.vue';
import RefundSuccessContent from '@/components/RefundSuccessContent.vue';
import RefundDetailContent from '@/components/RefundDetailContent.vue';
import OrderDetailContent from '@/components/OrderDetailContent.vue';
import OrderReviewContent from '@/components/OrderReviewContent.vue';
import OrderReviewSuccessContent from '@/components/OrderReviewSuccessContent.vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';
import { useSlideOver } from '@/composables/useSlideOver';
import { useOrderRefunds } from '@/composables/useOrderRefunds';
import { useOrderReviews } from '@/composables/useOrderReviews';
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

const emit = defineEmits<{
  back: [];
}>();

const activeStatus = ref<OrderStatusTabId>('all');
const { hasRefund, getRefund, submitRefund } = useOrderRefunds();
const { hasReview, getReview, submitReview } = useOrderReviews();
const visibleOrders = computed(() => {
  const orders = getOrdersByStatus(activeStatus.value);
  if (activeStatus.value === 'reviewed') {
    const reviewedCompleted = getOrdersByStatus('completed').filter((order) => hasReview(order.id));
    return [...reviewedCompleted, ...orders];
  }
  return orders;
});
const { visible: refundFlowVisible, open: openRefundFlow, close: closeRefundFlow } = useSlideOver();
const refundOrder = ref<OrderRecord | null>(null);
const refundStep = ref<'form' | 'success'>('form');
const { visible: refundDetailFlowVisible, open: openRefundDetailFlow, close: closeRefundDetailFlow } = useSlideOver();
const refundDetailOrder = ref<OrderRecord | null>(null);
const refundDetailRecord = computed(() =>
  refundDetailOrder.value ? getRefund(refundDetailOrder.value.id) : null,
);
const { visible: detailFlowVisible, open: openDetailFlow, close: closeDetailFlow } = useSlideOver();
const detailOrder = ref<OrderRecord | null>(null);
const { visible: reviewFlowVisible, open: openReviewFlow, close: closeReviewFlow } = useSlideOver();
const reviewOrder = ref<OrderRecord | null>(null);
const reviewStep = ref<'form' | 'view' | 'success'>('form');
const reviewRecord = computed(() =>
  reviewOrder.value ? getReview(reviewOrder.value.id) : null,
);

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

const handleOrderReorder = (orderId: string) => {
  uni.showToast({
    title: `再次下单 ${orderId}`,
    icon: 'none',
  });
};

const handleOrderReview = (orderId: string) => {
  const order = getOrderById(orderId);
  if (!order) return;

  reviewOrder.value = order;
  reviewStep.value = hasReview(orderId) ? 'view' : 'form';
  openReviewFlow();
};

const resetReviewFlow = () => {
  reviewOrder.value = null;
  reviewStep.value = 'form';
};

const handleReviewSubmit = (payload: {
  orderId: string;
  rating: number;
  content: string;
}) => {
  submitReview(payload.orderId, {
    rating: payload.rating,
    content: payload.content,
  });
  reviewStep.value = 'success';
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

  if (hasRefund(orderId)) {
    refundDetailOrder.value = order;
    openRefundDetailFlow();
    return;
  }

  refundOrder.value = order;
  openRefundFlow();
};

const resetRefundFlow = () => {
  refundOrder.value = null;
  refundStep.value = 'form';
};

const handleRefundSubmit = (payload: {
  orderId: string;
  itemIds: string[];
  reason: string;
  remarks: string;
}) => {
  submitRefund(payload.orderId, {
    reason: payload.reason,
    remarks: payload.remarks,
    itemIds: payload.itemIds,
  });
  refundStep.value = 'success';
};

const resetRefundDetailFlow = () => {
  refundDetailOrder.value = null;
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
  padding: 0 48rpx 32rpx;
  flex-shrink: 0;
}

.header-top-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
}

.icon-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 88rpx;
  pointer-events: none;
}

.header-placeholder {
  width: 88rpx;
  height: 88rpx;
  flex-shrink: 0;
}

.status-capsule-wrap {
  margin-top: 32rpx;
}

.order-body {
  flex: 1;
  min-height: 0;
  padding: 0 48rpx calc(40rpx + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.order-list {
  height: 100%;
  box-sizing: border-box;
}

.list-top-spacer {
  height: 8rpx;
}

.list-bottom-spacer {
  height: 24rpx;
}

.order-card-item {
  display: block;
  margin-bottom: 28rpx;
}

.order-card-item:last-child {
  margin-bottom: 0;
}

.empty-state {
  padding: 128rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}
</style>
