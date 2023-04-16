import { FacebookPage } from './facebook_page';

export interface Shop {
  id?: string;
  shopName?: string;
  shopImage?: string;
  provinceId?: number;
  provinceName?: string;
  districtId?: number;
  districtName?: string;
  paypalClientId?: string;
  description?: string;
  facebookPageDetail?: FacebookPage;
}
