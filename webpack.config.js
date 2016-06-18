var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
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
    new webpack.HotModuleReplacementPlugin()
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
