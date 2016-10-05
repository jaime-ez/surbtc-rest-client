'use strict'

var Client = require('../')
var assert = require('chai').assert
var accountSecret = require('./fixtures/account_info').secret
var accountKey = require('./fixtures/account_info').key

var errorFixture = require('./fixtures/cancel_order_id').error
var success = require('./fixtures/cancel_order_id').success
var orders = require('./fixtures/cancel_order_id').orders()
var async = require('async')

describe('Surbtc REST Client Cancel Order Id', function () {
  async.eachSeries(orders, function (orderId, cb) {
    it('should cancel order ID ' + orderId, function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/v1',
        key: accountKey,
        secret: accountSecret
      })

      client.cancelOrderId(orderId, function (error, response) {
        assert(!error)
        assert(response)
        assert.deepEqual(success(response), response)
        done()
      })
    })
    cb()
  })

  async.eachSeries(orders, function (orderId, cb) {
    it('should fail to cancel order ID ' + orderId, function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/12',
        secret: 'akdjs'
      })

      client.cancelOrderId(orderId, function (error, response) {
        assert(error)
        assert(!response)
        assert.deepEqual(errorFixture(error), error)
        done()
      })
    })
    cb()
  })
})
