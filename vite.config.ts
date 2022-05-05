import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginEslint from 'vite-plugin-eslint'
import VueJsx from '@vitejs/plugin-vue-jsx'
import * as path from 'path'
export default defineConfig({
  plugins: [
    vue(),
    VitePluginEslint({
      // vite 编译过程中的 lint 可配置于此
      // failOnError: false
    }),
    VueJsx({})
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/variable.scss" as *;'
      }
    }
  }
})
