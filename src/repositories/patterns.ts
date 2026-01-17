import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { getResult } from 'src/common/dto/find-all-response';
import { CreatePatternDto } from 'src/patterns/dto/create-pattern.dto';
import { PatternFilter } from 'src/patterns/dto/query.dto';

export class PatternsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('patterns') : this.knex('patterns');
  }

  create(createColorDto: CreatePatternDto) {
    return this.getBuilder()
      .insert(createColorDto)
      .returning('*')
      .then((res) => res[0]);
  }
  findBy(param: { id?: number; name_uz?: string }) {
    return this.getBuilder().where(param).first();
  }

  async find(query: PatternFilter) {
    const { type, page, q, lang } = query;
    const bQuery = this.getBuilder().select('*').orderBy('id', 'desc');

    if (type) {
      bQuery.where('type', type);
    }
    if (q) {
      bQuery.whereILike(`name_${lang}`, `%${q}%`);
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
  update(param: { id: number }, updateColorDto: CreatePatternDto) {
    return this.getBuilder()
      .where(param)
      .update(updateColorDto)
      .returning('*')
      .then((res) => res[0]);
  }

  delete(param: { id: number }) {
    return this.getBuilder().where(param).delete();
  }

  findAllFilter() {
    return this.getBuilder().select('*').orderBy('id', 'desc');
  }
}
