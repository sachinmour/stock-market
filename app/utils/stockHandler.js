var Stock = require("../models/stocks.js");

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
      else if (stocks.length === 0) {
        res.json({data:[]});
      }
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
  }
  
};