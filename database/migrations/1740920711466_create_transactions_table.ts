import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('(UUID())')).notNullable()

      table
        .uuid('client_id')
        .references('id')
        .inTable('clients')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable()

      table
        .uuid('gateway_id')
        .references('id')
        .inTable('gateways')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable()

      table.string('external_id').notNullable()
      table.string('status').notNullable().defaultTo('pending')
      table.integer('amount').notNullable()
      table.string('card_last_numbers').notNullable()
      table.json('products').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
