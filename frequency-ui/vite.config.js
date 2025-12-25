import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Element Plus 自动按需引入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    
    // 自动导入 API (如: ref, reactive, computed, useRouter 等)
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
      // 自动生成类型声明文件，解决 TS 报错
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true, // 解决 Eslint 报错
      },
    }),

    // 自动导入组件 (如: ElButton, ElInput 等)
    Components({
      resolvers: [ElementPlusResolver()],
      // 自动生成组件类型声明文件
      dts: 'src/components.d.ts',
    }),
  ],

  resolve: {
    // 路径别名配置: 让 @ 指向 src 目录
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  // 开发服务器配置
  server: {
    port: 5173,      // 端口号
    open: true,      // 启动后自动打开浏览器
    cors: true,      // 允许跨域
    
    // 代理配置 (解决前后端跨域问题)
    proxy: {
      // 匹配 /api 开头的请求
      '/api': {
        target: 'http://localhost:9999', // 后端网关地址 (Pig 默认是 9999)
        changeOrigin: true,             // 开启代理
        rewrite: (path) => path.replace(/^\/api/, '') // 去掉 /api 前缀
      },
      
      // 如果后端有单独的 auth 模块且没走 /api，可以保留这个
      '/auth': {
        target: 'http://localhost:9999',
        changeOrigin: true,
      }
    }
  },

  // 依赖优化配置 (解决部分老包兼容性问题)
  optimizeDeps: {
    include: ['axios', 'js-cookie', 'element-plus/es']
  }
})