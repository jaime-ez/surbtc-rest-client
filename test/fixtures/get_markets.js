'use strict'

var _ = require('lodash')

exports.success = function (args) {
  var fixture = {
    success: true,
    statusCode: args.statusCode,
    markets: []
  }

  _.forEach(args.markets, function (body) {
    fixture.markets.push({
      name: body.name,
      base_currency: body.base_currency,
      quote_currency: body.quote_currency
    })
  })

  return fixture
}

exports.error = function (args) {
  return {
    success: false,
    statusCode: args.statusCode,
    error_type: 'invalid_request'
  }
}
