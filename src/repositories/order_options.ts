import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { OrderStatus } from 'src/common/types/enums';

export class OrderOptionsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('order_options') : this.knex('order_options');
  }

  findBy(param: { id?: number }) {
    return this.getBuilder().where(param).first();
  }

  findWithOrder(arg0: { product_option_id: number }) {
    return this.getBuilder()
      .leftJoin('orders', 'order_options.order_id', 'orders.id')
      .where(arg0)
      .first();
  }
}
