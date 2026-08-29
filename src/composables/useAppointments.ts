import { computed, type Ref } from 'vue';

export type AppointmentStatus =
  | 'pending_acceptance'
  | 'pending_confirm_time'
  | 'pending_confirm_change'
  | 'order_suspended'
  | 'appointment_abnormal'
  | 'pending_visit'
  | 'completed';

export type AppointmentItem = {
  id: number;
  projectId: number;
  projectName: string;
  scheduledAt: string;
  countdown: string;
  status: AppointmentStatus;
  contact: string;
  phone: string;
  address: string;
};

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending_acceptance: '待客户验收',
  pending_confirm_time: '待确认预约时间',
  pending_confirm_change: '待确认变更时间',
  order_suspended: '订单挂起',
  appointment_abnormal: '预约异常',
  pending_visit: '待上门',
  completed: '已完成',
};

const CONFIRMABLE_STATUS = new Set<AppointmentStatus>([
  'pending_acceptance',
  'pending_confirm_time',
  'pending_confirm_change',
]);

export const canConfirmAppointment = (status: AppointmentStatus) =>
  CONFIRMABLE_STATUS.has(status);

const appointments: AppointmentItem[] = [
  {
    id: 1,
    projectId: 1,
    projectName: '中央空调系统年度维保',
    scheduledAt: '2026-08-29 01:00',
    countdown: '-9小时',
    status: 'pending_acceptance',
    contact: '李志强',
    phone: '13912345678',
    address: '杭州市上城区延安路298号',
  },
  {
    id: 2,
    projectId: 1,
    projectName: '中央空调系统年度维保',
    scheduledAt: '2026-08-31 16:00',
    countdown: '2天5小时',
    status: 'pending_confirm_time',
    contact: '李志强',
    phone: '13912345678',
    address: '杭州市上城区延安路298号',
  },
  {
    id: 3,
    projectId: 1,
    projectName: '中央空调系统年度维保',
    scheduledAt: '2026-08-29 20:00',
    countdown: '9小时',
    status: 'pending_confirm_change',
    contact: '李志强',
    phone: '13912345678',
    address: '杭州市上城区延安路298号',
  },
  {
    id: 4,
    projectId: 1,
    projectName: '中央空调系统年度维保',
    scheduledAt: '2026-03-24 13:00',
    countdown: '-5天',
    status: 'order_suspended',
    contact: '李志强',
    phone: '13912345678',
    address: '杭州市上城区延安路298号',
  },
  {
    id: 5,
    projectId: 1,
    projectName: '中央空调系统年度维保',
    scheduledAt: '2026-03-24 13:00',
    countdown: '-5天',
    status: 'appointment_abnormal',
    contact: '李志强',
    phone: '13912345678',
    address: '杭州市上城区延安路298号',
  },
  {
    id: 6,
    projectId: 1,
    projectName: '中央空调系统年度维保',
    scheduledAt: '2026-08-30 09:00',
    countdown: '20小时',
    status: 'pending_visit',
    contact: '李志强',
    phone: '13912345678',
    address: '杭州市上城区延安路298号',
  },
  {
    id: 7,
    projectId: 1,
    projectName: '中央空调系统年度维保',
    scheduledAt: '2026-03-23 00:00',
    countdown: '-',
    status: 'completed',
    contact: '李志强',
    phone: '13912345678',
    address: '杭州市上城区延安路298号',
  },
  {
    id: 8,
    projectId: 2,
    projectName: '星巴克广州太古汇店',
    scheduledAt: '2026-08-30 14:00',
    countdown: '20小时',
    status: 'pending_visit',
    contact: '刘洋',
    phone: '13455667788',
    address: '广州市天河区天河路383号',
  },
  {
    id: 9,
    projectId: 2,
    projectName: '星巴克广州太古汇店',
    scheduledAt: '2025-04-15 08:00',
    countdown: '-',
    status: 'completed',
    contact: '刘洋',
    phone: '13455667788',
    address: '广州市天河区天河路383号',
  },
  {
    id: 10,
    projectId: 3,
    projectName: '星巴克成都太古里店',
    scheduledAt: '2026-08-29 11:00',
    countdown: '1小时',
    status: 'pending_confirm_time',
    contact: '陈晨',
    phone: '13566778899',
    address: '成都市锦江区中纱帽街8号',
  },
  {
    id: 11,
    projectId: 3,
    projectName: '星巴克成都太古里店',
    scheduledAt: '2026-09-01 10:00',
    countdown: '2天',
    status: 'pending_acceptance',
    contact: '陈晨',
    phone: '13566778899',
    address: '成都市锦江区中纱帽街8号',
  },
  {
    id: 12,
    projectId: 3,
    projectName: '星巴克成都太古里店',
    scheduledAt: '2025-08-18 09:00',
    countdown: '-',
    status: 'completed',
    contact: '陈晨',
    phone: '13566778899',
    address: '成都市锦江区中纱帽街8号',
  },
  {
    id: 13,
    projectId: 4,
    projectName: '星巴克上海臻选烘焙工坊',
    scheduledAt: '2026-08-29 08:00',
    countdown: '-2小时',
    status: 'pending_confirm_change',
    contact: '张伟',
    phone: '13812345678',
    address: '上海市静安区南京西路789号',
  },
  {
    id: 14,
    projectId: 4,
    projectName: '星巴克上海臻选烘焙工坊',
    scheduledAt: '2026-09-02 14:00',
    countdown: '4天',
    status: 'pending_visit',
    contact: '张伟',
    phone: '13812345678',
    address: '上海市静安区南京西路789号',
  },
  {
    id: 15,
    projectId: 5,
    projectName: '星巴克深圳海岸城店',
    scheduledAt: '2026-08-28 18:00',
    countdown: '-16小时',
    status: 'appointment_abnormal',
    contact: '李娜',
    phone: '13987654321',
    address: '深圳市南山区文心五路33号',
  },
];

export function useAppointments(projectId: Ref<number>) {
  const projectAppointments = computed(() =>
    appointments.filter((item) => item.projectId === projectId.value),
  );

  return {
    appointments: projectAppointments,
  };
}
