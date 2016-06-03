import React from "react";
var socket = require('socket.io-client').connect(process.env.ROOT_URL);

class Stock extends React.Component{
  
  constructor(props, context){
    super(props, context);
  }
  
  handleClick(e) {
    var _this = this;
    socket.emit('removeStock', _this.props.code);
  }

  render() {
    return (
      <div className="stock">
				<p className="code">{this.props.code}</p>
				<p className="name">{this.props.name}</p>
				<p className="close" onClick={(e) => this.handleClick(e)}>x</p>
			</div>
    );
  }
  
}

export default Stock;