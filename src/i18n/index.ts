import { createI18n } from 'vue-i18n'
import en from './en'
import zhTW from './zh-TW'
import zhCN from './zh-CN'

export default createI18n({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'en',
  messages: { en, 'zh-TW': zhTW, 'zh-CN': zhCN }
})
