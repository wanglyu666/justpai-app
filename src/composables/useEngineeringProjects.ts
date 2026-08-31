import { ref } from 'vue';

export type EngineeringProjectStatus =
  | 'pending_start'
  | 'in_progress'
  | 'completed'
  | 'settled'
  | 'in_warranty'
  | 'out_of_warranty';

export type EngineeringProjectItem = {
  id: number;
  name: string;
  code: string;
  address: string;
  managerName: string;
  managerPhone: string;
  status: EngineeringProjectStatus;
  amount: number;
  startDate: string;
  endDate: string;
};

export const ENGINEERING_PROJECT_STATUS_LABEL: Record<
  EngineeringProjectStatus,
  string
> = {
  pending_start: '待开工',
  in_progress: '施工中',
  completed: '已完工',
  settled: '已结算',
  in_warranty: '保修中',
  out_of_warranty: '保修外',
};

export const ENGINEERING_PROJECT_STATUS_TABS: {
  id: EngineeringProjectStatus;
  label: string;
}[] = [
  { id: 'pending_start', label: '待开工' },
  { id: 'in_progress', label: '施工中' },
  { id: 'completed', label: '已完工' },
  { id: 'settled', label: '已结算' },
  { id: 'in_warranty', label: '保修中' },
  { id: 'out_of_warranty', label: '保修外' },
];

const projects = ref<EngineeringProjectItem[]>([
  {
    id: 1,
    name: '杭州万象城店装修工程',
    code: 'GC-2026-001',
    address: '杭州市上城区延安路298号',
    managerName: '李志强',
    managerPhone: '13912345678',
    status: 'pending_start',
    amount: 128000,
    startDate: '2026-09-01',
    endDate: '2027-02-28',
  },
  {
    id: 2,
    name: '时代广场商铺软装陈设',
    code: 'PRJ-2023-004',
    address: '南京市玄武区中山路18号',
    managerName: '刘洋',
    managerPhone: '13655556666',
    status: 'pending_start',
    amount: 85000,
    startDate: '2023-07-10',
    endDate: '2023-12-30',
  },
  {
    id: 3,
    name: '上海静安嘉里中心改造',
    code: 'GC-2026-003',
    address: '上海市静安区南京西路1515号',
    managerName: '张伟',
    managerPhone: '13812345678',
    status: 'in_progress',
    amount: 256000,
    startDate: '2026-03-01',
    endDate: '2026-08-20',
  },
  {
    id: 4,
    name: '武汉天地店装修工程',
    code: 'GC-2026-004',
    address: '武汉市江岸区解放大道688号',
    managerName: '周宁',
    managerPhone: '13622334455',
    status: 'in_progress',
    amount: 168000,
    startDate: '2026-04-12',
    endDate: '2026-09-30',
  },
  {
    id: 5,
    name: '广州太古汇店翻新工程',
    code: 'GC-2025-005',
    address: '广州市天河区天河路383号',
    managerName: '刘洋',
    managerPhone: '13455667788',
    status: 'completed',
    amount: 96000,
    startDate: '2025-04-10',
    endDate: '2025-11-22',
  },
  {
    id: 6,
    name: '成都太古里店装修工程',
    code: 'GC-2025-006',
    address: '成都市锦江区中纱帽街8号',
    managerName: '陈晨',
    managerPhone: '13566778899',
    status: 'settled',
    amount: 112000,
    startDate: '2025-03-02',
    endDate: '2025-09-18',
  },
  {
    id: 7,
    name: '深圳海岸城店装修工程',
    code: 'GC-2024-007',
    address: '深圳市南山区文心五路33号',
    managerName: '李娜',
    managerPhone: '13987654321',
    status: 'in_warranty',
    amount: 88000,
    startDate: '2024-05-16',
    endDate: '2024-12-30',
  },
  {
    id: 8,
    name: '北京三里屯店装修工程',
    code: 'GC-2023-008',
    address: '北京市朝阳区三里屯路19号',
    managerName: '赵敏',
    managerPhone: '13699887766',
    status: 'out_of_warranty',
    amount: 74000,
    startDate: '2023-02-18',
    endDate: '2023-08-31',
  },
]);

export function useEngineeringProjects() {
  return {
    projects,
  };
}
