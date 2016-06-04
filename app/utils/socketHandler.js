var Stock = require("../models/stocks.js");

import axios from "axios";
import stockHandler from "./stockHandler";

module.exports = function(socket, io) {
    
    socket.on('addStock', function(stockCode) {
      Stock.findOne({code: stockCode.toUpperCase()}, function(err, stock) {
        if (err) throw err;
        else if(stock) {
          socket.emit("stockAdded", {error: "Stock already present"});
        } else {
          axios.get("https://www.quandl.com/api/v3/datasets/WIKI/"+stockCode+".json?api_key=" + process.env.Quandl_api_key)
          .then(function(response) {
            var data = response.data;
            if(!data || data.quandl_error) {
              socket.emit("stockAdded", {error: "Invalid Code"});
            } else {
              new Stock({code: stockCode.toUpperCase()}).save();
              io.sockets.emit("stockAdded", {seriesData: stockHandler.formatData(data.dataset.data), name: stockHandler.formatName(data.dataset.name), code: response.data.dataset.dataset_code});
            }
          })
          .catch(function(response) {
            socket.emit("stockAdded", {error: "Invalid Code"});
          });
        }
      });
    });
    
    socket.on('removeStock', function(stockCode) {
      Stock.findOne({code: stockCode.toUpperCase()}, function(err, stock) {
        if (err) throw err;
        if (stock) {
          stock.remove();
          io.sockets.emit("stockRemoved", {code: stockCode.toUpperCase()});
        } else {
          socket.emit("stockRemoved", {error: "stock not in the database"});
        }
      });
    });

};