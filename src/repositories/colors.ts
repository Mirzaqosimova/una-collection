import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateColorDto } from 'src/colors/dto/create-color.dto';
import { ColorsFilter } from 'src/colors/dto/query.dto';
import { getResult } from 'src/common/dto/find-all-response';

export class ColorsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('colors') : this.knex('colors');
  }
  create(createColorDto: CreateColorDto) {
    return this.getBuilder()
      .insert(createColorDto)
      .returning('*')
      .then((res) => res[0]);
  }
  findBy(param: { id?: number; code?: string }) {
    return this.getBuilder().where(param).first();
  }

  async find(query: ColorsFilter) {
    const { type, page, q, lang } = query;
    const bQuery = this.getBuilder().select('*').orderBy('id', 'desc');

    if (type) {
      bQuery.where('type', type);
    }
    if (q) {
      bQuery.where((builder) =>
        builder
          .whereILike(`name_${lang}`, `%${q}%`)
          .orWhereILike('code', `%${q}%`),
      );
    }
    const [totalCount] = await bQuery
      .clone()
      .clearSelect()
      .clearOrder()
      .count('id');

    bQuery.offset(page.offset).limit(page.limit);

    return getResult(
      await bQuery,
      Number(totalCount.count),
      Number(totalCount.count) > page.offset + page.limit,
    );
  }
  update(param: { id: number }, updateColorDto: CreateColorDto) {
    return this.getBuilder()
      .where(param)
      .update(updateColorDto)
      .returning('*')
      .then((res) => res[0]);
  }

  delete(param: { id: number }) {
    return this.getBuilder().where(param).delete();
  }
}
