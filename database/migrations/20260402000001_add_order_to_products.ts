import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.integer('order').nullable();
  });

  await knex.raw(`
    UPDATE products
    SET "order" = sub.row_num
    FROM (
      SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS row_num
      FROM products
    ) sub
    WHERE products.id = sub.id
  `);

  await knex.schema.alterTable('products', (table) => {
    table.integer('order').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.dropColumn('order');
  });
}
