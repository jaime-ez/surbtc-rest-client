'use strict'

exports.success = function (args) {
  return {
    success: true,
    reverse_quotation: {
      amount: args.reverse_quotation.amount,
      total: args.reverse_quotation.total,
      error_message: args.reverse_quotation.error_message,
      price: args.reverse_quotation.price
    }
  }
}

exports.types = function () {
  return [
    'Ask',
    'Bid'
  ]
}

exports.markets = function () {
  return [
    'BTC-CLP',
    'BTC-COP'
  ]
}

exports.error = function (args) {
  if (args.message === 'not_enough_orders') {
    return {
      success: false,
      error_type: 'server',
      message: 'not_enough_orders'
    }
  } else {
    return {
      success: false,
      error_type: args.error_type
    }
  }
}
