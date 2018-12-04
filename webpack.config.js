var path = require('path');
var webpack = require('webpack');
var _ = require("lodash");
var commonConfig = require("./webpack.common.config");

var config = _.assign(commonConfig, {
  devtool: 'eval',
  mode: "development",
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/example/index.tsx'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = config;

