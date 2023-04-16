import { baseConfig } from 'src/config';
import { Transaction } from 'src/models/transaction';
import BaseServices from './baseServices';

interface BalanceRequest {
  sender_id: string;
  driver_id: string;
}

export class TransactionServices extends BaseServices {
  constructor() {
    super(baseConfig.apiServer);
  }

  createTransaction(data: Transaction) {
    return this.post(`/createTransaction`, data);
  }

  getBalance(data: BalanceRequest) {
    return this.post(`/getBalance`, data);
  }

  checkInfo(data: Transaction) {
    return this.post(`/checkInfo`, data);
  }

  otpAuth(data: { transaction_id: number; otp: string }) {
    return this.post('/otpAuth', data);
  }

  voiceBio(data: any) {
    return this.post('/voiceBio', data);
  }

  getHistory(user_id: string) {
    return this.get(`/getHistory/${user_id}`);
  }
}

export default new TransactionServices();
