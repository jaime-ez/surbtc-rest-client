# surbtc-rest-client #

This nodejs module connects to surbtc api in order to get quotes and execute orders.  

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)  

## Installation

    npm install surbtc-rest-client

### Usage
    
    var surbtcRestClient = require("surbtc-rest-client").Client;
    
    var client = new surbtcRestClient({
      api: 'http://localhost:5990',
      secret: '',      
      params: {}
      }
    });    

#### Primary functions  

Get Markets  

    client.getMarkets(function(err, res){
      
    })
    
Get Exchange Fee  

    client.getExchangeFee(marketId, type, marketOrder, function(err, res){
    
    })
    
Generate UUID  

    client.generateUUID(function(err, res){
    
    })  
    
Get Order Book  

    client.getOrderBook(marketId, function (err, res){
    
    })  
    
Get Quotation  

    client.getQuotation(marketId, type, total, function(err, res){
    
    })  
    
Get Reverse Quotation  

    client.getReverseQuotation(marketId, type, amount, function(err, res){
    
    })  

Create Order  

    client.createOrder(marketId, order, function(err, res){
    
    })  
    
Get Order  

    client.getOrder(orderId, function(err, res){
    
    })  
    
Cancel Order  

    client.cancelOrder(orderId, function(err, res){
    
    })  
    
Create and Confirm Order  

    client.createAndConfirmOrder(marketId, order, function(err, res){
    
    })  
    
Cancel and Confirm Order  

    client.cancelAndConfirmOrder(orderId, function(err, res){
    
    })  
