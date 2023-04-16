import { baseConfig } from 'src/config';
import BaseServices from './baseServices';

export class UserServices extends BaseServices {
  constructor() {
    super(baseConfig.apiServer);
  }

  getInfoMe() {
    return this.get(`/users/me`);
  }
}

export default new UserServices();
