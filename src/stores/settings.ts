import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({ lang: 'zh-TW' as 'en' | 'zh-TW' | 'zh-CN' }),
  actions: {
    setLang(lang: 'en' | 'zh-TW' | 'zh-CN') {
      this.lang = lang
    },
  },
})
