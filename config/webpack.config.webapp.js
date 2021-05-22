const path = require('path')
const os = require('os')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const merge = require('webpack-merge')
const base = require('./webpack.config.base.js')

const commonConfig = merge(base, {
  entry: {
    webapp: ['@babel/polyfill', './src/index.js'],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src', 'bookmarks.html'),
      chunks: ['webapp'],
      filename: 'index.html',
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/assets/icons/*.png',
        flatten: true,
      },
    ]),
  ],
})

// Wrap the object inside a function because otherwise the Vercel build fails
// with ENOENT error because it tries to read the cert and key filepaths which
// do not exist on the build server.
function getDevelopmentConfig() {
  const homedir = os.homedir()
  const keyFilename = 'savory.test+4-key.pem'
  const certFilename = 'savory.test+4.pem'

  return {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      historyApiFallback: true,
      public: 'app.savory.test:8080',
      https: {
        key: fs.readFileSync(`${homedir}/Projects/certs/${keyFilename}`),
        cert: fs.readFileSync(`${homedir}/Projects/certs/${certFilename}`),
      },
    },
  }
}

const productionConfig = {
  mode: 'production',
  devtool: 'source-map',
}

module.exports = (env) => {
  switch (env) {
    case 'development':
      return merge(commonConfig, getDevelopmentConfig())
    case 'production':
      return merge(commonConfig, productionConfig)
    default:
      throw new Error('No matching configuration was found!')
  }
}
