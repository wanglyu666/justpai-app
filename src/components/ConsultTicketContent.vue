<template>
  <view class="consult-ticket">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
      <view class="search-bar">
        <image src="/static/icons/search.svg" mode="aspectFit" class="search-icon" />
        <input
          class="search-input"
          type="text"
          v-model="keyword"
          placeholder="搜索咨询单"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">咨询单</text>
          <text class="page-desc">查看全部咨询单信息</text>
        </view>
        <view class="add-btn" @click="onAdd">
          <text class="add-btn-text">新增</text>
        </view>
      </view>

      <StatusCapsuleSwitch
        class="status-capsule-wrap"
        v-model="activeStatus"
        :tabs="statusTabs"
        equal
      />

      <view class="ticket-list">
        <view
          v-for="item in filteredTickets"
          :key="item.id"
          class="ticket-card"
          @click="openDetail(item)"
        >
          <text class="ticket-name">{{ item.name }}</text>

          <view class="ticket-field">
            <text class="field-label">咨询时间</text>
            <text class="field-value">{{ item.time }}</text>
          </view>

          <view class="ticket-field">
            <text class="field-label">需求</text>
            <text class="field-value field-value-demand">{{ item.demand }}</text>
          </view>
        </view>

        <view v-if="filteredTickets.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关咨询单</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="detailVisible"
      :z-index="1200"
      @closed="resetDetail"
    >
      <view class="sheet-page sheet-page--with-footer" v-if="selectedTicket">
        <view class="sheet-page__header">
          <view class="sheet-page__back-btn" @click="closeDetail">
            <image
              src="/static/icons/chevron-left.svg"
              mode="aspectFit"
              class="sheet-page__back-icon"
            />
          </view>
        </view>

        <view class="sheet-page__body">
          <text class="sheet-page__title">咨询详情</text>

          <view class="info-card">
            <view class="info-row">
              <view class="info-field">
                <text class="info-label">期望勘查时间</text>
                <text class="info-value">{{ selectedTicket.surveyDate }}</text>
              </view>
              <view class="info-field">
                <text class="info-label">期望服务开始时间</text>
                <text class="info-value">{{ selectedTicket.serviceStartDate }}</text>
              </view>
            </view>

            <view class="info-row">
              <view class="info-field">
                <text class="info-label">工期</text>
                <text class="info-value">{{ selectedTicket.duration }}</text>
              </view>
              <view class="info-field">
                <text class="info-label">报价</text>
                <text class="info-value">{{ selectedTicket.quote }}</text>
              </view>
            </view>

            <view class="info-row">
              <view class="info-field info-field-full">
                <text class="info-label">服务地址</text>
                <text class="info-value">{{ selectedTicket.address }}</text>
              </view>
            </view>

            <view class="info-row">
              <view class="info-field info-field-full">
                <text class="info-label">需求</text>
                <text class="info-value info-value-body">{{ selectedTicket.demand }}</text>
              </view>
            </view>
          </view>

          <view class="info-card">
            <text class="card-heading">报价时间的确认</text>
            <view class="info-row">
              <view class="info-field">
                <text class="info-label">是否需要报价</text>
                <text class="info-value">{{ selectedTicket.needQuote }}</text>
              </view>
              <view class="info-field">
                <text class="info-label">报价时间</text>
                <text class="info-value">{{ selectedTicket.quoteTime }}</text>
              </view>
            </view>
          </view>

          <view class="section-card">
            <view class="section-head">
              <view class="section-bar" />
              <text class="section-title">附件</text>
            </view>

            <view v-if="selectedTicket.attachments.length" class="attachment-grid">
              <view
                v-for="(file, index) in selectedTicket.attachments"
                :key="`${file}-${index}`"
                class="attachment-item"
              >
                <view class="attachment-ext" :class="`ext-${fileKind(file)}`">
                  <text class="attachment-ext-text">{{ fileExt(file) }}</text>
                </view>
                <text class="attachment-name">{{ file }}</text>
              </view>
            </view>
            <text v-else class="section-empty">暂无附件</text>
          </view>

          <view class="action-card-row">
            <view class="action-card" @click="onChecklist">
              <text class="action-card-text">清单</text>
            </view>
            <view class="action-card" @click="onInquiry">
              <text class="action-card-text">询价</text>
            </view>
          </view>
        </view>

        <view class="sheet-page__footer">
          <view class="end-btn" @click="onEndConsult">
            <text class="end-btn-text">结束咨询</text>
          </view>
        </view>
      </view>
    </BottomSheetPanel>

    <BottomSheetPanel
      :show="inquiryVisible"
      :z-index="1300"
      @closed="resetInquiry"
    >
      <ConsultInquiryContent
        v-if="selectedTicket"
        :messages="inquiryMessages"
        @back="closeInquiry"
        @short-chat-submit="handleShortChatSubmit"
      />
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import ConsultInquiryContent, {
  type InquiryMessage,
} from '@/components/ConsultInquiryContent.vue';
import { useSlideOver } from '@/composables/useSlideOver';

type ConsultStatus = 'pending_reply' | 'in_progress' | 'closed';

type ConsultTicket = {
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

const emit = defineEmits<{
  back: [];
}>();

const keyword = ref('');
const activeStatus = ref<ConsultStatus>('pending_reply');
const selectedTicket = ref<ConsultTicket | null>(null);
const {
  visible: detailVisible,
  open: openDetailPanel,
  close: closeDetail,
} = useSlideOver();
const {
  visible: inquiryVisible,
  open: openInquiryPanel,
  close: closeInquiry,
} = useSlideOver();

const inquiryMessages = computed(
  () => selectedTicket.value?.inquiryMessages ?? [],
);

const statusTabs: { id: ConsultStatus; label: string }[] = [
  { id: 'pending_reply', label: '待回复' },
  { id: 'in_progress', label: '进行中' },
  { id: 'closed', label: '已结束' },
];

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

const filteredTickets = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  return tickets.value.filter((item) => {
    if (item.status !== activeStatus.value) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.demand.toLowerCase().includes(q) ||
      item.time.toLowerCase().includes(q)
    );
  });
});

const fileExt = (name: string) => {
  const index = name.lastIndexOf('.');
  if (index < 0) return 'FILE';
  return name.slice(index + 1).toUpperCase();
};

const fileKind = (name: string) => {
  const ext = fileExt(name).toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'avi'].includes(ext)) return 'video';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'sheet';
  return 'file';
};

const openDetail = (item: ConsultTicket) => {
  selectedTicket.value = item;
  openDetailPanel();
};

const resetDetail = () => {
  selectedTicket.value = null;
};

const handleBack = () => {
  emit('back');
};

const onAdd = () => {
  // TODO: open create consult form
};

const onChecklist = () => {
  // TODO: open checklist
};

const onInquiry = () => {
  openInquiryPanel();
};

const resetInquiry = () => {
  // keep selectedTicket for detail page underneath
};

const handleShortChatSubmit = (payload: {
  content: string;
  attachments: string[];
}) => {
  if (!selectedTicket.value) return;

  const pad = (n: number) => String(n).padStart(2, '0');
  const d = new Date();
  const sendTime = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const nextId =
    Math.max(0, ...selectedTicket.value.inquiryMessages.map((item) => item.id)) + 1;

  const nextMessage: InquiryMessage = {
    id: nextId,
    sender: '我',
    sendTime,
    content: payload.content,
    attachmentName: payload.attachments[0] || '',
  };

  selectedTicket.value = {
    ...selectedTicket.value,
    inquiryMessages: [nextMessage, ...selectedTicket.value.inquiryMessages],
  };

  tickets.value = tickets.value.map((item) =>
    item.id === selectedTicket.value?.id ? selectedTicket.value! : item,
  );
};

const onEndConsult = () => {
  // TODO: end consultation
};
</script>

<style scoped>
.consult-ticket {
  min-height: 100%;
  padding-bottom: 80rpx;
  box-sizing: border-box;
}

.page-header {
  padding: 0 48rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.icon-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.header-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.search-bar {
  width: 336rpx;
  flex-shrink: 0;
  margin-left: auto;
  height: 88rpx;
  background-color: #ffffff;
  border-radius: 1998rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}

.search-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #111827;
  height: 100%;
}

.search-placeholder {
  color: #9ca3af;
  font-size: 28rpx;
}

.content {
  padding: 64rpx 48rpx 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.title-block {
  flex: 1;
  min-width: 0;
}

.page-title {
  display: block;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.page-desc {
  display: block;
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.add-btn {
  flex-shrink: 0;
  height: 88rpx;
  padding: 0 48rpx;
  border-radius: 28rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.status-capsule-wrap {
  margin-bottom: 48rpx;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.ticket-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.ticket-name {
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.ticket-field {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.field-label {
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.field-value {
  font-size: 30rpx;
  font-weight: 500;
  color: #111827;
  line-height: 1.45;
}

.field-value-demand {
  font-weight: 400;
  color: #374151;
  line-height: 1.55;
}

.empty-tip {
  padding: 96rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-tip-text {
  font-size: 28rpx;
  color: #9ca3af;
}

.sheet-page__body {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.info-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 36rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
}

.card-heading {
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}

.info-row {
  display: flex;
  gap: 32rpx;
}

.info-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-field-full {
  flex: 1 1 100%;
}

.info-label {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.info-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
  word-break: break-all;
}

.info-value-body {
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.55;
}

.section-card {
  background-color: #ffffff;
  border-radius: 44rpx;
  padding: 36rpx;
  box-sizing: border-box;
  box-shadow: 0 16rpx 48rpx rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.section-bar {
  width: 8rpx;
  height: 28rpx;
  border-radius: 4rpx;
  background-color: #9fe870;
  flex-shrink: 0;
}

.section-title {
  font-size: 28rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.section-empty {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.attachment-grid {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.attachment-item {
  width: 100%;
  min-height: 96rpx;
  padding: 20rpx 24rpx;
  border-radius: 28rpx;
  background-color: #f8fafc;
  border: 2rpx solid #eef2f7;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.attachment-ext {
  width: 80rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #e5e7eb;
}

.attachment-ext-text {
  font-size: 20rpx;
  font-weight: 800;
  color: #374151;
  line-height: 1;
}

.ext-pdf {
  background-color: #fee2e2;
}

.ext-pdf .attachment-ext-text {
  color: #b91c1c;
}

.ext-image {
  background-color: #dbeafe;
}

.ext-image .attachment-ext-text {
  color: #1d4ed8;
}

.ext-video {
  background-color: #ede9fe;
}

.ext-video .attachment-ext-text {
  color: #6d28d9;
}

.ext-sheet {
  background-color: #dcfce7;
}

.ext-sheet .attachment-ext-text {
  color: #15803d;
}

.attachment-name {
  flex: 1;
  min-width: 0;
  font-size: 26rpx;
  font-weight: 600;
  color: #111827;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-card-row {
  display: flex;
  gap: 24rpx;
}

.action-card {
  flex: 1;
  min-height: 144rpx;
  border-radius: 40rpx;
  background-color: #ffffff;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.action-card-text {
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.end-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  background-color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
}

.end-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}
</style>
