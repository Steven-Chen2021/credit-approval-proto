import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import i18n from './i18n'
import App from './App.vue'
import { pinia } from './stores'
import { worker } from './mocks/msw'

if (import.meta.env.DEV) {
  // Register MSW using a local worker file shipped in /public for convenience
  worker.start({ serviceWorker: { url: '/mockServiceWorker.js' } })
}

createApp(App)
  .use(pinia)
  .use(router)
  .use(i18n)
  .use(ElementPlus)
  .mount('#app')
