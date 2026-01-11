import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { CategoriesFilter } from 'src/categories/dto/query.dto';
import { getResult } from 'src/common/dto/find-all-response';

export class CategoriesRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('categories') : this.knex('categories');
  }

  findBy(param: { id?: number; name_uz?: string }) {
    return this.getBuilder().where(param).first();
  }

  create(payload: CreateCategoryDto) {
    return this.getBuilder()
      .insert(payload)
      .returning('*')
      .then((res) => res[0]);
  }

  async find(query: CategoriesFilter) {
    const { product_type, page, q } = query;
    const bQuery = this.getBuilder().select('*').orderBy('id', 'desc');

    if (product_type) {
      bQuery.where('product_type', product_type);
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

  update(param: { id: number }, payload: CreateCategoryDto) {
    return this.getBuilder()
      .where(param)
      .update(payload)
      .returning('*')
      .then((res) => res[0]);
  }

  delete(param: { id: number }) {
    return this.getBuilder().where(param).delete();
  }

  findAllFilter({ product_type }: CategoriesFilter) {
    const bQuery = this.getBuilder().select('*').orderBy('id', 'desc');

    if (product_type) {
      bQuery.where('product_type', product_type);
    }
    return bQuery;
  }
}
