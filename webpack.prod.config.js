var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/example/index.tsx'
  ],
  resolve: {
    extensions: ['', '.ts','.tsx', '.webpack.js', '.web.js', '.js']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
  ],
  module: {    
    loaders: [    
    {
        test: [/\.ts$/,/\.tsx$/],
        loader: 'awesome-typescript-loader'
      },
      {
        test: [/\.less$/,/\.css$/],
        loader: "style!css!less"
      }]
  }
};
