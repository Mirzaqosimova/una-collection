import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { getResult } from 'src/common/dto/find-all-response';
import { ProductType } from 'src/common/types/enums';
import { CreateProductDto } from 'src/products/dto/create-products.dto';
import { ProductsFilter } from 'src/products/dto/query.dto';

export class ProductsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('products') : this.knex('products');
  }

  findBy(param: { id?: number; name_uz?: string }) {
    return this.getBuilder().where(param).first();
  }

  create(payload: CreateProductDto) {
    return this.getBuilder()
      .insert(payload)
      .returning('*')
      .then((res) => res[0]);
  }

  async findAll(query: ProductsFilter) {
    const { page, q, lang } = query;
    const bQuery = this.getBuilder()
      .select(
        'products.*',
        'categories.name_uz as category_name_uz',
        'categories.name_ru as category_name_ru',
        'categories.name_en as category_name_en',
        this.knex.raw(`count(product_options.id) as options_count`),
      )
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .leftJoin('product_options', 'products.id', 'product_options.product_id')
      .orderBy('products.id', 'desc')
      .groupBy('products.id', 'categories.id');

    if (q) {
      bQuery.whereILike(`name_${lang}`, `%${q}%`);
    }

    const [totalCount] = await bQuery
      .clone()
      .clearSelect()
      .clearOrder()
      .count('products.id');

    bQuery.offset(page.offset).limit(page.limit);

    return getResult(
      await bQuery,
      Number(totalCount?.count || 0),
      Number(totalCount?.count || 0) > page.offset + page.limit,
    );
  }

  async findUserSide(query: ProductsFilter) {
    const { page, q, lang, category_id } = query;
    const bQuery = this.getBuilder()
      .select(
        'products.id',
        'products.name_uz',
        'products.name_ru',
        'products.name_en',
        'products.category_id',
        this.knex.raw(`product_options.photos,
          case when products.type = 'pastels' then product_options.price else products.price end as price`),
      )
      .joinRaw(
        `inner join lateral(
   SELECT *
    FROM product_options
    WHERE product_options.product_id = products.id
      AND (
        (products.type = 'clothes' AND product_options.is_sold = false)
        OR
        (products.type = 'pastels' AND product_options.quantity > 0)
      )
    ORDER BY product_options.id desc
    LIMIT 1) as product_options on true`,
      );

    if (category_id) {
      bQuery.where({ 'products.category_id': category_id });
    }
    if (q) {
      bQuery.whereILike(`name_${lang}`, `%${q}%`);
    }

    const [totalCount] = await bQuery
      .clone()
      .clearSelect()
      .clearOrder()
      .count('products.id');

    bQuery.offset(page.offset).limit(page.limit);

    return getResult(
      await bQuery,
      Number(totalCount?.count || 0),
      Number(totalCount?.count || 0) > page.offset + page.limit,
    );
  }

  update(param: { id: number }, payload: CreateProductDto) {
    return this.getBuilder()
      .where(param)
      .update(payload)
      .returning('id')
      .then((res) => res[0]);
  }

  findByUserSide(param: { id: number }) {
    return this.getBuilder()
      .select(
        'products.*',
        'categories.name_uz as category_name_uz',
        'categories.name_ru as category_name_ru',
        'categories.name_en as category_name_en',
      )
      .leftJoin('categories', { 'categories.id': 'products.category_id' })
      .where('products.id', param.id)
      .first();
  }

  delete(param: { id: number }) {
    return this.getBuilder().where(param).delete();
  }

  findOrderFilters({ category_id }: ProductsFilter) {
    const bQuery = this.getBuilder()
      .select(
        this.knex.raw(`
        jsonb_agg( distinct jsonb_build_object('id', colors.id,
        'name_uz', colors.name_uz,
        'name_ru', colors.name_ru,
        'name_en', colors.name_en,
        'color', colors.color)) as colors,
        jsonb_agg( distinct jsonb_build_object('id', measurements.id,
        'name_uz', measurements.name_uz,
        'name_ru', measurements.name_ru,
        'name_en', measurements.name_en)) as measurements
        `),
      )
      .innerJoin('product_options', 'products.id', 'product_options.product_id')
      .innerJoin('colors', 'product_options.main_color_id', 'colors.id')
      .innerJoin(
        'measurements',
        'product_options.measurement_id',
        'measurements.id',
      )
      .first();

    if (category_id) {
      bQuery.where({ 'products.category_id': category_id });
    }

    return bQuery;
  }
}
