import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

export class OrderOptionsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('order_options') : this.knex('order_options');
  }

  findBy(param: { id?: number }) {
    return this.getBuilder().where(param).first();
  }
}
