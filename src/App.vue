<script setup>
import { ref, computed, onMounted } from 'vue'
import { useData } from './composables/useData.js'
import { useInventory } from './composables/useInventory.js'
import { useDigivices } from './composables/useDigivices.js'

import AppHeader from './components/AppHeader.vue'
import AppNav from './components/AppNav.vue'
import LegendBar from './components/LegendBar.vue'
import InventoryPanel from './components/InventoryPanel.vue'
import FilterBar from './components/FilterBar.vue'
import SearchBox from './components/SearchBox.vue'
import ProgressBar from './components/ProgressBar.vue'
import OwnedDigimons from './components/OwnedDigimons.vue'
import CoveragePanel from './components/CoveragePanel.vue'
import DigimonCard from './components/DigimonCard.vue'
import SealMasterPanel from './components/SealMasterPanel.vue'
import HelpPanel from './components/HelpPanel.vue'
import BackupControls from './components/BackupControls.vue'
import PortfolioFooter from './components/PortfolioFooter.vue'
import DataLoader from './components/DataLoader.vue'
import ConfirmModal from './components/ConfirmModal.vue'

const {
  status, load, loadFromFile,
  config, attributes, elements, families, digimons, rankOrder,
  availableFamilies, availableAttributes, availableElements
} = useData()

const { inv, ownsDigimon } = useInventory()

const view = ref('digimons') // 'digimons' | 'progresso' | 'inventario'
const filter = ref('all')
const query = ref('')

function passFilter(name) {
  // filtro por texto (nome)
  const q = query.value.trim().toLowerCase()
  if (q && !name.toLowerCase().includes(q)) return false
  // filtro tenho / faltam
  if (filter.value === 'all') return true
  const has = ownsDigimon(name)
  return filter.value === 'have' ? has : !has
}

// progresso global (independente dos filtros): quantos digimons distintos foram coletados
const totalDigimons = computed(() => Object.keys(digimons.value).length)
const ownedDigimons = computed(() =>
  inv.digimons.filter(n => n in digimons.value).length
)

/**
 * Agrupa os digimons apenas por rank (sem separar por família),
 * respeitando o filtro atual. Cada digimon aparece uma única vez.
 */
const sections = computed(() => {
  const digis = digimons.value
  const order = rankOrder.value

  const byRank = {}
  for (const [name, info] of Object.entries(digis)) {
    if (!passFilter(name)) continue
    const rank = info.rank || 'Sem rank'
    ;(byRank[rank] = byRank[rank] || []).push(name)
  }

  const ranks = [
    ...order.filter(r => byRank[r]),
    ...Object.keys(byRank).filter(r => !order.includes(r))
  ]

  return ranks.map(rank => ({ rank, names: byRank[rank] }))
})

async function handleFile(file) {
  try {
    await loadFromFile(file)
  } catch (e) {
    alert('JSON inválido: ' + e.message)
  }
}

const { load: loadDigivices } = useDigivices()
onMounted(() => { load(); loadDigivices() })
</script>

<template>
  <div class="wrap">
    <AppHeader :config="config" />

    <template v-if="status === 'ready'">
      <AppNav v-model="view" />

      <!-- ABA: DIGIMONS -->
      <div v-show="view === 'digimons'" class="tabview">
        <LegendBar :attributes="attributes" />
        <div class="toolbar">
          <FilterBar v-model="filter" />
          <SearchBox v-model="query" />
        </div>
        <main>
          <section v-for="s in sections" :key="s.rank">
            <div class="rank-head">
              RANK <b>{{ s.rank }}</b>
              <span class="rank-count">{{ s.names.length }}</span>
            </div>
            <div class="grid">
              <DigimonCard
                v-for="name in s.names"
                :key="name"
                :name="name"
                :info="digimons[name]"
                :attributes="attributes"
                :elements="elements"
              />
            </div>
          </section>
          <p v-if="!sections.length" class="nothing">
            {{ query.trim() ? `Nenhum digimon encontrado para "${query.trim()}".` : 'Nada para mostrar com esse filtro.' }}
          </p>
        </main>
      </div>

      <!-- ABA: PROGRESSO -->
      <div v-show="view === 'progresso'" class="tabview">
        <div class="prog-wrap">
          <ProgressBar :owned="ownedDigimons" :total="totalDigimons" label="Coleção" unit="coletados" />
        </div>
        <OwnedDigimons :digimons="digimons" :attributes="attributes" />
        <CoveragePanel
          :digimons="digimons"
          :families="families"
        />
      </div>

      <!-- ABA: INVENTÁRIO -->
      <div v-show="view === 'inventario'" class="tabview">
        <InventoryPanel
          :families="families"
          :attributes="attributes"
          :elements="elements"
          :available-families="availableFamilies"
          :available-attributes="availableAttributes"
          :available-elements="availableElements"
        />
        <BackupControls />
      </div>

      <!-- ABA: SELOS -->
      <div v-show="view === 'selos'" class="tabview">
        <SealMasterPanel />
      </div>

      <!-- ABA: AJUDA / FAQ -->
      <div v-show="view === 'ajuda'" class="tabview">
        <HelpPanel />
      </div>

      <PortfolioFooter />
    </template>

    <DataLoader v-else-if="status === 'error'" @file="handleFile" />

    <p v-else class="loading">Carregando dados…</p>

    <ConfirmModal />
  </div>
</template>

<style scoped>
.prog-wrap { margin-top: 24px; }
.toolbar {
  display: flex; flex-wrap: wrap; align-items: center; gap: 12px;
  margin-top: 8px;
}
.toolbar :deep(.filters) { margin-top: 16px; }
main section { margin-top: 32px; }
.rank-head {
  display: flex; align-items: center; gap: 12px;
  font-family: 'Rajdhani', sans-serif; font-weight: 700;
  font-size: clamp(20px, 4vw, 26px); letter-spacing: 3px;
  color: var(--muted); border-bottom: 2px solid var(--line);
  padding-bottom: 10px; margin-bottom: 16px;
}
.rank-head b { color: var(--accent); }
.rank-count {
  margin-left: auto; font-family: 'Chakra Petch', sans-serif;
  font-size: 12px; font-weight: 600; letter-spacing: 2px;
  color: var(--muted); text-transform: uppercase;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}
.nothing { color: var(--muted); margin-top: 32px; }
.loading { color: var(--muted); margin-top: 32px; }
</style>
