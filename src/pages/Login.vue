<template>
  <el-card class="login-card" shadow="hover">
    <h2>{{ t('login.title') }}</h2>
    <el-form @submit.prevent="onLogin" label-position="top" :model="form">
      <el-form-item :label="t('login.username')"><el-input v-model="form.username" /></el-form-item>
      <el-form-item :label="t('login.password')"><el-input type="password" v-model="form.password" /></el-form-item>
      <el-button type="primary" @click="onLogin">{{ t('login.submit') }}</el-button>
      <div style="margin-top:10px">
        Demo: admin/sales/accounting/station/l1/l2 + <code>demo1234</code>
      </div>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
const { t } = useI18n()
const auth = useAuthStore(); const router = useRouter()
const form = reactive({ username: '', password: '' })
function onLogin(){
  try { auth.login(form.username, form.password); router.push('/applications') } catch(e:any){ alert(e.message) }
}
</script>
<style>
.login-card { max-width: 420px; margin: 80px auto; }
</style>
