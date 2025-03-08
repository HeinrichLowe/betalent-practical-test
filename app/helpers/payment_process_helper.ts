import Gateway from '#models/gateway'
import Product from '#models/product'
import { type CreatePurchasePayload } from '#validators/transaction'

export async function paymentProcessHelper(gateway: Gateway, payload: CreatePurchasePayload) {
  if (gateway.schema === 'EN') {
    let totalAmount = 0

    for (const product of payload.products) {
      const p = await Product.findByOrFail('id', product.id)

      totalAmount += p.amount * product.quantity
    }

    return {
      data: {
        amount: totalAmount,
        name: payload.client.name,
        email: payload.client.email,
        cardNumber: payload.cardNumber,
        cvv: payload.cvv,
      },
      endPoint: 'transactions',
    }
  }

  if (gateway.schema === 'BR' || gateway.schema === 'PT') {
    let totalAmount = 0

    for (const product of payload.products) {
      const p = await Product.findByOrFail('id', product.id)

      totalAmount += p.amount * product.quantity
    }

    return {
      data: {
        valor: totalAmount,
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
