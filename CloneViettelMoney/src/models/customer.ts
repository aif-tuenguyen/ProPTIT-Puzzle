export interface Customer {
  id?: string;
  name: string;
  shopId: string;
  facebookUserId: string;
  messageUserId?: string;
  phone?: string;
  provinceId?: number;
  provinceName?: string;
  districtId?: number;
  districtName?: string;
  wardCode?: string;
  wardName?: string;
  detailAddress?: string;
}
