var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  mode: "production",
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
  ],
  module: {
    rules: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: path.join(__dirname, 'src')
    }, {
      test: [/\.less$/, /\.css$/],
      loader: "style-loader!css-loader!less-loader"
    }]
  }
};
