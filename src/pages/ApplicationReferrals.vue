<template>
  <div v-if="item">
    <h2>Referrals - {{ item.company.name }}</h2>
    <el-button @click="send">Send 3 Referrals</el-button>
    <el-table :data="rows">
      <el-table-column prop="company" label="Company" />
      <el-table-column prop="verdict" label="Verdict" />
      <el-table-column>
        <template #default="{row}">
          <el-button size="small" @click="reply(row,'positive')">Mark Positive</el-button>
          <el-button size="small" @click="reply(row,'negative')">Mark Negative</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useApplicationsStore } from '@/stores/applications'
const apps = useApplicationsStore(); const route = useRoute()
const appId = route.params.id as string
const rows = ref<any[]>([])
const item = computed(()=> apps.list.find(x=> x.id === appId))
async function load(){
  const r = await fetch(`/api/applications/${appId}/referrals`); rows.value = await r.json()
}
async function send(){ await fetch(`/api/applications/${appId}/referrals/send`, { method:'POST' }); await load() }
async function reply(row:any, verdict:'positive'|'negative'){ await fetch(`/api/applications/${appId}/referrals/${row.id}/reply`, { method:'POST', body: JSON.stringify({ verdict, openAR: 100, pastDue: 0, avgDays: 30 }) }); await load() }
onMounted(load)
</script>
