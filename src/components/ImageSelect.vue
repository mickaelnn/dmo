<script setup>
import { ref, computed } from 'vue'
import AssetImage from './AssetImage.vue'
import Icon from './Icon.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  // options: [{ value, label, image, color }]
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Selecione' },
  width: { type: String, default: '240px' }
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const selected = computed(() => props.options.find(o => o.value === props.modelValue) || null)
function pick(v) { emit('update:modelValue', v); open.value = false }
</script>

<template>
  <div class="imgsel" :style="{ width }">
    <button type="button" class="trigger" @click="open = !open">
      <span class="thumb">
        <AssetImage :src="selected?.image" alt="">
          <template #fallback><span class="dot" :style="{ background: selected?.color || 'var(--none)' }"></span></template>
        </AssetImage>
      </span>
      <span class="tname">{{ selected?.label || placeholder }}</span>
      <Icon name="chevron" :size="16" />
    </button>
    <div v-if="open" class="backdrop" @click="open = false"></div>
    <div v-if="open" class="menu">
      <button type="button" class="opt" v-for="o in options" :key="o.value"
              :class="{ on: o.value === modelValue }" @click="pick(o.value)">
        <span class="thumb">
          <AssetImage :src="o.image" alt="">
            <template #fallback><span class="dot" :style="{ background: o.color || 'var(--none)' }"></span></template>
          </AssetImage>
        </span>
        <span class="oname">{{ o.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.imgsel { position: relative; }
.trigger {
  display: inline-flex; align-items: center; gap: 8px; width: 100%;
  background: #0d122a; color: var(--text); border: 1px solid var(--line);
  border-radius: 8px; padding: 6px 10px; font-family: inherit; font-size: 13px; cursor: pointer;
}
.trigger:hover { border-color: var(--muted); }
.tname { flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.thumb {
  width: 30px; height: 30px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  background: #060912; border: 1px solid var(--line); border-radius: 7px;
}
.thumb :deep(img) { max-width: 26px; max-height: 26px; object-fit: contain; }
.dot { width: 12px; height: 12px; border-radius: 3px; transform: rotate(45deg); }
.backdrop { position: fixed; inset: 0; z-index: 30; }
.menu {
  position: absolute; top: calc(100% + 4px); left: 0; z-index: 31;
  width: 100%; max-height: 300px; overflow-y: auto;
  background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, .5); padding: 5px;
}
.opt {
  display: flex; align-items: center; gap: 9px; width: 100%;
  background: none; border: 1px solid transparent; color: var(--text); cursor: pointer;
  padding: 6px 8px; border-radius: 7px; font-family: inherit; font-size: 12.5px; font-weight: 600; text-align: left;
}
.oname { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.opt:hover { background: #0d122a; }
.opt.on { background: rgba(63, 169, 255, .12); color: #3fa9ff; border-color: rgba(63, 169, 255, .35); }
</style>
