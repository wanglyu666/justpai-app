import { ref } from 'vue';
import type { ProductDetail } from '@/components/ProductDetailContent.vue';

export type CartItem = {
  cartKey: string;
  productId: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  spec: string;
  quantity: number;
  selected: boolean;
};

type CartParams = {
  model: string;
  spec: string;
  color: string;
};

const cartItems = ref<CartItem[]>([]);

const buildCartKey = (productId: number, params: CartParams) =>
  `${productId}-${params.model}-${params.spec}-${params.color}`;

const buildSpecLabel = (params: CartParams) =>
  `规格 ${params.spec} · ${params.color}`;

export function useCart() {
  const addToCart = (
    product: ProductDetail,
    params: CartParams,
    quantity: number,
  ) => {
    const cartKey = buildCartKey(product.id, params);
    const existing = cartItems.value.find((item) => item.cartKey === cartKey);

    if (existing) {
      existing.quantity += quantity;
      return;
    }

    cartItems.value.push({
      cartKey,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      rating: product.rating,
      spec: buildSpecLabel(params),
      quantity,
      selected: false,
    });
  };

  const toggleSelect = (cartKey: string) => {
    const item = cartItems.value.find((entry) => entry.cartKey === cartKey);
    if (item) {
      item.selected = !item.selected;
    }
  };

  const increaseQty = (cartKey: string) => {
    const item = cartItems.value.find((entry) => entry.cartKey === cartKey);
    if (item) {
      item.quantity += 1;
    }
  };

  const decreaseQty = (cartKey: string) => {
    const item = cartItems.value.find((entry) => entry.cartKey === cartKey);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
    }
  };

  const removeItem = (cartKey: string) => {
    cartItems.value = cartItems.value.filter((item) => item.cartKey !== cartKey);
  };

  const removeSelected = () => {
    cartItems.value = cartItems.value.filter((item) => !item.selected);
  };

  return {
    cartItems,
    addToCart,
    increaseQty,
    decreaseQty,
    removeItem,
    removeSelected,
    toggleSelect,
  };
}
