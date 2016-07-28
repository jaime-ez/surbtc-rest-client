'use strict'

var Client = require('../')
var assert = require('chai').assert
var errorFixture = require('./fixtures/get_order_book').error
var success = require('./fixtures/get_order_book').success
var markets = require('./fixtures/get_order_book').markets()
var async = require('async')

describe('Surbtc REST Client Get Order Book', function () {
  async.eachSeries(markets, function (marketId, cb) {
    it('should get order books for market ' + marketId, function (done) {
      var client = new Client({})
      client.getOrderBook(marketId, function (error, response) {
        assert(!error)
        assert(response)
        assert.deepEqual(success(response), response)
        done()
      })
    })
    cb()
  })

  async.eachSeries(markets, function (marketId, cb) {
    it('should fail to get order books for market ' + marketId, function (done) {
      var client = new Client({
        api: 'https://surbtc.com/api/v1/marketmarket'
      })

      client.getOrderBook(marketId, function (error, response) {
        assert(error)
        assert(!response)
        assert.deepEqual(errorFixture(), error)
        done()
      })
    })
    cb()
  })
})
