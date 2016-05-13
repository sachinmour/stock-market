var path = require("path");
var fs = require('fs');
var webpack = require('webpack');

module.exports = {
    entry: ["webpack-hot-middleware/client?https://0.0.0.0:8080", "webpack/hot/only-dev-server","./app/App.js"],
    output: {
        path: path.join(__dirname, '/'),
        publicPath: "/",
        filename: "public/bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['react-hot', 'babel']
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};