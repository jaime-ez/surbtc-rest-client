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

- type=ask => fiat amount that I would get for `amount` BTC
- type=bid => fiat amount I have to pay to get `amount` BTC

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

- type=ask => BTC I have to pay to get `amount` fiat
- type=bid => BTC I would get for `amount` fiat

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

## To Do:

### Should we promisify or promisifyAll this?

http://bluebirdjs.com/docs/api/promise.promisify.html
http://bluebirdjs.com/docs/api/promise.promisifyall.html

### createAndTradeOrder

Should cancel order if not traded after X seconds?
