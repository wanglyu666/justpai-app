import { ref } from 'vue';

export type MaintenanceProjectStatus = 'pending_start' | 'in_progress' | 'completed';

export type MaintenanceProjectItem = {
  id: number;
  name: string;
  code: string;
  address: string;
  managerName: string;
  managerPhone: string;
  status: MaintenanceProjectStatus;
  startDate: string;
  endDate: string;
  warranty: string;
  attachments: string[];
};

const projects = ref<MaintenanceProjectItem[]>([
  {
    id: 1,
    name: '中央空调系统年度维保',
    code: 'WB-2024-001',
    address: '杭州市上城区延安路298号',
    managerName: '李志强',
    managerPhone: '13912345678',
    status: 'completed',
    startDate: '2025/06/18',
    endDate: '2025/12/30',
    warranty: '24个月',
    attachments: ['竣工验收单.pdf', '现场竣工照片.jpg'],
  },
  {
    id: 2,
    name: '星巴克广州太古汇店',
    code: 'WB-2024-002',
    address: '广州市天河区天河路383号',
    managerName: '刘洋',
    managerPhone: '13455667788',
    status: 'completed',
    startDate: '2025/04/10',
    endDate: '2025/11/22',
    warranty: '24个月',
    attachments: ['竣工报告.pdf'],
  },
  {
    id: 3,
    name: '星巴克成都太古里店',
    code: 'WB-2024-003',
    address: '成都市锦江区中纱帽街8号',
    managerName: '陈晨',
    managerPhone: '13566778899',
    status: 'completed',
    startDate: '2025/03/02',
    endDate: '2025/09/18',
    warranty: '36个月',
    attachments: ['验收照片.jpg', '质保协议.pdf'],
  },
  {
    id: 4,
    name: '星巴克上海臻选烘焙工坊',
    code: 'WB-2024-004',
    address: '上海市静安区南京西路789号',
    managerName: '张伟',
    managerPhone: '13812345678',
    status: 'in_progress',
    startDate: '2026/03/01',
    endDate: '2026/08/20',
    warranty: '24个月',
    attachments: ['施工进度周报.pdf'],
  },
  {
    id: 5,
    name: '星巴克深圳海岸城店',
    code: 'WB-2024-005',
    address: '深圳市南山区文心五路33号',
    managerName: '李娜',
    managerPhone: '13987654321',
    status: 'in_progress',
    startDate: '2026/02/16',
    endDate: '2026/07/30',
    warranty: '24个月',
    attachments: [],
  },
  {
    id: 6,
    name: '星巴克北京三里屯店',
    code: 'WB-2024-006',
    address: '北京市朝阳区三里屯路19号',
    managerName: '赵敏',
    managerPhone: '13699887766',
    status: 'pending_start',
    startDate: '2026/09/01',
    endDate: '2027/02/28',
    warranty: '24个月',
    attachments: ['开工准备清单.pdf'],
  },
]);

export function useMaintenanceProjects() {
  return {
    projects,
  };
}
