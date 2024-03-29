const path = require('path')
const os = require('os')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const { merge } = require('webpack-merge')
const base = require('./webpack.config.base.js')
const { DefinePlugin } = require('webpack')

const commonConfig = merge(base, {
  entry: {
    webapp: ['@babel/polyfill', './src/index.js'],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/',
  },
  plugins: [
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: true,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src', 'index.html'),
      chunks: ['webapp'],
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/icons/*.png',
          to: '[name][ext]',
        },
      ],
    }),
  ],
})

function getDevServerConfig() {
  const homedir = os.homedir()
  const keyFilename = 'savory.test+4-key.pem'
  const certFilename = 'savory.test+4.pem'

  return {
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      historyApiFallback: true,
      host: 'app.savory.test',
      port: 8080,
      https: {
        key: fs.readFileSync(`${homedir}/Projects/certs/${keyFilename}`),
        cert: fs.readFileSync(`${homedir}/Projects/certs/${certFilename}`),
      },
    },
  }
}

const developmentConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
}

const productionConfig = {
  mode: 'production',
  devtool: 'source-map',
}

module.exports = (env) => {
  if (env.development) {
    return merge(commonConfig, developmentConfig, getDevServerConfig())
  }
  if (env.production) {
    return merge(commonConfig, productionConfig)
  }
  throw new Error('No matching configuration was found!')
}
