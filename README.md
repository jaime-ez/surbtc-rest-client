# surbtc-rest-client #

This nodejs module connects to surbtc api in order to get quotes and execute orders.

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Installation

    npm install surbtc-rest-client

### Usage

    var surbtcRestClient = require("surbtc-rest-client");

    var client = new surbtcRestClient({
      api: 'http://surbtc.com/api/',
      secret: 'apiKey',
      params: {}
      });


### Primary functions

#### Get Markets

    client.getMarkets(function(err, res){

    })

#### Get Exchange Fee

- marketId: string - required
- type: string - required
- marketOrder: boolean - optional

        client.getExchangeFee(marketId, type, marketOrder, function(err, res){

        })

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

Total is the number of CLP cents I am willing to give in order to get BTC satoshi's amount

- marketId: string - required
- type: string - required
- total: Number - required


        client.getQuotation(marketId, type, total, function(err, res){

        })

Response:

      {
        success: true,
        quotation: {
          amount: ,
          expected_base_change: ,
          error_message: ,
          price:
        }
      }


#### Get Reverse Quotation

Amount is the number of satoshis I am willing to buy/sell in order to get CLP cents total

- marketId: string - required
- type: string - required
- amount: Number - required


        client.getReverseQuotation(marketId, type, amount, function(err, res){

        })

Response:

      {
        success: true,
        reverse_quotation: {
          amount: ,
          total: ,
          error_message: ,
          price:
        }
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
        id: args.order.id,
        type: args.order.type,
        state: args.order.state,
        limit: args.order.limit,
        amount: args.order.amount,
        original_amount: args.order.original_amount,
        created_at: args.order.created_at,
        market_id: args.order.market_id,
        paid_fee: args.order.paid_fee,
        total_exchanged: args.order.total_exchanged,
        fee_currency: args.order.fee_currency,
        price_type: args.order.price_type,
        weighted_quotation: args.order.weighted_quotation,
        account_id: args.order.account_id
      }
    }


#### Cancel Order Id

    client.cancelOrderId(orderId, function(err, res){

    })

Response:

    {
      success: true,
      order: {
        id: args.order.id,
        type: args.order.type,
        state: args.order.state,
        limit: args.order.limit,
        amount: args.order.amount,
        original_amount: args.order.original_amount,
        created_at: args.order.created_at,
        market_id: args.order.market_id,
        paid_fee: args.order.paid_fee,
        total_exchanged: args.order.total_exchanged,
        fee_currency: args.order.fee_currency,
        price_type: args.order.price_type,
        weighted_quotation: args.order.weighted_quotation,
        account_id: args.order.account_id
      }
    }


### Create and Trade Order

    client.createAndConfirmOrder(marketId, order, function(err, res){

    })

Response:

     {
        success: true,
        order: {
          id: args.order.id,
          type: args.order.type,
          state: args.order.state,
          limit: args.order.limit,
          amount: args.order.amount,
          original_amount: args.order.original_amount,
          created_at: args.order.created_at,
          market_id: args.order.market_id,
          paid_fee: args.order.paid_fee,
          total_exchanged: args.order.total_exchanged,
          fee_currency: args.order.fee_currency,
          price_type: args.order.price_type,
          weighted_quotation: args.order.weighted_quotation,
          account_id: args.order.account_id
        }
      }

## To Do:

### Should we promisify or promisifyAll this?

http://bluebirdjs.com/docs/api/promise.promisify.html
http://bluebirdjs.com/docs/api/promise.promisifyall.html

### createAndTradeOrder

Should cancel order if not traded after X seconds?
