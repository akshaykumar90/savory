const path = require('path')
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const { merge } = require('webpack-merge')
const base = require('./webpack.config.base.js')

const gitRevisionPlugin = new GitRevisionPlugin()

const commonConfig = merge(base, {
  entry: {
    background: ['@babel/polyfill', './src/background.js'],
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].js',
  },
  plugins: [
    gitRevisionPlugin,
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
