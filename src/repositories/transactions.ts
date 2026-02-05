import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { TransactionI } from 'src/payments/dto/interface';
import { OrderStatus, TransactionStatus } from '../common/types/enums';

export class TransactionsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('transactions') : this.knex('transactions');
  }

  findBy(param: {
    id?: number;
    order_id?: number;
    click_trans_id?: string;
    status?: string;
  }) {
    return this.getBuilder().where(param).first();
  }

  create(arg0: TransactionI) {
    return this.getBuilder().insert(arg0).returning('id');
  }

  update(
    arg0: { id?: string; order_id?: number; status?: string },
    arg1: { status: TransactionStatus; cancel_time?: Date },
  ) {
    return this.getBuilder().where(arg0).update(arg1);
  }

  completeOrder(hasTransaction: TransactionI, payment_id: number) {
    return this.knex.transaction(async (trx) => {
      const [[res]] = await Promise.all([
        this.getBuilder(trx)
          .where({ id: hasTransaction.id })
          .update({
            status: TransactionStatus.PAID,
            payment_id,
            paid_time: new Date(),
          })
          .returning('id'),
        trx('orders').where({ id: hasTransaction.order_id }).update({
          status: OrderStatus.APPROVED,
          is_paid: true,
        }),
      ]);
      return res;
    });
  }
}
