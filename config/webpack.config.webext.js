const path = require('path')
const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const merge = require('webpack-merge')
const base = require('./webpack.config.base.js')

const gitRevisionPlugin = new GitRevisionPlugin()

const commonConfig = merge(base, {
  entry: {
    background: ['@babel/polyfill', './src/background.js'],
    bookmarks: ['@babel/polyfill', './src/index.js'],
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].js',
  },
  plugins: [
    gitRevisionPlugin,
    new webpack.EnvironmentPlugin({
      DEVTOOLS: 'false', // Disable devtools by default
      VERSION: gitRevisionPlugin.version(),
      RUNTIME_CONTEXT: 'webext',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src', 'bookmarks.html'),
      chunks: ['bookmarks'],
      filename: 'bookmarks.html',
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json',
        to: 'manifest.json',
      },
      {
        from: 'src/assets/icons/*.png',
        flatten: true,
      },
    ]),
  ],
})

const developmentConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
}

const productionConfig = {
  mode: 'production',
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
