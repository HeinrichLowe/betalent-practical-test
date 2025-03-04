import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Product from './product.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.js'

export default class TransactionProduct extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @belongsTo(() => Transaction)
  declare transaction_id: BelongsTo<typeof Transaction>

  @belongsTo(() => Product)
  declare product_id: BelongsTo<typeof Product>

  @column()
  declare quantity: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
