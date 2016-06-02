import React from "react";
import Footer from "./Footer";

class Main extends React.Component{
  
  constructor(props, context){
    super(props, context);
  }

  render() {
    return (
      <div id="content">
        <Footer />
      </div>
    );
  }
  
}

export default Main;