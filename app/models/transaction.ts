import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Gateway from './gateway.js'
import Client from './client.js'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare clientId: string

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @column()
  declare gatewayId: string

  @belongsTo(() => Gateway)
  declare gateway: BelongsTo<typeof Gateway>

  @column()
  declare external_id: string

  @column()
  declare status: string

  @column()
  declare amount: number

  @column()
  declare cardLastNumbers: string

  @column({
    prepare: (value: any) => JSON.stringify(value),
  })
  declare products: { id: string; name: string; price: number; quantity: number }[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
