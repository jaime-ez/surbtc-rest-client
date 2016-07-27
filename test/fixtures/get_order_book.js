'use strict'

exports.markets = function () {
  return ['BTC-CLP', 'BTC-COP']
}

exports.success = function (args) {
  return {
    success: true,
    order_book: {
      asks: args.order_book.asks,
      bids: args.order_book.bids
    }
  }
}

exports.error = function (args) {
  return {
    success: false,
    error_type: 'invalid_request',
    message: 'Not Found'
  }
}
