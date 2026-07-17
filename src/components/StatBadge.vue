<script setup>
import AssetImage from './AssetImage.vue'

defineProps({
  def: { type: Object, default: () => ({}) },
  id: { type: String, default: '' }
})
</script>

<template>
  <span class="badge" :style="{ '--c': def?.color || 'var(--none)' }">
    <AssetImage v-if="def?.image" :src="def.image" :alt="def?.label || id" />
    {{ def?.label || id }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10.5px; font-weight: 700; letter-spacing: .5px;
  text-transform: uppercase; padding: 3px 9px; border-radius: 4px;
  border: 1px solid var(--c, var(--none)); color: var(--c, var(--none));
  background: rgba(0, 0, 0, .25);
}
.badge :deep(img) { width: 14px; height: 14px; object-fit: contain; }
</style>
