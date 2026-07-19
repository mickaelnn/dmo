<script setup>
import { ref, computed, watch } from 'vue'
import AssetImage from './AssetImage.vue'
import ProgressBar from './ProgressBar.vue'
import ModalDialog from './ModalDialog.vue'
import Icon from './Icon.vue'
import { useInventory } from '../composables/useInventory.js'

const props = defineProps({
  digimons: { type: Object, default: () => ({}) },
  families: { type: Object, default: () => ({}) },
  attributes: { type: Object, default: () => ({}) },
  elements: { type: Object, default: () => ({}) }
})

const { hasKeyring, bestKeyring, ownsDigimon } = useInventory()

// base do cálculo: todos os digimons do guia, ou só os que possuo
const scope = ref('all') // 'all' | 'owned'

const roster = computed(() =>
  Object.entries(props.digimons)
    .filter(([name]) => scope.value === 'all' || ownsDigimon(name))
    .map(([name, info]) => ({ name, info }))
)

function isKeyCovered(info) {
  return (info.families || []).some(f => hasKeyring(f))
}

const total = computed(() => roster.value.length)
const keyCovered = computed(() => roster.value.filter(d => isKeyCovered(d.info)).length)

// ---- chaveiros que faltam (ranqueados por impacto) ----
const keyringWishlist = computed(() => {
  const tally = {}
  for (const { info } of roster.value) {
    if (isKeyCovered(info)) continue
    for (const f of (info.families || [])) {
      if (hasKeyring(f)) continue
      tally[f] = (tally[f] || 0) + 1
    }
  }
  return Object.entries(tally)
    .map(([fam, count]) => ({
      fam, count,
      label: props.families[fam]?.label || fam,
      image: props.families[fam]?.image || ''
    }))
    .sort((a, b) => b.count - a.count || a.fam.localeCompare(b.fam))
})

// ---- chaveiros que TENHO (com quantos digimons cada um cobre) ----
const ownedKeyringList = computed(() => {
  const tally = {}
  for (const { info } of roster.value) {
    for (const f of (info.families || [])) {
      if (!hasKeyring(f)) continue
      tally[f] = (tally[f] || 0) + 1
    }
  }
  return Object.entries(tally)
    .map(([fam, count]) => ({
      fam, count,
      label: props.families[fam]?.label || fam,
      image: props.families[fam]?.image || ''
    }))
    .sort((a, b) => b.count - a.count || a.fam.localeCompare(b.fam))
})

const listMode = ref('missing') // 'missing' | 'owned'

// ---- seleção: clicar num item mostra os digimons relacionados ----
const selected = ref(null) // { fam, label, mode }

function selectItem(fam, label, mode) {
  if (selected.value && selected.value.fam === fam) selected.value = null
  else selected.value = { fam, label, mode }
}
function isSelected(fam) { return selected.value && selected.value.fam === fam }

const selectedDigimons = computed(() => {
  if (!selected.value) return []
  const { fam, mode } = selected.value
  const base = roster.value.filter(d => (d.info.families || []).includes(fam))
  return mode === 'owned' ? base : base.filter(d => !isKeyCovered(d.info))
})

watch([scope, listMode], () => { selected.value = null })
</script>

<template>
  <div class="coverage">
    <div class="cov-head">
      <h2>Cobertura de chaveiro & próximos passos</h2>
      <div class="scope">
        <button class="sbtn" :class="{ on: scope === 'all' }" @click="scope = 'all'">Todos os digimons</button>
        <button class="sbtn" :class="{ on: scope === 'owned' }" @click="scope = 'owned'">Só os que possuo</button>
      </div>
    </div>

    <p v-if="!total" class="empty">
      {{ scope === 'owned' ? 'Você ainda não marcou nenhum digimon como possuído.' : 'Sem digimons para analisar.' }}
    </p>

    <template v-else>
      <ProgressBar :owned="keyCovered" :total="total" label="Com chaveiro Ghost" unit="com chaveiro" color="var(--accent)" />

      <div class="mode">
        <button class="mbtn" :class="{ on: listMode === 'missing' }" @click="listMode = 'missing'">Que faltam</button>
        <button class="mbtn" :class="{ on: listMode === 'owned' }" @click="listMode = 'owned'">Que tenho</button>
      </div>

      <div class="wish">
        <!-- QUE FALTAM -->
        <template v-if="listMode === 'missing'">
          <p v-if="!keyringWishlist.length" class="done"><Icon name="check" :size="15" /> Todos os digimons desta base já têm chaveiro.</p>
          <ul v-else>
            <li
              v-for="(k, i) in keyringWishlist"
              :key="k.fam"
              :class="{ next: i === 0, sel: isSelected(k.fam) }"
              @click="selectItem(k.fam, k.fam + ' · ' + k.label, 'missing')"
            >
              <AssetImage :src="k.image" :alt="k.fam" />
              <span class="nm"><b>{{ k.fam }}</b><span class="sub"> · {{ k.label }}</span></span>
              <span v-if="i === 0" class="tag-next">Próximo</span>
              <span class="cnt">+{{ k.count }}</span>
            </li>
          </ul>
        </template>

        <!-- QUE TENHO -->
        <template v-else>
          <p v-if="!ownedKeyringList.length" class="empty-sm">Nenhum chaveiro Ghost cadastrado. Adicione na aba Inventário.</p>
          <ul v-else>
            <li
              v-for="k in ownedKeyringList"
              :key="k.fam"
              :class="{ has: true, sel: isSelected(k.fam) }"
              @click="selectItem(k.fam, k.fam + ' · ' + k.label, 'owned')"
            >
              <AssetImage :src="k.image" :alt="k.fam" />
              <span class="nm"><b>{{ k.fam }}</b><span class="sub"> · {{ k.label }}</span></span>
              <span class="cnt cnt-has">{{ k.count }}</span>
            </li>
          </ul>
        </template>
      </div>

      <p class="hint">
        Clique num chaveiro para ver os digimons relacionados.
        <template v-if="listMode === 'missing'">O <b>+N</b> mostra quantos digimons ainda descobertos seriam cobertos ao conseguir cada chaveiro; o de maior impacto é marcado como <b>Próximo</b>.</template>
        <template v-else>O número mostra quantos digimons desta base cada chaveiro que você tem está cobrindo.</template>
      </p>
    </template>

    <!-- DETALHE em modal -->
    <ModalDialog v-if="selected" @close="selected = null">
      <template #title>
        <div class="d-title-row">
          <span class="dtag"><Icon name="key" :size="14" /> Chaveiro</span>
          <b>{{ selected.label }}</b>
          <span class="dcount">
            <template v-if="selected.mode === 'owned'">cobre {{ selectedDigimons.length }} digimon{{ selectedDigimons.length !== 1 ? 's' : '' }}</template>
            <template v-else>{{ selectedDigimons.length }} digimon{{ selectedDigimons.length !== 1 ? 's' : '' }} precisa{{ selectedDigimons.length !== 1 ? 'm' : '' }}</template>
          </span>
        </div>
      </template>

      <p v-if="!selectedDigimons.length" class="done">Nenhum digimon relacionado a este chaveiro nesta base.</p>
      <div v-else class="mini-grid">
        <div class="mini" v-for="d in selectedDigimons" :key="d.name" :title="d.name"
             :style="{ '--attr': attributes[d.info.attribute]?.color || 'var(--none)' }">
          <div class="mini-img">
            <AssetImage :src="d.info.image" :alt="d.name">
              <template #fallback><span class="mini-fb">{{ (d.name.match(/[A-Za-z]/) || ['?'])[0] }}</span></template>
            </AssetImage>
          </div>
          <span class="mini-name">{{ d.name }}</span>
          <span v-if="attributes[d.info.attribute]" class="mini-attr" :style="{ '--c': attributes[d.info.attribute].color }">
            <AssetImage :src="attributes[d.info.attribute].image" alt="">
              <template #fallback><span class="mini-dot" :style="{ background: attributes[d.info.attribute].color }"></span></template>
            </AssetImage>
            {{ attributes[d.info.attribute].label }}
          </span>
        </div>
      </div>
    </ModalDialog>
  </div>
</template>

<style scoped>
.coverage {
  margin-top: 26px; background: var(--panel);
  border: 1px solid var(--line); border-radius: 12px; padding: 18px;
}
.cov-head { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 16px; }
.cov-head h2 {
  font-family: 'Rajdhani', sans-serif; font-size: 18px; letter-spacing: 3px; text-transform: uppercase;
}
.scope { margin-left: auto; display: flex; gap: 6px; }
.sbtn {
  border: 1px solid var(--line); background: #0d122a; color: var(--muted);
  border-radius: 999px; padding: 6px 13px; font-family: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
}
.sbtn.on { border-color: var(--accent); color: var(--accent); background: rgba(247, 163, 37, .10); }

.mode { display: flex; gap: 6px; margin-top: 18px; }
.mbtn {
  border: 1px solid var(--line); background: #0d122a; color: var(--muted);
  border-radius: 999px; padding: 6px 15px; font-family: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
}
.mbtn.on { border-color: var(--ok); color: var(--ok); background: rgba(62, 209, 124, .08); }

.wish { margin-top: 12px; }
.wish ul { list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 6px; }
.wish li {
  display: flex; align-items: center; gap: 10px; background: #0d122a; border: 1px solid var(--line);
  border-radius: 8px; padding: 8px 12px; font-size: 13px; cursor: pointer; transition: border-color .15s, background .15s;
}
.wish li:hover { border-color: var(--muted); }
.wish li.next { border-color: var(--accent); box-shadow: inset 0 0 0 1px rgba(247, 163, 37, .35); }
.wish li.has { border-color: rgba(62, 209, 124, .35); }
.wish li.sel { border-color: var(--ok); background: rgba(62, 209, 124, .08); box-shadow: inset 0 0 0 1px var(--ok); }
.wish li :deep(img) { width: 20px; height: 20px; object-fit: contain; }
.nm { flex: 1; min-width: 0; }
.nm b { color: var(--text); }
.nm .sub { color: var(--muted); }
.tag-next {
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
  color: #0b0e1a; background: var(--accent); border-radius: 4px; padding: 2px 7px;
}
.cnt {
  font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px;
  color: var(--ok); min-width: 34px; text-align: right;
}
.cnt-has { color: var(--accent); }
.done { color: var(--ok); font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }
.empty { color: var(--muted); font-size: 14px; }
.empty-sm { color: var(--muted); font-size: 12.5px; }
.hint { margin-top: 14px; color: var(--muted); font-size: 12px; line-height: 1.6; }
.hint b { color: var(--text); }

/* detalhe (modal) */
.d-title-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.dtag {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
  color: #0b0e1a; background: var(--ok); border-radius: 4px; padding: 3px 8px;
}
.d-title-row b { color: var(--text); font-size: 15px; }
.dcount { color: var(--muted); font-size: 12px; }
.mini-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
.mini {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  background: var(--card); border: 1px solid var(--line);
  border-top: 3px solid var(--attr, var(--none));
  border-radius: 8px; padding: 8px 6px;
}
.mini-img { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; }
.mini-img :deep(img) { max-width: 56px; max-height: 56px; }
.mini-fb {
  width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 20px; color: var(--muted); border: 2px dashed var(--line);
}
.mini-name {
  font-size: 11px; text-align: center; line-height: 1.25; color: var(--text);
  min-height: 28px; display: flex; align-items: center; justify-content: center;
}
.mini-attr {
  display: inline-flex; align-items: center; gap: 4px; margin-top: auto;
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .3px;
  color: var(--c, var(--muted)); border: 1px solid var(--c, var(--line));
  border-radius: 4px; padding: 1px 6px; background: rgba(0, 0, 0, .2);
}
.mini-attr :deep(img) { width: 12px; height: 12px; object-fit: contain; }
.mini-dot { width: 8px; height: 8px; border-radius: 2px; transform: rotate(45deg); }
</style>
