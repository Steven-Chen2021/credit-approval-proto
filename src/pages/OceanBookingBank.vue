<template>
  <div class="booking-page">
    <section class="toolbar">
      <el-card class="filters-card" shadow="never">
        <div class="toolbar-header">
          <div>
            <h1>{{ t('ocean.title') }}</h1>
            <p>{{ t('ocean.subtitle') }}</p>
          </div>
          <div class="toolbar-buttons">
            <el-button type="primary" @click="openCreate" :disabled="isViewer">{{ t('ocean.actions.new') }}</el-button>
            <el-button @click="clearFilters">{{ t('ocean.actions.clear') }}</el-button>
            <el-button @click="exportCsv" plain>{{ t('ocean.actions.export') }}</el-button>
            <el-button text @click="showFilters = !showFilters">
              <el-icon><component :is="showFilters ? ArrowUp : ArrowDown" /></el-icon>
            </el-button>
          </div>
        </div>
        <el-collapse-transition>
          <div v-show="showFilters" class="filters-body">
            <el-form :model="filters" label-position="top" class="filters-grid">
              <el-form-item :label="t('common.status')">
                <el-select v-model="filters.status" multiple collapse-tags filterable @change="applyFilters(true)">
                  <el-option label="Unused" value="Unused" />
                  <el-option label="Used" value="Used" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('fields.soNo')">
                <el-input v-model="filters.soNo" clearable @keyup.enter="applyFilters(true)" ref="soInputRef" />
              </el-form-item>
              <el-form-item :label="t('fields.blNo')">
                <el-input v-model="filters.blNo" clearable @keyup.enter="applyFilters(true)" />
              </el-form-item>
              <el-form-item :label="t('fields.pol')">
                <el-select v-model="filters.pol" filterable allow-create default-first-option clearable @change="applyFilters(true)">
                  <el-option v-for="port in polOptions" :key="port" :label="port" :value="port" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('fields.pod')">
                <el-select v-model="filters.pod" filterable allow-create default-first-option clearable @change="applyFilters(true)">
                  <el-option v-for="port in podOptions" :key="port" :label="port" :value="port" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('fields.carrier')">
                <el-select v-model="filters.carrier" filterable allow-create default-first-option clearable @change="applyFilters(true)">
                  <el-option v-for="carrier in carrierOptions" :key="carrier" :label="carrier" :value="carrier" />
                </el-select>
              </el-form-item>
              <el-form-item :label="t('fields.etc')">
                <el-date-picker
                  v-model="filters.etc"
                  type="datetimerange"
                  range-separator="~"
                  start-placeholder="Start"
                  end-placeholder="End"
                  value-format="YYYY-MM-DD HH:mm"
                  format="YYYY-MM-DD HH:mm"
                  @change="applyFilters(true)"
                />
              </el-form-item>
              <el-form-item :label="t('fields.etd')">
                <el-date-picker
                  v-model="filters.etd"
                  type="datetimerange"
                  range-separator="~"
                  start-placeholder="Start"
                  end-placeholder="End"
                  value-format="YYYY-MM-DD HH:mm"
                  format="YYYY-MM-DD HH:mm"
                  @change="applyFilters(true)"
                />
              </el-form-item>
              <el-form-item :label="t('fields.eta')">
                <el-date-picker
                  v-model="filters.eta"
                  type="datetimerange"
                  range-separator="~"
                  start-placeholder="Start"
                  end-placeholder="End"
                  value-format="YYYY-MM-DD HH:mm"
                  format="YYYY-MM-DD HH:mm"
                  @change="applyFilters(true)"
                />
              </el-form-item>
              <el-form-item :label="t('fields.vessel')">
                <el-input v-model="filters.vessel" clearable @keyup.enter="applyFilters(true)" />
              </el-form-item>
              <el-form-item :label="t('fields.voyage')">
                <el-input v-model="filters.voyage" clearable @keyup.enter="applyFilters(true)" />
              </el-form-item>
              <el-form-item :label="t('fields.containerType')">
                <el-select v-model="filters.containerType" multiple collapse-tags @change="applyFilters(true)">
                  <el-option label="20CNT" value="20CNT" />
                  <el-option label="40CNT" value="40CNT" />
                  <el-option label="40HQ" value="40HQ" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-transition>
        <div class="chips" v-if="activeChips.length">
          <el-space wrap>
            <el-tag
              v-for="chip in activeChips"
              :key="chip.key"
              closable
              @close="removeChip(chip.key)"
              effect="plain"
            >
              {{ chip.label }}：{{ chip.value }}
            </el-tag>
          </el-space>
        </div>
      </el-card>
    </section>

    <section class="results">
      <div class="results-actions">
        <div class="left">
          <el-button-group>
            <el-button size="small" :disabled="!selectedIds.length || isViewer" @click="batchStatus('Used')">
              {{ t('ocean.actions.batchUsed') }}
            </el-button>
            <el-button size="small" :disabled="!selectedIds.length || isViewer" @click="batchStatus('Unused')">
              {{ t('ocean.actions.batchUnused') }}
            </el-button>
            <el-button size="small" type="primary" :disabled="!selectedIds.length || isViewer" @click="assignSelected">
              {{ t('ocean.actions.assign') }}
            </el-button>
          </el-button-group>
        </div>
        <div class="right">
          <span>{{ t('ocean.resultCount', { total }) }}</span>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table
          :data="bookings"
          row-key="id"
          border
          height="100%"
          v-loading="loading"
          @selection-change="onSelectionChange"
          @sort-change="onSortChange"
          :default-sort="{ prop: sortState.sortBy, order: sortState.sortDir === 'asc' ? 'ascending' : 'descending' }"
        >
          <el-table-column type="selection" width="48" />
          <el-table-column type="expand">
            <template #default="{ row }">
              <div class="row-detail">
                <div>
                  <strong>{{ t('fields.createdBy') }}：</strong>{{ row.createdBy }}
                </div>
                <div>
                  <strong>{{ t('fields.createdAt') }}：</strong>{{ formatDateTime(row.createdAt) }}
                </div>
                <div>
                  <strong>{{ t('fields.updatedAt') }}：</strong>{{ formatDateTime(row.updatedAt) || t('common.na') }}
                </div>
                <div>
                  <strong>{{ t('fields.remarks') }}：</strong>{{ row.remarks || t('common.none') }}
                </div>
                <div v-if="row.carrierBookingId">
                  <strong>{{ t('ocean.assignedTo') }}：</strong>
                  <router-link :to="{ path: '/carrier-booking', query: { focus: row.carrierBookingId } }">#{{ row.carrierBookingId }}</router-link>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" :label="t('common.status')" sortable="custom" min-width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === 'Unused' ? 'success' : 'info'">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="soNo" :label="t('fields.soNo')" min-width="160" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="blNo" :label="t('fields.blNo')" min-width="160" show-overflow-tooltip />
          <el-table-column prop="pol" :label="t('fields.pol')" min-width="140" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="pod" :label="t('fields.pod')" min-width="140" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="carrier" :label="t('fields.carrier')" min-width="140" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="etc" :label="t('fields.etc')" min-width="170" sortable="custom">
            <template #default="{ row }">{{ formatDateTime(row.etc) }}</template>
          </el-table-column>
          <el-table-column prop="etd" :label="t('fields.etd')" min-width="170" sortable="custom">
            <template #default="{ row }">{{ formatDateTime(row.etd) }}</template>
          </el-table-column>
          <el-table-column prop="eta" :label="t('fields.eta')" min-width="170" sortable="custom">
            <template #default="{ row }">{{ formatDateTime(row.eta) }}</template>
          </el-table-column>
          <el-table-column prop="containerType" :label="t('fields.containerType')" min-width="120" sortable="custom" />
          <el-table-column prop="containerQty" :label="t('fields.containerQty')" min-width="140" sortable="custom" />
          <el-table-column prop="vessel" :label="t('fields.vessel')" min-width="160" show-overflow-tooltip />
          <el-table-column prop="voyage" :label="t('fields.voyage')" min-width="120" show-overflow-tooltip />
          <el-table-column fixed="right" :label="t('common.actions')" min-width="220">
            <template #default="{ row }">
              <el-space>
                <el-button type="primary" link size="small" @click="openEdit(row)" :disabled="isViewer">{{ t('common.edit') }}</el-button>
                <el-button type="primary" link size="small" :disabled="isViewer" @click="toggleStatus(row)">
                  {{ row.status === 'Unused' ? t('ocean.actions.markUsed') : t('ocean.actions.markUnused') }}
                </el-button>
                <el-button type="primary" link size="small" :disabled="isViewer" @click="assignSingle(row)">
                  {{ t('ocean.actions.assign') }}
                </el-button>
              </el-space>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-footer">
        <el-pagination
          background
          layout="prev, pager, next, jumper, ->, sizes, total"
          :current-page="pagination.page"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          @current-change="(page: number) => { pagination.page = page; loadData() }"
          @size-change="(size: number) => { pagination.pageSize = size; pagination.page = 1; loadData() }"
        />
      </div>
    </section>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="720px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item prop="soNo" :label="t('fields.soNo')">
              <el-input v-model="form.soNo" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="carrier" :label="t('fields.carrier')">
              <el-select v-model="form.carrier" filterable allow-create default-first-option>
                <el-option v-for="carrier in carrierOptions" :key="carrier" :label="carrier" :value="carrier" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item prop="pol" :label="t('fields.pol')">
              <el-select v-model="form.pol" filterable allow-create default-first-option>
                <el-option v-for="port in polOptions" :key="port" :label="port" :value="port" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="pod" :label="t('fields.pod')">
              <el-select v-model="form.pod" filterable allow-create default-first-option>
                <el-option v-for="port in podOptions" :key="port" :label="port" :value="port" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item prop="etd" :label="t('fields.etd')">
              <el-date-picker v-model="form.etd" type="datetime" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="etc" :label="t('fields.etc')">
              <el-date-picker v-model="form.etc" type="datetime" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item prop="eta" :label="t('fields.eta')">
              <el-date-picker v-model="form.eta" type="datetime" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="containerType" :label="t('fields.containerType')">
              <el-select v-model="form.containerType">
                <el-option label="20CNT" value="20CNT" />
                <el-option label="40CNT" value="40CNT" />
                <el-option label="40HQ" value="40HQ" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item prop="containerQty" :label="t('fields.containerQty')">
              <el-input-number v-model="form.containerQty" :min="1" :step="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vessel" :label="t('fields.vessel')">
              <el-input v-model="form.vessel" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item prop="voyage" :label="t('fields.voyage')">
              <el-input v-model="form.voyage" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="blNo" :label="t('fields.blNo')">
              <el-input v-model="form.blNo" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="remarks" :label="t('fields.remarks')">
          <el-input v-model="form.remarks" type="textarea" :rows="3" maxlength="300" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm">{{ t('common.save') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOceanBookingStore, type OceanBooking, type OceanBookingStatus } from '@/stores/oceanBookings'
import { useCarrierBookingStore } from '@/stores/carrierBookings'
import { useUserStore } from '@/stores/user'
import { formatDateTime, isoToLocalInput, localDateTimeToISO } from '@/utils/datetime'

const { t } = useI18n()
const bookingStore = useOceanBookingStore()
const carrierStore = useCarrierBookingStore()
const userStore = useUserStore()

const showFilters = ref(true)
const pagination = reactive({ page: 1, pageSize: 20 })
const sortState = reactive({ sortBy: 'etd', sortDir: 'asc' as 'asc' | 'desc' })
const filters = reactive({
  status: [] as OceanBookingStatus[],
  soNo: '',
  blNo: '',
  pol: '',
  pod: '',
  carrier: '',
  etc: [] as string[],
  etd: [] as string[],
  eta: [] as string[],
  vessel: '',
  voyage: '',
  containerType: [] as string[],
})

const carrierOptions = ['COSCO', 'EMC', 'SITC']
const polOptions = ['CNSHA/Shanghai', 'CNSZX/Shenzhen', 'CNNGB/Ningbo']
const podOptions = ['USLAX/Los Angeles', 'USLGB/Long Beach', 'USSEA/Seattle']

const bookings = computed(() => bookingStore.items)
const total = computed(() => bookingStore.total)
const loading = computed(() => bookingStore.loading)
const isViewer = computed(() => userStore.role === 'Viewer')
const selectedIds = ref<string[]>([])
const soInputRef = ref()

const filterTimer = ref<number | null>(null)

onMounted(() => {
  bookingStore.fetchSummary()
  loadData()
  window.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKey)
})

watch(
  filters,
  () => {
    scheduleFetch()
  },
  { deep: true }
)

watch(
  () => filters.etc,
  (val) => {
    if (!Array.isArray(val)) filters.etc = []
  }
)

watch(
  () => filters.etd,
  (val) => {
    if (!Array.isArray(val)) filters.etd = []
  }
)

watch(
  () => filters.eta,
  (val) => {
    if (!Array.isArray(val)) filters.eta = []
  }
)

const activeChips = computed(() => {
  const chips: { key: string; label: string; value: string }[] = []
  if (filters.status.length) chips.push({ key: 'status', label: t('common.status'), value: filters.status.join(', ') })
  if (filters.soNo) chips.push({ key: 'soNo', label: t('fields.soNo'), value: filters.soNo })
  if (filters.blNo) chips.push({ key: 'blNo', label: t('fields.blNo'), value: filters.blNo })
  if (filters.pol) chips.push({ key: 'pol', label: t('fields.pol'), value: filters.pol })
  if (filters.pod) chips.push({ key: 'pod', label: t('fields.pod'), value: filters.pod })
  if (filters.carrier) chips.push({ key: 'carrier', label: t('fields.carrier'), value: filters.carrier })
  if (filters.etc && filters.etc.length === 2 && filters.etc[0]) chips.push({ key: 'etc', label: t('fields.etc'), value: filters.etc.join(' ~ ') })
  if (filters.etd && filters.etd.length === 2 && filters.etd[0]) chips.push({ key: 'etd', label: t('fields.etd'), value: filters.etd.join(' ~ ') })
  if (filters.eta && filters.eta.length === 2 && filters.eta[0]) chips.push({ key: 'eta', label: t('fields.eta'), value: filters.eta.join(' ~ ') })
  if (filters.vessel) chips.push({ key: 'vessel', label: t('fields.vessel'), value: filters.vessel })
  if (filters.voyage) chips.push({ key: 'voyage', label: t('fields.voyage'), value: filters.voyage })
  if (filters.containerType.length) chips.push({ key: 'containerType', label: t('fields.containerType'), value: filters.containerType.join(', ') })
  return chips
})

const dialogVisible = ref(false)
const editing = ref<OceanBooking | null>(null)

const form = reactive({
  soNo: '',
  blNo: '',
  pol: '',
  pod: '',
  carrier: '',
  etc: '',
  etd: '',
  eta: '',
  vessel: '',
  voyage: '',
  containerType: '20CNT',
  containerQty: 1,
  remarks: '',
})

const rules: FormRules = {
  soNo: [{ required: true, message: t('validation.required'), trigger: 'blur' }],
  pol: [{ required: true, message: t('validation.required'), trigger: 'change' }],
  pod: [{ required: true, message: t('validation.required'), trigger: 'change' }],
  carrier: [{ required: true, message: t('validation.required'), trigger: 'change' }],
  etd: [{ required: true, message: t('validation.required'), trigger: 'change' }],
  containerType: [{ required: true, message: t('validation.required'), trigger: 'change' }],
  containerQty: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (!value || Number(value) <= 0 || !Number.isInteger(Number(value))) {
          callback(new Error(t('validation.qtyPositive')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  etc: [
    {
      validator: (_rule, value, callback) => {
        if (value && form.etd) {
          const etcIso = localDateTimeToISO(value)
          const etdIso = localDateTimeToISO(form.etd)
          if (etcIso && etdIso && new Date(etcIso) > new Date(etdIso)) {
            callback(new Error(t('validation.etcBeforeEtd')))
            return
          }
        }
        callback()
      },
      trigger: 'change',
    },
  ],
  eta: [
    {
      validator: (_rule, value, callback) => {
        if (value && form.etd) {
          const etaIso = localDateTimeToISO(value)
          const etdIso = localDateTimeToISO(form.etd)
          if (etaIso && etdIso && new Date(etaIso) < new Date(etdIso)) {
            callback(new Error(t('validation.etaAfterEtd')))
            return
          }
        }
        callback()
      },
      trigger: 'change',
    },
  ],
}

const formRef = ref<FormInstance>()

const dialogTitle = computed(() => (editing.value ? t('ocean.dialog.edit') : t('ocean.dialog.new')))

function scheduleFetch(immediate = false) {
  if (filterTimer.value) {
    clearTimeout(filterTimer.value)
    filterTimer.value = null
  }
  const run = () => {
    pagination.page = 1
    loadData()
  }
  if (immediate) {
    run()
  } else {
    filterTimer.value = window.setTimeout(run, 300)
  }
}

function applyFilters(immediate = false) {
  scheduleFetch(immediate)
}

function removeChip(key: string) {
  switch (key) {
    case 'status':
      filters.status = []
      break
    case 'soNo':
      filters.soNo = ''
      break
    case 'blNo':
      filters.blNo = ''
      break
    case 'pol':
      filters.pol = ''
      break
    case 'pod':
      filters.pod = ''
      break
    case 'carrier':
      filters.carrier = ''
      break
    case 'etc':
      filters.etc = []
      break
    case 'etd':
      filters.etd = []
      break
    case 'eta':
      filters.eta = []
      break
    case 'vessel':
      filters.vessel = ''
      break
    case 'voyage':
      filters.voyage = ''
      break
    case 'containerType':
      filters.containerType = []
      break
  }
  scheduleFetch(true)
}

function clearFilters() {
  filters.status = []
  filters.soNo = ''
  filters.blNo = ''
  filters.pol = ''
  filters.pod = ''
  filters.carrier = ''
  filters.etc = []
  filters.etd = []
  filters.eta = []
  filters.vessel = ''
  filters.voyage = ''
  filters.containerType = []
  scheduleFetch(true)
}

async function loadData() {
  await bookingStore.fetchList({
    status: filters.status.length ? filters.status : undefined,
    soNo: filters.soNo || undefined,
    blNo: filters.blNo || undefined,
    pol: filters.pol || undefined,
    pod: filters.pod || undefined,
    carrier: filters.carrier || undefined,
    etcFrom: filters.etc && filters.etc.length === 2 ? localDateTimeToISO(filters.etc[0]) ?? undefined : undefined,
    etcTo: filters.etc && filters.etc.length === 2 ? localDateTimeToISO(filters.etc[1]) ?? undefined : undefined,
    etdFrom: filters.etd && filters.etd.length === 2 ? localDateTimeToISO(filters.etd[0]) ?? undefined : undefined,
    etdTo: filters.etd && filters.etd.length === 2 ? localDateTimeToISO(filters.etd[1]) ?? undefined : undefined,
    etaFrom: filters.eta && filters.eta.length === 2 ? localDateTimeToISO(filters.eta[0]) ?? undefined : undefined,
    etaTo: filters.eta && filters.eta.length === 2 ? localDateTimeToISO(filters.eta[1]) ?? undefined : undefined,
    vessel: filters.vessel || undefined,
    voyage: filters.voyage || undefined,
    containerType: filters.containerType.length ? (filters.containerType as any) : undefined,
    page: pagination.page,
    pageSize: pagination.pageSize,
    sortBy: sortState.sortBy,
    sortDir: sortState.sortDir,
  })
}

function onSelectionChange(rows: OceanBooking[]) {
  selectedIds.value = rows.map((r) => r.id)
}

function onSortChange({ prop, order }: { prop: string; order: 'ascending' | 'descending' | null }) {
  if (!prop || !order) return
  sortState.sortBy = prop
  sortState.sortDir = order === 'ascending' ? 'asc' : 'desc'
  loadData()
}

function openCreate() {
  if (isViewer.value) return
  editing.value = null
  Object.assign(form, {
    soNo: '',
    blNo: '',
    pol: '',
    pod: '',
    carrier: '',
    etc: '',
    etd: '',
    eta: '',
    vessel: '',
    voyage: '',
    containerType: '20CNT',
    containerQty: 1,
    remarks: '',
  })
  dialogVisible.value = true
}

function openEdit(row: OceanBooking) {
  if (isViewer.value) return
  editing.value = row
  Object.assign(form, {
    soNo: row.soNo,
    blNo: row.blNo || '',
    pol: row.pol,
    pod: row.pod,
    carrier: row.carrier,
    etc: isoToLocalInput(row.etc),
    etd: isoToLocalInput(row.etd),
    eta: isoToLocalInput(row.eta),
    vessel: row.vessel || '',
    voyage: row.voyage || '',
    containerType: row.containerType,
    containerQty: row.containerQty,
    remarks: row.remarks || '',
  })
  dialogVisible.value = true
}

async function submitForm() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    const etdIso = localDateTimeToISO(form.etd)
    if (!etdIso) {
      ElMessage.error(t('validation.invalidDate'))
      return
    }
    const payload = {
      soNo: form.soNo.trim(),
      blNo: form.blNo.trim() || undefined,
      pol: form.pol,
      pod: form.pod,
      carrier: form.carrier,
      etc: localDateTimeToISO(form.etc || undefined) || undefined,
      etd: etdIso,
      eta: localDateTimeToISO(form.eta || undefined) || undefined,
      vessel: form.vessel.trim() || undefined,
      voyage: form.voyage.trim() || undefined,
      containerType: form.containerType,
      containerQty: form.containerQty,
      remarks: form.remarks.trim() || undefined,
    }
    const unique = await bookingStore.checkUnique(payload.soNo, payload.carrier, payload.etd, editing.value?.id)
    if (!unique) {
      ElMessage.error(t('validation.uniqueSo'))
      return
    }
    try {
      if (editing.value) {
        await bookingStore.update(editing.value.id, payload)
        ElMessage.success(t('messages.updated'))
      } else {
        await bookingStore.create(payload)
        pagination.page = 1
        ElMessage.success(t('messages.created'))
      }
      dialogVisible.value = false
      await bookingStore.fetchSummary()
      await loadData()
    } catch (err: any) {
      ElMessage.error(err.message || 'Failed')
    }
  })
}

async function batchStatus(status: OceanBookingStatus) {
  if (!selectedIds.value.length) return
  try {
    const res = await bookingStore.updateStatus(selectedIds.value, status)
    const success = res.updated.length
    const skipped = res.skipped.length
    ElMessage.success(t('messages.batchStatus', { success, skipped, status }))
    selectedIds.value = []
    await loadData()
  } catch (err: any) {
    ElMessage.error(err.message || 'Failed')
  }
}

async function toggleStatus(row: OceanBooking) {
  const target = row.status === 'Unused' ? 'Used' : 'Unused'
  try {
    await bookingStore.updateStatus([row.id], target)
    ElMessage.success(t('messages.singleStatus', { status: target }))
    await loadData()
  } catch (err: any) {
    ElMessage.error(err.message || 'Failed')
  }
}

async function assignSingle(row: OceanBooking) {
  if (!row) return
  await assignWithConfirmation([row])
}

async function assignSelected() {
  if (!selectedIds.value.length) return
  const rows = bookings.value.filter((b) => selectedIds.value.includes(b.id))
  await assignWithConfirmation(rows)
}

async function assignWithConfirmation(rows: OceanBooking[]) {
  if (!rows.length) return
  const carrierSet = new Set(rows.map((r) => r.carrier))
  const polSet = new Set(rows.map((r) => r.pol))
  const podSet = new Set(rows.map((r) => r.pod))
  const etdSet = new Set(rows.map((r) => formatDateTime(r.etd)))
  let proceed = true
  if (carrierSet.size > 1 || polSet.size > 1 || podSet.size > 1 || etdSet.size > 1) {
    try {
      await ElMessageBox.confirm(t('messages.assignMixed'), t('ocean.actions.assign'), {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      })
    } catch {
      proceed = false
    }
  }
  if (!proceed) return
  try {
    const drafts = await bookingStore.assignToCarrier(rows.map((r) => r.id))
    await carrierStore.fetchDrafts()
    selectedIds.value = []
    ElMessage.success(t('messages.assigned', { count: drafts.length }))
    await loadData()
  } catch (err: any) {
    ElMessage.error(err.message || 'Failed')
  }
}

function exportCsv() {
  const count = bookings.value.length
  ElMessage.info(t('messages.exportWip', { count }))
}

function handleKey(event: KeyboardEvent) {
  const tag = (event.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    showFilters.value = !showFilters.value
  } else if (event.key === '/') {
    event.preventDefault()
    soInputRef.value?.focus?.()
  } else if (!event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'n') {
    if (isViewer.value) return
    event.preventDefault()
    openCreate()
  }
}
</script>

<style scoped>
.booking-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px 24px;
  min-height: calc(100vh - 80px);
}
.toolbar {
  flex: 0 0 20%;
  min-height: 160px;
}
.filters-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.toolbar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}
.toolbar-header h1 {
  margin: 0;
  font-size: 26px;
}
.toolbar-header p {
  margin: 4px 0 0;
  color: #606266;
}
.toolbar-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}
.filters-body {
  overflow: auto;
}
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px 16px;
}
.chips {
  margin-top: 12px;
}
.results {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.results-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-wrapper {
  flex: 1 1 auto;
  min-height: 0;
}
.table-footer {
  display: flex;
  justify-content: flex-end;
}
.row-detail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px 16px;
  padding: 12px 8px;
  background: #f9fafc;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
