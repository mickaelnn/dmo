import { ref, computed } from 'vue'

const BASE = import.meta.env.BASE_URL

const data = ref(null)
const status = ref('idle') // 'idle' | 'loading' | 'ready' | 'error'

export function useSeals() {
  async function load() {
    if (status.value === 'ready' || status.value === 'loading') return
    status.value = 'loading'
    try {
      const res = await fetch(BASE + 'seals.json', { cache: 'no-store' })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      data.value = await res.json()
      status.value = 'ready'
    } catch (e) {
      status.value = 'error'
    }
  }

  const tiers = computed(() => data.value?.tiers || ['Fechado', 'Normal', 'Bronze', 'Prata', 'Ouro', 'Platina', 'Mestre'])
  const stats = computed(() => data.value?.stats || {})
  const seals = computed(() => data.value?.seals || [])

  // selos agrupados por status, na ordem dos stats
  const byStat = computed(() => {
    const groups = {}
    for (const s of seals.value) {
      const id = `${s.stat}|${s.name}`
      ;(groups[s.stat] = groups[s.stat] || []).push({ ...s, id })
    }
    return Object.keys(stats.value)
      .filter(st => groups[st])
      .map(st => ({ stat: st, meta: stats.value[st], seals: groups[st] }))
  })

  return { status, load, tiers, stats, seals, byStat }
}
