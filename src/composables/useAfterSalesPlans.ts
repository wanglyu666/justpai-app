import { ref } from 'vue';
import type { ProgressAcceptType, SiteContact } from '@/composables/useProcessAcceptance';

export type AfterSalesPlanItem = {
  id: string;
  name: string;
  plannedAt: string;
  startedAt?: string;
  endedAt?: string;
  bookedAt?: string;
  acceptType?: ProgressAcceptType | string;
  contacts?: SiteContact[];
  canBook?: boolean;
};

const plans = ref<AfterSalesPlanItem[]>([
  {
    id: 'as-1',
    name: '第1次售后计划',
    plannedAt: '2026-07-11',
    startedAt: '2026-07-12',
    endedAt: '2026-07-15',
  },
  {
    id: 'as-2',
    name: '第2次售后计划',
    plannedAt: '2027-01-11',
    canBook: true,
  },
  {
    id: 'as-3',
    name: '第3次售后计划',
    plannedAt: '2027-07-11',
  },
]);

export function useAfterSalesPlans() {
  const updateBooking = (
    id: string,
    payload: {
      bookedAt: string;
      acceptType: ProgressAcceptType;
      contacts: SiteContact[];
    },
  ) => {
    plans.value = plans.value.map((item) =>
      item.id === id
        ? {
            ...item,
            bookedAt: payload.bookedAt,
            acceptType: payload.acceptType,
            contacts: payload.contacts.map((contact) => ({ ...contact })),
          }
        : item,
    );
  };

  return {
    plans,
    updateBooking,
  };
}
