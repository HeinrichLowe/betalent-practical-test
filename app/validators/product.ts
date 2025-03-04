import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    amount: vine.number().positive(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    amount: vine.number().positive().optional(),
  })
)
