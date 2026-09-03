import { ref } from 'vue';

export type DefectReportStatus = 'pending_reply' | 'in_progress' | 'closed' | 'rejected';

export type DefectReportItem = {
  id: number;
  projectId: number;
  name: string;
  time: string;
  status: DefectReportStatus;
  content: string;
  plannedAt: string;
  actualAt: string;
  defectPhotos: string[];
  fixPhotos: string[];
};

export const DEFECT_REPORT_STATUS_LABEL: Record<DefectReportStatus, string> = {
  pending_reply: '待处理',
  in_progress: '处理中',
  closed: '已关闭',
  rejected: '不通过',
};

const defectItems = ref<DefectReportItem[]>([
  {
    id: 1,
    projectId: 1,
    name: '墙面空鼓待整改',
    time: '2026-08-28 14:20',
    status: 'pending_reply',
    content: '客厅西侧墙面敲击有空鼓，面积约 0.6㎡，需铲除后重新找平批腻。',
    plannedAt: '2026-09-05',
    actualAt: '',
    defectPhotos: ['空鼓位置.jpg', '敲击记录.mp4'],
    fixPhotos: [],
  },
  {
    id: 2,
    projectId: 1,
    name: '卫生间防水渗漏',
    time: '2026-08-25 10:05',
    status: 'in_progress',
    content: '二楼卫生间闭水试验后楼下顶棚有水渍，怀疑防水层破损。',
    plannedAt: '2026-09-02',
    actualAt: '',
    defectPhotos: ['渗漏照片.jpg', '闭水试验记录.pdf'],
    fixPhotos: [],
  },
  {
    id: 3,
    projectId: 1,
    name: '门套安装偏差',
    time: '2026-08-18 16:40',
    status: 'closed',
    content: '主卧门套垂直度超差 4mm，关扇有摩擦。',
    plannedAt: '2026-08-22',
    actualAt: '2026-08-21',
    defectPhotos: ['门套实测.jpg'],
    fixPhotos: ['整改后-门套.jpg'],
  },
  {
    id: 5,
    projectId: 1,
    name: '吊顶接缝开裂',
    time: '2026-08-10 11:15',
    status: 'rejected',
    content: '客厅吊顶接缝处出现开裂，复查后材料与工艺均不符合验收要求。',
    plannedAt: '2026-08-16',
    actualAt: '',
    defectPhotos: ['吊顶开裂.jpg'],
    fixPhotos: [],
  },
  {
    id: 4,
    projectId: 2,
    name: '软包色差复查',
    time: '2026-08-12 09:30',
    status: 'pending_reply',
    content: '沙发背景软包与样品存在可见色差，需确认是否换料。',
    plannedAt: '2026-08-20',
    actualAt: '',
    defectPhotos: ['现场对比.jpg', '样品照片.jpg'],
    fixPhotos: [],
  },
]);

const formatNow = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const nameFromContent = (content: string) => {
  const text = content.trim().replace(/\s+/g, ' ');
  if (!text) return '未命名缺陷';
  return text.length > 20 ? `${text.slice(0, 20)}…` : text;
};

export function useDefectReports() {
  const addDefect = (payload: {
    projectId: number;
    content: string;
    attachments: string[];
  }) => {
    const nextId = Math.max(0, ...defectItems.value.map((item) => item.id)) + 1;
    defectItems.value = [
      {
        id: nextId,
        projectId: payload.projectId,
        name: nameFromContent(payload.content),
        time: formatNow(),
        status: 'pending_reply',
        content: payload.content,
        plannedAt: '',
        actualAt: '',
        defectPhotos: payload.attachments,
        fixPhotos: [],
      },
      ...defectItems.value,
    ];
  };

  const removeDefect = (id: number) => {
    defectItems.value = defectItems.value.filter((item) => item.id !== id);
  };

  const getByProject = (projectId: number) =>
    defectItems.value.filter((item) => item.projectId === projectId);

  return {
    items: defectItems,
    addDefect,
    removeDefect,
    getByProject,
  };
}
