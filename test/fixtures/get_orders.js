'use strict'

exports.markets = function () {
  return ['BTC-CLP', 'BTC-COP']
}

exports.success = function (args) {
  return {
    success: true,
    orders: args.orders,
    meta: args.meta
  }
}

exports.error = function (args) {
  return {
    success: false,
    error_type: args.error_type
  }
}
