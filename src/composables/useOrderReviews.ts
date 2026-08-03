import { ref } from 'vue';

export interface OrderReviewRecord {
  orderId: string;
  rating: number;
  content: string;
  submittedAt: string;
}

const reviewRecords = ref<Record<string, OrderReviewRecord>>({});

const formatSubmittedAt = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export function useOrderReviews() {
  const hasReview = (orderId: string) => Boolean(reviewRecords.value[orderId]);

  const getReview = (orderId: string) => reviewRecords.value[orderId] ?? null;

  const submitReview = (
    orderId: string,
    payload: Pick<OrderReviewRecord, 'rating' | 'content'>,
  ) => {
    reviewRecords.value[orderId] = {
      orderId,
      rating: payload.rating,
      content: payload.content,
      submittedAt: formatSubmittedAt(new Date()),
    };
  };

  return {
    reviewRecords,
    hasReview,
    getReview,
    submitReview,
  };
}
