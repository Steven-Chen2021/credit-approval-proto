import { defineStore } from 'pinia'
export const useSettingsStore = defineStore('settings', {
  state: () => ({ lang: 'zh-TW' as 'en'|'zh-TW'|'zh-CN', esamHit: true, dnbHit: true }),
  actions: { setLang(l: 'en'|'zh-TW'|'zh-CN'){ this.lang = l } }
})
