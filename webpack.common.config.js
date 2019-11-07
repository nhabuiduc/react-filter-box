var path = require('path');
var webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.webpack.js', '.web.js', '.js']
  },
  module: {
    rules: [
      {
        test: [/\.ts$/, /\.tsx$/],
        loaders: ['ts-loader']
      },
      {
        test: [/\.less$/, /\.css$/],
        loader: "style-loader!css-loader!less-loader"
      },
      {
        test: /\.pegjs$/,
        loader: "pegjs-loader"
      }
    ]
  }
};
