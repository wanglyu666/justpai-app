import { ref } from 'vue';

export interface OrderRefundRecord {
  orderId: string;
  reason: string;
  remarks: string;
  itemIds: string[];
  submittedAt: string;
  /** 0=提交申请 1=平台审核 2=退款处理 3=退款完成 */
  currentStep: number;
}

const refundRecords = ref<Record<string, OrderRefundRecord>>({});

const formatSubmittedAt = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export function useOrderRefunds() {
  const hasRefund = (orderId: string) => Boolean(refundRecords.value[orderId]);

  const getRefund = (orderId: string) => refundRecords.value[orderId] ?? null;

  const submitRefund = (
    orderId: string,
    payload: Pick<OrderRefundRecord, 'reason' | 'remarks' | 'itemIds'>,
  ) => {
    refundRecords.value[orderId] = {
      orderId,
      reason: payload.reason,
      remarks: payload.remarks,
      itemIds: payload.itemIds,
      submittedAt: formatSubmittedAt(new Date()),
      currentStep: 1,
    };
  };

  return {
    refundRecords,
    hasRefund,
    getRefund,
    submitRefund,
  };
};
