const Dotenv = require('dotenv-webpack');

module.exports = {

  watch: true,

  target: 'electron-renderer',

  entry: './app/src/js/index.js',

  output: {
    path: __dirname + '/app/build',
    publicPath: 'build/',
    filename: 'bundle.js'
  },

  module: {
    rules: [{
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/react']
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },

  plugins: [
    new Dotenv()
  ],

  resolve: {
    extensions: ['.js', '.json', '.jsx']
  }

};
