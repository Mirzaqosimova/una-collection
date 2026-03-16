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
    pattern_id?: number;
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
              'id', product_options.id,
              'pattern_id', product_options.pattern_id,
              'photo', product_options.photos,
              'name_uz', patterns.name_uz,
              'name_ru', patterns.name_ru,
              'name_en', patterns.name_en,
              'type', patterns.type,
              'image', patterns.image,
              'color', patterns.color,
              'product_id', product_options.id
            ) order by product_options.order
          ) AS patterns
        `),
      )
      .innerJoin('patterns', 'patterns.id', 'product_options.pattern_id')
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
        'main_color.color',
        this.knex.raw(`
          jsonb_agg(
            jsonb_build_object(
              'measurement_id', t.measurement_id,
              'measurement_name_uz', measurements.name_uz,
              'measurement_name_en', measurements.name_en,
              'measurement_name_ru', measurements.name_ru,
              'patterns', t.patterns
            )
          ) AS size
        `),
      )
      .from(subquery)
      .innerJoin({ main_color: 'colors' }, 'main_color.id', 't.main_color_id')
      .innerJoin('measurements', 'measurements.id', 't.measurement_id')
      .groupBy('t.main_color_id', 'main_color.id');
    return query;
  }

  async maxOrderByProduct(productId: number): Promise<number> {
    const result = await this.getBuilder()
      .where('product_id', productId)
      .max('order as max')
      .first();
    return Number(result?.max ?? 0);
  }

  async create(payload: CreateProductOptionDto) {
    const max = await this.maxOrderByProduct(payload.product_id);
    return this.getBuilder()
      .insert({ ...payload, order: max + 1 })
      .returning('*')
      .then((res) => res[0]);
  }

  async changeOrder(id: number, toOrder: number) {
    const item = await this.findBy({ id });
    if (!item) return null;
    const fromOrder: number = item.order;
    const productId: number = item.product_id;

    if (fromOrder === toOrder) return item;

    if (toOrder < fromOrder) {
      await this.getBuilder()
        .where('product_id', productId)
        .whereBetween('order', [toOrder, fromOrder - 1])
        .increment('order', 1);
    } else {
      await this.getBuilder()
        .where('product_id', productId)
        .whereBetween('order', [fromOrder + 1, toOrder])
        .decrement('order', 1);
    }

    return this.getBuilder()
      .where({ id })
      .update({ order: toOrder })
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
      .leftJoin('patterns', 'patterns.id', 'product_options.pattern_id')
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
        'product_options.pattern_id',
        'product_options.article',
        'product_options.price',
        'product_options.quantity',
        'main_color.name_uz as main_color_name_uz',
        'main_color.name_ru as main_color_name_ru',
        'main_color.name_en as main_color_name_en',
        'main_color.code as main_color_code',
        'main_color.color as main_color',
        'patterns.name_uz as pattern_name_uz',
        'patterns.name_ru as pattern_name_ru',
        'patterns.name_en as pattern_name_en',
        'patterns.image as pattern_image',
        'patterns.color as pattern_color',
        'patterns.type as pattern_type',
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

  remove(param: { id: number }) {
    return this.getBuilder()
      .where(param)
      .delete()
      .returning('*')
      .then((res) => res[0]);
  }

  async findAllUserSidePastels(arg0: { product_id: number }) {
    return this.getBuilder()
      .select(
        'colors.id as main_color_id',
        'colors.name_uz as main_color_name_uz',
        'colors.name_ru as main_color_name_ru',
        'colors.name_en as main_color_name_en',
        'colors.code',
        'colors.color',
        this.knex.raw(`
      jsonb_agg(
        jsonb_build_object(
          'measurement_id', measurements.id,
          'measurement_name_uz', measurements.name_uz,
          'measurement_name_en', measurements.name_en,
          'measurement_name_ru', measurements.name_ru,
          'price', product_options.price,
          'description_uz', product_options.description_uz,
          'description_ru', product_options.description_ru,
          'description_en', product_options.description_en,
          'quantity', product_options.quantity,
          'id', product_options.id,
          'product_id', product_options.product_id,
          'photo', product_options.photos
        ) order by product_options.order desc
      ) AS size
    `),
      )
      .innerJoin(
        'measurements',
        'measurements.id',
        'product_options.measurement_id',
      )
      .innerJoin('colors', 'colors.id', 'product_options.main_color_id')
      .where('product_options.product_id', arg0.product_id)
      .andWhereNot('product_options.quantity', 0)
      .groupBy('colors.id');
  }
}
