import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Gateway from './gateway.js'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @belongsTo(() => User)
  declare client: BelongsTo<typeof User>

  @belongsTo(() => Gateway)
  declare gateway: BelongsTo<typeof Gateway>

  @column()
  declare external_id: string

  @column()
  declare amount: number

  @column()
  declare card_last_numbers: string

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value),
  })
  declare products: { product_id: number; quantity: number }[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
