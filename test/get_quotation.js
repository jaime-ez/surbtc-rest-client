'use strict'

var Client = require('../')
var assert = require('chai').assert
var errorFixture = require('./fixtures/get_quotation').error
var success = require('./fixtures/get_quotation').success
var types = require('./fixtures/get_quotation').types()
var markets = require('./fixtures/get_quotation').markets()
var accountSecret = require('./fixtures/account_info').secret
var accountKey = require('./fixtures/account_info').key

var async = require('async')
var total = 1

describe('Surbtc REST Client Get Quotation', function () {
  async.eachSeries(types, function (type, cb) {
    async.eachSeries(markets, function (marketId, callback) {
      it('should get quotation for limit order type ' + type + ' in market ' + marketId + ' for total ' + total, function (done) {
        var client = new Client({
          api: 'https://stg.surbtc.com/api/v1',
          key: accountKey,
          secret: accountSecret
        })

        client.getQuotation(marketId, type, total, function (error, response) {
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
      it('should fail to get quotation for limit order type ' + type + ' in market ' + marketId, function (done) {
        var client = new Client({
          api: 'https://surbtc.com/api/123'
        })

        client.getQuotation(marketId, type, total, function (error, response) {
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
