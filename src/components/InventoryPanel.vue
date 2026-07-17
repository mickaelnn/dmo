<script setup>
import { ref, computed } from 'vue'
import AssetImage from './AssetImage.vue'
import Icon from './Icon.vue'
import { useInventory } from '../composables/useInventory.js'
import { useConfirm } from '../composables/useConfirm.js'

const props = defineProps({
  families: { type: Object, default: () => ({}) },
  attributes: { type: Object, default: () => ({}) },
  elements: { type: Object, default: () => ({}) },
  availableFamilies: { type: Array, default: () => [] },
  availableAttributes: { type: Array, default: () => [] },
  availableElements: { type: Array, default: () => [] }
})

const { inv, toggleKeyring, addDigivice, removeDigivice, hasKeyring } = useInventory()
const { confirm } = useConfirm()

const collapsed = ref(false)
const selAttr = ref('')
const selElem = ref('')

// inicializa selects com os primeiros valores disponíveis
if (props.availableAttributes.length) selAttr.value = props.availableAttributes[0]
if (props.availableElements.length) selElem.value = props.availableElements[0]

function onAdd() {
  if (selAttr.value && selElem.value) addDigivice(selAttr.value, selElem.value)
}

// adicionar liga direto; remover (desligar) pede confirmação
async function onKeyring(f) {
  if (hasKeyring(f)) {
    const label = props.families[f]?.label ? `${f} · ${props.families[f].label}` : f
    const ok = await confirm(`Remover o chaveiro ${label}?`)
    if (!ok) return
  }
  toggleKeyring(f)
}

async function onRemoveDigivice(item) {
  const ok = await confirm(`Remover o digivice ${item.attrLabel} · ${item.elemLabel}?`)
  if (ok) removeDigivice(item.key)
}

const digiviceItems = computed(() =>
  inv.digivices.map(dv => {
    const [a, e] = dv.split('|')
    return {
      key: dv,
      attr: a, attrLabel: props.attributes[a]?.label || a,
      elem: e, elemLabel: props.elements[e]?.label || e,
      color: props.elements[e]?.color || props.attributes[a]?.color || 'var(--none)'
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
        <h3>Chaveiros +10 que possuo</h3>
        <div class="toggles">
          <button
            v-for="f in availableFamilies"
            :key="f"
            class="toggle"
            :class="{ on: hasKeyring(f) }"
            @click="onKeyring(f)"
          >
            <AssetImage :src="families[f]?.image" :alt="f" />
            {{ f }}<template v-if="families[f]?.label"> · {{ families[f].label }}</template>
          </button>
        </div>
      </div>

      <div class="inv-sec">
        <h3>Digivices que possuo (atributo + elemento)</h3>
        <div class="dv-add">
          <select v-model="selAttr">
            <option v-for="a in availableAttributes" :key="a" :value="a">{{ attributes[a]?.label || a }}</option>
          </select>
          <select v-model="selElem">
            <option v-for="e in availableElements" :key="e" :value="e">{{ elements[e]?.label || e }}</option>
          </select>
          <button @click="onAdd">+ Adicionar digivice</button>
        </div>
        <div class="dv-list">
          <template v-if="digiviceItems.length">
            <span class="dv-item" v-for="d in digiviceItems" :key="d.key">
              <span class="swatch" :style="{ background: d.color }"></span>
              {{ d.attrLabel }} · {{ d.elemLabel }}
              <button class="x" title="remover" @click="onRemoveDigivice(d)">×</button>
            </span>
          </template>
          <span v-else class="empty">Nenhum digivice cadastrado.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inv {
  background: var(--panel); border: 1px solid var(--line);
  border-radius: 12px; margin-top: 26px; overflow: hidden;
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
.dv-add button {
  background: var(--accent); color: #0b0e1a; font-weight: 700; border: none;
  border-radius: 8px; padding: 9px 16px; font-family: inherit; font-size: 13px;
  cursor: pointer; letter-spacing: .5px;
}
.dv-add button:hover { filter: brightness(1.08); }
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
</style>
