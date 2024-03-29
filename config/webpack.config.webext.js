const path = require('path')
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require('webpack')

const { merge } = require('webpack-merge')
const base = require('./webpack.config.base.js')

const gitRevisionPlugin = new GitRevisionPlugin()

const commonConfig = merge(base, {
  entry: {
    popup: ['@babel/polyfill', './src/popup.js'],
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].js',
  },
  plugins: [
    gitRevisionPlugin,
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: 'manifest.json',
        },
        {
          from: 'src/assets/icons/*.png',
          to: '[name][ext]',
        },
        {
          from: 'src/popup.html',
          to: 'popup.html',
        },
      ],
    }),
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
  if (env.development) {
    return merge(commonConfig, developmentConfig)
  }
  if (env.production) {
    return merge(commonConfig, productionConfig)
  }
  throw new Error('No matching configuration was found!')
}
