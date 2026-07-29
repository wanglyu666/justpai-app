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
  payDeadline: string;
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
];

export const getOrdersByStatus = (status: OrderStatusId) => {
  if (status === 'all') return mockOrders;
  return mockOrders.filter((order) => order.status === status);
};
