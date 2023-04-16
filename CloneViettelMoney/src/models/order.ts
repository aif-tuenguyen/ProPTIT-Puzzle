import { Customer } from './customer';
import { Product } from './product';

export enum OrderStatus {
  OPEN = 'open',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Invoice {
  id: string;
  issuedDate: number;
  number: string;
  dueDate: number;
  clientName: string;
  clientAvatar: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  [key: string]: any;
}

export interface Information {
  name: string;
  phone: string;
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardCode: string;
  wardName: string;
  detailAddress: string;
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal'
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  FAILED = 'failed',
  EXPIRED = 'expired',
  PAID = 'paid',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded'
}

export enum DeliveryStatus {
  UNFULFILLED = 'unfulfilled',
  SHIPPING = 'shipping',
  SHIPPED = 'shipped',
  ARRIVED = 'arrived',
  COLLECTED = 'collected',
  RETURNING = 'returning',
  RETURNED = 'returned'
}

export interface Order {
  id?: string;
  shopId: string;
  customerDetail?: Customer;
  note?: string;
  orderStatus?: OrderStatus;
  totalPrice: number;
  totalSalePrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentTotal: number;
  shipmentStatus?: DeliveryStatus;
  shipmentPrice: number;
  serviceId: number;
  fromDistrictId: number;
  toDistrictId: number;
  campaignId?: string;
}

type ProductQuantity = {
  product: Product;
  quantity: number;
};

export type OrderWithSender = Order & {
  sender?: {
    facebookUserId: string;
  } & Information;
  products: ProductQuantity[];
};
