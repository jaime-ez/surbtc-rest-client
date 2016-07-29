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

Client.prototype.createOrder = function (marketId, order, callback) {
  var url = this.api + 'v1/markets/' + marketId + '/orders'

  if (this.secret !== '') {
    url += '?api_key=' + this.secret
  } else {
    return callback(new Error('InvalidRequest:ApiKeyRequired'))
  }

  http
  .post(url)
  .set({'Accept': 'application/json', 'Content-Type': 'application/json'})
  .send(order)
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json)
    }

    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype._getOrderPages = function (orders, marketId, callback, loopFunction) {
  var self = this

  // check if there are any more pages
  var page = _.toNumber(orders.meta.current_page)

  if (orders.success && page < orders.meta.total_pages) {
    ++page

    self.getOrdersRaw(marketId, page, function (error, response) {
      if (error) {
        callback(error, null)
        return
      }

      orders.orders = _.concat(orders.orders, response.orders)
      orders.meta.current_page = page

      loopFunction(orders, marketId, callback, loopFunction)
    })
  } else {
    callback(null, orders)
  }
}

Client.prototype.pollOrders = function (orders, marketId, callback) {
  var self = this

  self._getOrderPages(orders, marketId, callback,
    self._getOrderPages.bind(this))
}

Client.prototype.getOrdersRaw = function (marketId, page, callback) {
  var url = this.api + 'v1/markets/' + marketId + '/orders'

  if (this.secret !== '') {
    url += '?api_key=' + this.secret
  } else {
    return callback(new Error('InvalidRequest:ApiKeyRequired'))
  }

  if (page) {
    url += '&page=' + page
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

Client.prototype.getOrders = function (marketId, callback) {
  var self = this

  async.waterfall([
    function (next) {
      self.getOrdersRaw(marketId, 0, next)
    },
    function (orders, next) {
      self.pollOrders(orders, marketId, next)
    }
  ], callback)
}

module.exports = Client
