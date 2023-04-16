import { baseConfig } from 'src/config';
import { Category } from 'src/models/category';
import BaseServices from './baseServices';

export class CategoryServices extends BaseServices {
  constructor() {
    super(baseConfig.apiServer);
  }

  getListCategories(params?: any) {
    return this.get(`/categories`, { params: { ...params } });
  }

  getStatisticCategories() {
    return this.get(`/categories/statistic`);
  }

  getListCategoriesClient(shopId: string, params?: any) {
    return this.get(`/client/categories/all/${shopId}`, {
      params: { ...params }
    });
  }

  getDetailCategory(id: string) {
    return this.get(`/categories/${id}`);
  }

  createCategory(data: Category) {
    return this.post('/categories', data);
  }

  updateCategory(id: string, data: Category) {
    return this.put(`/categories/${id}`, data);
  }

  deleteCategory(id: string) {
    return this.delete(`/categories/${id}`);
  }
}

export default new CategoryServices();
