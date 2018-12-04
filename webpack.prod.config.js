var path = require('path');
var webpack = require('webpack');
var _ = require("lodash");
var commonConfig = require("./webpack.common.config");

var config = _.assign(commonConfig, {
  devtool: 'source-map',
  mode: "'production",
  entry: [
    './src/example/index.tsx'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
})

module.exports = config;

