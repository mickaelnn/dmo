<script setup>
import { computed } from 'vue'
import AssetImage from './AssetImage.vue'
import Icon from './Icon.vue'
import { useInventory } from '../composables/useInventory.js'
import { useConfirm } from '../composables/useConfirm.js'
import { useDigivices } from '../composables/useDigivices.js'
import { fmtPct } from '../utils/format.js'

const props = defineProps({
  digimons: { type: Object, default: () => ({}) },
  attributes: { type: Object, default: () => ({}) }
})

const { inv, toggleDigimon, hasKeyring, bestKeyring, matchingDigivice } = useInventory()
const { confirm } = useConfirm()
const { byId: digiviceById } = useDigivices()

const ASSET = { key: 'assets/keyring.png', dv: 'assets/digivice.png' }

function dvInfo(info) {
  const my = (info.attribute && info.element) ? matchingDigivice(info.attribute, info.element) : null
  if (!my) return { hasDv: false, image: '', title: 'Sem digivice para esse atributo + elemento' }
  const cat = digiviceById.value[my.type]
  const name = cat?.name || my.type
  const pcts = []
  if (my.attrPct) pcts.push(`Atrib +${fmtPct(my.attrPct)}%`)
  if (my.elemPct) pcts.push(`Elem +${fmtPct(my.elemPct)}%`)
  const extra = pcts.length ? ' · ' + pcts.join(' / ') : (cat?.stats ? ' · ' + cat.stats : '')
  return { hasDv: true, image: cat?.image || '', title: name + extra }
}

const ownedList = computed(() =>
  inv.digimons
    .filter(name => name in props.digimons)
    .map(name => {
      const info = props.digimons[name]
      const best = bestKeyring(info.families || [])
      const dv = dvInfo(info)
      return {
        name, info,
        color: props.attributes[info.attribute]?.color || 'var(--none)',
        initial: (name.match(/[A-Za-z]/) || ['?'])[0],
        hasKey: (info.families || []).some(f => hasKeyring(f)),
        bestLevel: best ? best.level : null,
        hasDv: dv.hasDv, dvImage: dv.image, dvTitle: dv.title
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
)

// resumo: quantos dos possuídos já têm chaveiro
const readyCount = computed(() => ownedList.value.filter(d => d.hasKey).length)

async function remove(name) {
  const ok = await confirm(`Remover "${name}" da sua coleção?`)
  if (ok) toggleDigimon(name)
}
</script>

<template>
  <div class="owned">
    <div class="o-head">
      <h2>Digimons que possuo</h2>
      <span class="o-count">{{ ownedList.length }}</span>
      <span v-if="ownedList.length" class="o-ready">{{ readyCount }} com chaveiro Ghost</span>
    </div>

    <p v-if="!ownedList.length" class="empty">
      Você ainda não marcou nenhum digimon. Vá na aba <b>Digimons</b> e clique nos cards que você já tem.
    </p>

    <div v-else class="grid">
      <div
        v-for="d in ownedList"
        :key="d.name"
        class="mini"
        :style="{ '--attr': d.color }"
        :title="`${d.name} — clique para remover da coleção`"
        @click="remove(d.name)"
      >
        <span class="rm"><Icon name="close" :size="13" /></span>
        <div class="mini-img">
          <AssetImage :src="d.info.image" :alt="d.name">
            <template #fallback><span class="mini-fb">{{ d.initial }}</span></template>
          </AssetImage>
        </div>
        <span class="mini-name">{{ d.name }}</span>
        <div class="mini-status">
          <span class="ms" :class="{ off: !d.hasDv }" :title="d.dvTitle">
            <AssetImage v-if="d.hasDv && d.dvImage" :src="d.dvImage" alt="digivice">
              <template #fallback>
                <AssetImage :src="ASSET.dv" alt="digivice">
                  <template #fallback><span class="ms-fb d">D</span></template>
                </AssetImage>
              </template>
            </AssetImage>
            <AssetImage v-else :src="ASSET.dv" alt="digivice">
              <template #fallback><span class="ms-fb d">D</span></template>
            </AssetImage>
          </span>
          <span class="ms" :class="{ off: !d.hasKey }" :title="d.hasKey ? `Chaveiro Ghost +${d.bestLevel}` : 'Sem chaveiro Ghost'">
            <AssetImage :src="ASSET.key" alt="chaveiro">
              <template #fallback><span class="ms-fb k">K</span></template>
            </AssetImage>
            <span v-if="d.hasKey" class="ms-lv">+{{ d.bestLevel }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.owned {
  margin-top: 26px; background: var(--panel);
  border: 1px solid var(--line); border-radius: 12px; padding: 18px;
}
.o-head { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.o-head h2 {
  font-family: 'Rajdhani', sans-serif; font-size: 18px;
  letter-spacing: 3px; text-transform: uppercase;
}
.o-count {
  font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 14px;
  color: var(--ok); background: rgba(62, 209, 124, .1);
  border: 1px solid rgba(62, 209, 124, .4); border-radius: 999px; padding: 2px 12px;
}
.o-ready { color: var(--muted); font-size: 12px; margin-left: 2px; }
.empty { color: var(--muted); font-size: 14px; line-height: 1.6; }
.empty b { color: var(--accent); }
.grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;
}
.mini {
  position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  background: var(--card); border: 1px solid var(--line);
  border-top: 3px solid var(--attr, var(--none));
  border-radius: 8px; padding: 10px 6px 8px; cursor: pointer;
  transition: border-color .15s;
}
.mini:hover { border-color: #ff6a6a; }
.mini:hover .rm { opacity: 1; }
.rm {
  position: absolute; top: 5px; right: 5px; opacity: 0; transition: opacity .15s;
  width: 18px; height: 18px; border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255, 106, 106, .18); color: #ff6a6a;
}
.mini-img { width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; }
.mini-img :deep(img) { max-width: 60px; max-height: 60px; }
.mini-fb {
  width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-family: 'Rajdhani', sans-serif; font-weight: 700;
  font-size: 20px; color: var(--attr, var(--muted)); border: 2px dashed var(--attr, var(--line)); opacity: .85;
}
.mini-name {
  font-size: 11px; text-align: center; line-height: 1.25; color: var(--text);
  min-height: 28px; display: flex; align-items: center; justify-content: center;
}
.mini-status {
  display: flex; align-items: center; gap: 6px; margin-top: auto;
  padding-top: 6px; border-top: 1px solid var(--line); width: 100%; justify-content: center;
}
.ms { position: relative; display: flex; align-items: center; justify-content: center; transition: opacity .15s, filter .15s; }
.ms :deep(img) { width: 18px; height: 18px; object-fit: contain; }
.ms.off { opacity: .25; filter: grayscale(1); }
.ms-lv {
  font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 11px;
  color: var(--accent); margin-left: 2px;
}
.ms-fb {
  width: 18px; height: 18px; border-radius: 5px; display: flex;
  align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #0b0e1a;
}
.ms-fb.k { background: var(--accent); }
.ms-fb.d { background: #3fa9ff; }
</style>

