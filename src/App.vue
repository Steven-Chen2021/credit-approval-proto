<template>
  <el-container>
    <el-header class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <strong>{{ t('appTitle') }}</strong>
        <el-tag type="info" size="small">MSW</el-tag>
      </div>
      <div class="flex items-center gap-2">
        <el-select v-model="lang" size="small" @change="onLang" style="width:140px">
          <el-option label="English" value="en" />
          <el-option label="繁體中文" value="zh-TW" />
          <el-option label="简体中文" value="zh-CN" />
        </el-select>
        <el-button size="small" @click="$router.push('/diagnostics')">Diagnostics</el-button>
        <el-button size="small" type="primary" @click="logout" v-if="auth.isAuthenticated">{{ auth.currentUser?.username }} · Logout</el-button>
        <el-button size="small" type="primary" @click="$router.push('/login')" v-else>Login</el-button>
      </div>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from './stores/auth'
import { useSettingsStore } from './stores/settings'

const { t, locale } = useI18n()
const auth = useAuthStore()
const settings = useSettingsStore()
const lang = $ref(settings.lang)

function onLang(v: string) {
  settings.setLang(v as any)
  locale.value = v
}
function logout(){ auth.logout(); location.href = '/#/login' }
</script>

<style>
body, html, #app {
  margin: 0; padding: 0; height: 100%;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial;
}
.el-header { border-bottom: 1px solid #eee; }
.flex { display:flex } .items-center{align-items:center} .justify-between{justify-content:space-between}
.gap-2 { gap: .5rem }
</style>
