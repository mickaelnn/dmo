<script setup>
import ModalDialog from './ModalDialog.vue'
import { useConfirm } from '../composables/useConfirm.js'

const { state, answer } = useConfirm()
</script>

<template>
  <ModalDialog v-if="state.open" :title="state.title" @close="answer(false)">
    <p class="msg">{{ state.message }}</p>
    <div class="actions">
      <button class="btn ghost" @click="answer(false)">{{ state.cancelLabel }}</button>
      <button class="btn danger" @click="answer(true)">{{ state.confirmLabel }}</button>
    </div>
  </ModalDialog>
</template>

<style scoped>
.msg { color: var(--text); font-size: 14px; line-height: 1.6; }
.actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn {
  border: 1px solid var(--line); border-radius: 8px; padding: 9px 18px;
  font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer; letter-spacing: .3px;
}
.btn.ghost { background: #0d122a; color: var(--muted); }
.btn.ghost:hover { color: var(--text); border-color: var(--muted); }
.btn.danger { background: #ff6a6a; color: #0b0e1a; border-color: #ff6a6a; }
.btn.danger:hover { filter: brightness(1.08); }
</style>
