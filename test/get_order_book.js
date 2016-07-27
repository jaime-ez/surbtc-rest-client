'use strict'

var Client = require('../')
var assert = require('chai').assert
var errorFixture = require('./fixtures/get_order_book').error
var success = require('./fixtures/get_order_book').success
var marketId = require('./fixtures/get_order_book').markets()[0]

/*
  How can i test all markets at once? With async or forEach I have callback problems
*/

describe('Surbtc REST Client Get Order Book', function () {
  it('should get order books for market ' + marketId, function (done) {
    var client = new Client({})
    client.getOrderBook(marketId, function (error, response) {
      assert(!error)
      assert(response)
      assert.deepEqual(success(response), response)
      done()
    })
  })

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
})
