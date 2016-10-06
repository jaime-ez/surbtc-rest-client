'use strict'

exports.success = function (args) {
  return {
    success: true,
    statusCode: args.statusCode,
    withdrawal: {
      id: args.withdrawal.id,
      state: args.withdrawal.state,
      amount: args.withdrawal.amount,
      currency: args.withdrawal.currency,
      created_at: args.withdrawal.created_at,
      require_manual_approval: args.withdrawal.require_manual_approval
    }
  }
}

exports.error = function (args) {
  if (args.error_type === 'unprocessable_entity') {
    return {
      success: false,
      error_type: 'unprocessable_entity',
      errors: args.errors,
      statusCode: args.statusCode
    }
  } else {
    return {
      success: false,
      statusCode: args.statusCode,
      error_type: args.error_type
    }
  }
}

exports.withdrawals = function () {
  return [
    {
      amount: 10000,
      currency: 'CLP',
      target_address: ''
    },
    {
      amount: 1,
      currency: 'BTC',
      target_address: 'mjpvxk9axLFizBuDBRG4z8Qi4dBhiYBiqs'
    }
  ]
}
