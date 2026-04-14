import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('comments', (table) => {
    table
      .integer('product_id')
      .references('id')
      .inTable('products')
      .onDelete('CASCADE')
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('comments', (table) => {
    table.dropColumn('product_id');
  });
}
