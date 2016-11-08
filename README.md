# surbtc-rest-client #

This nodejs module connects to surbtc api in order to get quotes and execute orders.

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Installation

    npm install surbtc-rest-client

### Usage

    var surBtcRestClient = require("surbtc-rest-client");

    var client = new surBtcRestClient({
      api: 'http://surbtc.com/api/v1',
      secret: 'apiKey',
      params: {}
      });


### Primary functions

#### Get Markets

    client.getMarkets(function(err, res){

    })

Response:

      {
        success: true,
        markets: [
          { name: , base_currency: , quote_currency:  }
        ],
        statusCode: 200
      }


#### Get Exchange Fee

- marketId: string - required
- type: string - required
- marketOrder: boolean - optional

        client.getExchangeFee(marketId, type, marketOrder, function(err, res){

        })

Response:

      {
        success: true,
        fee_percentage: { value: },
        statusCode: 200
      }

#### Generate UUID

    client.generateUUID(function(err, res){

    })

#### Get Order Book

- marketId: string - required


        client.getOrderBook(marketId, function (err, res){

        })

Response:

      {
        success: true,
        order_book: {
          asks: [amount, limit],
          bids: [amount, limit]
        }
      }

#### Get Quotation

Returns the number of fiat equivalent to `amount` BTC on the `marketId` market.

- type=ask => fiat cents that I would get for `amount` satoshis
- type=bid => fiat cents I have to pay to get `amount` satoshis

- marketId: string - required
- type: string - required
- amount: Number - required


        client.getQuotation(marketId, type, amount, function(err, res){

        })

Response:

      {
        success: true,
        quotation: {
          type: type,
          reverse: false,
          amount: amount,
          order_amount: [ amount, currency ],
          base_balance_change: [ amount, currency ],
          quote_balance_change: [ -amount, currency ],
          fee: [ fee, currency ],
          incomplete: false
        },
        statusCode: 200
      }


#### Get Reverse Quotation

Returns the number of BTC equivalent to `amount` of fiat on the `marketId` market.

- type=ask => BTC satoshis I would get for `amount` fiat cents
- type=bid => BTC satoshis I have to pay to get `amount` fiat cents

- marketId: string - required
- type: string - required
- amount: Number - required


        client.getReverseQuotation(marketId, type, amount, function(err, res){

        })

Response:

      {
        success: true,
        quotation: {
          type: type,
          reverse: true,
          amount: amount,
          order_amount: [ amount, currency ],
          base_balance_change: [ amount, currency ],
          quote_balance_change: [ -amount, currency ],
          fee: [ fee, currency ],
          incomplete: false
        },
        statusCode: 200
      }


#### Create Order

- marketId: string - required
- order:
      order: {
        type:,
        limit:,
        amount:,
        original_amount:,
        price_type:
      }


        client.createOrder(marketId, order, function(err, res){

        })

Response:

    {
      success: true,
      order: {
        id: ,
        type: ,
        state: ,
        limit: ,
        amount: ,
        original_amount: ,
        created_at: ,
        market_id: ,
        paid_fee: ,
        total_exchanged: ,
        fee_currency: ,
        price_type: ,
        weighted_quotation: ,
        account_id:
      }
    }


#### Get Orders

    client.getOrders(marketId, function(err, res){

    })

Response:

    {
      success: true,
      orders: [],
      meta: {}
    }


#### Get Orders by State


    client.getOrdersByState(marketId, state, function(err, res){

    })

Response:

    {
      success: true,
      orders: [],
      meta: {}
    }


#### Get Order Id

    client.getOrderId(orderId, function(err, res){

    })

Response:

    {
      success: true,
      order: {
        id:
        type:
        state:
        limit:
        amount:
        original_amount:
        created_at:
        market_id:
        paid_fee:
        total_exchanged:
        fee_currency:
        price_type:
        weighted_quotation:
        account_id:
      }
    }


#### Cancel Order Id

    client.cancelOrderId(orderId, function(err, res){

    })

Response:

    {
      success: true,
      order: {
        id:
        type:
        state:
        limit:
        amount:
        original_amount:
        created_at:
        market_id:
        paid_fee:
        total_exchanged:
        fee_currency:
        price_type:
        weighted_quotation:
        account_id:
      }
    }


### Create and Trade Order

    client.createAndConfirmOrder(marketId, order, function(err, res){

    })

Response:

     {
        success: true,
        order: {
          id:
          type:
          state:
          limit:
          amount:
          original_amount:
          created_at:
          market_id:
          paid_fee:
          total_exchanged:
          fee_currency:
          price_type:
          weighted_quotation:
          account_id:
        }
      }

### registerBankAccount  

    var opts = {
      bank_name: 'Banco Santander',
      bank_account_holder_name: 'jaime echegaray',
      bank_account_holder_id: '157715003',
      bank_account_type: 'Cuenta Corriente',
      bank_account_number: 123456,
      bank_currency: 'cop',
      email: '',
      phone: ''
    }
    
    client.registerBankAccount(opts, function(err, res){

    })

Response:

    { success: true,
      fiat_account: 
       { id: 943,
         account_number: '123456',
         account_type: 'Cuenta Corriente',
         bank_id: 56,
         created_at: '2016-09-06T18:13:16.864Z',
         currency: 'COP',
         document_number: '157715003',
         email: '',
         full_name: 'jaime echegaray',
         national_number_identifier: null,
         phone: '',
         updated_at: '2016-09-06T18:13:16.864Z',
         bank_name: 'Banco Santander' },
      statusCode: 200 }

### registerDeposit  

- amount in currency standard precision  

        var opts = {
          amount: 1000,
          currency: 'CLP',
        }

        client.registerDeposit(opts, function(err, res){

        })

Response:

    { success: true,    
      deposit:       
        { id: 2869,        
        state: 'pending_confirmation',
        amount: 1000000,
        currency: 'CLP',
        created_at: '2016-10-05T19:02:49.696Z',
        deposit_data: 
        { type: 'FiatDepositData',        
          id: 1530,
          created_at: '2016-10-05T19:02:49.673Z',
          updated_at: '2016-10-05T19:02:49.673Z' } 
        },
      statusCode: 200 }

### requestWithdrawal  

- amount in currency standard precision  

        var opts = {
          amount: 1,
          currency: 'BTC',
          target_address: ''
        }

        client.requestWithdrawal(opts, function(err, res){

        })

Response:

    { success: true,    
      withdrawal:       
        { id: 2869,        
        state: 'pending_preparation',
        amount: 100000000,
        currency: 'BTC',
        created_at: '2016-10-05T19:02:49.696Z',
        require_manual_approval: false, 
      statusCode: 200 }

## To Do:

### createAndTradeOrder

Should cancel order if not traded after X seconds?
