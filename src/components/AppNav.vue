<script setup>
import Icon from './Icon.vue'

defineProps({
  modelValue: { type: String, default: 'digimons' }
})
const emit = defineEmits(['update:modelValue'])

const tabs = [
  { id: 'digimons', label: 'Digimons', icon: 'grid' },
  { id: 'progresso', label: 'Progresso', icon: 'progress' },
  { id: 'selos', label: 'Selos', icon: 'seal' },
  { id: 'inventario', label: 'Inventário', icon: 'inventory' },
  { id: 'ajuda', label: 'Ajuda', icon: 'help' }
]
</script>

<template>
  <nav class="nav">
    <button
      v-for="t in tabs"
      :key="t.id"
      class="tab"
      :class="{ on: modelValue === t.id }"
      @click="emit('update:modelValue', t.id)"
    >
      <Icon :name="t.icon" :size="17" />
      <span>{{ t.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.nav {
  position: sticky; top: 0; z-index: 20;
  display: flex; gap: 6px; margin: 22px 0 4px;
  padding: 8px; background: rgba(11, 14, 26, .85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--line); border-radius: 12px;
}
.tab {
  display: inline-flex; align-items: center; gap: 8px;
  flex: 1; justify-content: center;
  border: 1px solid transparent; background: none; color: var(--muted);
  border-radius: 8px; padding: 10px 14px; cursor: pointer;
  font-family: inherit; font-size: 14px; font-weight: 600; letter-spacing: .3px;
  transition: color .15s, background .15s, border-color .15s;
}
.tab:hover { color: var(--text); }
.tab.on {
  color: var(--accent); background: rgba(247, 163, 37, .10);
  border-color: rgba(247, 163, 37, .4);
}
@media (max-width: 480px) {
  .tab span { display: none; }
  .tab { padding: 10px; }
}
</style>
