<template>
  <div class="flex items-center justify-between">
    <h2>{{ t('list.title') }}</h2>
    <div>
      <el-button type="primary" @click="$router.push('/applications/new')">{{ t('list.new') }}</el-button>
    </div>
  </div>
  <el-table :data="apps.list" style="width:100%" v-loading="!apps.list.length">
    <el-table-column prop="company.name" label="Company" />
    <el-table-column label="Status">
      <template #default="{row}"><StatusBadge :status="row.status" /></template>
    </el-table-column>
    <el-table-column prop="estimatedAnnualRevenue" label="Revenue" />
    <el-table-column>
      <template #default="{row}">
        <el-button size="small" @click="$router.push('/applications/'+row.id)">View</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import StatusBadge from '@/components/StatusBadge.vue'
import { useI18n } from 'vue-i18n'
const apps = useApplicationsStore()
const { t } = useI18n()
onMounted(()=> apps.fetch())
</script>
