<script setup>
import { ref, computed, onMounted } from 'vue'
import Icon from './Icon.vue'
import ImageSelect from './ImageSelect.vue'
import { useDunit } from '../composables/useDunit.js'
import { useInventory } from '../composables/useInventory.js'

const { status, load, packs, lineById, eggOptions, stats } = useDunit()
const { getLine } = useInventory()

onMounted(load)

const query = ref('')
const eggFilter = ref('all')
const statFilter = ref('all')
const ownedFilter = ref('all') // 'all' | 'owned' | 'missing'

// ---- helpers por linha ----
function lineLevel(lineId) {
  const g = getLine(lineId)
  if (g.stage === 'l110') return 110
  if (g.stage === 'max') return lineById.value[lineId]?.maxLevel || 140
  return 0
}
// status da linha (somente leitura; edição fica na aba Archive)
function lineStatusText(lineId) {
  const g = getLine(lineId)
  const max = lineById.value[lineId]?.maxLevel || 140
  const lvl = g.stage === 'no' ? '—'
    : g.stage === 'ob' ? 'Obtido'
    : g.stage === 'l110' ? 'Nv 110'
    : 'Nv ' + max
  return g.transc ? `${lvl} · Transc.` : lvl
}

// ---- cálculo por pack ----
function computePack(p) {
  let ob = 0, lvl = 0, tr = 0
  for (const m of (p.members || [])) {
    const g = getLine(m.line)
    if (g.stage !== 'no') { ob += m.count; lvl += m.count * lineLevel(m.line) }
    if (g.transc) tr += m.count
  }
  return { ob, lvl, tr }
}
function bracketMet(b, c) {
  if (b.type === 'obtidos') return c.ob >= b.need
  if (b.type === 'nivel') return c.lvl >= b.need
  if (b.type === 'transcendidos') return c.tr >= b.need
  return false
}
function bracketCondText(b) {
  if (b.type === 'obtidos') return `Obtidos ${b.need}`
  if (b.type === 'transcendidos') return `${b.need} Transcendidos`
  return `Nível total ${b.need}`
}
function fmtVal(b) {
  const v = String(b.value).replace('.', ',')
  return `${b.stat} +${v}${b.unit || ''}`
}
function packMet(p) { const c = computePack(p); return (p.brackets || []).filter(b => bracketMet(b, c)).length }

// membros agrupados por linha distinta (para os controles)
function packLines(p) {
  const seen = new Set(); const out = []
  for (const m of (p.members || [])) {
    if (seen.has(m.line)) continue
    seen.add(m.line)
    out.push({ id: m.line, name: lineById.value[m.line]?.name || m.line })
  }
  return out
}

const completedCount = computed(() => packs.value.filter(p => packMet(p) >= (p.brackets?.length || 4)).length)

// Efeito Total de Coleta
const totals = computed(() => {
  const acc = {}
  for (const p of packs.value) {
    const c = computePack(p)
    for (const b of (p.brackets || [])) {
      if (!bracketMet(b, c)) continue
      const key = b.stat + (b.unit || '')
      if (!acc[key]) acc[key] = { stat: b.stat, unit: b.unit || '', value: 0 }
      acc[key].value += Number(b.value) || 0
    }
  }
  return Object.values(acc)
    .map(t => ({ ...t, value: Math.round(t.value * 100) / 100 }))
    .sort((a, b) => a.stat.localeCompare(b.stat))
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return packs.value.filter(p => {
    if (eggFilter.value !== 'all' && !(p.members || []).some(m => m.line === eggFilter.value)) return false
    if (statFilter.value !== 'all' && !(p.brackets || []).some(b => b.stat === statFilter.value)) return false
    const done = packMet(p) >= (p.brackets?.length || 4)
    if (ownedFilter.value === 'owned' && !done) return false
    if (ownedFilter.value === 'missing' && done) return false
    if (q) {
      const names = (p.members || []).map(m => (m.name || '') + ' ' + (lineById.value[m.line]?.name || ''))
      const hay = [p.name, ...names].join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
})

const eggFilterOptions = computed(() => [{ value: 'all', label: 'Todos os digi-ovos' }, ...eggOptions.value])
const statFilterOptions = computed(() => [{ value: 'all', label: 'Todos os status' }, ...stats.value.map(s => ({ value: s, label: s }))])

function fmtNum(v) { return (Number.isInteger(v) ? v : Math.round(v * 100) / 100).toLocaleString('pt-BR') }
</script>

<template>
  <div class="dunit">
    <header class="hd">
      <h1>D-Unit <span>coleção</span></h1>
      <p class="sub">
        Os brackets são calculados a partir do que você cadastrou na aba <b>Digimon Archive</b> (nível e
        transcendência de cada linha). Aqui você acompanha os packs, o progresso e o Efeito Total de Coleta.
      </p>
    </header>

    <p v-if="status === 'loading'" class="msg">Carregando packs…</p>
    <p v-else-if="status === 'error'" class="msg">Não consegui carregar os packs (dunit.json).</p>

    <template v-else>
      <div class="totals">
        <div class="t-head">
          <span class="t-title">Efeito Total de Coleta</span>
          <span class="t-count">{{ completedCount }}/{{ packs.length }} grupos completos</span>
        </div>
        <div v-if="totals.length" class="t-chips">
          <span class="t-chip" v-for="t in totals" :key="t.stat + t.unit">{{ t.stat }} <b>+{{ fmtNum(t.value) }}{{ t.unit }}</b></span>
        </div>
        <p v-else class="t-empty">Nenhum bracket alcançado ainda.</p>
      </div>

      <div class="filters">
        <div class="search">
          <span class="ico"><Icon name="search" :size="15" /></span>
          <input v-model="query" type="search" placeholder="Buscar pack, digi-ovo ou digimon…">
        </div>
        <ImageSelect v-model="eggFilter" :options="eggFilterOptions" width="210px" />
        <ImageSelect v-model="statFilter" :options="statFilterOptions" width="180px" />
        <div class="own">
          <button class="obtn" :class="{ on: ownedFilter === 'all' }" @click="ownedFilter = 'all'">Geral</button>
          <button class="obtn" :class="{ on: ownedFilter === 'owned' }" @click="ownedFilter = 'owned'">Obtidos</button>
          <button class="obtn" :class="{ on: ownedFilter === 'missing' }" @click="ownedFilter = 'missing'">Não obtidos</button>
        </div>
      </div>

      <div class="packs">
        <div class="pack" v-for="p in filtered" :key="p.id" :class="{ done: packMet(p) >= (p.brackets?.length || 4) }">
          <div class="p-head">
            <div class="p-title">
              <b>{{ p.name }}</b>
              <span v-if="p.hard" class="p-hard">Hard</span>
            </div>
            <span class="p-prog">{{ packMet(p) }}/{{ p.brackets?.length || 4 }}</span>
          </div>

          <!-- linhas do pack (status; edite na aba Archive) -->
          <div class="lines">
            <div class="line" v-for="l in packLines(p)" :key="l.id" :class="{ off: getLine(l.id).stage === 'no' }">
              <span class="l-name">{{ l.name }}</span>
              <span class="l-status">{{ lineStatusText(l.id) }}</span>
            </div>
          </div>

          <!-- brackets (calculados) -->
          <div class="brackets">
            <div class="bracket" v-for="(b, i) in p.brackets" :key="i" :class="{ on: bracketMet(b, computePack(p)) }">
              <span class="b-cond">{{ bracketCondText(b) }}</span>
              <span class="b-bonus">{{ fmtVal(b) }}</span>
            </div>
          </div>
        </div>
        <p v-if="!filtered.length" class="msg">Nenhum pack encontrado com esse filtro.</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dunit { margin-top: 8px; }
.hd { margin-top: 20px; }
.hd h1 { font-size: clamp(22px, 4vw, 32px); font-weight: 700; }
.hd h1 span { color: var(--accent); }
.hd .sub { color: var(--muted); font-size: 14px; line-height: 1.6; margin-top: 8px; max-width: 700px; }
.msg { color: var(--muted); margin-top: 20px; }

.totals { margin-top: 20px; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 16px 18px; }
.t-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px; }
.t-title { font-family: 'Rajdhani', sans-serif; font-size: 16px; letter-spacing: 2px; text-transform: uppercase; }
.t-count { margin-left: auto; color: var(--ok); font-size: 13px; font-weight: 600; }
.t-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.t-chip { font-size: 12px; color: var(--text); background: #0d122a; border: 1px solid var(--line); border-radius: 6px; padding: 4px 10px; }
.t-chip b { color: var(--accent); }
.t-empty { color: var(--muted); font-size: 13px; }

.filters { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 20px; }
.search { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 220px; background: #0d122a; border: 1px solid var(--line); border-radius: 999px; padding: 7px 14px; }
.search .ico { color: var(--muted); display: flex; }
.search input { flex: 1; background: none; border: none; outline: none; color: var(--text); font-family: inherit; font-size: 14px; }
.search input::-webkit-search-cancel-button { display: none; }
.own { display: flex; gap: 6px; }
.obtn { border: 1px solid var(--line); background: var(--panel); color: var(--muted); border-radius: 999px; padding: 6px 13px; font-family: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.obtn.on { border-color: var(--ok); color: var(--ok); background: rgba(62, 209, 124, .08); }

.packs { margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
.pack { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 14px; }
.pack.done { border-color: rgba(62, 209, 124, .5); box-shadow: inset 0 0 0 1px rgba(62, 209, 124, .25); }
.p-head { display: flex; align-items: center; gap: 10px; }
.p-title { flex: 1; min-width: 0; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.p-title b { color: var(--text); font-size: 14px; }
.p-hard { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #ff6a6a; background: rgba(255,106,106,.12); border: 1px solid rgba(255,106,106,.4); border-radius: 4px; padding: 1px 6px; }
.p-prog { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px; color: var(--ok); }

.lines { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; }
.line { display: flex; align-items: center; gap: 8px; }
.line.off { opacity: .5; }
.l-name { flex: 1; min-width: 0; font-size: 12.5px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.l-status { font-size: 11.5px; font-weight: 600; color: var(--muted); white-space: nowrap; }
.line:not(.off) .l-status { color: var(--ok); }

.brackets { display: flex; flex-direction: column; gap: 5px; margin-top: 12px; }
.bracket { display: flex; align-items: center; gap: 10px; background: #0d122a; border: 1px solid var(--line); border-radius: 8px; padding: 6px 11px; }
.bracket.on { border-color: var(--ok); background: rgba(62, 209, 124, .08); }
.b-cond { flex: 1; font-size: 11.5px; color: var(--muted); }
.bracket.on .b-cond { color: var(--text); }
.b-bonus { font-size: 12px; font-weight: 700; color: var(--muted); white-space: nowrap; }
.bracket.on .b-bonus { color: var(--ok); }
</style>
