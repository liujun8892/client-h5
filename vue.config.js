const path = require('path')

// const TerserPlugin = require('terser-webpack-plugin')// 去console插件
const CompressionWebpackPlugin = require('compression-webpack-plugin') // gzip压缩插件

const resolve = dir => path.join(__dirname, dir)
module.exports = {
  // 基本路径
  publicPath: '/h5',
  // 输出文件目录
  outputDir: 'dist',
  // 用于嵌套生成的静态资产（js，css，img，fonts）的目录
  assetsDir: '',
  // 指定生成的 index.html 的输出路径 (相对于 outputDir)
  indexPath: 'index.html',
  // 静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
  filenameHashing: true,
  // 以多页模式构建应用程序。
  pages: { //pages里配置的路径和文件名在你的文档目录必须存在，否则启动服务会报错
    index: { //除了 entry 之外都是可选的
      entry: 'src/main.js', //page的主入口
      template: 'public/index.html', //模板来源
      filename: 'index.html', //在 dist/index.html 的输出
      //title在template中使用：<title><%=htmlWebpackPlugin.options.title%></title>
      title: '轻听树下',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
      // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk
    },
    subpage: 'src/main.js'
    //官方解释：当使用只有入口的字符串格式时，模板会被推导为public/subpage.html
    //若找不到就回退到public/index.html，输出文件名会被推导为subpage.html
  },
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // 是否使用包含运行时编译器的Vue核心的构建。
  runtimeCompiler: false,
  // 默认情况下babel-loader忽略其中的所有文件node_modules。
  transpileDependencies: [],
  // 生产环境sourceMap
  productionSourceMap: false,
  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性
  crossorigin: undefined,
  // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
  integrity: false,
  // webpack配置
  configureWebpack: config => {
    const plugins = [
        // new TerserPlugin({
        //   terserOptions: {
        //     warnings: false,
        //     compress: {
        //       inline: false, // 解决vConsole打包报错问题
        //       drop_debugger: true,
        //       drop_console: true,
        //     },
        //   },
        //   sourceMap: false,
        //   parallel: true,
        // }),
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' + ['js', 'css'].join('|') +
          ')$',
        ),
        threshold: 10240,
        minRatio: 0.8,
      }),
    ]
    if (process.env.NODE_ENV === 'production') {
      config.plugins = [...config.plugins, ...plugins]
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  // css相关配置
  css: {
    // 启用 CSS modules
    requireModuleExtension: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      less: {
        modifyVars: {
          red: '#f74042',
          blue: '#4a90e2',
          orange: '#ff9603',
          'text-color': '#373737',
          'border-color': '#e4e4e4'
        }
      }
    },
  },
  // webpack-dev-server配置
  devServer: {
    disableHostCheck: true,
    open: true, // 打开浏览器
    // overlay: {
    //   warnings: true,
    //   errors: true
    // },
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      "/api": {
        target: "http://192.168.1.198:9501/api/", // 目标代理接口地址
        secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        ws: true, // 是否启用websockets
        pathRewrite: {
          "^/api": "/"
        }
      }
    },
  },
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  pwa: {},
  // 第三方插件选项
  pluginOptions: {
    lintStyleOnBuild: true,
    stylelint: {
      fix: true,
      files: 'src/**/*.{vue,htm,html,css,sss,less,scss}',
      formatter: () => {}
    }
  }
}