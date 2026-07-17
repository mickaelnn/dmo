<script setup>
import { computed } from 'vue'
import AssetImage from './AssetImage.vue'
import StatBadge from './StatBadge.vue'
import { useInventory } from '../composables/useInventory.js'
import { useConfirm } from '../composables/useConfirm.js'

// ícones do jogo para os status
const ASSET = {
  key: 'assets/keyring.png',
  dv: 'assets/digivice.png'
}

const props = defineProps({
  name: { type: String, required: true },
  info: { type: Object, default: () => ({}) },
  attributes: { type: Object, default: () => ({}) },
  elements: { type: Object, default: () => ({}) }
})

const { toggleDigimon, ownsDigimon, hasKeyring, hasDigivice } = useInventory()
const { confirm } = useConfirm()

// marca direto; ao desmarcar (remover da coleção), pede confirmação
async function onClick() {
  if (owned.value) {
    const ok = await confirm(`Remover "${props.name}" da sua coleção?`)
    if (!ok) return
  }
  toggleDigimon(props.name)
}

const attr = computed(() => props.attributes[props.info.attribute])
const elem = computed(() => props.info.element ? props.elements[props.info.element] : null)
const attrColor = computed(() => attr.value?.color || 'var(--none)')
const initial = computed(() => (props.name.match(/[A-Za-z]/) || ['?'])[0])
const owned = computed(() => ownsDigimon(props.name))

const fams = computed(() => props.info.families || [])
const hasKey = computed(() => fams.value.some(f => hasKeyring(f)))
// digivice combina com o digimon por atributo + elemento
const hasDv = computed(() =>
  !!(props.info.attribute && props.info.element &&
     hasDigivice(props.info.attribute, props.info.element))
)
</script>

<template>
  <div
    class="card"
    :class="{ owned }"
    :style="{ '--attr': attrColor }"
    :title="owned ? 'Clique para remover da coleção' : 'Clique para marcar que possui'"
    @click="onClick"
  >
    <div class="imgbox">
      <AssetImage :src="info.image" :alt="name">
        <template #fallback><div class="fallback">{{ initial }}</div></template>
      </AssetImage>
    </div>

    <div class="name">{{ name }}</div>

    <div class="badges">
      <StatBadge v-if="info.attribute" :def="attr" :id="info.attribute" />
      <StatBadge v-if="elem" :def="elem" :id="info.element" />
    </div>

    <div class="cardfoot">
      <div class="slots">
        <span class="sicon" :class="{ off: !hasKey }" :title="hasKey ? 'Tenho o chaveiro +10' : 'Sem o chaveiro +10'">
          <AssetImage :src="ASSET.key" alt="chaveiro">
            <template #fallback><span class="sfb k">K</span></template>
          </AssetImage>
        </span>
        <span class="sicon" :class="{ off: !hasDv }" :title="hasDv ? 'Tenho o digivice certo' : 'Sem o digivice certo'">
          <AssetImage :src="ASSET.dv" alt="digivice">
            <template #fallback><span class="sfb d">D</span></template>
          </AssetImage>
        </span>
      </div>
      <span class="owned-tag" :class="{ off: !owned }">{{ owned ? 'Possuído' : 'Não possuo' }}</span>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative; background: var(--card); border: 1px solid var(--line);
  border-radius: 10px; padding: 12px 10px 10px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  border-top: 3px solid var(--attr, var(--none));
  min-height: 210px; cursor: pointer; transition: border-color .15s;
}
.card:hover { border-color: var(--accent); }
.card.owned { box-shadow: inset 0 0 0 1px var(--ok); }
.imgbox {
  width: 100px; height: 100px; display: flex;
  align-items: center; justify-content: center;
  background: radial-gradient(circle at 50% 60%, rgba(63, 169, 255, .10), transparent 70%);
  border-radius: 8px; overflow: hidden;
}
.imgbox :deep(img) { max-width: 100px; max-height: 100px; }
.fallback {
  width: 74px; height: 74px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 30px;
  color: var(--attr, var(--none)); border: 2px dashed var(--attr, var(--none)); opacity: .85;
}
.name {
  font-size: 13px; font-weight: 600; text-align: center; line-height: 1.3;
  flex: 1; display: flex; align-items: center;
}
.badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }

/* rodapé do card: status sempre presente (alinha as alturas) */
.cardfoot {
  display: flex; align-items: center; gap: 8px; justify-content: space-between;
  margin-top: auto; padding-top: 8px; width: 100%;
  border-top: 1px solid var(--line);
}
.slots { display: flex; align-items: center; gap: 6px; }
.sicon { display: flex; align-items: center; justify-content: center; transition: opacity .15s, filter .15s; }
.sicon :deep(img) { width: 22px; height: 22px; object-fit: contain; }
.sicon.off { opacity: .25; filter: grayscale(1); }
.sfb {
  width: 22px; height: 22px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #0b0e1a;
}
.sfb.k { background: var(--accent); }
.sfb.d { background: #3fa9ff; }
.owned-tag {
  font-size: 10px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase;
  color: var(--ok); background: rgba(62, 209, 124, .12);
  border: 1px solid rgba(62, 209, 124, .5); border-radius: 999px; padding: 3px 9px;
  white-space: nowrap;
}
.owned-tag.off {
  color: var(--muted); background: transparent; border-color: var(--line);
}
</style>
