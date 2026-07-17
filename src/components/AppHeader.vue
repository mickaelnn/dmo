<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: { type: Object, default: () => ({}) }
})

// Destaca a palavra "Chaveiro(s)" com a cor de destaque, como no site original.
const titleHtml = computed(() => {
  const t = props.config.title || 'Guia de Progesso'
  return t.replace(/(Chaveiros?)/i, '<span>$1</span>')
})
</script>

<template>
  <header>
    <div class="eyebrow">{{ config.subtitle || 'Digimon Masters Online' }}</div>
    <h1 v-html="titleHtml"></h1>
    <p class="sub">{{ config.note || '' }}</p>
  </header>
</template>

<style scoped>
header { margin-bottom: 12px; }
.eyebrow {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}
h1 {
  font-size: clamp(26px, 5vw, 40px);
  font-weight: 700;
  line-height: 1.05;
}
:deep(h1 span) { color: var(--accent); }
.sub {
  color: var(--muted);
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  max-width: 680px;
}
</style>
