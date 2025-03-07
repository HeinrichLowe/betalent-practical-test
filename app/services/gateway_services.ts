import Gateway from '#models/gateway'
import { type CreatePurchasePayload } from '#validators/transaction'
import { mapPayloadForGateway } from '../helpers/map_payload_for_gateway.js'

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
    const mappedPayload = mapPayloadForGateway(gateway, payload)

    const url = `${gateway.base_url}/${mappedPayload.endPoint}`
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
      body: JSON.stringify(mappedPayload.data),
    })

    if (!response.ok) {
      return { success: false }
    }

    const responseData = await response.json()
    const typedResponseData = responseData as { id: string }
    return {
      success: true,
      transactionId: typedResponseData.id,
    }
  } catch (error) {
    console.error(`Erro ao processar pagamento no ${gateway.name}:`, error)
    return { success: false }
  }
}
