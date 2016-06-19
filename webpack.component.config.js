var path = require('path');
var webpack = require('webpack');
var _ = require("lodash");
var commonConfig = require("./webpack.common.config");

var config = _.assign(commonConfig, {
  devtool: 'source-map',
  entry: [
    "./src/ReactFilterBox.tsx"
  ],

    externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  },
  
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'react-filter-box.js',
    library: 'react-filter-box',
    libraryTarget: "CommonJS"
  },
})

module.exports = config;
