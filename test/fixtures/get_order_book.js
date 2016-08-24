'use strict'

exports.markets = function () {
  return ['btc-clp', 'btc-cop']
}

exports.success = function (args) {
  return {
    success: true,
    statusCode: args.statusCode,
    order_book: {
      asks: args.order_book.asks,
      bids: args.order_book.bids
    }
  }
}

exports.error = function (args) {
  return {
    success: false,
    statusCode: args.statusCode,
    error_type: 'invalid_request'
  }
}
