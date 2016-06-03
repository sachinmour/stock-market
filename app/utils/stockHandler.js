var Stock = require("../models/stocks");
import axios from "axios";

module.exports = {
  
  formatData(data) {
    var series = data.reverse().map(info => {
      return [(new Date(info[0])).getTime(), info[1]];
    });
    return series;
  },
  
  formatName(name) {
    return name.split("Prices,")[0];
  },
  
  getStocks(req, res) {
    var formatData = this.formatData;
    var formatName = this.formatName;
    Stock.find({}, function(err, stocks) {
      if (err) throw err;
      else {
        var promises = stocks.map(function(stock) {
          return axios.get("https://www.quandl.com/api/v3/datasets/WIKI/"+stock.code+".json?api_key=" + process.env.Quandl_api_key);
        });
        axios.all(promises)
        .then(function(responses) {
          var series = [];
          responses.map(function(response, i) {
            series.push({seriesData: formatData(response.data.dataset.data), name: formatName(response.data.dataset.name), code: response.data.dataset.dataset_code});
            if (series.length == responses.length) {
              res.json({data: series});
            }
          });
        });
      }
    });
  },
  
  addStock(req, res) {
    var formatData = this.formatData;
    var formatName = this.formatName;
    Stock.findOne({code: req.body.code}, function(err, stock) {
      if (err) throw err;
      else if(stock) {
        res.json({message: "Stock already present"});
      } else {
        var stockCode = req.body.code;
        axios.get("https://www.quandl.com/api/v3/datasets/WIKI/"+stockCode+".json?api_key=" + process.env.Quandl_api_key)
        .then(function(response) {
          var data = response.data;
          if(!data || data.quandl_error) {
            res.json({error: "Invalid Code"});
          } else {
            res.json({seriesData: formatData(data.dataset.data), name: formatName(data.dataset.name), code: response.data.dataset.dataset_code});
            stock = new Stock({code: stockCode});
            stock.save();
          }
        })
        .catch(function(response) {
          res.json({error: "Something went wrong."});
        });
      }
    });
  },
  
  removeStock(req, res) {
    Stock.findOne({name: req.body.code}, function(err, stock) {
      if (err) throw err;
      if (stock) {
        stock.remove();
        res.json({message: 'done'});
      } else {
        res.json({message: "stock not in the database"});
      }
    });
  }
  
};