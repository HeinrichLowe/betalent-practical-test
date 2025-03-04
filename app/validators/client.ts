import vine from '@vinejs/vine'

export const createClientValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    email: vine.string().trim().email().normalizeEmail(),
  })
)

export const updateClientValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    email: vine.string().trim().email().normalizeEmail().optional(),
  })
)
