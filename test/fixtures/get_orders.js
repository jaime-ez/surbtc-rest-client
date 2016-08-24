'use strict'

exports.markets = function () {
  return ['btc-clp', 'btc-cop']
}

exports.success = function (args) {
  return {
    success: true,
    statusCode: args.statusCode,
    orders: args.orders,
    meta: args.meta
  }
}

exports.error = function (args) {
  return {
    success: false,
    statusCode: args.statusCode,
    error_type: args.error_type
  }
}
