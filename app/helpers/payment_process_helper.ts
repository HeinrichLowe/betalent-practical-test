import Gateway from '#models/gateway'
import Product from '#models/product'
import { type CreatePurchasePayload } from '#validators/transaction'

export async function paymentProcessHelper(gateway: Gateway, payload: CreatePurchasePayload) {
  if (gateway.schema === 'EN') {
    let totalAmount = 0
    let allProducts = []

    for (const product of payload.products) {
      const p = await Product.findByOrFail('id', product.id)

      totalAmount += p.amount * product.quantity
      allProducts.push({ id: p.id, name: p.name, price: p.amount, quantity: product.quantity })
    }

    return {
      data: {
        name: payload.client.name,
        email: payload.client.email,
        cardNumber: payload.cardNumber,
        cvv: payload.cvv,
        amount: totalAmount,
        products: allProducts,
      },
      endPoint: 'transactions',
    }
  }

  if (gateway.schema === 'BR' || gateway.schema === 'PT') {
    let totalAmount = 0
    let allProducts = []

    for (const product of payload.products) {
      const p = await Product.findByOrFail('id', product.id)

      totalAmount += p.amount * product.quantity
      allProducts.push({ id: p.id, name: p.name, price: p.amount, quantity: product.quantity })
    }

    return {
      data: {
        nome: payload.client.name,
        email: payload.client.email,
        numeroCartao: payload.cardNumber,
        cvv: payload.cvv,
        valor: totalAmount,
        products: allProducts,
      },
      endPoint: 'transacoes',
    }
  }

  throw new Error(
    `Schema '${gateway.schema}' do Gateway ${gateway.name} não tem mapeamento configurado`
  )
}
