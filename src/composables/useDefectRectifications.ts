import { ref } from 'vue';

export type DefectRectificationStatus =
  | 'pending_reply'
  | 'in_progress'
  | 'closed'
  | 'rejected';

export type DefectRectificationItem = {
  id: number;
  acceptanceItemId: string;
  name: string;
  time: string;
  status: DefectRectificationStatus;
  content: string;
  plannedAt: string;
  actualAt: string;
  defectPhotos: string[];
  fixPhotos: string[];
};

export const DEFECT_RECTIFICATION_STATUS_LABEL: Record<
  DefectRectificationStatus,
  string
> = {
  pending_reply: '待处理',
  in_progress: '处理中',
  closed: '已关闭',
  rejected: '不通过',
};

const rectificationItems = ref<DefectRectificationItem[]>([
  {
    id: 1,
    acceptanceItemId: 'prg-1',
    name: '竣工墙面修补不到位',
    time: '2026-02-02 09:40',
    status: 'pending_reply',
    content: '竣工验收时客厅阴角批腻发空，约 0.4㎡，需铲除后重新找平。',
    plannedAt: '2026-02-10',
    actualAt: '',
    defectPhotos: ['阴角空鼓.jpg'],
    fixPhotos: [],
  },
  {
    id: 2,
    acceptanceItemId: 'prg-1',
    name: '踢脚线缝隙超差',
    time: '2026-02-01 16:15',
    status: 'in_progress',
    content: '走廊踢脚线与地面缝隙超过 3mm，需重新收口。',
    plannedAt: '2026-02-08',
    actualAt: '',
    defectPhotos: ['踢脚缝隙.jpg', '实测记录.pdf'],
    fixPhotos: [],
  },
  {
    id: 3,
    acceptanceItemId: 'prg-5',
    name: '乳胶漆色差复查',
    time: '2026-01-26 11:20',
    status: 'rejected',
    content: '主卧墙面与样板存在可见色差，复查后仍不通过。',
    plannedAt: '2026-02-02',
    actualAt: '',
    defectPhotos: ['现场对比.jpg'],
    fixPhotos: [],
  },
  {
    id: 4,
    acceptanceItemId: 'prg-2',
    name: '防水附加层漏做',
    time: '2025-12-19 14:05',
    status: 'closed',
    content: '卫生间管根附加层漏做，已按要求补做并通过复查。',
    plannedAt: '2025-12-22',
    actualAt: '2025-12-21',
    defectPhotos: ['管根原状.jpg'],
    fixPhotos: ['整改后-管根.jpg'],
  },
]);

const formatNow = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const nameFromContent = (content: string) => {
  const text = content.trim().replace(/\s+/g, ' ');
  if (!text) return '未命名整改';
  return text.length > 20 ? `${text.slice(0, 20)}…` : text;
};

export function useDefectRectifications() {
  const addRectification = (payload: {
    acceptanceItemId: string;
    content: string;
    attachments: string[];
  }) => {
    const nextId = Math.max(0, ...rectificationItems.value.map((item) => item.id)) + 1;
    rectificationItems.value = [
      {
        id: nextId,
        acceptanceItemId: payload.acceptanceItemId,
        name: nameFromContent(payload.content),
        time: formatNow(),
        status: 'pending_reply',
        content: payload.content,
        plannedAt: '',
        actualAt: '',
        defectPhotos: payload.attachments,
        fixPhotos: [],
      },
      ...rectificationItems.value,
    ];
  };

  const removeRectification = (id: number) => {
    rectificationItems.value = rectificationItems.value.filter((item) => item.id !== id);
  };

  const getByAcceptance = (acceptanceItemId: string) =>
    rectificationItems.value.filter((item) => item.acceptanceItemId === acceptanceItemId);

  return {
    items: rectificationItems,
    addRectification,
    removeRectification,
    getByAcceptance,
  };
}
