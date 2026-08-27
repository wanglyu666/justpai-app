import { ref } from 'vue';

export type MaintenanceStatus = 'in_maintenance' | 'pending' | 'completed';
export type RepairType = 'normal' | 'urgent';

export type MaintenanceProject = {
  id: string;
  name: string;
  address: string;
  managerName: string;
  managerPhone: string;
  projectCode: string;
};

export type MaintenanceItem = {
  id: number;
  code: string;
  projectCode: string;
  projectName: string;
  address: string;
  managerName: string;
  managerPhone: string;
  status: MaintenanceStatus;
  repairType: RepairType;
  visitTime: string;
  reason: string;
  media: string[];
};

export const maintenanceProjects: MaintenanceProject[] = [
  {
    id: 'p1',
    name: '星巴克上海臻选烘焙工坊',
    address: '上海市静安区南京西路789号',
    managerName: '张伟',
    managerPhone: '13812345678',
    projectCode: 'PJ20260324001',
  },
  {
    id: 'p2',
    name: '星巴克深圳海岸城店',
    address: '深圳市南山区文心五路33号',
    managerName: '李娜',
    managerPhone: '13987654321',
    projectCode: 'PJ20260322002',
  },
  {
    id: 'p3',
    name: '星巴克杭州湖滨银泰店',
    address: '杭州市上城区延安路298号',
    managerName: '王强',
    managerPhone: '13700112233',
    projectCode: 'PJ20260318003',
  },
  {
    id: 'p4',
    name: '星巴克北京三里屯店',
    address: '北京市朝阳区三里屯路19号',
    managerName: '赵敏',
    managerPhone: '13699887766',
    projectCode: 'PJ20260315004',
  },
  {
    id: 'p5',
    name: '星巴克成都太古里店',
    address: '成都市锦江区中纱帽街8号',
    managerName: '陈晨',
    managerPhone: '13566778899',
    projectCode: 'PJ20260328005',
  },
  {
    id: 'p6',
    name: '星巴克广州太古汇店',
    address: '广州市天河区天河路383号',
    managerName: '刘洋',
    managerPhone: '13455667788',
    projectCode: 'PJ20260328006',
  },
];

const maintenanceItems = ref<MaintenanceItem[]>([
  {
    id: 1,
    code: 'WB202603241401488',
    projectCode: 'WB202603241401488',
    projectName: '星巴克上海臻选烘焙工坊',
    address: '上海市静安区南京西路789号',
    managerName: '张伟',
    managerPhone: '13812345678',
    status: 'in_maintenance',
    repairType: 'normal',
    visitTime: '2026-03-24 14:00',
    reason: '空调系统制冷效果下降，需要检修',
    media: ['机房现场照片.jpg', '设备铭牌.jpg'],
  },
  {
    id: 2,
    code: 'WB202603221009231',
    projectCode: 'WB202603221009231',
    projectName: '星巴克深圳海岸城店',
    address: '深圳市南山区文心五路33号',
    managerName: '李娜',
    managerPhone: '13987654321',
    status: 'pending',
    repairType: 'urgent',
    visitTime: '2026-03-25 10:30',
    reason: '门店照明回路跳闸，需排查配电箱并更换损坏灯具。',
    media: ['配电箱现场.jpg'],
  },
  {
    id: 3,
    code: 'WB202603180814002',
    projectCode: 'WB202603180814002',
    projectName: '星巴克杭州湖滨银泰店',
    address: '杭州市上城区延安路298号',
    managerName: '王强',
    managerPhone: '13700112233',
    status: 'completed',
    repairType: 'normal',
    visitTime: '2026-03-18 09:00',
    reason: '客区地砖空鼓，需局部拆除后重新铺贴。',
    media: ['地砖空鼓照片.jpg'],
  },
  {
    id: 4,
    code: 'WB202603151530667',
    projectCode: 'WB202603151530667',
    projectName: '星巴克北京三里屯店',
    address: '北京市朝阳区三里屯路19号',
    managerName: '赵敏',
    managerPhone: '13699887766',
    status: 'in_maintenance',
    repairType: 'normal',
    visitTime: '2026-03-16 15:30',
    reason: '后厨排烟风机异响，需清洁风轮并检查轴承。',
    media: ['排烟风机.mp4', '风机铭牌.jpg'],
  },
]);

const pad = (value: number, length = 2) => String(value).padStart(length, '0');

const createMaintenanceCode = () => {
  const now = new Date();
  return `WB${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${pad(now.getMilliseconds(), 3)}`;
};

export function useMaintenanceItems() {
  const addMaintenance = (payload: {
    projectName: string;
    address: string;
    managerName: string;
    managerPhone: string;
    projectCode: string;
    repairType: RepairType;
    visitTime: string;
    reason: string;
    attachments: string[];
  }) => {
    const nextId = Math.max(0, ...maintenanceItems.value.map((item) => item.id)) + 1;
    maintenanceItems.value = [
      {
        id: nextId,
        code: createMaintenanceCode(),
        projectCode: payload.projectCode,
        projectName: payload.projectName,
        address: payload.address,
        managerName: payload.managerName,
        managerPhone: payload.managerPhone,
        status: 'pending',
        repairType: payload.repairType,
        visitTime: payload.visitTime,
        reason: payload.reason,
        media: payload.attachments,
      },
      ...maintenanceItems.value,
    ];
  };

  return {
    items: maintenanceItems,
    addMaintenance,
  };
}
