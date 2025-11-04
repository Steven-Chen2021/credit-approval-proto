<template>
  <el-container class="app-shell">
    <el-header class="app-header">
      <div class="header-left">
        <router-link to="/" class="app-title">{{ t('appTitle') }}</router-link>
        <el-tag type="info" size="small">{{ timeZoneLabel }}</el-tag>
        <nav class="nav-links">
          <router-link to="/" :class="navClass('/')">{{ t('nav.portal') }}</router-link>
          <router-link to="/ocean-booking-bank" :class="navClass('/ocean-booking-bank')">{{ t('nav.ocean') }}</router-link>
          <router-link to="/carrier-booking" :class="navClass('/carrier-booking')">{{ t('nav.carrier') }}</router-link>
        </nav>
      </div>
      <div class="header-right">
        <el-select v-model="lang" size="small" style="width: 140px">
          <el-option label="English" value="en" />
          <el-option label="繁體中文" value="zh-TW" />
          <el-option label="简体中文" value="zh-CN" />
        </el-select>
        <el-select v-model="role" size="small" style="width: 140px">
          <el-option label="OP" value="OP" />
          <el-option label="Viewer" value="Viewer" />
        </el-select>
        <el-tag size="small" type="success">{{ user.username }}</el-tag>
      </div>
    </el-header>
    <el-main class="app-main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from './stores/settings'
import { useUserStore } from './stores/user'
import { timeZoneLabel } from './utils/datetime'

const { t, locale } = useI18n()
const settings = useSettingsStore()
const user = useUserStore()
const route = useRoute()

const lang = computed({
  get: () => settings.lang,
  set: (value: string) => {
    settings.setLang(value as 'en' | 'zh-TW' | 'zh-CN')
    locale.value = value
  },
})

const role = computed({
  get: () => user.role,
  set: (value: 'OP' | 'Viewer') => {
    user.setRole(value)
  },
})

function navClass(path: string) {
  return ['nav-link', route.path === path ? 'active' : ''].join(' ').trim()
}
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
}
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #ebeef5;
  gap: 16px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.app-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2d3d;
  text-decoration: none;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-link {
  color: #606266;
  text-decoration: none;
  font-weight: 500;
}
.nav-link.active {
  color: #409eff;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.app-main {
  background: #f5f7fa;
  padding: 0;
}
</style>
