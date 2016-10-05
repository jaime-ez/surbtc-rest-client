'use strict'

var Client = require('../')
var assert = require('chai').assert
var accountSecret = require('./fixtures/account_info').secret
var accountKey = require('./fixtures/account_info').key

var errorFixture = require('./fixtures/register_bank_account').error
var success = require('./fixtures/register_bank_account').success
var bankAccounts = require('./fixtures/register_bank_account').bankAccounts()
var async = require('async')

describe('Surbtc REST Client Register Bank Account', function () {
  async.eachSeries(bankAccounts, function (bankAccount, cb) {
    it('should register bank account ' + JSON.stringify(bankAccount), function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/v1',
        key: accountKey,
        secret: accountSecret
      })

      client.registerBankAccount(bankAccount, function (error, response) {
        assert(!error)
        assert(response)
        assert.deepEqual(success(response), response)
        done()
      })
      client = undefined
    })
    cb()
  })

  async.eachSeries(bankAccounts, function (bankAccount, cb) {
    it('should fail to register bank account ' + JSON.stringify(bankAccount), function (done) {
      var client = new Client({
        api: 'https://stg.surbtc.com/api/v1',
        secret: 'jhgkjhgk'
      })

      client.registerBankAccount(bankAccount, function (error, response) {
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
