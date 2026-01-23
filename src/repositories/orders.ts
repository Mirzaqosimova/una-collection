import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { OrderStatus } from 'src/common/types/enums';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';

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
        .insert({ status: OrderStatus.NEW, ...orderData })
        .returning('*');

      const options = products.map((p) => ({
        order_id: order.id,
        product_option_id: p.product_option_id,
        quantity: p.quantity,
        price: p.price,
      }));

      await trx('order_options').insert(options);
      for (const product of products) {
        let updatePayload;
        if (product.quantity) {
          updatePayload = {
            quantity: this.knex.increment('1'),
          };
        } else {
          updatePayload = {
            is_sold: true,
          };
        }
        console.log(updatePayload);

        await trx('product_options')
          .where({ id: product.product_option_id })
          .update(updatePayload);
      }

      return order;
    });
  }

  findAll() {
    return this.getBuilder().select('*').orderBy('id', 'desc');
  }
}
