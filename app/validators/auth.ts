import vine from '@vinejs/vine'

export const createAuthValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(4),
  })
)
