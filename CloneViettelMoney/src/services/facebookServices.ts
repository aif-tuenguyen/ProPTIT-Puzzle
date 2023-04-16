import { baseConfig } from 'src/config';
import BaseServices from './baseServices';

export class FacebookServices extends BaseServices {
  constructor() {
    super(baseConfig.apiServer);
  }

  getFacebookPage(shopId: string) {
    return this.get(`/facebook/page/shop/${shopId}`);
  }

  getPostsPage() {
    return this.get(`/facebook/posts`);
  }

  getDetailPost(postId: string) {
    return this.get(`/facebook/posts/${postId}`);
  }

  postNewFeed(data: { imageUrl?: string; caption: string }) {
    return this.post(`/facebook/posts`, data);
  }

  sendMessage(data: { senderId: string; message: string; orderId: string }) {
    return this.post(
      `/facebook/orders/send-message?senderId=${data?.senderId}&message=${data?.message}&orderId=${data?.orderId}`
    );
  }
}

export default new FacebookServices();
