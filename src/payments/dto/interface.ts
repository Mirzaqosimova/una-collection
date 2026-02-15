import { TransactionStatus } from 'src/common/types/enums';

export interface TransactionI {
  id?: number;
  order_id: number; // FK → orders.id
  payment_method: string; // e.g. 'click'
  fiscal_check?: string | null;
  status: TransactionStatus; // default: 'pending'
  cancel_time?: Date | null;
  click_trans_id?: string;
  amount: number;
}

export class ClickRequestDto {
  click_trans_id: number;
  service_id: number;
  click_paydoc_id: string;
  merchant_user_id?: string;
  merchant_trans_id: string;
  amount: number;
  action: 0 | 1;
  error: 0 | 1;
  error_note: string;
  sign_time: string;
  sign_string: string;
  merchant_prepare_id: number;
}
export interface GenerateMd5HashParams {
  clickTransId: string;
  serviceId: number;
  secretKey: string;
  merchantTransId: string;
  merchantPrepareId?: number;
  amount: number;
  action: number;
  signTime: string;
}
