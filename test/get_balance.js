'use strict'

var Client = require('../')
var assert = require('chai').assert
var errorFixture = require('./fixtures/get_balance').error
var success = require('./fixtures/get_balance').success
var currencies = require('./fixtures/get_balance').currencies()
var accountSecret = require('./fixtures/account_info').secret
var accountKey = require('./fixtures/account_info').key

var async = require('async')

describe('Surbtc REST Client Get Balance', function () {
  async.eachSeries(currencies, function (currency, cb) {
    it('should get Balance for currency ' + currency, function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/v1',
        key: accountKey,
          secret: accountSecret
      })

      client.getBalances(currency, function (error, response) {
        assert(!error)
        assert(response)
        assert.deepEqual(success(response), response)
        done()
      })
    })
    cb()
  })

  async.eachSeries(currencies, function (currency, cb) {
    it('should fail to get balance for currency ' + currency, function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/12',
        secret: 'asdf'
      })

      client.getBalances(currency, function (error, response) {
        assert(error)
        assert(!response)
        assert.deepEqual(errorFixture(error), error)
        done()
      })
    })
    cb()
  })
})
