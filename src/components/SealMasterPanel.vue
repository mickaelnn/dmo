<script setup>
import { ref, computed, onMounted } from 'vue'
import AssetImage from './AssetImage.vue'
import Icon from './Icon.vue'
import { useSeals } from '../composables/useSeals.js'
import { useInventory } from '../composables/useInventory.js'

const { status, load, tiers, byStat } = useSeals()
const { inv, getSealTier, setSealTier } = useInventory()

onMounted(load)

const query = ref('')
const filterStat = ref('all')
const onlyOwned = ref(false)

function currentValue(seal) {
  const tier = getSealTier(seal.id)
  return tier > 0 ? seal.levels[tier - 1] : 0
}
function maxValue(seal) { return seal.levels[seal.levels.length - 1] }

function fmt(value, unit) {
  const n = Number.isInteger(value) ? value : Math.round(value * 100) / 100
  return `${n.toLocaleString('pt-BR')}${unit || ''}`
}

// grupos filtrados por busca / status / só possuídos
const groups = computed(() => {
  const q = query.value.trim().toLowerCase()
  return byStat.value
    .filter(g => filterStat.value === 'all' || g.stat === filterStat.value)
    .map(g => {
      const seals = g.seals.filter(s => {
        if (q && !s.name.toLowerCase().includes(q)) return false
        if (onlyOwned.value && getSealTier(s.id) === 0) return false
        return true
      })
      return { ...g, seals }
    })
    .filter(g => g.seals.length)
})

// totais por status (todos os selos, independente do filtro visual)
const totals = computed(() =>
  byStat.value.map(g => {
    let current = 0, max = 0
    for (const s of g.seals) {
      current += currentValue(s)
      max += maxValue(s)
    }
    const owned = g.seals.filter(s => getSealTier(s.id) > 0).length
    return { stat: g.stat, meta: g.meta, current, max, owned, count: g.seals.length }
  })
)

const statList = computed(() => byStat.value.map(g => ({ stat: g.stat, meta: g.meta })))

function onTier(seal, e) { setSealTier(seal.id, Number(e.target.value)) }
</script>

<template>
  <div class="wrap-seal">
    <header class="hd">
      <h1>Selos <span>Seal Master</span></h1>
      <p class="sub">
        Cada selo dá status ao tamer conforme o nível (Fechado → Mestre). Escolha o nível que você
        já tem em cada selo; o total ganho por status aparece na tabela abaixo.
      </p>
    </header>

    <p v-if="status === 'loading'" class="msg">Carregando selos…</p>
    <p v-else-if="status === 'error'" class="msg">Não consegui carregar os selos (seals.json).</p>

    <template v-else>
      <!-- TABELA DE TOTAIS -->
      <div class="totals">
        <div class="t-card" v-for="t in totals" :key="t.stat" :style="{ '--c': t.meta.color }">
          <div class="t-top">
            <span class="t-stat">{{ t.stat }}</span>
            <span class="t-name">{{ t.meta.name }}</span>
            <span class="t-owned">{{ t.owned }}/{{ t.count }}</span>
          </div>
          <div class="t-val"><b>{{ fmt(t.current, t.meta.unit) }}</b> <span class="t-max">/ {{ fmt(t.max, t.meta.unit) }}</span></div>
          <div class="t-bar"><div class="t-fill" :style="{ width: (t.max ? (t.current / t.max * 100) : 0) + '%' }"></div></div>
        </div>
      </div>

      <!-- FILTROS -->
      <div class="filters">
        <div class="chips">
          <button class="chip" :class="{ on: filterStat === 'all' }" @click="filterStat = 'all'">Todos</button>
          <button class="chip" v-for="s in statList" :key="s.stat"
                  :class="{ on: filterStat === s.stat }" :style="{ '--c': s.meta.color }"
                  @click="filterStat = s.stat">{{ s.stat }}</button>
        </div>
        <div class="search">
          <span class="ico"><Icon name="search" :size="15" /></span>
          <input v-model="query" type="search" placeholder="Buscar selo…">
        </div>
        <button class="own" :class="{ on: onlyOwned }" @click="onlyOwned = !onlyOwned">Só os que tenho</button>
      </div>

      <!-- GRADE POR STATUS -->
      <section v-for="g in groups" :key="g.stat" class="group">
        <div class="g-head" :style="{ '--c': g.meta.color }">
          <span class="g-stat">{{ g.stat }}</span>
          <span class="g-name">{{ g.meta.name }}</span>
          <span class="g-count">{{ g.seals.length }}</span>
        </div>
        <div class="grid">
          <div class="card" v-for="s in g.seals" :key="s.id"
               :class="{ owned: getSealTier(s.id) > 0 }" :style="{ '--c': g.meta.color }">
            <div class="imgbox">
              <AssetImage :src="s.image" :alt="s.name">
                <template #fallback><span class="fb">{{ (s.name.match(/[A-Za-z0-9]/) || ['?'])[0] }}</span></template>
              </AssetImage>
            </div>
            <div class="nm" :title="s.name">{{ s.name }}</div>
            <div class="val">{{ getSealTier(s.id) > 0 ? '+' + fmt(currentValue(s), g.meta.unit) : '—' }}</div>
            <select class="tier" :value="getSealTier(s.id)" @change="onTier(s, $event)">
              <option v-for="(t, i) in tiers" :key="i" :value="i">{{ t }}</option>
            </select>
          </div>
        </div>
      </section>

      <p v-if="!groups.length" class="msg">Nenhum selo encontrado com esse filtro.</p>
    </template>
  </div>
</template>

<style scoped>
.wrap-seal { margin-top: 8px; }
.hd { margin-top: 20px; }
.hd h1 { font-size: clamp(22px, 4vw, 32px); font-weight: 700; }
.hd h1 span { color: var(--accent); }
.hd .sub { color: var(--muted); font-size: 14px; line-height: 1.6; margin-top: 8px; max-width: 680px; }
.msg { color: var(--muted); margin-top: 24px; }

/* totais */
.totals {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px; margin-top: 20px;
}
.t-card { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
.t-top { display: flex; align-items: baseline; gap: 8px; }
.t-stat {
  font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px; color: var(--c, var(--text));
}
.t-name { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
.t-owned { margin-left: auto; font-size: 11px; color: var(--muted); }
.t-val { margin-top: 6px; font-size: 15px; color: var(--text); }
.t-val b { color: var(--c, var(--text)); font-family: 'Rajdhani', sans-serif; font-size: 18px; }
.t-max { color: var(--muted); font-size: 12px; }
.t-bar { margin-top: 8px; height: 5px; background: #0d122a; border-radius: 999px; overflow: hidden; }
.t-fill { height: 100%; background: var(--c, var(--accent)); border-radius: 999px; transition: width .3s; }

/* filtros */
.filters { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 22px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip {
  border: 1px solid var(--line); background: var(--panel); color: var(--muted);
  border-radius: 999px; padding: 6px 12px; font-family: inherit; font-size: 12.5px;
  font-weight: 700; cursor: pointer;
}
.chip.on { border-color: var(--c, var(--accent)); color: var(--c, var(--accent)); background: rgba(255,255,255,.03); }
.search {
  display: flex; align-items: center; gap: 8px; flex: 1; min-width: 200px;
  background: #0d122a; border: 1px solid var(--line); border-radius: 999px; padding: 7px 14px;
}
.search .ico { color: var(--muted); display: flex; }
.search input { flex: 1; background: none; border: none; outline: none; color: var(--text); font-family: inherit; font-size: 14px; }
.search input::-webkit-search-cancel-button { display: none; }
.own {
  border: 1px solid var(--line); background: var(--panel); color: var(--muted);
  border-radius: 999px; padding: 6px 14px; font-family: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer;
}
.own.on { border-color: var(--ok); color: var(--ok); background: rgba(62, 209, 124, .08); }

/* grupos */
.group { margin-top: 30px; }
.g-head {
  display: flex; align-items: center; gap: 12px;
  border-bottom: 2px solid var(--line); padding-bottom: 8px; margin-bottom: 14px;
}
.g-stat { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 26px; color: var(--c, var(--accent)); letter-spacing: 2px; }
.g-name { color: var(--text); font-size: 14px; font-weight: 600; }
.g-count { margin-left: auto; color: var(--muted); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
.card {
  background: var(--card); border: 1px solid var(--line); border-radius: 10px;
  padding: 10px 8px; display: flex; flex-direction: column; align-items: center; gap: 6px;
  border-top: 3px solid var(--c, var(--none));
}
.card.owned { box-shadow: inset 0 0 0 1px var(--c, var(--ok)); }
.imgbox { width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; }
.imgbox :deep(img) { max-width: 64px; max-height: 64px; }
.fb {
  width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 22px;
  color: var(--c, var(--muted)); border: 2px dashed var(--c, var(--line)); opacity: .8;
}
.nm { font-size: 12px; font-weight: 600; text-align: center; line-height: 1.25; min-height: 30px; display: flex; align-items: center; }
.val { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px; color: var(--c, var(--text)); }
.tier {
  width: 100%; background: #0d122a; color: var(--text); border: 1px solid var(--line);
  border-radius: 7px; padding: 5px 6px; font-family: inherit; font-size: 12px; cursor: pointer;
}
</style>
