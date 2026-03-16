import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('categories', (table) => {
    table.integer('order').nullable();
  });

  await knex.schema.alterTable('product_options', (table) => {
    table.integer('order').nullable();
  });

  // Backfill existing rows with sequential order based on id
  await knex.raw(`
    UPDATE categories
    SET "order" = sub.row_num
    FROM (
      SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS row_num
      FROM categories
    ) sub
    WHERE categories.id = sub.id
  `);

  await knex.raw(`
    UPDATE product_options
    SET "order" = sub.row_num
    FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY id) AS row_num
      FROM product_options
    ) sub
    WHERE product_options.id = sub.id
  `);

  await knex.schema.alterTable('categories', (table) => {
    table.integer('order').notNullable().alter();
  });

  await knex.schema.alterTable('product_options', (table) => {
    table.integer('order').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('categories', (table) => {
    table.dropColumn('order');
  });

  await knex.schema.alterTable('product_options', (table) => {
    table.dropColumn('order');
  });
}
