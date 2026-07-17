<script setup>
import { ref, watch } from 'vue'
import { assetUrl } from '../composables/useData.js'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' }
})

const failed = ref(false)
// reseta o estado de erro se a fonte mudar
watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <img
    v-if="src && !failed"
    :src="assetUrl(src)"
    :alt="alt"
    loading="lazy"
    @error="failed = true"
  >
  <!-- fallback: mostrado quando não há imagem ou ela falhou ao carregar -->
  <slot v-else name="fallback" />
</template>
