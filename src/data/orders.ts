export type OrderStatusId =
  | 'all'
  | 'pending'
  | 'signed'
  | 'service'
  | 'completed'
  | 'cancelled'
  | 'reviewed';

export interface OrderRecord {
  id: string;
  orderNo: string;
  contractNo: string;
  status: Exclude<OrderStatusId, 'all'>;
  payDeadline?: string;
  signedAt?: string;
  serviceStartedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  productName: string;
  productImage: string;
  itemCount: number;
  orderTime: string;
  serviceAddress: string;
  amount: string;
  contactName?: string;
  contactPhone?: string;
}

export const mockOrders: OrderRecord[] = [
  {
    id: 'order-1',
    orderNo: 'JS-20260709-142',
    contractNo: 'HT-20260709-501',
    status: 'pending',
    payDeadline: '2026/07/12 23:59',
    productName: 'Hemlingby 双人沙发',
    productImage:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop',
    itemCount: 1,
    orderTime: '2026/07/09 11:20',
    serviceAddress: '北京市海淀区中关村大街 1 号海龙大厦 3 层',
    amount: '630.00',
    contactName: '管理员',
    contactPhone: '138-0013-8000',
  },
  {
    id: 'order-2',
    orderNo: 'JS-20260709-142',
    contractNo: 'HT-20260709-501',
    status: 'pending',
    payDeadline: '2026/07/12 23:59',
    productName: 'Poäng 摇椅 等 2 件商品',
    productImage:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop',
    itemCount: 2,
    orderTime: '2026/07/09 11:20',
    serviceAddress: '北京市海淀区中关村大街 1 号海龙大厦 3 层',
    amount: '630.00',
    contactName: '管理员',
    contactPhone: '138-0013-8000',
  },
  {
    id: 'order-3',
    orderNo: 'JS-20260710-088',
    contractNo: 'HT-20260710-312',
    status: 'signed',
    signedAt: '2026/07/10 14:30',
    productName: 'MALM 卧室套装',
    productImage:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop',
    itemCount: 3,
    orderTime: '2026/07/10 09:15',
    serviceAddress: '上海市静安区南京西路 1266 号 8 栋 502 室',
    amount: '1280.00',
  },
  {
    id: 'order-4',
    orderNo: 'JS-20260711-056',
    contractNo: 'HT-20260711-204',
    status: 'signed',
    signedAt: '2026/07/11 16:45',
    productName: 'BILLY 书柜 等 2 件商品',
    productImage:
      'https://images.unsplash.com/photo-1594620302200-9a7622441566?q=80&w=600&auto=format&fit=crop',
    itemCount: 2,
    orderTime: '2026/07/11 10:20',
    serviceAddress: '上海市徐汇区漕溪北路 331 号 2 栋 1803 室',
    amount: '890.00',
  },
  {
    id: 'order-5',
    orderNo: 'JS-20260712-201',
    contractNo: 'HT-20260712-418',
    status: 'service',
    serviceStartedAt: '2026/07/12 09:00',
    productName: 'KALLAX 搁架单元',
    productImage:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop',
    itemCount: 1,
    orderTime: '2026/07/11 18:30',
    serviceAddress: '广州市天河区体育西路 103 号 15 栋 1201 室',
    amount: '450.00',
    contactName: '管理员',
    contactPhone: '138-0013-8000',
  },
  {
    id: 'order-6',
    orderNo: 'JS-20260713-067',
    contractNo: 'HT-20260713-529',
    status: 'service',
    serviceStartedAt: '2026/07/13 14:20',
    productName: 'LACK 茶几 等 2 件商品',
    productImage:
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=600&auto=format&fit=crop',
    itemCount: 2,
    orderTime: '2026/07/13 10:05',
    serviceAddress: '深圳市南山区科技园南路 18 号 6 栋 803 室',
    amount: '760.00',
    contactName: '管理员',
    contactPhone: '138-0013-8000',
  },
  {
    id: 'order-7',
    orderNo: 'JS-20260714-118',
    contractNo: 'HT-20260714-336',
    status: 'completed',
    completedAt: '2026/07/14 17:30',
    productName: 'NORDLI 六斗抽屉柜',
    productImage:
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop',
    itemCount: 1,
    orderTime: '2026/07/12 15:40',
    serviceAddress: '杭州市西湖区文三路 478 号 9 栋 602 室',
    amount: '980.00',
    contactName: '管理员',
    contactPhone: '138-0013-8000',
  },
  {
    id: 'order-8',
    orderNo: 'JS-20260715-042',
    contractNo: 'HT-20260715-711',
    status: 'completed',
    completedAt: '2026/07/15 11:15',
    productName: 'STOCKHOLM 2025 地毯 等 2 件商品',
    productImage:
      'https://images.unsplash.com/photo-1600166896089-009adc1cbd40?q=80&w=600&auto=format&fit=crop',
    itemCount: 2,
    orderTime: '2026/07/13 09:20',
    serviceAddress: '成都市武侯区人民南路 88 号 3 栋 1506 室',
    amount: '1120.00',
    contactName: '管理员',
    contactPhone: '138-0013-8000',
  },
  {
    id: 'order-9',
    orderNo: 'JS-20260716-033',
    contractNo: 'HT-20260716-128',
    status: 'cancelled',
    cancelledAt: '2026/07/16 10:20',
    productName: 'EKTORP 三人沙发',
    productImage:
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=600&auto=format&fit=crop',
    itemCount: 1,
    orderTime: '2026/07/15 20:15',
    serviceAddress: '南京市鼓楼区中山北路 88 号 12 栋 903 室',
    amount: '1580.00',
    contactName: '管理员',
    contactPhone: '138-0013-8000',
  },
  {
    id: 'order-10',
    orderNo: 'JS-20260717-074',
    contractNo: 'HT-20260717-602',
    status: 'cancelled',
    cancelledAt: '2026/07/17 15:45',
    productName: 'HEMNES 床架 等 2 件商品',
    productImage:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop',
    itemCount: 2,
    orderTime: '2026/07/16 14:30',
    serviceAddress: '武汉市江汉区解放大道 688 号 5 栋 1102 室',
    amount: '2150.00',
    contactName: '管理员',
    contactPhone: '138-0013-8000',
  },
];

export const getOrdersByStatus = (status: OrderStatusId) => {
  if (status === 'all') return mockOrders;
  return mockOrders.filter((order) => order.status === status);
};

export const getOrderById = (orderId: string) =>
  mockOrders.find((order) => order.id === orderId) ?? null;
