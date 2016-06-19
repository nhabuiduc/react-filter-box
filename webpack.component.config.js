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
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
    },
  },

  
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'react-filter-box.js',
    library: 'react-filter-box',
    libraryTarget: 'umd'
  },
})

module.exports = config;
