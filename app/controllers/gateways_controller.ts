import type { HttpContext } from '@adonisjs/core/http'
import { roleVerify } from '../helpers/role_verify.js'
import { roles } from '../constants/roles.js'
import Gateway from '#models/gateway'
import {
  createGatewayValidator,
  updateGatewayActiveValidator,
  updateGatewayPriorityValidator,
  updateGatewayValidator,
} from '#validators/gateway'

export default class GatewaysController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!

    if (!roleVerify(user, [...roles.manager], response)) {
      return
    }

    const gates = await Gateway.query().orderBy('priority')

    return response.ok(gates)
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

    if (!roleVerify(user, [...roles.manager], response)) {
      return
    }

    const newGate = await request.validateUsing(createGatewayValidator)

    const lastGateway = await Gateway.query().orderBy('priority', 'desc').first()
    const newPriority = lastGateway ? lastGateway.priority + 1 : 0

    const gateway = await Gateway.create({
      name: newGate.name,
      base_url: newGate.base_url,
      requires_auth: newGate.requires_auth ?? false,
      is_active: newGate.is_active ?? false,
      priority: newPriority,
    })

    return response.created(gateway)
  }

  /**
   * Show individual record
   */
  async show({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!

      if (!roleVerify(user, [...roles.manager], response)) {
        return
      }

      const gate = await Gateway.findByOrFail('id', params.id)

      return response.ok(gate)
    } catch (error) {
      return response.notFound({ message: 'Gateway not found' })
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

      if (!roleVerify(user, [...roles.manager], response)) {
        return
      }

      const payload = await request.validateUsing(updateGatewayValidator)

      const gateway = await Gateway.findOrFail(params.id)
      gateway.merge(payload)
      await gateway.save()

      return response.ok(gateway)
    } catch (error) {
      return response.notFound({ message: 'Gateway not found' })
    }
  }

  /**
   * Delete record
   */
  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!

      if (!roleVerify(user, [...roles.manager], response)) {
        return
      }

      const gateway = await Gateway.findOrFail(params.id)
      const deletedPriority = gateway.priority

      await gateway.delete()

      // Reorganize priorities
      await Gateway.query().where('priority', '>', deletedPriority).decrement('priority', 1)

      return response.noContent()
    } catch (error) {
      return response.notFound({ message: 'Gateway not found' })
    }
  }

  /**
   * Update 'is_active' field
   */
  public async updateActive({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!

      if (!roleVerify(user, [...roles.manager], response)) {
        return
      }

      const payload = await request.validateUsing(updateGatewayActiveValidator)

      const gateway = await Gateway.findOrFail(params.id)
      gateway.is_active = payload.is_active
      await gateway.save()

      return response.json(gateway)
    } catch (error) {
      return response.notFound({ message: 'Gateway not found' })
    }
  }

  /**
   * Update 'priority' field
   */
  public async updatePriority({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!
      if (!roleVerify(user, [...roles.manager], response)) {
        return
      }

      const payload = await request.validateUsing(updateGatewayPriorityValidator)
      const gateway = await Gateway.findOrFail(params.id)
      const currentGatewayPosition = gateway.priority

      if (payload.priority === gateway.priority) {
        return response.ok(gateway)
      }

      // Temporary position ("Hole")
      gateway.priority = 99999
      await gateway.save()

      if (payload.priority < currentGatewayPosition) {
        await Gateway.query()
          .where('priority', '>=', payload.priority)
          .where('priority', '<', currentGatewayPosition)
          .orderBy('priority', 'desc')
          .increment('priority', 1)
      } else {
        await Gateway.query()
          .where('priority', '>', currentGatewayPosition)
          .where('priority', '<=', payload.priority)
          .orderBy('priority', 'asc')
          .decrement('priority', 1)
      }

      gateway.priority = payload.priority
      await gateway.save()

      return response.json(gateway)
    } catch (error) {
      return response.notFound({ message: 'Gateway not found' })
    }
  }
}
