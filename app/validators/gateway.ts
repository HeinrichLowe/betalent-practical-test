import vine from '@vinejs/vine'

export const createGatewayValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    base_url: vine.string().trim(),
    schema: vine.string().toUpperCase().maxLength(2).trim(),
    requires_auth: vine.boolean().optional(),
    is_active: vine.boolean().optional(),
  })
)

export const updateGatewayValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    base_url: vine.string().trim().optional(),
    schema: vine.string().toUpperCase().maxLength(2).trim().optional(),
    requires_auth: vine.boolean().optional(),
    is_active: vine.boolean().optional(),
  })
)

export const updateGatewayActiveValidator = vine.compile(
  vine.object({
    is_active: vine.boolean(),
  })
)

export const updateGatewayPriorityValidator = vine.compile(
  vine.object({
    priority: vine.number().positive(),
  })
)
