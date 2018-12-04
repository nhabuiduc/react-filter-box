var path = require('path');
var webpack = require('webpack');
var _ = require("lodash");
var commonConfig = require("./webpack.common.config");
var nodeExternals = require('webpack-node-externals');

var hostname = "localhost";
var port = 1111;

var config = _.assign(commonConfig, {
  mode: "development",
  target: "node",
  entry: 'mocha-loader!./test/index.js',
  devtool: "eval",
  output: {
    filename: 'test.build.js',
    path: path.join(__dirname, 'test-output/'),
    publicPath: 'http://' + hostname + ':' + port + '/test'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    host: hostname,
    port: port
  },
  externals: [nodeExternals()],
})

module.exports = config;

