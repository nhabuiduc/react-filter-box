var path = require('path');
var webpack = require('webpack');
var _ = require("lodash");
var commonConfig = require("./webpack.common.config");

var config = _.assign(commonConfig, {
  devtool: 'source-map',
  entry: [
    "./src/ReactFilterBox.tsx"
  ],
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'react-filter-box.js',
    publicPath: '/static/'
  }
})

module.exports = config;
