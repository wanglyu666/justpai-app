import { ref } from 'vue';
import type { InquiryMessage } from '@/components/ConsultInquiryContent.vue';
import type { ConsultTicketFormPayload } from '@/components/ConsultTicketFormContent.vue';

export type ConsultStatus = 'pending_reply' | 'in_progress' | 'closed';

export type ConsultTicket = {
  id: number;
  name: string;
  time: string;
  demand: string;
  status: ConsultStatus;
  surveyDate: string;
  serviceStartDate: string;
  duration: string;
  quote: string;
  address: string;
  needQuote: string;
  quoteTime: string;
  attachments: string[];
  inquiryMessages: InquiryMessage[];
};

const tickets = ref<ConsultTicket[]>([
  {
    id: 1,
    name: '门店空调系统选型咨询',
    time: '2026-03-28 14:20',
    demand: '需要了解多联机与风冷模块机在本项目中的适用性，并给出大致造价区间供立项参考。',
    status: 'pending_reply',
    surveyDate: '2026-03-22',
    serviceStartDate: '2026-03-28',
    duration: '18 天',
    quote: '暂无报价',
    address: '上海市静安区曹家渡街道智慧广场 (武宁南路)',
    needQuote: '否',
    quoteTime: '暂无',
    attachments: ['门店平面图.pdf', '现场照片-机房.jpg', '选型需求说明.docx'],
    inquiryMessages: [
      {
        id: 1,
        sender: '王磊',
        sendTime: '2026-03-28 15:30',
        content:
          '您好，关于多联机与风冷模块机在本项目中的适用性，我们已请技术同事做了初步评估，请查收附件中的方案摘要...',
        attachmentName: '空调选型初稿.pdf',
      },
      {
        id: 2,
        sender: '李婷',
        sendTime: '2026-03-28 16:10',
        content:
          '补充说明：若场地层高受限，建议优先评估风冷模块机方案，附件中含两种方案的造价对比。',
        attachmentName: '造价对比表.xlsx',
      },
    ],
  },
  {
    id: 2,
    name: '办公楼暖通方案咨询',
    time: '2026-03-26 10:05',
    demand: '希望评估集中式与分体式方案的能耗差异，并提供设备选型清单与交付周期建议。',
    status: 'pending_reply',
    surveyDate: '2026-03-20',
    serviceStartDate: '2026-03-26',
    duration: '12 天',
    quote: '暂无报价',
    address: '上海市徐汇区漕河泾开发区科技绿洲',
    needQuote: '是',
    quoteTime: '2026-03-30',
    attachments: ['暖通方案初稿.pdf', '楼层平面图.jpg'],
    inquiryMessages: [
      {
        id: 1,
        sender: '陈凯',
        sendTime: '2026-03-26 11:20',
        content:
          '您好，集中式与分体式方案的能耗测算已完成，请查收附件中的对比报告与选型建议。',
        attachmentName: '能耗对比报告.pdf',
      },
    ],
  },
  {
    id: 3,
    name: '机房精密空调改造咨询',
    time: '2026-03-20 16:40',
    demand: '现有机房制冷能力不足，需要改造方案，包含冗余设计、施工窗口与预算评估。',
    status: 'in_progress',
    surveyDate: '2026-03-15',
    serviceStartDate: '2026-03-25',
    duration: '25 天',
    quote: '¥86,000',
    address: '上海市浦东新区张江高科技园区',
    needQuote: '是',
    quoteTime: '2026-03-18',
    attachments: ['机房现场照片.jpg', '设备铭牌.jpg'],
    inquiryMessages: [
      {
        id: 1,
        sender: '赵强',
        sendTime: '2026-03-20 18:05',
        content:
          '您好，机房改造方案初稿已整理完成，含冗余配置与施工窗口建议，请查收附件。',
        attachmentName: '机房改造方案.pdf',
      },
    ],
  },
  {
    id: 4,
    name: '年框续约服务咨询',
    time: '2026-03-15 09:18',
    demand: '了解续约后的服务范围、响应时效及驻场支持是否可按需增减。',
    status: 'in_progress',
    surveyDate: '2026-03-10',
    serviceStartDate: '2026-04-01',
    duration: '30 天',
    quote: '¥128,000',
    address: '上海市黄浦区外滩中心',
    needQuote: '是',
    quoteTime: '2026-03-12',
    attachments: ['上年合同扫描件.pdf'],
    inquiryMessages: [
      {
        id: 1,
        sender: '周敏',
        sendTime: '2026-03-15 10:40',
        content:
          '您好，续约服务范围与报价明细已整理，驻场支持可按需增减，请查收附件。',
        attachmentName: '续约报价明细.pdf',
      },
    ],
  },
  {
    id: 5,
    name: '冷站节能优化咨询',
    time: '2026-02-28 11:30',
    demand: '希望针对现有冷站进行能效诊断，并输出可落地的优化措施与预期节省测算。',
    status: 'closed',
    surveyDate: '2026-02-20',
    serviceStartDate: '2026-03-01',
    duration: '20 天',
    quote: '¥45,000',
    address: '上海市闵行区虹桥商务区',
    needQuote: '是',
    quoteTime: '2026-02-25',
    attachments: ['能耗月报.xlsx', '冷站运行日志.pdf'],
    inquiryMessages: [
      {
        id: 1,
        sender: '孙浩',
        sendTime: '2026-02-28 14:15',
        content:
          '您好，冷站能效诊断报告已完成，优化措施与节省测算见附件，请查收。',
        attachmentName: '能效诊断报告.pdf',
      },
    ],
  },
  {
    id: 6,
    name: '新项目立项设备咨询',
    time: '2026-02-12 15:55',
    demand: '项目处于立项阶段，需要设备配置建议、关键参数说明及大致投资区间。',
    status: 'closed',
    surveyDate: '2026-02-08',
    serviceStartDate: '2026-02-18',
    duration: '10 天',
    quote: '¥22,000',
    address: '杭州市西湖区西溪湿地园区',
    needQuote: '否',
    quoteTime: '暂无',
    attachments: [],
    inquiryMessages: [
      {
        id: 1,
        sender: '王磊',
        sendTime: '2026-02-12 17:20',
        content:
          '您好，立项阶段设备配置建议与投资区间说明已整理完毕，请查收附件。',
        attachmentName: '设备配置建议.pdf',
      },
    ],
  },
]);

const formatNow = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function useConsultTickets() {
  const addConsultTicket = (payload: ConsultTicketFormPayload) => {
    const name =
      payload.demand.length > 18
        ? `${payload.demand.slice(0, 18)}…`
        : payload.demand;
    const nextId = Math.max(0, ...tickets.value.map((item) => item.id)) + 1;

    tickets.value = [
      {
        id: nextId,
        name,
        time: formatNow(),
        demand: payload.demand,
        status: 'pending_reply',
        surveyDate: payload.surveyDate || '暂无',
        serviceStartDate: payload.serviceStartDate,
        duration: `${payload.duration} 天`,
        quote: payload.needQuote ? '待报价' : '不需要',
        address: payload.address,
        needQuote: payload.needQuote ? '是' : '否',
        quoteTime: '暂无',
        attachments: [...payload.attachments],
        inquiryMessages: [],
      },
      ...tickets.value,
    ];
  };

  return {
    tickets,
    addConsultTicket,
  };
}
