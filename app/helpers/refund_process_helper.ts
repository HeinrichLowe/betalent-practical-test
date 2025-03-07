import Gateway from '#models/gateway'
import Transaction from '#models/transaction'

export function refundProcessHelper(gateway: Gateway, transaction: Transaction) {
  if (gateway.schema === 'EN') {
    return {
      body: undefined,
      endPoint: `transactions/${transaction.external_id}/charge_back`,
    }
  }

  if (gateway.schema === 'BR' || gateway.schema === 'PT') {
    return {
      body: {
        id: transaction.external_id,
      },
      endPoint: 'transacoes/reembolso',
    }
  }

  throw new Error(
    `Schema '${gateway.schema}' do Gateway ${gateway.name} não tem mapeamento configurado`
  )
}
