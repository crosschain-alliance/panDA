const webpack = require('webpack')

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {}
  Object.assign(fallback, {
    async_hooks: false,
    assert: require.resolve('assert'),
    crypto: require.resolve('crypto-browserify'),
    fs: require.resolve('browserify-fs'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    net: require.resolve('net-browserify'),
    os: require.resolve('os-browserify'),
    path: require.resolve('path-browserify'),
    stream: require.resolve('stream-browserify'),
    tls: require.resolve('tls-browserify'),
    url: require.resolve('url'),
    zlib: require.resolve('browserify-zlib'),
    querystring: require.resolve('querystring-es3')
  })
  config.resolve.fallback = fallback
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ])
  config.externals = {
    express: 'express'
  }
  return config
}
