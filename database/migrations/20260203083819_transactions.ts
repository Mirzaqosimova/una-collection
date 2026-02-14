import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .references('id')
      .inTable('orders')
      .onDelete('SET NULL')
      .notNullable();
    table.string('payment_method').notNullable(); //click
    table.string('payment_id').nullable(); //click
    table.string('fiscal_check');
    table.string('status').defaultTo('pending');
    table.string('click_trans_id'); //came from click
    table.timestamp('cancel_time');
    table.timestamp('paid_time');
    table.float('amount').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
