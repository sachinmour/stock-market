import React from "react";
import Footer from "./Footer";
import StockList from "./StockList";

class Main extends React.Component{
  
  constructor(props, context){
    super(props, context);
  }

  render() {
    return (
      <div id="content">
        <div id="chart"></div>
        <StockList />
        <Footer />
      </div>
    );
  }
  
}

export default Main;