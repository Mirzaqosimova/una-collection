import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { getResult } from 'src/common/dto/find-all-response';
import { OrderStatus } from 'src/common/types/enums';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrdersQueryDto } from 'src/orders/dto/query.dto';
import { ChangeStatusDto } from 'src/orders/dto/update-order.dto';

export class OrdersRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  private getBuilder(trx?: Knex.Transaction) {
    return trx ? trx('orders') : this.knex('orders');
  }

  findBy(param: {
    id?: number;
    product_option_id?: number;
    phone?: string;
    status?: OrderStatus;
  }) {
    return this.getBuilder().where(param).first();
  }

  create({ products, ...orderData }: CreateOrderDto) {
    return this.knex.transaction(async (trx) => {
      const [order] = await trx('orders')
        .insert({
          status: OrderStatus.NEW,
          ...orderData,
          total_price: products.reduce((sum, i) => sum + i.price, 0),
        })
        .returning('*');

      const options = products.map((p) => ({
        order_id: order.id,
        product_option_id: p.product_option_id,
        quantity: p.quantity,
        price: p.price,
      }));

      await trx('order_options').insert(options);
      for (const product of products) {
        if (product.quantity) {
          await trx('product_options')
            .where({ id: product.product_option_id })
            .increment('quantity', 1);
        } else {
          await trx('product_options')
            .where({ id: product.product_option_id })
            .update({ is_sold: true });
        }
      }

      return order;
    });
  }

  async findAll({ page, status, q }: OrdersQueryDto) {
    const bQuery = this.getBuilder()
      .select('*')
      .orderBy('delivery_type', 'desc');

    if (status) {
      bQuery.where({ 'orders.status': status });
    }
    if (q) {
      bQuery.where((bQuery) => {
        bQuery
          .whereILike('phone', `%${q}%`)
          .orWhereILike('full_name', `%${q}%`);
      });
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

  update(param: { id: number }, payload: ChangeStatusDto) {
    return this.getBuilder().where(param).update(payload);
  }

  findByIdAdmin(arg0: { id: number }) {
    return this.getBuilder()
      .select(
        'orders.*',
        this.knex.raw(
          `jsonb_agg(jsonb_build_object('id', product_options.id,
          'quantity',order_options.quantity,
          'price',order_options.price,
          'name_uz',products.name_uz,
          'name_ru',products.name_ru,
          'name_en',products.name_en,
          'type',products.type,
          'photos',product_options.photos,
          'color_name_uz',colors.name_uz,
          'color_name_ru',colors.name_ru,
          'color_name_en',colors.name_en,
          'color',colors.color,
          'pattern_name_uz',patterns.name_uz,
          'pattern_name_ru',patterns.name_ru,
          'pattern_name_en',patterns.name_en,
          'pattern_color',patterns.color,
          'pattern_type',patterns.type,
          'pattern_type',patterns.type,
          'pattern_image',patterns.image,
          'article',product_options.article,
          'measurement_name_uz',measurements.name_uz,
          'measurement_name_ru',measurements.name_ru,
          'measurement_name_en',measurements.name_en)
          ) as products`,
        ),
      )
      .leftJoin('order_options', 'orders.id', 'order_options.order_id')
      .leftJoin(
        'product_options',
        'order_options.product_option_id',
        'product_options.id',
      )
      .leftJoin('products', 'product_options.product_id', 'products.id')
      .leftJoin('colors', 'product_options.main_color_id', 'colors.id')
      .leftJoin('patterns', 'product_options.pattern_id', 'patterns.id')
      .leftJoin(
        'measurements',
        'product_options.measurement_id',
        'measurements.id',
      )
      .where({ 'orders.id': arg0.id })
      .groupBy('orders.id')
      .first();
  }
}
