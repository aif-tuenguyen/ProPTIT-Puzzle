import { baseConfig } from 'src/config';
import { OrderWithSender } from 'src/models/order';
import BaseServices from './baseServices';

export class OrderServices extends BaseServices {
  constructor() {
    super(baseConfig.apiServer);
  }

  getListOrders(params?: any) {
    return this.get(`/orders`, { params: { ...params } });
  }

  getNumberOfOrders(month: number, year: number) {
    return this.get(`/orders/month/${month}/year/${year}`);
  }

  getGrossSale() {
    return this.get(`/orders/gross-sale`);
  }

  getGrossSaleCampaign(id: string) {
    return this.get(`/orders/gross-sale/${id}`);
  }

  getListOrdersClient(params?: any) {
    return this.get(`/client/orders-list`, {
      params: { ...params }
    });
  }

  getDetailOrder(id: string) {
    return this.get(`/orders/${id}`);
  }

  getDetailOrderClient(id: string) {
    return this.get(`/client/orders/${id}`);
  }

  placeOrder(data: OrderWithSender) {
    return this.post('/client/orders/create', data);
  }

  updateOrderStatus(id: string, data: any) {
    return this.patch(`/orders/${id}/status`, data);
  }

  updateOrderStatusClient(id: string, data: any) {
    return this.patch(`/client/orders/${id}/status`, data);
  }

  deleteOrder(id: string) {
    return this.delete(`/orders/${id}`);
  }
}

export default new OrderServices();
