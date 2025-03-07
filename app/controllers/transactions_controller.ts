import type { HttpContext } from '@adonisjs/core/http'
import { roleVerify } from '../helpers/role_verify.js'
import { roles } from '../constants/roles.js'
import Transaction from '#models/transaction'
import Client from '#models/client'
import Gateway from '#models/gateway'
import { createPurchaseValidator } from '#validators/transaction'
import { processPayment, processRefund } from '#services/gateway_services'

export default class TransactionsController {
  async index({ auth, response }: HttpContext) {
    const user = auth.user!

    if (!roleVerify(user, [...roles.finance], response)) {
      return
    }

    const transactions = await Transaction.query().orderBy('created_at', 'desc')

    return response.ok(transactions)
  }

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

  async refund({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!
      const rolex = roles.finance.filter((role) => role === 'ADMIN' || role === 'FINANCE')
      if (!roleVerify(user, rolex, response)) {
        return
      }

      const transaction = await Transaction.findOrFail(params.id)

      if (transaction.status === 'refunded') {
        return response.badRequest({ message: 'Esta transação já foi reembolsada' })
      }

      const gateway = await Gateway.findOrFail(transaction.gatewayId)

      if (!gateway.is_active) {
        return response.serviceUnavailable({ message: `${gateway.name} está inativo` })
      }

      const refundResult = await processRefund(gateway, transaction)

      if (!refundResult.success) {
        return response.status(502).json({ message: 'Reembolso falhou no gateway' })
      }

      transaction.status = 'refunded'
      await transaction.save()

      return response.ok(transaction)
    } catch (error) {
      response.internalServerError(error)
    }
  }
}
