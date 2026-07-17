<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'
import { useInventory } from '../composables/useInventory.js'
import { useConfirm } from '../composables/useConfirm.js'

const { inv, snapshot, replaceAll } = useInventory()
const { confirm } = useConfirm()

const fileInput = ref(null)
const feedback = ref('')

function flash(msg) {
  feedback.value = msg
  setTimeout(() => { feedback.value = '' }, 4000)
}

function exportData() {
  const payload = {
    app: 'dmo-progress',
    version: 1,
    savedAt: new Date().toISOString(),
    inventory: snapshot()
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `dmo-progresso-${stamp}.json`
  a.click()
  URL.revokeObjectURL(url)
  flash('Backup exportado.')
}

function pickFile() { fileInput.value?.click() }

async function onFile(e) {
  const file = e.target.files?.[0]
  e.target.value = '' // permite reimportar o mesmo arquivo
  if (!file) return
  let data
  try {
    const text = await file.text()
    const parsed = JSON.parse(text)
    // aceita o formato com wrapper ou o inventário puro
    data = parsed.inventory || parsed
    if (!data || (!Array.isArray(data.keyrings) && !Array.isArray(data.digivices) && !Array.isArray(data.digimons))) {
      throw new Error('formato inválido')
    }
  } catch (err) {
    flash('Arquivo inválido — não parece um backup do progresso.')
    return
  }
  const has = inv.keyrings.length || inv.digivices.length || inv.digimons.length
  if (has) {
    const ok = await confirm('Importar vai substituir todo o progresso atual. Continuar?', {
      title: 'Importar progresso', confirmLabel: 'Substituir'
    })
    if (!ok) return
  }
  replaceAll(data)
  flash('Progresso importado com sucesso.')
}
</script>

<template>
  <div class="backup">
    <div class="b-head">
      <h2>Backup do progresso</h2>
    </div>
    <p class="desc">
      Seu progresso fica salvo neste navegador. Exporte um arquivo para guardar como cópia
      de segurança ou levar para outro navegador/computador.
    </p>
    <div class="b-actions">
      <button class="btn" @click="exportData">
        <Icon name="inventory" :size="16" /> Exportar progresso
      </button>
      <button class="btn ghost" @click="pickFile">
        <Icon name="chevron" :size="16" /> Importar progresso
      </button>
      <input ref="fileInput" type="file" accept=".json,application/json" hidden @change="onFile">
    </div>
    <p v-if="feedback" class="feedback">{{ feedback }}</p>
  </div>
</template>

<style scoped>
.backup {
  margin-top: 20px; background: var(--panel);
  border: 1px solid var(--line); border-radius: 12px; padding: 18px;
}
.b-head h2 {
  font-family: 'Rajdhani', sans-serif; font-size: 18px;
  letter-spacing: 3px; text-transform: uppercase;
}
.desc { color: var(--muted); font-size: 13px; line-height: 1.6; margin: 10px 0 14px; max-width: 620px; }
.b-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent); color: #0b0e1a; font-weight: 700; border: none;
  border-radius: 8px; padding: 10px 16px; font-family: inherit; font-size: 13px;
  cursor: pointer; letter-spacing: .3px;
}
.btn:hover { filter: brightness(1.08); }
.btn.ghost { background: #0d122a; color: var(--text); border: 1px solid var(--line); }
.btn.ghost:hover { border-color: var(--muted); filter: none; }
.feedback { margin-top: 12px; color: var(--ok); font-size: 13px; }
</style>
