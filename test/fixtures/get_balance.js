'use strict'

exports.currencies = function () {
  return ['BTC', 'COP', 'CLP']
}

exports.success = function (args) {
  return {
    success: true,
    balance: {
      amount: args.balance.amount,
      available_amount: args.balance.available_amount,
      frozen_amount: args.balance.frozen_amount,
      pending_withdraw_amount: args.balance.pending_withdraw_amount,
      account_id: args.balance.account_id
    }
  }
}

exports.error = function (args) {
  return {
    success: false,
    error_type: args.error_type
  }
}
