'use strict'

var Client = require('../')
var assert = require('chai').assert
var accountSecret = require('./fixtures/account_info').secret()
var errorFixture = require('./fixtures/get_orders').error
var success = require('./fixtures/get_orders').success
var markets = require('./fixtures/get_orders').markets()
var async = require('async')

describe('Surbtc REST Client Get Orders', function () {
  async.eachSeries(markets, function (marketId, cb) {
    it('should get orders for market ' + marketId, function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/',
        secret: accountSecret
      })

      client.getOrders(marketId, function (error, response) {
        assert(!error)
        assert(response)
        assert.deepEqual(success(response), response)
        done()
      })
    })
    cb()
  })

  async.eachSeries(markets, function (marketId, cb) {
    it('should fail to get orders for market ' + marketId, function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/',
        secret: 'dfg'
      })

      client.getOrders(marketId, function (error, response) {
        assert(error)
        assert(!response)
        assert.deepEqual(errorFixture(error), error)
        done()
      })
    })
    cb()
  })
})
