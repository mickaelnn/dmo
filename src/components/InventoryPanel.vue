<script setup>
import { ref, computed, onMounted } from 'vue'
import AssetImage from './AssetImage.vue'
import Icon from './Icon.vue'
import { useInventory } from '../composables/useInventory.js'
import { useConfirm } from '../composables/useConfirm.js'
import { useDigivices } from '../composables/useDigivices.js'
import { KEYRING_STATS, KEYRING_LEVELS as LEVELS, krStatsText } from '../data/keyring.js'
import ImageSelect from './ImageSelect.vue'
import { fmtPct } from '../utils/format.js'

const props = defineProps({
  families: { type: Object, default: () => ({}) },
  attributes: { type: Object, default: () => ({}) },
  elements: { type: Object, default: () => ({}) },
  availableFamilies: { type: Array, default: () => [] },
  availableAttributes: { type: Array, default: () => [] },
  availableElements: { type: Array, default: () => [] }
})

const { inv, setKeyring, removeKeyring, addDigivice, removeDigivice } = useInventory()
const { confirm } = useConfirm()
const { load: loadDigivices, list: digiviceCatalog, byId: digiviceById } = useDigivices()
onMounted(loadDigivices)

const collapsed = ref(false)
const selFam = ref('')
const selLevel = ref(0)
const selDigivice = ref('')
const selDvAttr = ref('')
const selDvElem = ref('')
const dvAttrPct = ref('')
const dvElemPct = ref('')

// opções (valor + rótulo + imagem) para os seletores com imagem
const familyOptions = computed(() => props.availableFamilies.map(f => ({
  value: f,
  label: props.families[f]?.label ? `${f} · ${props.families[f].label}` : f,
  image: props.families[f]?.image
})))
const digiviceOptions = computed(() => digiviceCatalog.value.map(d => ({
  value: d.id, label: d.name, image: d.image
})))
const attrOptions = computed(() => props.availableAttributes.map(a => ({
  value: a, label: props.attributes[a]?.label || a, image: props.attributes[a]?.image, color: props.attributes[a]?.color
})))
const elemOptions = computed(() => props.availableElements.map(e => ({
  value: e, label: props.elements[e]?.label || e, image: props.elements[e]?.image, color: props.elements[e]?.color
})))

// inicializa selects com os primeiros valores disponíveis
if (props.availableFamilies.length) selFam.value = props.availableFamilies[0]
if (props.availableAttributes.length) selDvAttr.value = props.availableAttributes[0]
if (props.availableElements.length) selDvElem.value = props.availableElements[0]

// stats do nível escolhido no formulário (dica)
const selStats = computed(() => KEYRING_STATS[selLevel.value] || KEYRING_STATS[0])

function onAddKeyring() {
  if (selFam.value !== '') setKeyring(selFam.value, Number(selLevel.value))
}

async function onRemoveKeyring(fam) {
  const label = props.families[fam]?.label ? `${fam} · ${props.families[fam].label}` : fam
  const ok = await confirm(`Remover o chaveiro Ghost ${label}?`)
  if (ok) removeKeyring(fam)
}

// chaveiros possuídos (família -> nível), ordenados por nível desc
const keyringItems = computed(() =>
  Object.keys(inv.keyrings)
    .map(fam => ({
      fam, level: inv.keyrings[fam],
      label: props.families[fam]?.label || fam,
      image: props.families[fam]?.image || ''
    }))
    .sort((a, b) => b.level - a.level || a.fam.localeCompare(b.fam))
)

function onAddDigivice() {
  const type = selDigivice.value || digiviceCatalog.value[0]?.id
  if (!type) return
  addDigivice({
    type,
    attr: selDvAttr.value,
    elem: selDvElem.value,
    attrPct: dvAttrPct.value,
    elemPct: dvElemPct.value
  })
  dvAttrPct.value = ''
  dvElemPct.value = ''
}

async function onRemoveDigivice(item) {
  const ok = await confirm(`Remover o digivice ${item.name}?`)
  if (ok) removeDigivice(item.id)
}

// digivices possuídos, resolvendo nome/sprite/atributo/elemento/stats
const digiviceItems = computed(() =>
  inv.digivices.map(dv => {
    const cat = digiviceById.value[dv.type] || {}
    const attrLabel = props.attributes[dv.attr]?.label || dv.attr || ''
    const elemLabel = props.elements[dv.elem]?.label || dv.elem || ''
    const attrColor = props.attributes[dv.attr]?.color || 'var(--none)'
    const elemColor = props.elements[dv.elem]?.color || 'var(--none)'
    const attrImage = props.attributes[dv.attr]?.image || ''
    const elemImage = props.elements[dv.elem]?.image || ''
    // monta o texto do hover
    const parts = []
    if (attrLabel) parts.push(`${attrLabel}${dv.attrPct ? ' +' + fmtPct(dv.attrPct) + '%' : ''}`)
    if (elemLabel) parts.push(`${elemLabel}${dv.elemPct ? ' +' + fmtPct(dv.elemPct) + '%' : ''}`)
    const line = parts.join(' · ')
    const stats = [line, cat.stats].filter(Boolean).join('\n') || 'Sem informação de status'
    return {
      id: dv.id,
      name: cat.name || dv.type,
      image: cat.image || '',
      attrLabel, elemLabel, attrColor, elemColor, attrImage, elemImage,
      attrPct: dv.attrPct, elemPct: dv.elemPct,
      stats
    }
  })
)
</script>

<template>
  <div class="inv" :class="{ collapsed }">
    <div class="inv-bar" @click="collapsed = !collapsed">
      <h2>Inventário</h2>
      <span class="arrow"><Icon name="chevron" :size="20" /></span>
    </div>
    <div class="inv-body">
      <div class="inv-sec">
        <h3>Chaveiro Ghost que possuo</h3>
        <div class="dv-add">
          <ImageSelect v-model="selFam" :options="familyOptions" width="240px" placeholder="Família" />
          <select v-model="selLevel">
            <option v-for="lv in LEVELS" :key="lv" :value="lv">+{{ lv }}</option>
          </select>
          <button @click="onAddKeyring">+ Adicionar / atualizar</button>
          <span class="hint">
            +{{ selLevel }}: HT +{{ selStats.ht }}, HP +{{ selStats.hp }}<template v-if="selStats.skill">, Dano de Skill +{{ selStats.skill }}%</template>
          </span>
        </div>
        <div class="dv-list">
          <template v-if="keyringItems.length">
            <span class="kr-item" v-for="k in keyringItems" :key="k.fam" :title="`+${k.level}: ${krStatsText(k.level)}`">
              <AssetImage :src="k.image" :alt="k.fam" />
              <b>{{ k.fam }}</b><span class="kr-fam"> · {{ k.label }}</span>
              <span class="kr-lv">+{{ k.level }}</span>
              <button class="x" title="remover" @click="onRemoveKeyring(k.fam)">×</button>
            </span>
          </template>
          <span v-else class="empty">Nenhum chaveiro Ghost cadastrado.</span>
        </div>
      </div>

      <div class="inv-sec">
        <h3>Digivices que possuo</h3>
        <div class="dv-add">
          <ImageSelect v-model="selDigivice" :options="digiviceOptions" width="240px" placeholder="Selecione o digivice" />
          <ImageSelect v-model="selDvAttr" :options="attrOptions" width="150px" placeholder="Atributo" />
          <input v-model="dvAttrPct" class="dv-pct" type="number" min="0" placeholder="% atrib.">
          <ImageSelect v-model="selDvElem" :options="elemOptions" width="150px" placeholder="Elemento" />
          <input v-model="dvElemPct" class="dv-pct" type="number" min="0" placeholder="% elem.">
          <button @click="onAddDigivice">+ Adicionar</button>
        </div>
        <div class="dv-grid">
          <template v-if="digiviceItems.length">
            <div class="dg-item" v-for="d in digiviceItems" :key="d.id" :title="d.stats">
              <div class="dg-img">
                <AssetImage :src="d.image" :alt="d.name">
                  <template #fallback><span class="dg-fb"><Icon name="device" :size="18" /></span></template>
                </AssetImage>
              </div>
              <span class="dg-name">{{ d.name }}</span>
              <div class="dg-badges">
                <span v-if="d.attrLabel" class="dg-badge" :style="{ '--c': d.attrColor }">
                  <AssetImage :src="d.attrImage" alt="">
                    <template #fallback><span class="dg-dot" :style="{ background: d.attrColor }"></span></template>
                  </AssetImage>
                  {{ d.attrLabel }}<template v-if="d.attrPct"> +{{ fmtPct(d.attrPct) }}%</template>
                </span>
                <span v-if="d.elemLabel" class="dg-badge" :style="{ '--c': d.elemColor }">
                  <AssetImage :src="d.elemImage" alt="">
                    <template #fallback><span class="dg-dot" :style="{ background: d.elemColor }"></span></template>
                  </AssetImage>
                  {{ d.elemLabel }}<template v-if="d.elemPct"> +{{ fmtPct(d.elemPct) }}%</template>
                </span>
              </div>
              <button class="dg-x" title="remover" @click="onRemoveDigivice(d)">×</button>
            </div>
          </template>
          <span v-else class="empty">Nenhum digivice cadastrado.</span>
        </div>
        <p class="hint">Escolha o digivice, o atributo e o elemento; a % de cada é opcional. Passe o mouse para ver os status.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inv {
  background: var(--panel); border: 1px solid var(--line);
  border-radius: 12px; margin-top: 26px;
}
.inv-bar {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; cursor: pointer; user-select: none;
}
.inv-bar h2 {
  font-family: 'Rajdhani', sans-serif; font-size: 18px;
  letter-spacing: 3px; text-transform: uppercase;
}
.arrow { margin-left: auto; color: var(--muted); display: flex; transition: transform .2s; }
.inv.collapsed .arrow { transform: rotate(-90deg); }
.inv.collapsed .inv-body { display: none; }
.inv-body { padding: 4px 18px 20px; border-top: 1px solid var(--line); }
.inv-sec { margin-top: 16px; }
.inv-sec h3 {
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--muted); margin-bottom: 10px;
}
.toggles { display: flex; flex-wrap: wrap; gap: 8px; }
.toggle {
  border: 1px solid var(--line); background: #0d122a; color: var(--muted);
  border-radius: 999px; padding: 7px 15px; font-family: inherit;
  font-size: 13px; font-weight: 600; cursor: pointer;
  display: inline-flex; align-items: center; gap: 7px;
}
.toggle :deep(img) { width: 16px; height: 16px; object-fit: contain; }
.toggle.on { border-color: var(--accent); color: var(--accent); background: rgba(247, 163, 37, .10); }
.dv-add { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 10px; }
.dv-add select {
  background: #0d122a; color: var(--text); border: 1px solid var(--line);
  border-radius: 8px; padding: 8px 10px; font-family: inherit; font-size: 13px;
}
.dv-add > button {
  background: var(--accent); color: #0b0e1a; font-weight: 700; border: none;
  border-radius: 8px; padding: 9px 16px; font-family: inherit; font-size: 13px;
  cursor: pointer; letter-spacing: .5px;
}
.dv-add > button:hover { filter: brightness(1.08); }
.dv-list { display: flex; flex-wrap: wrap; gap: 8px; }
.dv-item {
  display: inline-flex; align-items: center; gap: 8px; background: #0d122a;
  border: 1px solid var(--line); border-radius: 8px;
  padding: 6px 6px 6px 12px; font-size: 13px; font-weight: 600;
}
.dv-item .x {
  background: none; border: none; color: var(--muted); cursor: pointer;
  font-size: 16px; line-height: 1; padding: 2px 6px; border-radius: 5px;
}
.dv-item .x:hover { color: #ff6a6a; background: rgba(255, 106, 106, .1); }
.swatch { width: 9px; height: 9px; border-radius: 2px; transform: rotate(45deg); }
.empty { color: var(--muted); font-size: 13px; }

/* chaveiro Ghost */
.hint { color: var(--muted); font-size: 12px; }
.kr-item {
  display: inline-flex; align-items: center; gap: 7px; background: #0d122a;
  border: 1px solid var(--line); border-radius: 8px;
  padding: 6px 6px 6px 10px; font-size: 13px;
}
.kr-item :deep(img) { width: 18px; height: 18px; object-fit: contain; }
.kr-item b { color: var(--text); }
.kr-fam { color: var(--muted); }
.kr-lv {
  font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 14px;
  color: var(--accent); background: rgba(247, 163, 37, .12);
  border: 1px solid rgba(247, 163, 37, .4); border-radius: 6px; padding: 1px 7px;
}
.kr-item .x {
  background: none; border: none; color: var(--muted); cursor: pointer;
  font-size: 16px; line-height: 1; padding: 2px 6px; border-radius: 5px;
}
.kr-item .x:hover { color: #ff6a6a; background: rgba(255, 106, 106, .1); }

/* digivices (coleção) */
.dv-pct {
  background: #0d122a; color: var(--text); border: 1px solid var(--line);
  border-radius: 8px; padding: 8px 10px; font-family: inherit; font-size: 13px; width: 92px;
}
.dv-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.dg-item {
  position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px;
  width: 150px; background: #0d122a; border: 1px solid var(--line); border-radius: 10px;
  padding: 10px 8px 9px; cursor: help;
}
.dg-item:hover { border-color: #3fa9ff; }
.dg-img { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; }
.dg-img :deep(img) { max-width: 48px; max-height: 48px; }
.dg-fb {
  width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
  color: #3fa9ff; border: 2px dashed var(--line);
}
.dg-name { font-size: 11px; text-align: center; line-height: 1.2; color: var(--text); }
.dg-badges { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
.dg-badge {
  display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;
  font-size: 10px; font-weight: 700; letter-spacing: .3px;
  color: var(--c, var(--muted)); border: 1px solid var(--c, var(--line));
  border-radius: 4px; padding: 2px 6px; background: rgba(0, 0, 0, .2);
}
.dg-badge :deep(img) { width: 12px; height: 12px; object-fit: contain; }
.dg-dot { width: 8px; height: 8px; border-radius: 2px; transform: rotate(45deg); }
.dg-x {
  position: absolute; top: 4px; right: 4px;
  background: none; border: none; color: var(--muted); cursor: pointer;
  font-size: 15px; line-height: 1; padding: 1px 5px; border-radius: 5px;
}
.dg-x:hover { color: #ff6a6a; background: rgba(255, 106, 106, .1); }
</style>
