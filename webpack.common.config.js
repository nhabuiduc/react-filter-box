var path = require('path');
var webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ['', '.ts','.tsx', '.webpack.js', '.web.js', '.js']
  },
  module: {    
    loaders: [    
    {
        test: [/\.ts$/,/\.tsx$/],
        loaders: ['react-hot','awesome-typescript-loader']
      },
      {
        test: [/\.less$/,/\.css$/],
        loader: "style!css!less"
      }]
  }
};
