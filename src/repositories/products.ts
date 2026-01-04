import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateProductDto } from 'src/products/dto/create-products.dto';

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

  findUserSide() {
    return this.getBuilder()
      .select(
        'products.id',
        'products.name_uz',
        'products.name_ru',
        'products.name_en',
        'products.price',
        this.knex.raw(`product_options.photos[0]`),
      )
      .joinRaw(
        `left join lateral(
    select * from product_options
    where product_options.product_id = products.id  
    order by product_options.created_at
    limit 1 ) as product_options on true`,
      )

      .where({ 'product_options.is_sold': false });
  }

  update(param: { id: number }, payload: CreateProductDto) {
    return this.getBuilder()
      .where(param)
      .update(payload)
      .returning('id')
      .then((res) => res[0]);
  }

  delete(param: { id: number }) {
    return this.getBuilder().where(param).delete();
  }
}
