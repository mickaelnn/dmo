<script setup>
import { ref } from 'vue'

const emit = defineEmits(['file'])
const fileInput = ref(null)

function pick() { fileInput.value?.click() }
function onChange(e) {
  const f = e.target.files?.[0]
  if (f) emit('file', f)
}
function onDrop(e) {
  const f = e.dataTransfer?.files?.[0]
  if (f) emit('file', f)
}
</script>

<template>
  <div class="loader" @dragover.prevent @drop.prevent="onDrop">
    <h2>Não consegui carregar o <code>data.json</code> automaticamente</h2>
    <p>
      Isso acontece ao abrir o arquivo direto (<code>file://</code>) — o navegador bloqueia
      a leitura de arquivos locais. Rode o servidor de desenvolvimento (<code>npm run dev</code>)
      ou selecione o JSON manualmente (também aceita arrastar o arquivo para a página):
    </p>
    <button class="btn" @click="pick">Escolher data.json</button>
    <input ref="fileInput" type="file" accept=".json,application/json" hidden @change="onChange">
  </div>
</template>

<style scoped>
.loader {
  background: var(--panel); border: 1px solid var(--line); border-radius: 12px;
  padding: 28px; margin-top: 32px; text-align: center; line-height: 1.7;
}
.loader h2 { font-size: 18px; margin-bottom: 10px; }
.loader p { color: var(--muted); font-size: 14px; max-width: 560px; margin: 0 auto 16px; }
.loader code {
  background: #0b0e1a; border: 1px solid var(--line);
  border-radius: 5px; padding: 2px 7px; color: var(--accent);
}
.btn {
  background: var(--accent); color: #0b0e1a; font-weight: 700; border: none;
  border-radius: 8px; padding: 9px 16px; font-family: inherit; font-size: 13px;
  cursor: pointer; letter-spacing: .5px;
}
.btn:hover { filter: brightness(1.08); }
</style>
