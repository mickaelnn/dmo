<script setup>
import { ref, computed, onMounted } from 'vue'
import Icon from './Icon.vue'
import ModalDialog from './ModalDialog.vue'
import { useDunit } from '../composables/useDunit.js'
import { useInventory } from '../composables/useInventory.js'

const { status, load, lines, lineById } = useDunit()
const { getLine, setLineStage, setLineTransc } = useInventory()

onMounted(load)

const query = ref('')
const filter = ref('all') // 'all' | 'owned' | 'missing'
const selected = ref(null) // linha aberta no modal

function firstForm(l) { return l.rookie || (l.forms && l.forms[0]) || l.name }
function lastForm(l) { return l.forms && l.forms.length ? l.forms[l.forms.length - 1] : '' }

function stageOptions(lineId) {
  const max = lineById.value[lineId]?.maxLevel || 140
  return [
    { value: 'no', label: 'Não obtido' },
    { value: 'ob', label: 'Obtido' },
    { value: 'l110', label: 'Nível 110' },
    { value: 'max', label: 'Nível ' + max }
  ]
}
function statusLabel(lineId) {
  const g = getLine(lineId)
  const max = lineById.value[lineId]?.maxLevel || 140
  if (g.stage === 'no') return '—'
  const lvl = g.stage === 'ob' ? 'Obtido' : g.stage === 'l110' ? 'Nv 110' : 'Nv ' + max
  return g.transc ? lvl + ' · T' : lvl
}

const list = computed(() => {
  const q = query.value.trim().toLowerCase()
  return lines.value
    .filter(l => {
      if (q) {
        const hay = [l.name, ...(l.forms || [])].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      const owned = getLine(l.id).stage !== 'no'
      if (filter.value === 'owned' && !owned) return false
      if (filter.value === 'missing' && owned) return false
      return true
    })
    .sort((a, b) => firstForm(a).localeCompare(firstForm(b)) || a.name.localeCompare(b.name))
})

const ownedCount = computed(() => lines.value.filter(l => getLine(l.id).stage !== 'no').length)
const transcCount = computed(() => lines.value.filter(l => getLine(l.id).transc).length)
</script>

<template>
  <div class="arch">
    <header class="hd">
      <h1>Digimon <span>Archive</span></h1>
      <p class="sub">
        Cada card é uma linha evolutiva (mostrando o rookie). Clique para ver as evoluções e definir
        o nível e a transcendência — isso alimenta os cálculos da aba D-Unit.
      </p>
    </header>

    <p v-if="status === 'loading'" class="msg">Carregando linhas…</p>
    <p v-else-if="status === 'error'" class="msg">Não consegui carregar as linhas (dunit.json).</p>

    <template v-else>
      <div class="bar">
        <div class="search">
          <span class="ico"><Icon name="search" :size="15" /></span>
          <input v-model="query" type="search" placeholder="Buscar por rookie ou evolução…">
        </div>
        <div class="fs">
          <button class="fb" :class="{ on: filter === 'all' }" @click="filter = 'all'">Todas</button>
          <button class="fb" :class="{ on: filter === 'owned' }" @click="filter = 'owned'">Que tenho</button>
          <button class="fb" :class="{ on: filter === 'missing' }" @click="filter = 'missing'">Que faltam</button>
        </div>
        <span class="counts">{{ ownedCount }}/{{ lines.length }} obtidas · {{ transcCount }} transc.</span>
      </div>

      <div class="grid">
        <button class="card" v-for="l in list" :key="l.id"
                :class="{ owned: getLine(l.id).stage !== 'no' }" @click="selected = l">
          <div class="c-top">
            <span class="c-fb">{{ (firstForm(l).match(/[A-Za-z0-9]/) || ['?'])[0] }}</span>
          </div>
          <div class="c-name">{{ firstForm(l) }}</div>
          <div v-if="lastForm(l) && lastForm(l) !== firstForm(l)" class="c-final">→ {{ lastForm(l) }}</div>
          <div class="c-status" :class="{ off: getLine(l.id).stage === 'no' }">{{ statusLabel(l.id) }}</div>
        </button>
        <p v-if="!list.length" class="msg">Nenhuma linha encontrada.</p>
      </div>
    </template>

    <!-- MODAL: evoluções + nível + transcendência -->
    <ModalDialog v-if="selected" @close="selected = null">
      <template #title>
        <div class="m-title">
          <b>{{ firstForm(selected) }}</b>
          <span class="m-rank">{{ selected.rank || '—' }} · máx {{ lineById[selected.id]?.maxLevel || 140 }}</span>
        </div>
      </template>

      <div class="m-forms">
        <span class="m-flabel">Evoluções</span>
        <div class="m-chain">
          <template v-for="(f, i) in (selected.forms || [])" :key="i">
            <span class="m-form">{{ f }}</span>
            <span v-if="i < selected.forms.length - 1" class="m-arr">›</span>
          </template>
        </div>
      </div>

      <div class="m-controls">
        <label class="m-ctl">
          <span>Nível</span>
          <select :value="getLine(selected.id).stage" @change="setLineStage(selected.id, $event.target.value)">
            <option v-for="o in stageOptions(selected.id)" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </label>
        <label class="m-tr" :class="{ dis: getLine(selected.id).stage === 'no' }">
          <input type="checkbox" :checked="getLine(selected.id).transc" :disabled="getLine(selected.id).stage === 'no'"
                 @change="setLineTransc(selected.id, $event.target.checked)">
          Transcendido
        </label>
      </div>
    </ModalDialog>
  </div>
</template>

<style scoped>
.arch { margin-top: 8px; }
.hd { margin-top: 20px; }
.hd h1 { font-size: clamp(22px, 4vw, 32px); font-weight: 700; }
.hd h1 span { color: var(--accent); }
.hd .sub { color: var(--muted); font-size: 14px; line-height: 1.6; margin-top: 8px; max-width: 700px; }
.msg { color: var(--muted); margin-top: 20px; }

.bar { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 20px; }
.search { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 220px; background: #0d122a; border: 1px solid var(--line); border-radius: 999px; padding: 7px 14px; }
.search .ico { color: var(--muted); display: flex; }
.search input { flex: 1; background: none; border: none; outline: none; color: var(--text); font-family: inherit; font-size: 14px; }
.search input::-webkit-search-cancel-button { display: none; }
.fs { display: flex; gap: 6px; }
.fb { border: 1px solid var(--line); background: var(--panel); color: var(--muted); border-radius: 999px; padding: 6px 13px; font-family: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.fb.on { border-color: var(--ok); color: var(--ok); background: rgba(62, 209, 124, .08); }
.counts { color: var(--muted); font-size: 12px; margin-left: auto; }

.grid { margin-top: 18px; display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
.card {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  background: var(--card); border: 1px solid var(--line); border-top: 3px solid var(--line);
  border-radius: 10px; padding: 12px 8px 10px; cursor: pointer; font-family: inherit; text-align: center;
  transition: border-color .15s;
}
.card:hover { border-color: var(--accent); }
.card.owned { border-top-color: var(--ok); box-shadow: inset 0 0 0 1px rgba(62, 209, 124, .2); }
.c-top { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; }
.c-fb {
  width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 20px; color: var(--muted); border: 2px dashed var(--line);
}
.c-name { font-size: 13px; font-weight: 600; color: var(--text); line-height: 1.2; }
.c-final { font-size: 10px; color: var(--muted); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
.c-status { margin-top: 4px; font-size: 11px; font-weight: 700; color: var(--ok); }
.c-status.off { color: var(--muted); }

/* modal */
.m-title { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.m-title b { color: var(--text); font-size: 16px; }
.m-rank { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
.m-forms { margin-bottom: 4px; }
.m-flabel { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }
.m-chain { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 8px; }
.m-form { font-size: 12.5px; color: var(--text); background: #0d122a; border: 1px solid var(--line); border-radius: 6px; padding: 4px 9px; }
.m-arr { color: var(--muted); }
.m-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--line); }
.m-ctl { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); }
.m-ctl select { background: #0d122a; color: var(--text); border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; font-family: inherit; font-size: 13px; }
.m-tr { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text); cursor: pointer; }
.m-tr.dis { opacity: .4; cursor: default; }
</style>
