import { baseConfig } from 'src/config';
import { FacebookPage } from 'src/models/facebook_page';
import { Shop } from 'src/models/shop';
import { TypeUser } from 'src/models/user';
import BaseServices from './baseServices';

export class ShopServices extends BaseServices {
  constructor() {
    super(baseConfig.apiServer);
  }

  getListShops(params?: any) {
    return this.get(`/shops`, { params: { ...params } });
  }

  getDetailShop(id: string) {
    return this.get(`/shops/${id}`);
  }

  getDetailShopClient(id: string) {
    return this.get(`/client/shops/${id}`);
  }

  createShop(data: Shop) {
    return this.post('/shops', data);
  }

  updateShop(id: string, data: Shop) {
    return this.put(`/shops/${id}`, data);
  }

  getUserShops(typeUser: TypeUser, params?: any) {
    return this.get(`/shops/get/${typeUser}`, { params: { ...params } });
  }

  assignPageToShop(data: FacebookPage) {
    return this.post(`/shops/assign-page`, data);
  }
}

export default new ShopServices();
