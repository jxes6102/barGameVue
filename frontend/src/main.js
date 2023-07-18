import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import 'normalize.css/normalize.css'
import router from './router'
import store from './store'
import './assets/tailwind.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import twCn from 'element-plus/dist/locale/zh-tw.mjs'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import i18n from './i18n'

const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn,
})

app.use(i18n).use(store).use(router).use(ElementPlus).mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
