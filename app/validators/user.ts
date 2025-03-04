import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('email', value).first()
        return !match
      }),
    password: vine.string().minLength(4),
    role: vine.string().trim().toUpperCase().optional(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('email', value).first()
        return !match
      })
      .optional(),
    password: vine.string().minLength(4).optional(),
    role: vine.string().trim().toUpperCase().optional(),
  })
)
