import { baseConfig } from 'src/config';
import BaseServices from './baseServices';

export class UploadServices extends BaseServices {
  constructor() {
    super(baseConfig.apiServer);
  }

  uploadImage(data: FormData) {
    return this.post(`/images`, data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    });
  }
}

export default new UploadServices();
