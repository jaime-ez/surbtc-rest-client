'use strict'

exports.success = function (args) {
  return {
    success: true,
    quotation: {
      amount: args.quotation.amount,
      expected_base_change: args.quotation.expected_base_change,
      error_message: args.quotation.error_message,
      price: args.quotation.price
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
