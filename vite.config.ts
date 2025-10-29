/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-21 13:21:20
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-22 15:12:19
 * @FilePath: \model-sandbox-frontend\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 引入tailwindcss
import tailwindcss from 'tailwindcss'

// 引入autoprefixer
import autoprefixer from 'autoprefixer'

const Timestamp = new Date().getTime()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    },
    preprocessorOptions: {
      scss: {
          additionalData: '@use "@/style/variables.scss" as *;',
      }
    }
  },

  publicDir: 'public', // 静态资源服务的文件夹
  base: './', // 基础路径
  assetsInclude: '', // 静态资源处理
  clearScreen: false, //设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      '~~': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  server: {
    // 开发配置
    host: '0.0.0.0',
    cors: true, // 跨域
    port: 8555, // 端口
    proxy: {
      // 接口地址
      // '/api/service1': {
      //   target:'http://10.10.20.46:15108',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api\/service1/, '')
      // },
      // '/api/message': {
      //   target:'http://10.10.171.152:15103',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api\/message/, '')
      // },
      // '/api/userService': {
      //   target:'http://10.10.20.46:15002',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api\/userService/, '')
      // }
      //   '/ms': { //刘永柱本地
      //     target:'http://10.10.171.198:11010',
      //       // target:'http://10.10.226.120:11010',
      //     changeOrigin: true,
      //       // rewrite: (path) => path.replace(/^\/api/, '')
      //   },
        // '/ms': { //李晓荣本地
        //     target:'http://10.10.171.195:11010',
        //     // target:'http://10.10.224.29:11010',
        //     changeOrigin: true,
        //     // rewrite: (path) => path.replace(/^\/model/, '')
        // },
      //   '/ms': { // 开发环境
      //       target:'http://10.195.6.251:11010',
      //       // target:'http://10.10.224.29:11010',
      //       changeOrigin: true,
      //       rewrite: (path) => path.replace(/^\/ms/, '')
      //   },
    }
  },
  build: {
    // 构建配置
    outDir: 'dist', // 输出目录
    assetsDir: 'static', // 配置静态资源路径
    assetsInlineLimit: 4096, //小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
    cssCodeSplit: true, // 启用/禁用 CSS 代码拆分
    sourcemap: false, // 构建后是否生成 source map 文件
    manifest: false,
    // 设置为 false 可以禁用最小化混淆
    // 或是用来指定使用哪种混淆器
    // boolean | 'terser' | 'esbuild'
    // terser 构建后文件体积更小
    minify: 'terser',
    terserOptions: {
      //传递给 Terser 的更多 minify 选项
      compress: {
        // 清除log
        keep_infinity: true,
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      //打包 js/css配置
      output: {
        entryFileNames: `static/js/[name].[hash].${Timestamp}.js`,
        chunkFileNames: `static/js/[name].[hash].${Timestamp}.js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo?.name?.endsWith('.css')) {
            return `static/css/[name].[hash].${Timestamp}.[ext]`
          }
          return `static/[name].[hash].${Timestamp}.[ext]`
        }
      }
    },
    reportCompressedSize: true, //启用/禁用 reportCompressedSize 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
    chunkSizeWarningLimit: 3000 // chunk大小警告限制
  }
})
