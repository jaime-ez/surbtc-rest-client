'use strict'

exports.orders = function () {
  return [452193, 452194]
}

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
      fee_currency: args.order.fee_currency,
      price_type: args.order.price_type,
      weighted_quotation: args.order.weighted_quotation,
      account_id: args.order.account_id
    }
  }
}

exports.error = function (args) {
  if (args.error_type === 'order_not_valid_for_canceling') {
    return {
      success: false,
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
        fee_currency: args.order.fee_currency,
        price_type: args.order.price_type,
        weighted_quotation: args.order.weighted_quotation,
        account_id: args.order.account_id
      },
      error_type: 'order_not_valid_for_canceling'
    }
  } else {
    return {
      success: false,
      error_type: args.error_type
    }
  }
}
