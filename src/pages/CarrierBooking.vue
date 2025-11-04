<template>
  <div class="carrier-booking">
    <div class="header">
      <h1>{{ t('carrier.title') }}</h1>
      <p>{{ t('carrier.subtitle') }}</p>
    </div>
    <el-empty description="Coming soon · 尚無內容" class="placeholder" />
    <section class="drafts">
      <div class="section-header">
        <h2>{{ t('carrier.recentDrafts') }}</h2>
        <el-button type="primary" link size="small" @click="refresh">{{ t('common.refresh') }}</el-button>
      </div>
      <el-table :data="drafts" v-loading="loading" border>
        <el-table-column prop="carrier" :label="t('fields.carrier')" min-width="120" />
        <el-table-column prop="pol" :label="t('fields.pol')" min-width="120" />
        <el-table-column prop="pod" :label="t('fields.pod')" min-width="120" />
        <el-table-column prop="etd" :label="t('fields.etd')" min-width="160">
          <template #default="{ row }">{{ formatDateTime(row.etd) }}</template>
        </el-table-column>
        <el-table-column prop="containerType" :label="t('fields.containerType')" min-width="120" />
        <el-table-column prop="totalContainerQty" :label="t('fields.containerQty')" min-width="140" />
        <el-table-column prop="sourceOceanBookingIds" :label="t('carrier.sourceIds')" min-width="220">
          <template #default="{ row }">{{ row.sourceOceanBookingIds.join(', ') }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" :label="t('fields.createdAt')" min-width="180">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column prop="createdBy" :label="t('fields.createdBy')" min-width="120" />
        <el-table-column prop="status" :label="t('common.status')" min-width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'Draft' ? 'warning' : 'success'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCarrierBookingStore } from '@/stores/carrierBookings'
import { formatDateTime } from '@/utils/datetime'

const { t } = useI18n()
const store = useCarrierBookingStore()

onMounted(() => {
  store.fetchDrafts()
})

const drafts = computed(() => store.drafts)
const loading = computed(() => store.loading)

function refresh() {
  store.fetchDrafts()
}
</script>

<style scoped>
.carrier-booking {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.header h1 {
  margin: 0;
  font-size: 28px;
}
.header p {
  margin: 4px 0 0;
  color: #606266;
}
.placeholder {
  max-width: 420px;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
</style>
