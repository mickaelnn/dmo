<script setup>
import AssetImage from './AssetImage.vue'
import DigimonCard from './DigimonCard.vue'

defineProps({
  fam: { type: String, required: true },
  meta: { type: Object, default: () => ({}) },
  rankGroups: { type: Array, default: () => [] }, // [{ rank, names: [] }]
  count: { type: Number, default: 0 },
  digimons: { type: Object, default: () => ({}) },
  attributes: { type: Object, default: () => ({}) },
  elements: { type: Object, default: () => ({}) }
})
</script>

<template>
  <section>
    <div class="kc-head">
      <AssetImage :src="meta.image" :alt="fam" />
      <div class="kc-code">{{ fam }}</div>
      <div class="kc-name">{{ meta.label || '' }}</div>
      <div class="kc-count">{{ count }} exibido{{ count !== 1 ? 's' : '' }}</div>
    </div>

    <template v-for="group in rankGroups" :key="group.rank">
      <div class="rank-label">RANK <b>{{ group.rank }}</b></div>
      <div class="grid">
        <DigimonCard
          v-for="name in group.names"
          :key="name"
          :name="name"
          :info="digimons[name]"
          :attributes="attributes"
          :elements="elements"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
section { margin-top: 40px; }
.kc-head {
  display: flex; align-items: center; gap: 14px;
  border-bottom: 2px solid var(--line); padding-bottom: 10px; margin-bottom: 6px;
}
.kc-head :deep(img) { width: 40px; height: 40px; object-fit: contain; }
.kc-code {
  font-family: 'Rajdhani', sans-serif; font-weight: 700;
  font-size: clamp(28px, 6vw, 42px); color: var(--accent);
  letter-spacing: 2px; line-height: 1;
}
.kc-name { color: var(--text); font-size: 15px; font-weight: 600; letter-spacing: 1px; }
.kc-count {
  margin-left: auto; color: var(--muted); font-size: 12px;
  letter-spacing: 2px; text-transform: uppercase;
}
.rank-label {
  font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px;
  letter-spacing: 4px; color: var(--muted);
  margin: 18px 0 10px; display: flex; align-items: center; gap: 10px;
}
.rank-label::after { content: ""; flex: 1; height: 1px; background: var(--line); }
.rank-label b { color: var(--text); }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}
</style>
