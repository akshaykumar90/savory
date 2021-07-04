module.exports = (api) => {
  const isTest = api.env('test')
  if (isTest) {
    return {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    }
  }
  return {
    presets: [['@babel/preset-env', { modules: false }]],
    plugins: ['@babel/plugin-syntax-dynamic-import'],
  }
}
