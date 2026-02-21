import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('login').notNullable();
    table.string('password').notNullable();
    table.string('role').notNullable();
    table.string('phone').nullable();
    table.string('full_name').nullable();
    table.string('address');
    table.string('yandex_address');
    table.double('longitude');
    table.double('latitude');
    table.dateTime('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
