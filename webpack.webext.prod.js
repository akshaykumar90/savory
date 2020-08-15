const merge = require('webpack-merge')
const common = require('./webpack.webext.common.js')

module.exports = merge(common, {
  mode: 'production',
})
