import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateProductOptionDto } from 'src/product_options/dto/create-product_option.dto';
import { ProductOptionsFilter } from 'src/product_options/dto/query.dto';
export class ProductOptionsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('product_options') : this.knex('product_options');
  }

  findBy(param: {
    id?: number;
    product_id?: number;
    main_color_id?: number;
    measurement_id?: number;
    decor_color_id?: number;
  }) {
    return this.getBuilder().where(param).first();
  }

  findAllUserSide(param: { product_id: number; is_sold?: boolean }) {
    const subquery = this.getBuilder()
      .select(
        'product_options.main_color_id',
        'product_options.measurement_id',
        this.knex.raw(`
          jsonb_agg(
            jsonb_build_object(
              'id', product_options.decor_color_id,
              'name_uz', colors.name_uz,
              'name_ru', colors.name_ru,
              'name_en', colors.name_en,
              'code', colors.code,
              'product_id', product_options.id
            )
          ) AS decor_colors
        `),
      )
      .innerJoin('colors', 'colors.id', 'product_options.decor_color_id')
      .where('product_options.product_id', param.product_id)
      .andWhere('product_options.is_sold', false)
      .groupBy(
        'product_options.main_color_id',
        'product_options.measurement_id',
      )
      .as('t');

    const query = this.getBuilder()
      .select(
        't.main_color_id',
        'main_color.name_uz as main_color_name_uz',
        'main_color.name_ru as main_color_name_ru',
        'main_color.name_en as main_color_name_en',
        'main_color.code',
        this.knex.raw(`
          jsonb_agg(
            jsonb_build_object(
              'measurement_id', t.measurement_id,
              'measurement_name_uz', measurements.name_uz,
              'measurement_name_en', measurements.name_en,
              'measurement_name_ru', measurements.name_ru,
              'decor_color', t.decor_colors
            )
          ) AS size
        `),
      )
      .from(subquery)
      .innerJoin({ main_color: 'colors' }, 'main_color.id', 't.main_color_id')
      .innerJoin('measurements', 'measurements.id', 't.measurement_id')
      .groupBy(
        't.main_color_id',
        'main_color.id',
        'main_color.name_uz',
        'main_color.name_ru',
        'main_color.name_en',
        'main_color.code',
      );
    return query;
  }

  create(payload: CreateProductOptionDto) {
    return this.getBuilder()
      .insert(payload)
      .returning('*')
      .then((res) => res[0]);
  }

  findAll(query: ProductOptionsFilter) {
    const bQuery = this.getBuilder()
      .leftJoin(
        'colors as main_color',
        'main_color.id',
        'product_options.main_color_id',
      )
      .leftJoin(
        'colors as decor_color',
        'decor_color.id',
        'product_options.decor_color_id',
      )
      .leftJoin(
        'measurements',
        'measurements.id',
        'product_options.measurement_id',
      )
      .select([
        'product_options.id',
        'product_options.is_sold',
        'product_options.photos',
        'product_options.product_id',
        'product_options.main_color_id',
        'product_options.measurement_id',
        'product_options.decor_color_id',
        'main_color.name_uz as main_color_name_uz',
        'main_color.name_ru as main_color_name_ru',
        'main_color.name_en as main_color_name_en',
        'main_color.code as main_color_code',
        'decor_color.name_uz as decor_color_name_uz',
        'decor_color.name_ru as decor_color_name_ru',
        'decor_color.name_en as decor_color_name_en',
        'decor_color.code as decor_color_code',
        'measurements.name_uz as measurement_name_uz',
        'measurements.name_ru as measurement_name_ru',
        'measurements.name_en as measurement_name_en',
      ]);

    if (query.product_id) {
      bQuery.where('product_options.product_id', query.product_id);
    }

    return bQuery;
  }

  update(param: { id: number }, payload: CreateProductOptionDto) {
    return this.getBuilder()
      .where(param)
      .update(payload)
      .returning('*')
      .then((res) => res[0]);
  }
}
