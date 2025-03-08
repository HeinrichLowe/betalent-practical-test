import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gateways'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('(UUID())')).notNullable()
      table.string('name')
      table.string('base_url').unique().notNullable()
      table.string('schema', 2).defaultTo('EN').notNullable()
      table.boolean('is_active').defaultTo(false).notNullable()
      table.boolean('requires_auth').defaultTo(false).notNullable()
      table.integer('priority').unsigned().unique().notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
