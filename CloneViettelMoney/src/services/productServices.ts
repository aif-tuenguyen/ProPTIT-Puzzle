import { baseConfig } from 'src/config';
import { Product } from 'src/models/product';
import BaseServices from './baseServices';

export class ProductServices extends BaseServices {
  constructor() {
    super(baseConfig.apiServer);
  }

  getListProducts(params?: any) {
    return this.get(`/products`, { params: { ...params } });
  }

  getListProductsClient(shopId: string, params?: any) {
    return this.get(`/client/products/all/${shopId}`, {
      params: { ...params }
    });
  }

  getDetailProduct(id: string) {
    return this.get(`/products/${id}`);
  }

  getDetailProductClient(id: string) {
    return this.get(`client/products/${id}`);
  }

  createProduct(data: Product) {
    return this.post('/products', data);
  }

  updateProduct(id: string, data: Product) {
    return this.put(`/products/${id}`, data);
  }

  deleteProduct(id: string) {
    return this.delete(`/products/${id}`);
  }
}

export default new ProductServices();
