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

  async maxOrder(): Promise<number> {
    const result = await this.getBuilder().max('order as max').first();
    return Number(result?.max ?? 0);
  }

  async create(payload: CreateCategoryDto) {
    const max = await this.maxOrder();
    return this.getBuilder()
      .insert({ ...payload, order: max + 1 })
      .returning('*')
      .then((res) => res[0]);
  }

  async changeOrder(id: number, toOrder: number) {
    const item = await this.findBy({ id });
    if (!item) return null;
    const fromOrder: number = item.order;

    if (fromOrder === toOrder) return item;

    if (toOrder < fromOrder) {
      await this.getBuilder()
        .whereBetween('order', [toOrder, fromOrder - 1])
        .increment('order', 1);
    } else {
      await this.getBuilder()
        .whereBetween('order', [fromOrder + 1, toOrder])
        .decrement('order', 1);
    }

    return this.getBuilder()
      .where({ id })
      .update({ order: toOrder })
      .returning('*')
      .then((res) => res[0]);
  }

  async find(query: CategoriesFilter) {
    const { product_type, page, q, lang } = query;
    const bQuery = this.getBuilder().select('*').orderBy('order');

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
    const bQuery = this.getBuilder().select('*').orderBy('orderp');

    if (product_type) {
      bQuery.where('product_type', product_type);
    }
    return bQuery;
  }
}
