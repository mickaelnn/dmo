<script setup>
import { ref, computed } from 'vue'
import { useInventory } from '../composables/useInventory.js'
import { useConfirm } from '../composables/useConfirm.js'

const { inv, addSeal, removeSeal } = useInventory()
const { confirm } = useConfirm()

const name = ref('')
const statsText = ref('')

// "HP+500, AT 100, DE:50" -> [{label:'HP', value:500}, ...]
function parseStats(text) {
  const out = []
  for (const part of (text || '').split(/[,;\n]+/)) {
    const m = part.trim().match(/^([\p{L}][\p{L}\s.%]*?)\s*[:+]?\s*([+-]?\d+)$/u)
    if (m) out.push({ label: m[1].trim().toUpperCase(), value: parseInt(m[2], 10) })
  }
  return out
}

function onAdd() {
  const n = name.value.trim()
  if (!n) return
  addSeal(n, parseStats(statsText.value))
  name.value = ''
  statsText.value = ''
}

async function onRemove(seal) {
  const ok = await confirm(`Remover o selo "${seal.name}"?`)
  if (ok) removeSeal(seal.id)
}

// soma dos status de todos os selos, por label
const totals = computed(() => {
  const acc = {}
  for (const s of inv.seals) {
    for (const st of (s.stats || [])) {
      acc[st.label] = (acc[st.label] || 0) + st.value
    }
  }
  return Object.entries(acc)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => a.label.localeCompare(b.label))
})

function fmt(v) { return (v > 0 ? '+' : '') + v.toLocaleString('pt-BR') }
</script>

<template>
  <div class="seals">
    <div class="s-head">
      <h2>Selos</h2>
      <span class="s-count">{{ inv.seals.length }}</span>
    </div>
    <p class="desc">
      Cartas que dão status gerais ao tamer. Cadastre cada selo que você abriu com os status
      que ele concede (ex.: <code>HP+500, AT+100</code>) — o total acumulado aparece abaixo.
    </p>

    <div class="add">
      <input v-model="name" class="in-name" placeholder="Nome do selo" @keyup.enter="onAdd">
      <input v-model="statsText" class="in-stats" placeholder="Status: HP+500, AT+100, DE+50" @keyup.enter="onAdd">
      <button class="btn" @click="onAdd">+ Adicionar</button>
    </div>

    <div v-if="totals.length" class="totals">
      <span class="t-label">Total dos selos</span>
      <span class="t-chip" v-for="t in totals" :key="t.label">{{ t.label }} <b>{{ fmt(t.value) }}</b></span>
    </div>

    <div class="list">
      <p v-if="!inv.seals.length" class="empty">Nenhum selo cadastrado ainda.</p>
      <div v-else class="item" v-for="s in inv.seals" :key="s.id">
        <div class="i-main">
          <b class="i-name">{{ s.name }}</b>
          <div class="i-stats">
            <span v-for="(st, idx) in s.stats" :key="idx" class="st">{{ st.label }} {{ fmt(st.value) }}</span>
            <span v-if="!s.stats.length" class="st none">sem status</span>
          </div>
        </div>
        <button class="x" title="remover" @click="onRemove(s)">×</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.seals {
  margin-top: 20px; background: var(--panel);
  border: 1px solid var(--line); border-radius: 12px; padding: 18px;
}
.s-head { display: flex; align-items: center; gap: 10px; }
.s-head h2 {
  font-family: 'Rajdhani', sans-serif; font-size: 18px;
  letter-spacing: 3px; text-transform: uppercase;
}
.s-count {
  font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 14px;
  color: var(--accent); background: rgba(247, 163, 37, .1);
  border: 1px solid rgba(247, 163, 37, .4); border-radius: 999px; padding: 2px 12px;
}
.desc { color: var(--muted); font-size: 13px; line-height: 1.6; margin: 10px 0 14px; max-width: 620px; }
.desc code { background: #0b0e1a; border: 1px solid var(--line); border-radius: 5px; padding: 1px 6px; color: var(--accent); }

.add { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.add input {
  background: #0d122a; color: var(--text); border: 1px solid var(--line);
  border-radius: 8px; padding: 9px 12px; font-family: inherit; font-size: 13px;
}
.in-name { width: 180px; }
.in-stats { flex: 1; min-width: 220px; }
.btn {
  background: var(--accent); color: #0b0e1a; font-weight: 700; border: none;
  border-radius: 8px; padding: 10px 16px; font-family: inherit; font-size: 13px;
  cursor: pointer; letter-spacing: .3px;
}
.btn:hover { filter: brightness(1.08); }

.totals {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
  margin-top: 16px; padding: 12px 14px; background: #0d122a;
  border: 1px solid rgba(247, 163, 37, .3); border-radius: 10px;
}
.t-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-right: 4px; }
.t-chip {
  font-size: 12px; color: var(--text); background: var(--card);
  border: 1px solid var(--line); border-radius: 6px; padding: 4px 9px;
}
.t-chip b { color: var(--accent); }

.list { margin-top: 14px; display: flex; flex-direction: column; gap: 8px; }
.empty { color: var(--muted); font-size: 13px; }
.item {
  display: flex; align-items: center; gap: 10px;
  background: #0d122a; border: 1px solid var(--line); border-radius: 8px; padding: 10px 12px;
}
.i-main { flex: 1; min-width: 0; }
.i-name { color: var(--text); font-size: 13px; }
.i-stats { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 5px; }
.st { font-size: 11px; color: var(--ok); background: rgba(62, 209, 124, .1); border-radius: 5px; padding: 2px 7px; }
.st.none { color: var(--muted); background: transparent; }
.x {
  background: none; border: none; color: var(--muted); cursor: pointer;
  font-size: 18px; line-height: 1; padding: 2px 8px; border-radius: 5px;
}
.x:hover { color: #ff6a6a; background: rgba(255, 106, 106, .1); }
</style>
