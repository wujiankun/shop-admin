import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {App} from 'vue'
export default {
  install (app:App) {
    app.use(ElementPlus, {size: 'large', zIndex: 3000, locale: zhCn})
  }
}
