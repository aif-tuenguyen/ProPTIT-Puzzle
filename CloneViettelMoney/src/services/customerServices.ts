import { baseConfig } from 'src/config';
import { Customer } from 'src/models/customer';
import BaseServices from './baseServices';

export class CustomerServices extends BaseServices {
  constructor() {
    super(baseConfig.apiServer);
  }

  getCustomers(params?: any) {
    return this.get(`/customers`, { params: { ...params } });
  }

  getCustomerByFacebookUserId(facebookUserId: string) {
    return this.get(`/client/customer?facebookUserId=${facebookUserId}`);
  }

  getDetailCustomer(id: string) {
    return this.get(`/customers/${id}`);
  }

  createCustomer(data: Customer) {
    return this.post('/customers', data);
  }

  updateCustomer(id: string, data: Customer) {
    return this.put(`/customers/${id}`, data);
  }

  deleteCustomer(id: string) {
    return this.delete(`/customers/${id}`);
  }
}

export default new CustomerServices();
