<script setup>
defineProps({
  modelValue: { type: String, default: 'all' }
})
const emit = defineEmits(['update:modelValue'])

const options = [
  { f: 'all', label: 'Todos' },
  { f: 'have', label: 'Que tenho' },
  { f: 'miss', label: 'Que faltam' }
]
</script>

<template>
  <div class="filters">
    <span class="lbl">Mostrar</span>
    <button
      v-for="o in options"
      :key="o.f"
      class="fbtn"
      :class="{ on: modelValue === o.f }"
      @click="emit('update:modelValue', o.f)"
    >{{ o.label }}</button>
  </div>
</template>

<style scoped>
.filters { display: flex; gap: 8px; margin-top: 24px; flex-wrap: wrap; align-items: center; }
.lbl {
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--muted); margin-right: 4px;
}
.fbtn {
  border: 1px solid var(--line); background: var(--panel); color: var(--muted);
  border-radius: 999px; padding: 6px 14px; font-family: inherit;
  font-size: 13px; font-weight: 600; cursor: pointer;
}
.fbtn.on { border-color: var(--ok); color: var(--ok); background: rgba(62, 209, 124, .08); }
</style>
