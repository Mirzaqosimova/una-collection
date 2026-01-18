import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

export class OrdersRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('orders') : this.knex('orders');
  }

  findBy(param: { id?: number; product_option_id?: number }) {
    return this.getBuilder().where(param).first();
  }
}
