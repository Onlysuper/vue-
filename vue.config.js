const path = require('path')
// const CompressionWebpackPlugin = require("compression-webpack-plugin");
// function resolve(dir) {
//     return path.join(__dirname, dir)
// }
// // 使用 webpack
// var webpack = require('webpack')
module.exports = {
    publicPath: "./",
    assetsDir: "static",
    pages: {
        index: {
            entry: './src/index/index.js',
            template: './src/index/index.html',
            filename: 'index.html',
            chunks: []
        },
        pc: { // pc端
          entry: './src/pcview/index/index.js',
          template: './src/pcview/index/index.html',
          filename: 'pc.html',
          title: 'pc端'
        },
        app: { // 手机端
            entry: './src/appview/index/index.js',
            template: './src/appview/index/index.html',
            filename: 'app.html',
            title: '移动端'
          }
      },
    /**
     * 开发环境服务器配置
     */
    // devServer: {
    //     open: true,
    //     host: '0.0.0.0',
    //     port: 8080,
    //     https: false,
    //     hotOnly: false,
    //     //配置跨域处理,只有一个代理
    //     proxy: 'http://tm.yeepiao.com',
    //     //配置跨域处理,多个代理
    //     // disableHostCheck: true,
    //     // proxy: {
    //     // '/api': {
    //     // target: 'http://118.190.149.38:8088',
    //     // changeOrigin: false
    //     // }
    //     // }
    // },
    //修改全局路径
    // chainWebpack: (config) => {
    //     config.resolve.alias
    //         .set('vue$', 'vue/dist/vue.esm.js')
    //         .set('@src', resolve('src'))
    //         .set('@node_modules', resolve('node_modules'))

    //     // 因为是多页面，所以取消 chunks，每个页面只对应一个单独的 JS / CSS
    //     config.optimization
    //     .splitChunks({
    //     cacheGroups: {}
    //     });
    // },
    // productionSourceMap: false,
    // css: {
    //     // 是否使用css分离插件 ExtractTextPlugin
    //     extract: true,
    // },
    // configureWebpack: {
    //     resolve: {
    //         extensions: ['.js', '.vue', '.json']
    //     },
    //     output: {
    //     },
    //     plugins: [
    //         new webpack.ProvidePlugin({
    //             '$': 'jquery',
    //             'jQuery': 'jquery',
    //             'window.jQuery': 'jquery',
    //             'window.$': 'jquery',
    //             'jWeixin': 'weixin-js-sdk',
    //             'pubsub': 'pubsub-js'
    //         }),
    //         new CompressionWebpackPlugin({
    //             filename: '[path].gz[query]',
    //             algorithm: 'gzip',
    //             test: new RegExp('\\.(js|css)$'),
    //             threshold: 10240,
    //             minRatio: 0.8
    //         })
    //     ]
    // }
}
