'use strict'

var crypto = require('crypto')
var url = require('url')
var async = require('async')
var uuid = require('node-uuid')
var http = require('superagent')
var _ = require('lodash')
require('bitcoin-math')
var bitcoinAddress = require('bitcoin-address')

var responseHandler = require('./lib/response_handler')
var colombiaBanks = require('./lib/banks').colombia

function Client (options) {
  this.api = options.api || 'https://www.surbtc.com/api/v1'
  this.key = options.key || ''
  this.secret = options.secret || ''
  this.params = options.params || {}
  this.headers = options.headers || {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

Client.prototype._getFullUrl = function (path) {
  return this.api + path
}

Client.prototype._getHmac = function (nonce, method, path, data) {
  // Returns a HMAC based on surBTC auth scheme to be
  // used to build headers when auth is required

  var fullPath = url.parse(this._getFullUrl(path)).path
  var message = ''

  if (method === 'GET') {
    message = 'GET' + ' ' + fullPath + ' ' + nonce
  } else if (method === 'POST' || method === 'PUT') {
    var encodedData = new Buffer(JSON.stringify(data)).toString('base64')
    message = method + ' ' + fullPath + ' ' + encodedData + ' ' + nonce
  } else {
    console.error('Authentication for ' + method + ' is not implemented')
    return
  }

  return crypto
    .createHmac('sha384', this.secret)
    .update(message)
    .digest('hex')
}

Client.prototype._getAuthHeaders = function (method, path, data) {
  // Returns headers for requests that requires auth
  var timestamp = new Date().getTime()

  var authHeaders = {
    'X-SBTC-APIKEY': this.key,
    'X-SBTC-NONCE': timestamp,
    'X-SBTC-SIGNATURE': this._getHmac(timestamp, method, path, data)
  }

  for (var attrname in this.headers) {
    authHeaders[attrname] = this.headers[attrname]
  }

  return authHeaders
}

Client.prototype.getMarkets = function (callback) {
  var path = '/markets'

  http
  .get(this._getFullUrl(path))
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
  // Requires auth
  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  http
  .get(this._getFullUrl(path))
  .set(this._getAuthHeaders('GET', path))
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
  // Requires auth
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
  .get(this._getFullUrl(path))
  .set(this._getAuthHeaders('GET', path))
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
  .get(this._getFullUrl(path))
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
  // Requires auth
  type = _.lowerCase(type)

  var path = '/markets/' + marketId + '/quotations'

  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  var data = {
    quotation: {
      type: type,
      reverse: false,
      amount: amount
    }
  }

  http
  .post(this._getFullUrl(path))
  .send(data)
  .set(this._getAuthHeaders('POST', path, data))
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
  // Requires auth
  type = _.lowerCase(type)

  var path = '/markets/' + marketId + '/quotations'

  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  var data = {
    quotation: {
      type: type,
      reverse: true,
      amount: amount
    }
  }

  http
  .post(this._getFullUrl(path))
  .send(data)
  .set(this._getAuthHeaders('POST', path, data))
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
  // Requires auth
  var path = '/markets/' + marketId + '/orders'

  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  http
  .post(this._getFullUrl(path))
  .set(this._getAuthHeaders('POST', path, order))
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
  // Requires auth
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
  .get(this._getFullUrl(path))
  .set(this._getAuthHeaders('GET', path))
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
  // Requires auth
  var path = '/orders/' + orderId

  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  http
  .get(this._getFullUrl(path))
  .set(this._getAuthHeaders('GET', path))
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
  // Requires auth
  var path = '/orders/' + orderId

  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  var data = { state: 'canceling' }

  http
  .put(this._getFullUrl(path))
  .set(this._getAuthHeaders('PUT', path, data))
  .send(data)
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

Client.prototype.registerBankAccount = function (opts, callback) {
  var currency = _.toUpper(opts.bank_currency)

  var path = '/fiat_accounts/' + currency

  // get bank id
  var bankId = _.find(colombiaBanks, {name: opts.bank_name}).id

  var surbtcOpts = {
    email: opts.email,
    phone: opts.phone,
    document_number: opts.bank_account_holder_id,
    full_name: opts.bank_account_holder_name,
    account_number: opts.bank_account_number,
    account_type: opts.bank_account_type,
    bank_id: bankId
  }

  // Requires auth
  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  http
  .put(this._getFullUrl(path))
  .set(this._getAuthHeaders('PUT', path, surbtcOpts))
  .send(surbtcOpts)
  .end(function (error, response) {
    if (error) {
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype.requestWithdrawal = function (opts, callback) {
  var path = '/withdrawals'

  opts.currency = _.toUpper(opts.currency)

  var withdrawalOpts = {
    withdrawal_data: {},
    amount: 0,
    currency: opts.currency
  }

  if (opts.currency === 'BTC') {
    console.log('testnet', bitcoinAddress.validate(opts.target_address, 'testnet'))
    console.log('prod', bitcoinAddress.validate(opts.target_address, 'prod'))
    // validate target address
    if ((this.api.indexOf('stg') > 0 && !bitcoinAddress.validate(opts.target_address, 'testnet')) ||
       (this.api.indexOf('stg') < 0 && !bitcoinAddress.validate(opts.target_address, 'prod'))) {
      var err1 = {}
      responseHandler.invalidRequest(err1, 'InvalidRequest:InvalidBitcoinAddress', null)
      return callback(err1.json, null)
    } else {
      withdrawalOpts.withdrawal_data.target_address = opts.target_address
    }

    // BTC to satoshis
    withdrawalOpts.amount = opts.amount.toSatoshi()
  } else if (opts.currency === 'CLP' || opts.currency === 'COP') {
    withdrawalOpts.amount = opts.amount * 100
  }

  // Requires auth
  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  http
  .post(this._getFullUrl(path))
  .set(this._getAuthHeaders('POST', path, withdrawalOpts))
  .send(withdrawalOpts)
  .end(function (error, response) {
    if (error) {
      console.log(error)
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

Client.prototype.registerDeposit = function (opts, callback) {
  var path = '/deposits'

  var depositOpts = {
    amount: opts.amount * 100,
    currency: _.toUpper(opts.currency)
  }

  // Requires auth
  if (this.secret === '') {
    var err = {}
    responseHandler.invalidRequest(err, 'InvalidRequest:ApiKeyRequired', null)
    return callback(err.json, null)
  }

  http
  .post(this._getFullUrl(path))
  .set(this._getAuthHeaders('POST', path, depositOpts))
  .send(depositOpts)
  .end(function (error, response) {
    if (error) {
      console.log(error)
      responseHandler.errorSet(error, error.response.error)
      return callback(error.json, null)
    }
    responseHandler.success(response, response.body)
    callback(null, response.json)
  })
}

module.exports = Client
