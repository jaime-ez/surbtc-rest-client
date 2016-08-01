'use strict'

exports.success = function (args) {
  return {
    success: true,
    order: {
      id: args.order.id,
      type: args.order.type,
      state: args.order.state,
      limit: args.order.limit,
      amount: args.order.amount,
      original_amount: args.order.original_amount,
      created_at: args.order.created_at,
      market_id: args.order.market_id,
      paid_fee: args.order.paid_fee,
      total_exchanged: args.order.total_exchanged,
      traded_amount: args.order.traded_amount,
      fee_currency: args.order.fee_currency,
      price_type: args.order.price_type,
      weighted_quotation: args.order.weighted_quotation,
      account_id: args.order.account_id
    }
  }
}

exports.error = function (args) {
  if (args.error_type === 'unprocessable_entity') {
    return {
      success: false,
      error_type: 'unprocessable_entity',
      errors: args.errors
    }
  } else {
    return {
      success: false,
      error_type: args.error_type
    }
  }
}

exports.orders = function () {
  return [
    {
      type: 'ask',
      limit: 100,
      amount: 100000,
      price_type: 'limit'
    },
    {
      type: 'bid',
      limit: 100,
      amount: 100000,
      price_type: 'limit'
    },
    {
      type: 'ask',
      limit: 100,
      amount: 100000,
      price_type: 'market'
    },
    {
      type: 'bid',
      limit: 100,
      amount: 100000,
      price_type: 'market'
    }
  ]
}

exports.markets = function () {
  return [
    'BTC-CLP',
    'BTC-COP'
  ]
}
