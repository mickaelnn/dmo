import { ref, computed } from 'vue'

const BASE = import.meta.env.BASE_URL

const data = ref(null)
const status = ref('idle')

export function useDigivices() {
  async function load() {
    if (status.value === 'ready' || status.value === 'loading') return
    status.value = 'loading'
    try {
      const res = await fetch(BASE + 'digivices.json', { cache: 'no-store' })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      data.value = await res.json()
      status.value = 'ready'
    } catch (e) {
      status.value = 'error'
    }
  }

  const list = computed(() => data.value?.digivices || [])
  const byId = computed(() => {
    const m = {}
    for (const d of list.value) m[d.id] = d
    return m
  })

  return { status, load, list, byId }
}
