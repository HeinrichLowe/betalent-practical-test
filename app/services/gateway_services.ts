import Gateway from '#models/gateway'
import Transaction from '#models/transaction'
import { type CreatePurchasePayload } from '#validators/transaction'
import { paymentProcessHelper } from '../helpers/payment_process_helper.js'
import { refundProcessHelper } from '../helpers/refund_process_helper.js'

/*interface PurchasePayload {
  amount: number
  nameOnCard: string
  cardNumber: string
  cvv: string
  client: {
    name: string
    email: string
  }
}*/

export async function processPayment(gateway: Gateway, payload: CreatePurchasePayload) {
  try {
    const processedPayload = await paymentProcessHelper(gateway, payload)

    const url = `${gateway.base_url}/${processedPayload.endPoint}`
    const headers = gateway.requires_auth
      ? {
          'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
          'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
        }
      : undefined

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(processedPayload.data),
    })

    if (!response.ok) {
      return { success: false }
    }

    const responseData = await response.json()
    const typedResponseData = responseData as { id: string }
    return {
      success: true,
      transactionId: typedResponseData.id,
      totalAmount: processedPayload.data.amount,
      allProducts: processedPayload.data.products,
    }
  } catch (error) {
    console.error(`Erro ao processar pagamento no ${gateway.name}:`, error)
    return { success: false }
  }
}

export async function processRefund(gateway: Gateway, transaction: Transaction) {
  try {
    const refundHelper = refundProcessHelper(gateway, transaction)
    const url = `${gateway.base_url}/${refundHelper.endPoint}`

    const headers = gateway.requires_auth
      ? {
          'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
          'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
        }
      : undefined

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: refundHelper.body ? JSON.stringify(refundHelper.body) : undefined,
    })

    if (!response.ok) {
      console.error(`Erro no reembolso via ${gateway.name}, status: ${response.status}`)
      return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error(`Erro ao processar reembolso no ${gateway.name}:`, error)
    return { success: false }
  }
}
