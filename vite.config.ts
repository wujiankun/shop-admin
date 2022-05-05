import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginEslint from 'vite-plugin-eslint'
import VueJsx from '@vitejs/plugin-vue-jsx'
import * as path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    VitePluginEslint({
      // vite 编译过程中的 lint 可配置于此
      // failOnError: false
    }),
    VueJsx({}),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        })
      ],
      dts: 'src/components.d.ts'
    })
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
