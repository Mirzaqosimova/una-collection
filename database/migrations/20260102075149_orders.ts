import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
      .notNullable();
    table.string('phone').notNullable();
    table.string('full_name').notNullable();
    table.string('delivery_type').notNullable();
    table.float('total_price').notNullable();
    table.string('address');
    table.string('yandex_address');
    table.double('longitude');
    table.double('latitude');
    table.string('payment_type'); // click | yetkazib berish
    table.string('payment_check');
    table.boolean('is_paid').notNullable().defaultTo(false);
    table.integer('transaction_id');
    table.string('status').notNullable(); // new | approved | on_delivery | done | rejected\
    table.dateTime('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('orders');
}
