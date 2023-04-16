export interface Product {
  id?: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice: number;
  categoryId?: string;
  images?: string[];
  weight: number;
  width: number;
  length: number;
  height: number;
  quantity: number;
  status: ProductStatus;
}

export enum ProductStatus {
  STOCK = 'stock',
  SOLD_OUT = 'sold_out',
  INCOMMING = 'incomming'
}
