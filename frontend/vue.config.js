const { defineConfig } = require('@vue/cli-service')
const ver = new Date().getTime() + '-1.0.0.0'
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  filenameHashing: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://ttlinblog.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true
    }
  },
  configureWebpack: {
    output: {
      filename: `js/[name].[chunkhash].${ver}.js`,
      chunkFilename: `js/[id].[chunkhash].${ver}.js`,
    }
  },
  css: {
    extract: {
      filename: `css/[name].[chunkhash].${ver}.css`,
      chunkFilename: `css/[id].[chunkhash].${ver}.css`,
    }
  }
})
