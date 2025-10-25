<template>
  <el-tag :type="type" size="small">{{ label }}</el-tag>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const props = defineProps<{ status: string }>()
const { t } = useI18n()
const type = computed(()=>{
  switch(props.status){
    case 'Approved': return 'success'
    case 'Rejected': return 'danger'
    case 'Referral-Received': return 'warning'
    default: return 'info'
  }
})
const label = computed(()=> t(`status.${props.status}` as any))
</script>
