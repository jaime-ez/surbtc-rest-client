'use strict'

var Client = require('../')
var assert = require('chai').assert
var accountSecret = require('./fixtures/account_info').secret
var accountKey = require('./fixtures/account_info').key

var errorFixture = require('./fixtures/register_deposit').error
var success = require('./fixtures/register_deposit').success
var deposits = require('./fixtures/register_deposit').deposits()
var async = require('async')

describe('Surbtc REST Client Register Deposit', function () {
  async.eachSeries(deposits, function (deposit, cb) {
    it('should register deposit ' + JSON.stringify(deposit), function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/v1',
        key: accountKey,
        secret: accountSecret
      })

      client.registerDeposit(deposit, function (error, response) {
        assert(!error)
        assert(response)
        assert.deepEqual(success(response), response)
        done()
      })
      client = undefined
    })
    cb()
  })

  async.eachSeries(deposits, function (deposit, cb) {
    it('should fail to register deposit ' + JSON.stringify(deposit), function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/v1',
        secret: 'jhgkjhgk'
      })

      client.registerDeposit(deposit, function (error, response) {
        assert(error)
        assert(!response)
        assert.deepEqual(errorFixture(error), error)
        done()
      })
      client = undefined
    })
    cb()
  })
})
