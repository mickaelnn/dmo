<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  title: { type: String, default: '' }
})
const emit = defineEmits(['close'])

function onKey(e) { if (e.key === 'Escape') emit('close') }
onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="backdrop" @click.self="emit('close')">
      <div class="dialog" role="dialog" aria-modal="true">
        <div class="d-head">
          <div class="d-title">
            <slot name="title">{{ title }}</slot>
          </div>
          <button class="d-close" title="Fechar" @click="emit('close')">
            <Icon name="close" :size="20" />
          </button>
        </div>
        <div class="d-body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(4, 6, 14, .72); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
  animation: fade .15s ease;
}
.dialog {
  width: 100%; max-width: 640px; max-height: 85vh;
  display: flex; flex-direction: column;
  background: var(--panel); border: 1px solid var(--line);
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, .5);
  animation: pop .18s ease;
}
.d-head {
  display: flex; align-items: center; gap: 10px;
  padding: 16px 18px; border-bottom: 1px solid var(--line);
}
.d-title { flex: 1; min-width: 0; }
.d-close {
  background: none; border: none; color: var(--muted); cursor: pointer;
  padding: 4px; border-radius: 6px; display: flex;
}
.d-close:hover { color: #ff6a6a; background: rgba(255, 106, 106, .1); }
.d-body { padding: 18px; overflow-y: auto; }
@keyframes fade { from { opacity: 0; } }
@keyframes pop { from { opacity: 0; transform: translateY(8px) scale(.98); } }
</style>
