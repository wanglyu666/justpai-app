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
  productName: string;
  productImage: string;
  itemCount: number;
  orderTime: string;
  serviceAddress: string;
  amount: string;
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
    serviceAddress: '上海市浦东新区张江路 88 号 3 栋 1201 室',
    amount: '630.00',
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
    serviceAddress: '上海市浦东新区张江路 88 号 3 栋 1201 室',
    amount: '630.00',
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
];

export const getOrdersByStatus = (status: OrderStatusId) => {
  if (status === 'all') return mockOrders;
  return mockOrders.filter((order) => order.status === status);
};

export const getOrderById = (orderId: string) =>
  mockOrders.find((order) => order.id === orderId) ?? null;
