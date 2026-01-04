import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

export class PastelsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('pastels') : this.knex('pastels');
  }

  findBy(param: { id?: number }) {
    return this.getBuilder().where(param).first();
  }
}
