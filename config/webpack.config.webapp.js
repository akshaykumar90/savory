const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')

const merge = require('webpack-merge')
const base = require('./webpack.config.base.js')

const gitRevisionPlugin = new GitRevisionPlugin()

const commonConfig = merge(base, {
  entry: {
    webapp: ['@babel/polyfill', './src/index.js'],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      VERSION: gitRevisionPlugin.version(),
      RUNTIME_CONTEXT: 'webapp',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src', 'bookmarks.html'),
      chunks: ['webapp'],
      filename: 'index.html',
    }),
  ],
})

const developmentConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
  },
}

const productionConfig = {
  mode: 'production',
  devtool: 'source-map',
}

module.exports = (env) => {
  switch (env) {
    case 'development':
      return merge(commonConfig, developmentConfig)
    case 'production':
      return merge(commonConfig, productionConfig)
    default:
      throw new Error('No matching configuration was found!')
  }
}
