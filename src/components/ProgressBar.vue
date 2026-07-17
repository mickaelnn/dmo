<script setup>
import { computed } from 'vue'

const props = defineProps({
  owned: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  label: { type: String, default: 'Progresso' },
  unit: { type: String, default: 'coletados' },
  color: { type: String, default: 'var(--ok)' }
})

const pct = computed(() => props.total ? Math.round((props.owned / props.total) * 100) : 0)
</script>

<template>
  <div class="progress">
    <div class="top">
      <span class="lbl">{{ label }}</span>
      <span class="count"><b :style="{ color }">{{ owned }}</b> / {{ total }} {{ unit }}</span>
      <span class="pct" :style="{ color }">{{ pct }}%</span>
    </div>
    <div class="track">
      <div class="fill" :style="{ width: pct + '%', background: color }"></div>
    </div>
  </div>
</template>

<style scoped>
.progress {
  background: var(--panel);
  border: 1px solid var(--line); border-radius: 12px; padding: 14px 18px;
}
.top { display: flex; align-items: baseline; gap: 10px; }
.lbl {
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted);
}
.count { font-size: 14px; color: var(--text); }
.count b { font-size: 16px; }
.pct {
  margin-left: auto; font-family: 'Rajdhani', sans-serif; font-weight: 700;
  font-size: 18px;
}
.track {
  margin-top: 10px; height: 8px; border-radius: 999px;
  background: #0d122a; border: 1px solid var(--line); overflow: hidden;
}
.fill {
  height: 100%; border-radius: 999px;
  transition: width .3s ease; filter: saturate(1.1);
}
</style>
