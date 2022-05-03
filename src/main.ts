import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store, {key} from './store'
import ElementPlus from './plugins/element-plus'
import '@/styles/index.scss'
createApp(App)
  .use(router)
  .use(store, key)
  .use(ElementPlus)
  .mount('#app')
