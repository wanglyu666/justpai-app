import { ref } from 'vue';

export type FeedbackStatus = 'pending_reply' | 'in_progress' | 'closed';

export type FeedbackItem = {
  id: number;
  name: string;
  time: string;
  status: FeedbackStatus;
  content: string;
  attachments: string[];
  result: string;
};

const feedbackItems = ref<FeedbackItem[]>([
  {
    id: 1,
    name: '精装房改造工期与进场条件',
    time: '2026-03-27 09:15',
    status: 'pending_reply',
    content: '确认最短施工周期、物业报批材料清单及周末是否可静音施工。',
    attachments: [
      '精装户型-平面图.pdf',
      '现场照片-客厅.jpg',
      '现场照片-厨房.jpg',
      '现场巡场记录.mp4',
    ],
    result:
      '已邮件回复物业报批材料清单模板；周末静音施工时段需物业书面确认后执行，预计 2 个工作日内反馈。',
  },
  {
    id: 2,
    name: '办公楼暖通方案咨询',
    time: '2026-03-26 10:05',
    status: 'pending_reply',
    content: '希望确认办公楼暖通改造方案的可行性、预算区间与工期安排。',
    attachments: ['暖通方案初稿.pdf', '楼层平面图.jpg'],
    result: '',
  },
  {
    id: 3,
    name: '机房精密空调改造咨询',
    time: '2026-03-20 16:40',
    status: 'in_progress',
    content: '现有精密空调制冷量不足，需评估扩容或更换方案，并确认停电窗口。',
    attachments: ['机房现场照片.jpg', '设备铭牌.jpg'],
    result: '已安排工程师现场勘察，方案预计本周内出具。',
  },
  {
    id: 4,
    name: '年框续约服务咨询',
    time: '2026-03-15 09:18',
    status: 'in_progress',
    content: '咨询年框续约价格、服务范围调整及付款节点。',
    attachments: ['上年合同扫描件.pdf'],
    result: '商务侧已同步报价草稿，待客户确认服务范围后签署。',
  },
  {
    id: 5,
    name: '冷站节能优化咨询',
    time: '2026-02-28 11:30',
    status: 'closed',
    content: '希望评估冷站群控策略优化空间，并给出节能量测算。',
    attachments: ['能耗月报.xlsx', '冷站运行日志.pdf'],
    result: '已完成节能测算并交付报告，项目已关闭。',
  },
  {
    id: 6,
    name: '新项目立项设备咨询',
    time: '2026-02-12 15:55',
    status: 'closed',
    content: '新项目立项阶段需确认主机选型与供货周期。',
    attachments: [],
    result: '已提供选型清单与交期说明，反馈关闭。',
  },
]);

const formatNow = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function useFeedbackItems() {
  const addFeedback = (payload: {
    projectName: string;
    content: string;
    attachments: string[];
  }) => {
    const nextId = Math.max(0, ...feedbackItems.value.map((item) => item.id)) + 1;
    feedbackItems.value = [
      {
        id: nextId,
        name: payload.projectName,
        time: formatNow(),
        status: 'pending_reply',
        content: payload.content,
        attachments: payload.attachments,
        result: '',
      },
      ...feedbackItems.value,
    ];
  };

  return {
    items: feedbackItems,
    addFeedback,
  };
}
