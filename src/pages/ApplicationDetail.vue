<template>
  <div v-if="item">
    <h2>{{ item.company.name }}</h2>
    <StatusBadge :status="item.status" />
    <p>AgeYears: {{ item.company.ageYears }}</p>
    <el-button @click="$router.push('/applications/'+item.id+'/referrals')">Referrals</el-button>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useApplicationsStore } from '@/stores/applications'
import StatusBadge from '@/components/StatusBadge.vue'
const route = useRoute(); const apps = useApplicationsStore()
const item = computed(()=> apps.list.find(x=> x.id === (route.params.id as string)))
</script>
