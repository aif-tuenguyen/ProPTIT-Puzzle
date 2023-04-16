export interface Transaction {
  user_id?: string;
  payment_type?: 'account_number' | 'phone_number' | 'card_number';
  receiver_id?: string;
  account_number?: string;
  card_number?: string;
  phone_number?: string;
  bank_name?: string;
  receiver_name?: string;
  payment_source?: 0 | 1; // 0 viettel 1 tien dd
  payment_destination?: 0 | 1; // 0 viettel 1 tien dd
  amount: number;
  content: string;
}
