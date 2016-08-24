'use strict'

var Client = require('../')
var assert = require('chai').assert
var accountSecret = require('./fixtures/account_info').secret()
var errorFixture = require('./fixtures/create_order').error
var success = require('./fixtures/create_order').success
var orders = require('./fixtures/create_order').orders()
var markets = require('./fixtures/create_order').markets()
var async = require('async')

describe('Surbtc REST Client Create Order', function () {
  async.eachSeries(markets, function (marketId, cb) {
    async.eachSeries(orders, function (order, callback) {
      it('should create order ' + JSON.stringify(order) + ' in market ' + marketId, function (done) {
        var client = new Client({
          api: 'https://stg.surbtc.com/api/v1',
          secret: accountSecret
        })

        client.createOrder(marketId, order, function (error, response) {
          assert(!error)
          assert(response)
          assert.deepEqual(success(response), response)
          done()
        })
        client = undefined
      })
      callback()
    })
    cb()
  })

  async.eachSeries(markets, function (marketId, cb) {
    async.eachSeries(orders, function (order, callback) {
      it('should fail to create order ' + JSON.stringify(order) + ' in market ' + marketId, function (done) {
        var client = new Client({
          api: 'https://stg.surbtc.com/api/v1',
          secret: 'jhgkjhgk'
        })

        client.createOrder(marketId, order, function (error, response) {
          assert(error)
          assert(!response)
          assert.deepEqual(errorFixture(error), error)
          done()
        })
        client = undefined
      })
      callback()
    })
    cb()
  })
})
