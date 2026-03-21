import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { getResult } from 'src/common/dto/find-all-response';
import { CreateMeasurementDto } from 'src/measurement/dto/create-measurement.dto';
import { MeasurementsFilter } from 'src/measurement/dto/query.dto';

export class MeasurementsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('measurements') : this.knex('measurements');
  }

  findBy(param: { id?: number; name_uz?: string }) {
    return this.getBuilder().where(param).first();
  }

  create(payload: CreateMeasurementDto) {
    return this.getBuilder()
      .insert(payload)
      .returning('*')
      .then((res) => res[0]);
  }

  async find(query: MeasurementsFilter) {
    const { product_type, page, q, lang } = query;
    const bQuery = this.getBuilder().select('*').orderBy('id', 'desc');

    if (product_type) {
      bQuery.where('product_type', product_type);
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

  update(param: { id: number }, payload: CreateMeasurementDto) {
    return this.getBuilder()
      .where(param)
      .update(payload)
      .returning('*')
      .then((res) => res[0]);
  }

  delete(param: { id: number }) {
    return this.getBuilder().where(param).delete();
  }

  findAllFilter({ product_type }: MeasurementsFilter) {
    const bQuery = this.getBuilder().select('*').orderBy('id', 'desc');

    if (product_type) {
      bQuery.where('product_type', product_type);
    }
    return bQuery;
  }
}
