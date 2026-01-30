import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('order_options', (table) => {
    table.increments('id').primary();
    table
      .integer('product_option_id')
      .references('id')
      .inTable('product_options')
      .notNullable();
    table
      .integer('order_id')
      .references('id')
      .inTable('orders.id')
      .onDelete('CASCADE')
      .notNullable();
    table.integer('quantity');
    table.float('price').notNullable();
    table.dateTime('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('order_options');
}
