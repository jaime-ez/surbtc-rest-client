'use strict'

var Client = require('../')
var assert = require('chai').assert
var accountSecret = require('./fixtures/account_info').secret
var accountKey = require('./fixtures/account_info').key

var errorFixture = require('./fixtures/request_withdrawal').error
var success = require('./fixtures/request_withdrawal').success
var withdrawals = require('./fixtures/request_withdrawal').withdrawals()
var async = require('async')

describe('Surbtc REST Client Request Withdrawal', function () {
  async.eachSeries(withdrawals, function (withdrawal, cb) {
    it('should request withdrawal ' + JSON.stringify(withdrawal), function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/v1',
        key: accountKey,
        secret: accountSecret
      })

      client.requestWithdrawal(withdrawal, function (error, response) {
        console.log(error)
        assert(!error)
        assert(response)
        assert.deepEqual(success(response), response)
        done()
      })
      client = undefined
    })
    cb()
  })

  async.eachSeries(withdrawals, function (withdrawal, cb) {
    it('should fail to request withdrawal ' + JSON.stringify(withdrawal), function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/v1',
        secret: 'jhgkjhgk'
      })

      client.requestWithdrawal(withdrawal, function (error, response) {
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
