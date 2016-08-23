'use strict'

exports.success = function (args) {
  return {
    success: true,
    statusCode: args.statusCode,
    quotation: {
      amount: args.quotation.amount,
      base_balance_change: args.quotation.base_balance_change,
      fee: args.quotation.fee,
      incomplete: false,
      order_amount: args.quotation.order_amount,
      quote_balance_change: args.quotation.quote_balance_change,
      reverse: false,
      type: args.quotation.type
    }
  }
}

exports.types = function () {
  return [
    'ask',
    'bid'
  ]
}

exports.markets = function () {
  return [
    'btc-clp',
    'btc-cop'
  ]
}

exports.error = function (args) {
  if (args.message === 'not_enough_orders') {
    return {
      success: false,
      statusCode: args.statusCode,
      error_type: 'server',
      message: 'not_enough_orders'
    }
  } else {
    return {
      success: false,
      statusCode: args.statusCode,
      error_type: args.error_type,
      message: args.message
    }
  }
}
