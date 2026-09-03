import { ref } from 'vue';

export type ProcessAcceptanceCategory = 'arrival' | 'progress';

export type ProgressAcceptStatus = 'pending' | 'rejected' | 'completed';

export type ProgressAcceptType = '现场验收' | '线上验收';

export type SiteContact = {
  id: string;
  name: string;
  position: string;
  phone: string;
};

export type ProcessAcceptanceItem = {
  id: string;
  category: ProcessAcceptanceCategory;
  name: string;
  specialty?: string;
  kind?: string;
  code?: string;
  brand?: string;
  spec?: string;
  unit?: string;
  remark?: string;
  model?: string;
  quantity?: string;
  plannedAt?: string;
  actualAt?: string;
  bookedAt?: string;
  acceptType?: string;
  acceptStatus?: ProgressAcceptStatus;
  contacts?: SiteContact[];
};

export const PROGRESS_ACCEPT_TYPES: ProgressAcceptType[] = ['现场验收', '线上验收'];

export const normalizeProgressAcceptType = (value?: string): ProgressAcceptType =>
  value === '线上验收' ? '线上验收' : '现场验收';

export const PROGRESS_ACCEPT_STATUS_LABEL: Record<ProgressAcceptStatus, string> = {
  pending: '待验收',
  rejected: '未通过',
  completed: '已通过',
};

export const PROCESS_ACCEPTANCE_TABS: {
  id: ProcessAcceptanceCategory;
  label: string;
}[] = [
  { id: 'arrival', label: '材料进场计划' },
  { id: 'progress', label: '进度管控' },
];

export const PROCESS_ACCEPTANCE_ICONS: Record<
  ProcessAcceptanceCategory,
  string
> = {
  arrival: '/static/icons/calendar-clock.svg',
  progress: '/static/icons/clipboard-check-green.svg',
};

const items = ref<ProcessAcceptanceItem[]>([
  {
    id: 'arr-1',
    category: 'arrival',
    specialty: '装饰',
    kind: '轻钢龙骨板材',
    code: 'KMB-LP-001',
    name: '矿棉板',
    brand: '龙牌',
    model: '/',
    spec: '600*1200*14',
    unit: '平方',
    quantity: '100',
    plannedAt: '2025-12-30',
    actualAt: '2026-03-13',
    remark: '',
  },
  {
    id: 'arr-2',
    category: 'arrival',
    specialty: '装饰',
    kind: '轻钢龙骨板材',
    code: 'KMB-LP-002',
    name: '矿棉板',
    brand: '龙牌',
    model: '/',
    spec: '600*1200*15',
    unit: '平方',
    quantity: '80',
    plannedAt: '2025-12-31',
    actualAt: '',
    remark: '',
  },
  {
    id: 'arr-3',
    category: 'arrival',
    specialty: '装饰',
    kind: '轻钢龙骨板材',
    code: 'BLM-HM-001',
    name: '玻璃棉',
    brand: '华美',
    model: '/',
    spec: '5公分24K',
    unit: '平方',
    quantity: '60',
    plannedAt: '2025-12-31',
    actualAt: '',
    remark: '待复核数量',
  },
  {
    id: 'arr-4',
    category: 'arrival',
    specialty: '装饰',
    kind: '木饰面板材',
    code: 'WDP-YM-001',
    name: '免漆木饰面',
    brand: '兔宝宝',
    model: '/',
    spec: '18mm',
    unit: '平方',
    quantity: '120',
    plannedAt: '2026-01-08',
    actualAt: '2026-03-20',
    remark: '分两批进场',
  },
  {
    id: 'arr-5',
    category: 'arrival',
    specialty: '机电',
    kind: '电线电缆',
    code: 'WD-NH-001',
    name: '阻燃电线',
    brand: '远东',
    model: 'ZR-BVR',
    spec: '2.5mm²',
    unit: '米',
    quantity: '800',
    plannedAt: '2026-01-10',
    actualAt: '2026-03-18',
    remark: '',
  },
  {
    id: 'arr-6',
    category: 'arrival',
    specialty: '装饰',
    kind: '石材瓷砖',
    code: 'ST-DB-001',
    name: '通体大理石砖',
    brand: '东鹏',
    model: '/',
    spec: '800*800',
    unit: '平方',
    quantity: '200',
    plannedAt: '2026-01-15',
    actualAt: '',
    remark: '',
  },
  {
    id: 'prg-1',
    category: 'progress',
    name: '竣工验收',
    plannedAt: '2026-01-31',
    bookedAt: '',
    acceptType: '现场验收',
    acceptStatus: 'rejected',
  },
  {
    id: 'prg-2',
    category: 'progress',
    name: '隐蔽工程验收',
    plannedAt: '2025-12-20',
    bookedAt: '2025-12-18',
    acceptType: '现场验收',
    acceptStatus: 'completed',
  },
  {
    id: 'prg-3',
    category: 'progress',
    name: '水电安装验收',
    plannedAt: '2026-01-10',
    bookedAt: '',
    acceptType: '资料验收',
    acceptStatus: 'pending',
  },
  {
    id: 'prg-4',
    category: 'progress',
    name: '木作安装验收',
    plannedAt: '2026-01-18',
    bookedAt: '2026-01-16',
    acceptType: '现场验收',
    acceptStatus: 'pending',
  },
  {
    id: 'prg-5',
    category: 'progress',
    name: '油漆涂料验收',
    plannedAt: '2026-01-25',
    bookedAt: '',
    acceptType: '现场验收',
    acceptStatus: 'rejected',
  },
  {
    id: 'prg-6',
    category: 'progress',
    name: '竣工资料验收',
    plannedAt: '2026-02-05',
    bookedAt: '',
    acceptType: '资料验收',
    acceptStatus: 'pending',
  },
]);

export function useProcessAcceptance() {
  const getByCategory = (category: ProcessAcceptanceCategory) =>
    items.value.filter((item) => item.category === category);

  const updateProgressBooking = (
    id: string,
    payload: {
      bookedAt: string;
      acceptType: ProgressAcceptType;
      contacts: SiteContact[];
    },
  ) => {
    items.value = items.value.map((item) =>
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
    tabs: PROCESS_ACCEPTANCE_TABS,
    icons: PROCESS_ACCEPTANCE_ICONS,
    items,
    getByCategory,
    updateProgressBooking,
  };
}
