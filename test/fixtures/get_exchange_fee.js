'use strict';

exports.success = function (args) {
  return {
    success: true,
    fee_percentage: {
      value:args.fee_percentage.value
    }
  }
}

exports.error = function (args) {
  return {
    success: false,
    error_type: args.error_type
  }
}

exports.types = function() {
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
