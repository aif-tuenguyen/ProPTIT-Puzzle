import { baseConfig } from 'src/config';
import { Campaign } from 'src/models/campaign';
import BaseServices from './baseServices';

export class CampaignServices extends BaseServices {
  constructor() {
    super(baseConfig.apiServer);
  }

  getListCampaigns(params?: any) {
    return this.get(`/campaigns`, { params: { ...params } });
  }

  getListCampaignsWithGross(params?: any) {
    return this.get(`/campaigns/gross`, { params: { ...params } });
  }

  getDetailCampaign(id: string) {
    return this.get(`/campaigns/${id}`);
  }

  getListCampaignsClient(shopId: string, params?: any) {
    return this.get(`/client/campaigns/all/${shopId}`, {
      params: { ...params }
    });
  }

  getDetailCampaignClient(id: string) {
    return this.get(`/client/campaigns/${id}`);
  }

  createCampaign(data: Campaign) {
    return this.post('/campaigns', data);
  }

  updateCampaign(id: string, data: Campaign) {
    return this.put(`/campaigns/${id}`, data);
  }

  deleteCampaign(id: string) {
    return this.delete(`/campaigns/${id}`);
  }
}

export default new CampaignServices();
