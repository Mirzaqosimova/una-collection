import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

export class PastelOptionsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('pastel_options') : this.knex('pastel_options');
  }

  findBy(param: { id?: number }) {
    return this.getBuilder().where(param).first();
  }
}
