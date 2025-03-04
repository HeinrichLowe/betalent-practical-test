import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('(UUID())')).notNullable()

      table
        .uuid('transaction_id')
        .references('id')
        .inTable('transactions')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .uuid('product_id')
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.integer('quantity').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
