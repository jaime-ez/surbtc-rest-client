'use strict'

var async = require('async')
var uuid = require('node-uuid')
var http = require('superagent')
var _ = require('lodash')
var responseHandler = require('./lib/response_handler')

var errors = require('./lib/errors')

function Client (options) {
  this.api = options.api || 'https://surbtc.com/api/'
  this.account = options.account
  this.secret = options.secret || 'a061fc555331d1285a89b012676d6e7c'
  this.version = options.version || 1
  this.sourceCurrency = options.sourceCurrency || 'CLP'
  this.destinationCurrency = options.destinationCurrency || 'COP'
  this.bridgeCurrency = options.bridgeCurrency || 'BTC'
  this.params = options.params || {}
}

Client.prototype.getMarkets = function (callback) {
  var url = this.api + 'v1/markets'
  http
  .get(url)
  .set({'Accept': 'application/json', 'Content-Type': 'application/json'})
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype.getExchangeFee = function (marketId, type, marketOrder, callback) {
  _.capitalize(type)
  var url = this.api + 'v1/markets/' + marketId + '/fee_percentage?type=' + type

  if (this.secret !== '') {
    url += '&api_key=' + this.secret
  } else {
    return callback(new Error('InvalidRequest:ApiKeyRequired'))
  }

  if (marketOrder && _.isFunction(marketOrder)) {
    callback = marketOrder
  }

  if (marketOrder && !_.isFunction(marketOrder)) {
    url += '&market_order=true'
  }

  http
  .get(url)
  .set({'Accept': 'application/json', 'Content-Type': 'application/json'})
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype.generateUUID = function (callback) {
  callback(null, {status: 'success', uuid: uuid.v4()})
}

Client.prototype.getOrderBook = function (marketId, callback) {
  var url = this.api + 'v1/markets/' + marketId + '/order_book'

  http
  .get(url)
  .set({'Accept': 'application/json', 'Content-Type': 'application/json'})
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype.getQuotation = function (marketId, type, total, callback) {
  var url = this.api + 'v1/markets/' + marketId + '/quotation?type=' + type + '&total=' + total

  http
  .get(url)
  .set({'Accept': 'application/json', 'Content-Type': 'application/json'})
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json)
    }

    var res = JSON.parse(response.text)
    if (res.quotation.success) {
      delete res.quotation.success
      responseHandler.success(response, res)
    } else {
      res.status = 503
      res.error = res.quotation.error_message
      responseHandler.errorSet(response, res)
    }

    callback(null, response.json)
  })
}

Client.prototype.getReverseQuotation = function (marketId, type, amount, callback) {
  var url = this.api + 'v1/markets/' + marketId + '/reverse_quotation?type=' + type + '&amount=' + amount

  http
  .get(url)
  .set({'Accept': 'application/json', 'Content-Type': 'application/json'})
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json)
    }

    var res = response.body
    if (res.reverse_quotation.success) {
      delete res.reverse_quotation.success
      responseHandler.success(response, res)
    } else {
      res.status = 503
      res.error = res.reverse_quotation.error_message
      responseHandler.errorSet(response, res)
    }

    callback(null, response.json)
  })
}

module.exports = Client
