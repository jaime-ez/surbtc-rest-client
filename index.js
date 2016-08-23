'use strict'

var async = require('async')
var uuid = require('node-uuid')
var http = require('superagent')
var _ = require('lodash')
var responseHandler = require('./lib/response_handler')

function Client (options) {
  this.api = options.api || 'https://surbtc.com/api/v1'
  this.secret = options.secret || ''
  this.params = options.params || {}
  this.headers = options.headers || {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

Client.prototype.getFullUrl = function (path) {
  // FIXME: Don't pass the secret if the method doesn't require it
  var url = this.api + path
  if (this.secret !== '') {
    var paramToken = path.indexOf('?') === -1 ? '?' : '&'
    return (url + paramToken + 'api_key=' + this.secret)
  }
  return url
}

Client.prototype.getMarkets = function (callback) {
  var path = '/markets'

  http
  .get(this.getFullUrl(path))
  .set(this.headers)
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype.getBalances = function (currency, callback) {
  var path = '/balances/' + currency
  // Requires API_KEY
  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  http
  .get(this.getFullUrl(path))
  .set(this.headers)
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype.getExchangeFee = function (marketId, type, marketOrder, callback) {
  // Requires API_KEY
  type = _.capitalize(type)

  var path = '/markets/' + marketId + '/fee_percentage?type=' + type

  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  if (marketOrder) {
    if (_.isFunction(marketOrder)) {
      callback = marketOrder
    } else {
      path += '&market_order=true'
    }
  }

  http
  .get(this.getFullUrl(path))
  .set(this.headers)
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype.generateUUID = function (callback) {
  callback(null, {status: 'success', uuid: uuid.v4()})
}

Client.prototype.getOrderBook = function (marketId, callback) {
  var path = '/markets/' + marketId + '/order_book'

  http
  .get(this.getFullUrl(path))
  .set(this.headers)
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype.getQuotation = function (marketId, type, amount, callback) {
  // Requires API_KEY

  var path = '/markets/' + marketId + '/quotations'

  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  http
  .post(this.getFullUrl(path))
  .send({
    quotation: {
      type: type,
      reverse: false,
      amount: amount
    }
  })
  .set(this.headers)
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype.getReverseQuotation = function (marketId, type, amount, callback) {
  // Requires API_KEY

  var path = '/markets/' + marketId + '/quotations'

  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  http
  .post(this.getFullUrl(path))
  .send({
    quotation: {
      type: type,
      reverse: true,
      amount: amount
    }
  })
  .set(this.headers)
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype.createOrder = function (marketId, order, callback) {
  // Requires API_KEY
  var path = '/markets/' + marketId + '/orders'

  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }
  http
  .post(this.getFullUrl(path))
  .set(this.headers)
  .send(order)
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
    }

    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype._getOrderPages = function (orders, marketId, state, callback, loopFunction) {
  var self = this

  // check if there are any more pages
  var page = _.toNumber(orders.meta.current_page)

  // filter orders by state
  if (orders.success && state) {
    orders.orders = _.filter(orders.orders, {state: state})
    if (page === orders.meta.total_pages) {
      orders.meta = {total_count: orders.orders.length}
    }
  }

  if (orders.success && page < orders.meta.total_pages) {
    ++page

    self.getOrdersRaw(marketId, page, function (error, response) {
      if (error) {
        callback(error, null)
        return
      }

      orders.orders = _.concat(orders.orders, response.orders)
      orders.meta.current_page = page

      loopFunction(orders, marketId, state, callback, loopFunction)
    })
  } else {
    callback(null, orders)
  }
}

Client.prototype._getOrderState = function (order, status, callback, loopFunction) {
  var self = this

  if (order.success && order.order.state !== status) {
    self.getOrderId(order.order.id, function (error, response) {
      if (error) {
        return callback(error, null)
      }

      setTimeout(function () {
        loopFunction(response, status, callback, loopFunction)
      }, 500)
    })
  } else {
    callback(null, order)
  }
}

Client.prototype.pollOrders = function (orders, marketId, state, callback) {
  var self = this

  self._getOrderPages(orders, marketId, state, callback,
    self._getOrderPages.bind(this))
}

Client.prototype.pollOrderState = function (order, status, callback) {
  var self = this

  self._getOrderState(order, status, callback,
    self._getOrderState.bind(this))
}

Client.prototype.getOrdersRaw = function (marketId, page, callback) {
  // Requires API_KEY
  var path = '/markets/' + marketId + '/orders'

  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  if (page) {
    path += '?page=' + page
  }

  http
  .get(this.getFullUrl(path))
  .set(this.headers)
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
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
      self.pollOrders(orders, marketId, false, next)
    }
  ], callback)
}

Client.prototype.getOrdersByState = function (marketId, state, callback) {
  var self = this

  async.waterfall([
    function (next) {
      self.getOrdersRaw(marketId, 0, next)
    },
    function (orders, next) {
      self.pollOrders(orders, marketId, state, next)
    }
  ], callback)
}

Client.prototype.getOrderId = function (orderId, callback) {
  // Requires API_KEY
  var path = '/orders/' + orderId

  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  http
  .get(this.getFullUrl(path))
  .set(this.headers)
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype.cancelOrderId = function (orderId, callback) {
  // Requires API_KEY
  var path = '/orders/' + orderId

  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  http
  .put(this.getFullUrl(path))
  .set(this.headers)
  .send({state: 'canceling'})
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
    }
    responseHandler.success(response, response.body)
    if (response.json.order.state !== 'canceling' && response.json.order.state !== 'canceled') {
      response.json.success = false
      response.json.error_type = 'order_not_valid_for_canceling'
      return callback(response.json, null)
    }
    callback(null, response.json)
  })
}

Client.prototype.createAndTradeOrder = function (marketId, order, callback) {
  var self = this

  async.waterfall([
    function (next) {
      self.createOrder(marketId, order, next)
    },
    function (createdOrder, next) {
      self.pollOrderState(createdOrder, 'traded', next)
    }
  ], callback)
}

module.exports = Client
