'use strict'

exports.success = function (args) {
  return {
    success: true,
    statusCode: args.statusCode,
    fee_percentage: {
      value: args.fee_percentage.value
    }
  }
}

exports.error = function (args) {
  return {
    success: false,
    statusCode: args.statusCode,
    error_type: args.error_type
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
