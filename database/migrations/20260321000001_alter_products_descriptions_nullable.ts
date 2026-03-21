import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.text('description_uz').nullable().alter();
    table.text('description_ru').nullable().alter();
    table.text('description_en').nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.text('description_uz').notNullable().alter();
    table.text('description_ru').notNullable().alter();
    table.text('description_en').notNullable().alter();
  });
}
