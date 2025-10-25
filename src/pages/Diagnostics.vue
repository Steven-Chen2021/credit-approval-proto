<template>
  <h2>Diagnostics</h2>
  <el-card>
    <div>MSW integrations</div>
    <div class="flex gap-2">
      <el-switch v-model="esam" active-text="eSAM hit" @change="save" />
      <el-switch v-model="dnb" active-text="D&B hit" @change="save" />
    </div>
    <el-button style="margin-top:10px" @click="reset">Reset Data</el-button>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const esam = ref(true); const dnb = ref(true)
async function load(){ const r = await fetch('/api/integrations'); const j = await r.json(); esam.value = j.esamHit; dnb.value = j.dnbHit }
async function save(){ await fetch('/api/integrations', { method:'POST', body: JSON.stringify({ esamHit: esam.value, dnbHit: dnb.value }) }) }
async function reset(){ await fetch('/api/seeds/reset', { method:'POST' }); alert('reset ok') }
onMounted(load)
</script>
