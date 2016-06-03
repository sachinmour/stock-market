require('babel-core/register');
var path = require('path');

var express = require('express'),
    server_routes = require("./app/server_routes/routes"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    morgan = require('morgan');
    
var app = express();
mongoose.connect(process.env.MONGODB_URI);

var PORT = process.env.PORT || 8080;

app.use(bodyParser.json());             //
app.use(bodyParser.urlencoded({         // get information from html forms    
  extended: true                        //
}));

// using webpack-dev-server and middleware in development environment
if(process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var config = require('./webpack.config.js');
  var compiler = webpack(config);
  app.use(morgan('dev'));
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, '/public')));

server_routes(app);

// var server = app.listen(PORT, function(error) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
//   }
// });


var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);

server.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});

var socketHandler = require("./app/utils/socketHandler");

io.on("connection", function(socket) {
  socketHandler(socket, io);
});