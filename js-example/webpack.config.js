var path = require('path');
var webpack = require('webpack');

module.exports = {
  // devtool: 'eval',
  mode: "development",
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
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
