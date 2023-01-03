import { Address } from "./Address";
import { CartItem } from "./CartItem";

export type Order = {
  id: number;
  status: 'preparing' | 'sent' | 'delivered';
  orderDate: string; //? 9999-99-99
  userId: string;
  shippingAddress: Address;
  shippingPrice: number;
  paymentMethod: 'money' | 'card';
  cashAdvanceValue?: number;
  cupom?: string;
  cupomDiscount?: number;
  products: CartItem[];
  subtotal: number;
  total: number
}