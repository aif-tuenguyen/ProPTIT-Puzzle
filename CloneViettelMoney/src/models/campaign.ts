export interface Campaign {
  id?: string;
  name: string;
  image: string;
  status: 'ON' | 'OFF';
  postId: string;
  productIds: string[];
}
