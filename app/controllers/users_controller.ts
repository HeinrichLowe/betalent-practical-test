import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { roleVerify } from '../helpers/role_verify.js'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!

    if (!roleVerify(user, ['ADMIN', 'MANAGER'], response)) {
      return
    }

    const users = await User.query().select('id', 'email', 'role', 'created_at')
    return response.json(users)
  }

  /**
   * Display form to create a new record
   */
  //async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!

    if (!roleVerify(user, ['ADMIN', 'MANAGER'], response)) {
      return
    }

    const { email, password, role } = await request.validateUsing(createUserValidator)
    const newUser = await User.create({ email, password, role })

    return response.status(201).json(newUser)
  }

  /**
   * Show individual record
   */
  async show({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!

      if (!roleVerify(user, ['ADMIN', 'MANAGER'], response)) {
        return
      }

      const showUser = await User.findByOrFail('id', params.id)

      return showUser
    } catch (error) {
      return response
        .status(error.status || 404)
        .json({ error: error.messages || 'User not found' })
    }
  }

  /**
   * Edit individual record
   */
  //async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!

      if (!roleVerify(user, ['ADMIN', 'MANAGER'], response)) {
        return
      }

      const updateUser = await User.findByOrFail('id', params.id)
      const { email, password, role } = await request.validateUsing(updateUserValidator)

      updateUser.merge({ email, password, role })
      await updateUser.save()
      return updateUser
    } catch (error) {
      return response
        .status(error.status || 404)
        .json({ error: error.messages || 'User not found' })
    }
  }

  /**
   * Delete record
   */
  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!

      if (!roleVerify(user, ['ADMIN', 'MANAGER'], response)) {
        return
      }

      const delUser = await User.findByOrFail('id', params.id)
      await delUser.delete()

      return response.status(200).json({ message: 'User deleted' })
    } catch (error) {
      return response.notFound({ message: 'User not found or already deleted' })
    }
  }
}
