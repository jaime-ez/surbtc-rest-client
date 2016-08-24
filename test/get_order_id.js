'use strict'

var Client = require('../')
var assert = require('chai').assert
var accountSecret = require('./fixtures/account_info').secret()
var errorFixture = require('./fixtures/get_order_id').error
var success = require('./fixtures/get_order_id').success
var orders = require('./fixtures/get_order_id').orders()
var async = require('async')

describe('Surbtc REST Client Get Order Id', function () {
  async.eachSeries(orders, function (orderId, cb) {
    it('should get order ID ' + orderId, function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/v1',
        secret: accountSecret
      })

      client.getOrderId(orderId, function (error, response) {
        assert(!error)
        assert(response)
        assert.deepEqual(success(response), response)
        done()
      })
    })
    cb()
  })

  async.eachSeries(orders, function (orderId, cb) {
    it('should fail to get order ID ' + orderId, function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/v1',
        secret: 'jka'
      })

      client.getOrderId(orderId, function (error, response) {
        assert(error)
        assert(!response)
        assert.deepEqual(errorFixture(error), error)
        done()
      })
    })
    cb()
  })
})
