import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { GetTokenUsers } from 'src/auth/dto/login.dto';

export class UsersRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('users') : this.knex('users');
  }

  findBy(param: { id?: number; login?: string; phone?: string }) {
    return this.getBuilder().where(param).first();
  }

  create(payload: {
    login: string;
    password: string;
    role: string;
    full_name?: string;
    phone: string;
  }) {
    return this.getBuilder().insert(payload).returning('*');
  }

  update(data: { id: number }, payload: { full_name: string }) {
    return this.getBuilder().where(data).update(payload).returning('*');
  }
}
