import Gateway from '#models/gateway'
import { type CreatePurchasePayload } from '#validators/transaction'

export function paymentProcessHelper(gateway: Gateway, payload: CreatePurchasePayload) {
  if (gateway.schema === 'EN') {
    return {
      data: {
        amount: payload.amount,
        name: payload.client.name,
        email: payload.client.email,
        cardNumber: payload.cardNumber,
        cvv: payload.cvv,
      },
      endPoint: 'transactions',
    }
  }

  if (gateway.schema === 'BR' || gateway.schema === 'PT') {
    return {
      data: {
        valor: payload.amount,
        nome: payload.client.name,
        email: payload.client.email,
        numeroCartao: payload.cardNumber,
        cvv: payload.cvv,
      },
      endPoint: 'transacoes',
    }
  }

  throw new Error(
    `Schema '${gateway.schema}' do Gateway ${gateway.name} não tem mapeamento configurado`
  )
}
