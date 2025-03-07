import type { HttpContext } from '@adonisjs/core/http'
import { roleVerify } from '../helpers/role_verify.js'
import { roles } from '../constants/roles.js'
import Transaction from '#models/transaction'
import Client from '#models/client'
import Gateway from '#models/gateway'
import { createPurchaseValidator } from '#validators/transaction'
import { processPayment } from '#services/gateway_services'

export default class TransactionsController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!

    if (!roleVerify(user, [...roles.finance], response)) {
      return
    }

    const transactions = await Transaction.query().orderBy('created_at', 'asc')

    return response.ok(transactions)
  }

  /**
   * Display form to create a new record
   */
  //async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createPurchaseValidator)

      const client = await Client.findByOrFail({ email: payload.client.email })
      const gateways = await Gateway.query().where('is_active', true).orderBy('priority', 'asc')

      if (gateways.length === 0) {
        return response.status(500).json({ message: 'Nenhum gateway disponível' })
      }

      let successfulGateway
      let externalTransactionId

      for (const gateway of gateways) {
        const result = await processPayment(gateway, payload)

        if (result.success) {
          successfulGateway = gateway
          externalTransactionId = result.transactionId
          break
        }
      }

      if (!successfulGateway) {
        return response.status(502).json({ message: 'Pagamento recusado por todos os gateways' })
      }

      const transaction = await Transaction.create({
        clientId: client.id,
        gatewayId: successfulGateway.id,
        external_id: externalTransactionId,
        amount: payload.amount,
        cardLastNumbers: payload.cardNumber.slice(-4),
      })

      return response.status(201).json(transaction)
    } catch (error) {
      return response.internalServerError(error)
    }
  }

  /**
   * Show individual record
   */
  //async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  //async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  //async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  //async destroy({ params }: HttpContext) {}
}
