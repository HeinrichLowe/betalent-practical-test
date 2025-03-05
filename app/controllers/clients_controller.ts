import type { HttpContext } from '@adonisjs/core/http'
import { roleVerify } from '../helpers/role_verify.js'
import { roles } from '../constants/roles.js'
import Client from '#models/client'
import { createClientValidator, updateClientValidator } from '#validators/client'

export default class ClientsController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!

    if (!roleVerify(user, [...roles.finance], response)) {
      return
    }

    const clients = await Client.query().select('id', 'name', 'email', 'created_at')

    return response.ok(clients)
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

    if (!roleVerify(user, [...roles.finance], response)) {
      return
    }

    const { name, email } = await request.validateUsing(createClientValidator)
    const newClient = await Client.create({ name, email })

    return response.created(newClient)
  }

  /**
   * Show individual record
   */
  async show({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!

      if (!roleVerify(user, [...roles.finance], response)) {
        return
      }

      const showClient = await Client.findByOrFail('id', params.id)

      return response.ok(showClient)
    } catch (error) {
      return response.notFound({ message: 'Client not found' })
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

      if (!roleVerify(user, [...roles.finance], response)) {
        return
      }

      const { name, email } = await request.validateUsing(updateClientValidator)

      const uptClient = await Client.findByOrFail('id', params.id)
      await uptClient.merge({ name, email })
      await uptClient.save()

      return response.ok(uptClient)
    } catch (error) {
      return response.notFound({ message: 'Client not found' })
    }
  }

  /**
   * Delete record
   */
  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!

      if (!roleVerify(user, [...roles.finance], response)) {
        return
      }

      const delClient = await Client.findByOrFail('id', params.id)
      await delClient.delete()

      return response.ok({ message: 'User deleted' })
    } catch (error) {
      return response.notFound({ message: 'Client not found or already deleted' })
    }
  }
}
