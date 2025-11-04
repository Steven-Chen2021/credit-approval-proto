<template>
  <div class="portal">
    <h1 class="page-title">{{ t('portal.title') }}</h1>
    <p class="page-subtitle">{{ t('portal.subtitle') }}</p>
    <el-row :gutter="24" class="cards-row">
      <el-col :xs="24" :sm="12">
        <el-card shadow="hover" class="portal-card">
          <template #header>
            <div class="card-header">
              <div>
                <h2>Ocean Booking Bank</h2>
                <p>{{ t('portal.ocean.desc') }}</p>
              </div>
              <div class="badges" v-if="summary">
                <el-tag type="success" effect="plain">{{ t('common.unused') }}: {{ summary.unused }}</el-tag>
                <el-tag type="info" effect="plain">{{ t('common.used') }}: {{ summary.used }}</el-tag>
              </div>
            </div>
          </template>
          <p class="card-body">{{ t('portal.ocean.body') }}</p>
          <el-button type="primary" @click="go('/ocean-booking-bank')">{{ t('portal.enter') }}</el-button>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card shadow="hover" class="portal-card">
          <template #header>
            <div class="card-header">
              <div>
                <h2>Carrier Booking</h2>
                <p>{{ t('portal.carrier.desc') }}</p>
              </div>
            </div>
          </template>
          <p class="card-body">{{ t('portal.carrier.body') }}</p>
          <el-button type="primary" @click="go('/carrier-booking')">{{ t('portal.enter') }}</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useOceanBookingStore } from '@/stores/oceanBookings'

const router = useRouter()
const { t } = useI18n()
const bookingStore = useOceanBookingStore()

onMounted(() => {
  bookingStore.fetchSummary()
})

const summary = computed(() => bookingStore.summary)

function go(path: string) {
  router.push(path)
}
</script>

<style scoped>
.portal {
  padding: 24px;
}
.page-title {
  margin: 0 0 8px;
  font-size: 28px;
}
.page-subtitle {
  margin: 0 0 24px;
  color: #606266;
}
.cards-row {
  margin-top: 16px;
}
.portal-card {
  min-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.card-header h2 {
  margin: 0 0 4px;
}
.card-header p {
  margin: 0;
  color: #909399;
}
.card-body {
  flex: 1;
  margin-bottom: 16px;
  color: #606266;
}
.badges {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}
</style>
