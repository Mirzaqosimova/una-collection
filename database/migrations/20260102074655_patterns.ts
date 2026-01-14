import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('patterns', (table) => {
    table.increments('id').primary();
    table.string('name_uz').notNullable();
    table.string('name_ru').notNullable();
    table.string('name_en').notNullable();
    table.string('type').notNullable();
    table.string('color').nullable();
    table.string('image').nullable();
    table.dateTime('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('patterns');
}
