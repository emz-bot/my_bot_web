const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const webpack = require('webpack')
module.exports = {
  runtimeCompiler: true,
  lintOnSave: false,
  productionSourceMap: false,
  publicPath: "./static",
  assetsDir: './',
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('tim', resolve('src/tim.js'))
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
        Popper: ['popper.js', 'default']
      })
    ]
  }
}