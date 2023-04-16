import { baseConfig } from 'src/config';
import { Template } from 'src/models/template';
import BaseServices from './baseServices';

export class TemplateServices extends BaseServices {
  constructor() {
    super(baseConfig.apiServer);
  }

  getTemplate() {
    return this.get(`/template`);
  }

  createPoperty(data: Template) {
    return this.post('/template', data);
  }

  updatePoperty(id: string, data: Template) {
    return this.put(`/template/${id}`, data);
  }
}

export default new TemplateServices();
