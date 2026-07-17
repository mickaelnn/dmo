<script setup>
import { computed } from 'vue'
import AssetImage from './AssetImage.vue'

const props = defineProps({
  attributes: { type: Object, default: () => ({}) }
})

const items = computed(() =>
  Object.values(props.attributes).filter(a => a.label !== 'None')
)
</script>

<template>
  <div class="legend">
    <span class="chip" v-for="a in items" :key="a.label">
      <AssetImage :src="a.image" :alt="a.label">
        <template #fallback>
          <span class="dot" :style="{ background: a.color || 'var(--none)' }"></span>
        </template>
      </AssetImage>
      {{ a.label }}
    </span>
  </div>
</template>

<style scoped>
.legend { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
.chip {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--panel); border: 1px solid var(--line);
  border-radius: 999px; padding: 6px 14px; font-size: 13px; font-weight: 600;
}
.chip :deep(img) { width: 18px; height: 18px; object-fit: contain; }
.dot { width: 10px; height: 10px; border-radius: 3px; transform: rotate(45deg); }
</style>
