import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name_uz').notNullable();
    table.string('name_ru').notNullable();
    table.string('name_en').notNullable();
    table
      .integer('category_id')
      .references('id')
      .inTable('categories')
      .notNullable();
    table.string('type').notNullable();
    table.text('description_uz').notNullable();
    table.text('description_ru').notNullable();
    table.text('description_en').notNullable();
    table.float('price').notNullable();
    table.dateTime('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('products');
}
