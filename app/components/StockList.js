import React from "react";
import ChartHandler from "../utils/chartHandler";
import axios from "axios";

class Chart extends React.Component{
  
    constructor(props, context){
        super(props, context);
        this.state = {
          stocks: [],
          error: ""
        }
    }
  
//   componentDidMount() {
//     var seriesOptions = [],
//     seriesCounter = 0,
//     names = ['MSFT', 'AAPL', 'GOOG'];
//     var createChart = this.createChart;
//     var i = 0;
//     for (var name of names) {
//         axios.get('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?')
//         .then(function(response) {
//             seriesOptions[i] = {name: name, data: response.data};
//             seriesCounter+=1;
//             i+=1;
            
//             if (seriesCounter === names.length) {
//                 createChart(seriesOptions);
//             }
//         });
//     }
//   }

    componentWillMount() {
      var _this = this;
      axios.get('/getStocks')
      .then(function(response) {
        _this.setState({
          stocks: response.data.data
        });
        var seriesOptions = _this.stocks.map(function(stock) {
          return {name: stock.code, data: stock.seriesData}
        })
      })
    }

  render() {
    return (
    );
  }
  
}

export default Chart;