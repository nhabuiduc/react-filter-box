var path = require('path');
var webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ['', '.ts','.tsx', '.webpack.js', '.web.js', '.js']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'react-filter-box.js',
    library: 'react-filter-box',
    publicPath: '/static/'
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  },
  
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
