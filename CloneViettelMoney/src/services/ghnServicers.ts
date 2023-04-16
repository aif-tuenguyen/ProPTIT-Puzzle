import { baseConfig } from 'src/config';
import BaseServices from './baseServices';

export class GHNServices extends BaseServices {
  constructor() {
    super(baseConfig.apiServer);
  }

  getFeeShipment(data: any) {
    return this.post(`/client/ship/fee`, data);
  }

  getServices(data: any) {
    return this.post(`/client/ship/services`, data);
  }

  getProvince() {
    return this.get(`/client/provinces`);
  }

  getDistrict(provinceId: number) {
    return this.get(`/client/districts/${provinceId}`);
  }

  getWard(districtId: number) {
    return this.get(`/client/wards/${districtId}`);
  }
}

export default new GHNServices();
