'use strict';

var _ = require('lodash');

exports.success = function(args) {
  var fixture = {
    success: true,
    markets: []
  };

  _.forEach(args.markets, function(body) {
    fixture.markets.push({
      name: body.name,
      base_currency: body.base_currency,
      quote_currency: body.quote_currency
    });
  });

  return fixture;
};

exports.error = function() {
  return {
    success: false,
    error_type: 'invalid_request',
    message: 'Not Found'
  };
};
