<script setup>
import Icon from './Icon.vue'

defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="search">
    <span class="ico"><Icon name="search" :size="16" /></span>
    <input
      type="search"
      :value="modelValue"
      placeholder="Buscar digimon pelo nome…"
      @input="emit('update:modelValue', $event.target.value)"
    >
    <button v-if="modelValue" class="clear" title="Limpar" @click="emit('update:modelValue', '')">
      <Icon name="close" :size="15" />
    </button>
  </div>
</template>

<style scoped>
.search {
  display: flex; align-items: center; gap: 8px; flex: 1; min-width: 220px;
  background: #0d122a; border: 1px solid var(--line); border-radius: 999px;
  padding: 8px 14px;
}
.ico { color: var(--muted); display: flex; flex-shrink: 0; }
input {
  flex: 1; background: none; border: none; outline: none;
  color: var(--text); font-family: inherit; font-size: 14px;
}
input::placeholder { color: var(--muted); }
input::-webkit-search-cancel-button { display: none; }
.clear {
  background: none; border: none; color: var(--muted); cursor: pointer;
  line-height: 1; padding: 2px; border-radius: 5px; display: flex;
}
.clear:hover { color: #ff6a6a; }
</style>
