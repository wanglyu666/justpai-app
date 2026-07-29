export interface RefundLineItem {
  id: string;
  specialty: string;
  subjectCode: string;
  subjectName: string;
  calcRule: string;
  brand: string;
  series: string;
  spec: string;
  description: string;
  unit: string;
  unitPrice: string;
}

export const refundReasons = [
  '拍错/不想要了',
  '商品有质量问题',
  '与描述不符',
  '服务不满意',
  '发货太慢',
  '其他原因',
];

const refundItemsByOrder: Record<string, RefundLineItem[]> = {
  'order-3': [
    {
      id: 'line-3-1',
      specialty: '装饰',
      subjectCode: 'KM-0003',
      subjectName: 'MALM 床架',
      calcRule: '按项计',
      brand: '宜家',
      series: 'MALM',
      spec: '标准款',
      description: '双人床架，含基础安装与调试',
      unit: '项',
      unitPrice: '680.00',
    },
    {
      id: 'line-3-2',
      specialty: '装饰',
      subjectCode: 'KM-0004',
      subjectName: 'MALM 床头柜',
      calcRule: '按项计',
      brand: '宜家',
      series: 'MALM',
      spec: '标准款',
      description: '床头柜 2 件，含配送上楼',
      unit: '项',
      unitPrice: '320.00',
    },
    {
      id: 'line-3-3',
      specialty: '装饰',
      subjectCode: 'KM-0005',
      subjectName: 'MALM 衣柜',
      calcRule: '按项计',
      brand: '宜家',
      series: 'MALM',
      spec: '标准款',
      description: '三门衣柜，含现场组装',
      unit: '项',
      unitPrice: '280.00',
    },
  ],
  'order-4': [
    {
      id: 'line-4-1',
      specialty: '装饰',
      subjectCode: 'KM-0003',
      subjectName: 'Hemlingby 双人沙发',
      calcRule: '按项计',
      brand: '宜家',
      series: 'Hemlingby',
      spec: '标准款',
      description: '双人沙发，含基础安装与现场验收',
      unit: '项',
      unitPrice: '630.00',
    },
    {
      id: 'line-4-2',
      specialty: '装饰',
      subjectCode: 'KM-0006',
      subjectName: 'BILLY 书柜',
      calcRule: '按项计',
      brand: '宜家',
      series: 'BILLY',
      spec: '标准款',
      description: '书柜 1 组，含固定安装',
      unit: '项',
      unitPrice: '260.00',
    },
  ],
};

export const getRefundItemsForOrder = (orderId: string) =>
  refundItemsByOrder[orderId] ?? refundItemsByOrder['order-4'] ?? [];
