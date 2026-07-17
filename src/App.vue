<script setup>
import { ref, computed, onMounted } from 'vue'
import { useData } from './composables/useData.js'
import { useInventory } from './composables/useInventory.js'

import AppHeader from './components/AppHeader.vue'
import AppNav from './components/AppNav.vue'
import LegendBar from './components/LegendBar.vue'
import InventoryPanel from './components/InventoryPanel.vue'
import FilterBar from './components/FilterBar.vue'
import SearchBox from './components/SearchBox.vue'
import ProgressBar from './components/ProgressBar.vue'
import OwnedDigimons from './components/OwnedDigimons.vue'
import CoveragePanel from './components/CoveragePanel.vue'
import FamilySection from './components/FamilySection.vue'
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
 * Monta as seções por família, cada uma com seus grupos de rank,
 * já respeitando o filtro atual. Reproduz a lógica do site original.
 */
const sections = computed(() => {
  const digis = digimons.value
  const famMeta = families.value
  const order = rankOrder.value

  // agrupa: família -> rank -> [nomes]
  const groups = {}
  for (const [name, info] of Object.entries(digis)) {
    for (const fam of (info.families || [])) {
      const rank = info.rank || 'Sem rank'
      groups[fam] = groups[fam] || {}
      groups[fam][rank] = groups[fam][rank] || []
      groups[fam][rank].push(name)
    }
  }

  // ordem das famílias: primeiro as conhecidas (na ordem do meta), depois extras
  const famOrder = [
    ...Object.keys(famMeta).filter(f => groups[f]),
    ...Object.keys(groups).filter(f => !(f in famMeta))
  ]

  const result = []
  for (const fam of famOrder) {
    const present = Object.keys(groups[fam])
    const ranks = [
      ...order.filter(r => present.includes(r)),
      ...present.filter(r => !order.includes(r))
    ]
    const rankGroups = []
    let count = 0
    for (const rank of ranks) {
      const names = groups[fam][rank].filter(passFilter)
      if (!names.length) continue
      count += names.length
      rankGroups.push({ rank, names })
    }
    if (rankGroups.length) {
      result.push({ fam, meta: famMeta[fam] || {}, rankGroups, count })
    }
  }
  return result
})

async function handleFile(file) {
  try {
    await loadFromFile(file)
  } catch (e) {
    alert('JSON inválido: ' + e.message)
  }
}

onMounted(load)
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
          <FamilySection
            v-for="s in sections"
            :key="s.fam"
            :fam="s.fam"
            :meta="s.meta"
            :rank-groups="s.rankGroups"
            :count="s.count"
            :digimons="digimons"
            :attributes="attributes"
            :elements="elements"
          />
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
          :attributes="attributes"
          :elements="elements"
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
.nothing { color: var(--muted); margin-top: 32px; }
.loading { color: var(--muted); margin-top: 32px; }
</style>
