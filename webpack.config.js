const path = require('path')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: {
    background: ['@babel/polyfill', './src/background.js'],
    bookmarks: ['@babel/polyfill', './src/bookmarks.js']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: ['vue-style-loader', 'css-loader', 'stylus-loader']
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEVTOOLS: 'false' // Disable devtools by default
    }),
    new VueLoaderPlugin(),
    new FriendlyErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'bookmarks.html'),
      chunks: ['bookmarks'],
      filename: 'bookmarks.html'
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json',
        to: 'manifest.json'
      },
      {
        from: 'src/assets/icons/*.png',
        flatten: true
      }
    ]),
    new Dotenv()
  ]
}
