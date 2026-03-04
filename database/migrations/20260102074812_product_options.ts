import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('product_options', (table) => {
    table.increments('id').primary();
    table.specificType('photos', 'varchar[]').notNullable();
    table
      .integer('product_id')
      .references('id')
      .inTable('products')
      .onDelete('CASCADE')
      .notNullable();
    table
      .integer('main_color_id')
      .references('id')
      .inTable('colors')
      .notNullable();
    table.integer('pattern_id').references('id').inTable('patterns').nullable();
    table
      .integer('measurement_id')
      .references('id')
      .inTable('measurements')
      .notNullable();
    table.string('article');
    table.integer('quantity').nullable();
    table.float('price').nullable();
    table.boolean('is_sold').notNullable().defaultTo(false);
    table.dateTime('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('product_options');
}
