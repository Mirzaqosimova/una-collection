import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from 'src/repositories/transactions';
import {
  ClickError,
  TransactionActions,
  TransactionStatus,
} from 'src/common/types/enums';
import { ConfigService } from '@nestjs/config';
import { ClickRequestDto } from './dto/interface';
import { HashingService } from 'src/common/services/hashing';
import { OrdersRepository } from 'src/repositories/orders';
import axios from 'axios';
import { createHash } from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly ordersRepository: OrdersRepository,
    private config: ConfigService,
    private hashingService: HashingService,
  ) {}
  async generateClickLink(payload: { id: number; total_price: number }) {
    return this.generateLink({
      service_id: this.config.get<number>('CLICK_SERVICE_ID'),
      merchant_id: this.config.get<number>('CLICK_MERCHANT_ID'),
      amount: payload.total_price,
      transaction_param: payload.id.toString(),
    });
  }

  async handleMerchantTransactions(clickReqBody: ClickRequestDto) {
    const actionType = +clickReqBody.action;

    clickReqBody.amount = parseFloat(clickReqBody.amount + '');

    switch (actionType) {
      case TransactionActions.Prepare:
        return this.prepare(clickReqBody);
      case TransactionActions.Complete:
        return this.complete(clickReqBody);
      default:
        return {
          error: ClickError.ActionNotFound,
          error_note: 'Invalid action',
        };
    }
  }

  async complete(clickReqBody: ClickRequestDto) {
    await this.validateMD5(clickReqBody);
    const hasTransaction = await this.transactionsRepository.findBy({
      click_trans_id: clickReqBody.click_trans_id + '',
      id: clickReqBody.merchant_prepare_id,
      order_id: +clickReqBody.merchant_trans_id,
    });
    if (!hasTransaction) {
      return {
        error: clickReqBody.error,
        error_note: 'Transaction not found',
      };
    }
    if (hasTransaction.status == TransactionStatus.PAID) {
      return {
        click_trans_id: clickReqBody.click_trans_id,
        merchant_trans_id: clickReqBody.merchant_trans_id,
        error: ClickError.Success,
        error_note: 'Already completed',
      };
    }
    if (clickReqBody.error != 0) {
      await this.transactionsRepository.update(
        {
          id: hasTransaction.id,
        },
        {
          status: TransactionStatus.CANCELED,
          cancel_time: new Date(),
        },
      );

      return {
        error: clickReqBody.error,
        error_note: 'Failed',
      };
    }
    await this.transactionsRepository.completeOrder(
      hasTransaction,
      clickReqBody.click_paydoc_id,
    );
    return {
      click_trans_id: clickReqBody.click_trans_id,
      merchant_trans_id: clickReqBody.merchant_trans_id,
      error: ClickError.Success,
      error_note: 'Success',
    };
  }

  async prepare(clickReqBody: ClickRequestDto) {
    console.log('prepare');
    await this.validateMD5(clickReqBody);
    const hasTransaction = await this.transactionsRepository.findBy({
      click_trans_id: clickReqBody.click_trans_id + '',
    });

    if (hasTransaction) {
      return {
        click_trans_id: clickReqBody.click_trans_id,
        merchant_trans_id: clickReqBody.merchant_trans_id,
        merchant_prepare_id: hasTransaction.id,
        error:
          hasTransaction.status == TransactionStatus.CANCELED
            ? ClickError.TransactionCanceled
            : ClickError.Success,
        error_note: 'Success',
      };
    }
    const hasPreviousTransaction = await this.transactionsRepository.findBy({
      order_id: +clickReqBody.merchant_trans_id,
      status: TransactionStatus.PENDING,
    });
    if (hasPreviousTransaction) {
      await this.transactionsRepository.update(
        {
          order_id: +clickReqBody.merchant_trans_id,
          status: TransactionStatus.PENDING,
        },
        { status: TransactionStatus.CANCELED },
      );
    }
    const hasOrder = await this.ordersRepository.findBy({
      id: +clickReqBody.merchant_trans_id,
    });
    if (!hasOrder) {
      return {
        error: ClickError.TransactionNotFound,
        error_note: 'Order not found',
      };
    }
    if (Math.abs(hasOrder.price - clickReqBody.amount) > 0.001) {
      return {
        error: ClickError.InvalidAmount,
        error_note: 'Amount mismatch',
      };
    }
    if (hasOrder.is_paid) {
      return {
        error: ClickError.AlreadyPaid,
        error_note: 'Transaction already done',
      };
    }
    const [res] = await this.transactionsRepository.create({
      order_id: +clickReqBody.merchant_trans_id,
      click_trans_id: clickReqBody.click_trans_id + '',
      payment_method: 'click',
      amount: clickReqBody.amount,
      status: TransactionStatus.PENDING,
    });
    return {
      click_trans_id: clickReqBody.click_trans_id,
      merchant_trans_id: clickReqBody.merchant_trans_id,
      merchant_prepare_id: res.id,
      error: ClickError.Success,
      error_note: 'Success',
    };
  }

  validateMD5(clickReqBody: ClickRequestDto) {
    const myMD5Params = {
      clickTransId: clickReqBody.click_trans_id + '',
      serviceId: clickReqBody.service_id,
      secretKey: this.config.get<string>('CLICK_SECRET_KEY'),
      merchantTransId: clickReqBody.merchant_trans_id,
      amount: clickReqBody.amount,
      action: clickReqBody.action,
      signTime: clickReqBody.sign_time,
    };
    const myMD5Hash = this.hashingService.generateMD5(myMD5Params);
    if (clickReqBody.sign_string !== myMD5Hash) {
      return {
        error: ClickError.SignFailed,
        error_note: 'Invalid sign_string',
      };
    }
  }

  generateLink(click: {
    service_id: number;
    merchant_id: number;
    amount: number;
    transaction_param: string;
  }) {
    return `https://my.click.uz/services/pay?service_id=${click.service_id}&merchant_id=${click.merchant_id}&amount=${click.amount}&transaction_param=${click.transaction_param}`;
  }

  async generateFiscalLink(order_id: number) {
    const ordersInfo = await this.ordersRepository.findFiscalCheck(order_id);
    return this.submitFiscalItems(
      this.config.get<number>('CLICK_SERVICE_ID'),
      this.config.get<number>('CLICK_MERCHANT_ID'),
      ordersInfo.payment_id,
      this.config.get<string>('CLICK_SECRET_KEY'),
      ordersInfo.total_price,
      ordersInfo.items.map((item) => ({
        Name: item.product_name,
        SPIC: item.spic,
        PackageCode: item.package_code,
        GoodPrice: item.price * 100,
        Price: item.price * 100 * item.quantity,
        Amount: item.quantity,
        VAT: 0,
        VATPercent: 0,
        CommissionInfo: {
          TIN: '519468848',
        },
      })),
    );
  }

  async submitFiscalItems(
    serviceId: number,
    merchantId: number,
    paymentId: number,
    secretKey: string,
    total_price: number,
    items: {
      Name: string;
      SPIC: string;
      PackageCode: string;
      GoodPrice: number;
      Price: number;
      Amount: number;
      VAT: number;
      VATPercent: number;
      CommissionInfo: {
        TIN: string;
      };
    }[],
  ) {
    console.log(items);
    const timestamp = Math.floor(Date.now() / 1000);

    const sign = createHash('sha1')
      .update(secretKey + timestamp)
      .digest('hex');

    const authHeader = `${merchantId}:${sign}:${timestamp}`;

    const url =
      'https://api.click.uz/v2/merchant/payment/ofd_data/submit_items';

    const response = await axios.post(
      url,
      {
        service_id: serviceId,
        payment_id: paymentId,
        items,
        received_ecash: 0,
        received_cash: 0,
        received_card: total_price * 100,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Auth: authHeader,
        },
      },
    );

    return response.data;
  }
}
