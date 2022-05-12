import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store, {key} from './store'
import ElementPlus from './plugins/element-plus'
import '@/styles/index.scss'
import VXETable from './plugins/vux-table'

const app = createApp(App)
app.use(router)
app.use(store, key)
app.use(ElementPlus)
app.use(VXETable)

// 自动注册全局自定义组件
const modules = import.meta.globEager('./components/**/index.ts')
for (const path in modules) {
  app.use(modules[path].default)
}
app.mount('#app')
