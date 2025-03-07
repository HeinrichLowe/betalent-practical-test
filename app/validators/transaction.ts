import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createPurchaseValidator = vine.compile(
  vine.object({
    client: vine.object({
      name: vine.string().trim(),
      email: vine.string().email(),
    }),
    products: vine.array(
      vine.object({
        id: vine.string().uuid(),
        quantity: vine.number().positive(),
      })
    ),
    amount: vine.number().positive(),
    cardNumber: vine
      .string()
      .trim()
      .regex(/^\d{16}$/),
    cvv: vine
      .string()
      .trim()
      .regex(/^\d{3}$/),
    nameOnCard: vine.string().trim(),
    expirationDate: vine
      .string()
      .trim()
      .regex(/^\d{2}\/\d{2}$/),
  })
)

export type CreatePurchasePayload = Infer<typeof createPurchaseValidator>
