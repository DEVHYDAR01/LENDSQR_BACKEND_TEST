import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('wallet_id').notNullable().references('id').inTable('wallets').onDelete('CASCADE');
    table.uuid('recipient_wallet_id').nullable().references('id').inTable('wallets').onDelete('SET NULL');
    table.enum('type', ['credit', 'debit']).notNullable();
    table.enum('category', ['funding', 'transfer', 'withdrawal']).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.decimal('balance_before', 15, 2).notNullable();
    table.decimal('balance_after', 15, 2).notNullable();
    table.string('reference').notNullable().unique();
    table.string('description').nullable();
    table.enum('status', ['pending', 'completed', 'failed']).notNullable().defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['wallet_id']);
    table.index(['recipient_wallet_id']);
    table.index(['reference']);
    table.index(['type']);
    table.index(['status']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}