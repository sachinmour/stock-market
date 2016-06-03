import React from "react";
import ChartHandler from "../utils/chartHandler";
import axios from "axios";
import Stock from "./Stock";
var socket = require('socket.io-client').connect('https://clementine-sachinmour.c9users.io/');

class Chart extends React.Component{
  
    constructor(props, context){
        super(props, context);
        this.state = {
          stocks: [],
          error: "",
          addStock: ""
        };
    }

    componentDidMount() {
      var _this = this;
      axios.get('/getStocks')
      .then(function(response) {
        _this.setState({
          stocks: response.data.data
        });
        var seriesOptions = _this.state.stocks.map(function(stock) {
          return {name: stock.code, data: stock.seriesData};
        });
        ChartHandler.createChart(seriesOptions);
      })
      .catch(function(response) {
        console.log(response);
      });
      
      socket.on('stockAdded', function(response) {
        if (response.error) {
          _this.setState({error: response.error});
        } else {
          var newSeries = response;
          _this.setState({
            stocks: [..._this.state.stocks, newSeries]
          });
          var seriesOptions = _this.state.stocks.map(function(stock) {
            return {name: stock.code, data: stock.seriesData};
          });
          ChartHandler.destroyChart();
          ChartHandler.createChart(seriesOptions);
        }
      });
      
      socket.on('stockRemoved', function(response) {
        if (response.error) {
          _this.setState({error: response.error});
        } else {
          _this.setState({
            stocks: _this.state.stocks.find(function(stock){
              return stock.code !== response.code;
            }) || []
          });
          var seriesOptions = _this.state.stocks.map(function(stock) {
            return {name: stock.code, data: stock.seriesData};
          });
          ChartHandler.destroyChart();
          ChartHandler.createChart(seriesOptions);
        }
      });
      
    }
    
    handleSubmit(e) {
      if (e) e.preventDefault();
      var _this = this;
      socket.emit('addStock', _this.state.addStock);
    }
    
    handleChange(e) {
      this.setState({
        addStock: e.target.value
      });
    }

  render() {
    
    var stockHtml = this.state.stocks.map(function(stock) {
        return <Stock code={stock.code} name={stock.name} key={stock.code}/>;
      });
    
    return (
      <div id="stocks">
        {stockHtml}
        <div className="addStock">
					<form onSubmit={(e) => this.handleSubmit(e)}>
						<div id="input">
							<input type="text" placeholder="Stock Code" value={this.state.addStock} onChange={(e) => this.handleChange(e)}/>
						</div>
						<div id="search">
							<button type='submit'>Add</button>
						</div>
					</form>
					<p id="error">{this.state.error}</p>
				</div>
      </div>
    );
  }
  
}

export default Chart;