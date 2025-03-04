import User from '#models/user'
import { createAuthValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async store({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(createAuthValidator)
    const user = await User.verifyCredentials(email, password)

    return await User.accessTokens.create(user, ['*'], { expiresIn: '6 hours' })
  }

  async destroy({ auth, response }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return response.status(203)
  }
}
