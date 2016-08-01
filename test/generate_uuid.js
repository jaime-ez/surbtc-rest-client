'use strict'

var Client = require('../')
var assert = require('chai').assert

describe('Ripple REST Client Generate UUID', function () {
  it('should successfully get UUID', function (done) {
    var client = new Client({})

    client.generateUUID(function (error, response) {
      assert(!error)
      assert(response)
      done()
    })
  })
})
