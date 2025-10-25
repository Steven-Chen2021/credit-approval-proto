<template>
  <h2>Application Edit</h2>
  <el-form label-width="140px">
    <el-form-item label="Company Name"><el-input v-model="name" /></el-form-item>
    <el-button type="primary" @click="save">Save Draft</el-button>
  </el-form>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import { useRouter } from 'vue-router'
const apps = useApplicationsStore(); const router = useRouter()
const name = ref('')
async function save(){
  await apps.createDraft({ company: { name: name.value, address:'', city:'', state:'', zip:'', ageYears: 5 }, owners:[], shipping:{unit:'TEU', perMonth:0, estFreightUSD:1000}, references:[], bankRefs:[], authorizedRep:{name:'', title:''}, attachments:[], audit:[], referrals:[], createdBy: 'sales', status:'Draft' as any })
  router.push('/applications')
}
</script>
