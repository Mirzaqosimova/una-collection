import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tokens', (table) => {
    table.increments('id').primary();
    table.string('token', 500).notNullable();
    table.dateTime('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tokens');
}
