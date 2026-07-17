import { reactive } from 'vue'

// Estado global de um diálogo de confirmação (singleton).
const state = reactive({
  open: false,
  title: 'Confirmar',
  message: '',
  confirmLabel: 'Remover',
  cancelLabel: 'Cancelar',
  _resolve: null
})

export function useConfirm() {
  /**
   * Abre o diálogo e resolve para true (confirmou) ou false (cancelou).
   * @returns {Promise<boolean>}
   */
  function confirm(message, opts = {}) {
    state.open = true
    state.message = message
    state.title = opts.title || 'Confirmar remoção'
    state.confirmLabel = opts.confirmLabel || 'Remover'
    state.cancelLabel = opts.cancelLabel || 'Cancelar'
    return new Promise(resolve => { state._resolve = resolve })
  }

  function answer(value) {
    state.open = false
    if (state._resolve) state._resolve(value)
    state._resolve = null
  }

  return { state, confirm, answer }
}
