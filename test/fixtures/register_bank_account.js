'use strict'

exports.success = function (args) {
  return {
    success: true,
    statusCode: args.statusCode,
    fiat_account: {
      id: args.fiat_account.id,
      account_number: args.fiat_account.account_number,
      account_type: args.fiat_account.account_type,
      bank_id: args.fiat_account.bank_id,
      currency: args.fiat_account.currency,
      document_number: args.fiat_account.document_number,
      email: args.fiat_account.email,
      full_name: args.fiat_account.full_name,
      national_number_identifier: args.fiat_account.national_number_identifier,
      phone: args.fiat_account.phone,
      bank_name: args.fiat_account.bank_name,
      created_at: args.fiat_account.created_at,
      updated_at: args.fiat_account.updated_at
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

exports.bankAccounts = function () {
  return [
    {
      bank_name: 'Banco Santander',
      bank_account_holder_name: 'jaime echegaray',
      bank_account_holder_id: '157715003',
      bank_account_type: 'Cuenta Corriente',
      bank_account_number: 123456,
      bank_currency: 'clp',
      email: '',
      phone: ''
    }
  ]
}
