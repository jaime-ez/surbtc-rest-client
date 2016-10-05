'use strict'

exports.success = function (args) {
  return {
    success: true,
    statusCode: args.statusCode,
    deposit: {
      id: args.deposit.id,
      state: args.deposit.state,
      amount: args.deposit.amount,
      currency: args.deposit.currency,
      created_at: args.deposit.created_at,
      deposit_data: {
        type: args.deposit.deposit_data.type,
        id: args.deposit.deposit_data.id,
        created_at: args.deposit.deposit_data.created_at,
        updated_at: args.deposit.deposit_data.updated_at
      }
    }
  }
}

exports.error = function (args) {
  if (args.error_type === 'unprocessable_entity') {
    return {
      success: false,
      statusCode: args.statusCode,
      error_type: 'unprocessable_entity',
      errors: args.errors
    }
  } else {
    return {
      success: false,
      statusCode: args.statusCode,
      error_type: args.error_type
    }
  }
}

exports.deposits = function () {
  return [
    {
      amount: 10000,
      currency: 'CLP'
    },
    {
      amount: 50000,
      currency: 'COP'
    }
  ]
}
