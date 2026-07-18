<script setup>
// Conjunto de ícones SVG inline (estilo linha, herdam currentColor).
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 }
})

// cada ícone é uma lista de elementos <path>/<circle>/<rect> (viewBox 0 0 24 24)
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.5 12.5 9-9"/><path d="m16 6 3 3"/><path d="m14 8 2.5 2.5"/>',
  device: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8.3 12.2 2.6 2.6 4.8-5.4"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.4"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.4"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.4"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.4"/>',
  progress: '<path d="M5 21V11"/><path d="M12 21V4"/><path d="M19 21v-7"/><path d="M3 21h18"/>',
  inventory: '<path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  seal: '<circle cx="12" cy="8.5" r="5.5"/><path d="M8.5 13 7 21l5-2.5L17 21l-1.5-8"/>'
}
</script>

<template>
  <svg
    :width="size" :height="size" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"
    class="icon" aria-hidden="true" v-html="ICONS[name] || ''"
  />
</template>

<style scoped>
.icon { display: inline-block; vertical-align: middle; flex-shrink: 0; }
</style>
