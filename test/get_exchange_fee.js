'use strict'

var Client = require('../')
var assert = require('chai').assert
var accountSecret = require('./fixtures/account_info').secret()
var errorFixture = require('./fixtures/get_exchange_fee').error
var success = require('./fixtures/get_exchange_fee').success
var types = require('./fixtures/get_exchange_fee').types()
var markets = require('./fixtures/get_exchange_fee').markets()
var async = require('async')

describe('Surbtc REST Client Get Exchange Fee', function () {
  async.eachSeries(types, function (type, cb) {
    async.eachSeries(markets, function (marketId, callback) {
      it('should get exchange fee for limit order type ' + type + ' in market ' + marketId, function (done) {
        var client = new Client({
          api: 'https://stg.surbtc.com/api/',
          secret: accountSecret
        })

        client.getExchangeFee(marketId, type, function (error, response) {
          assert(!error)
          assert(response)
          assert.deepEqual(success(response), response)
          done()
        })
        client = undefined
      })

      it('should get exchange fee for market_order order type ' + type + ' in market ' + marketId, function (done) {
        var client = new Client({
          api: 'https://stg.surbtc.com/api/',
          secret: accountSecret
        })

        client.getExchangeFee(marketId, type, 'market_order', function (error, response) {
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

  async.eachSeries(types, function (type, cb) {
    async.eachSeries(markets, function (marketId, callback) {
      it('should fail to get exchange fee for limit order type ' + type + ' in market ' + marketId, function (done) {
        var client = new Client({
          api: 'https://stg.surbtc.com/api/',
          secret: 'jhgkjhgk'
        })

        client.getExchangeFee(marketId, type, function (error, response) {
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
