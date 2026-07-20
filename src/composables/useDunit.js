import { ref, computed } from 'vue'

const BASE = import.meta.env.BASE_URL

const data = ref(null)
const status = ref('idle')

// nível-alvo (máx) a partir do rank da linha
export function maxLevelForRank(rank) {
  if (rank === 'U') return 160
  if (typeof rank === 'string' && rank.toUpperCase().startsWith('SSS')) return 150
  return 140
}

export function useDunit() {
  async function load() {
    if (status.value === 'ready' || status.value === 'loading') return
    status.value = 'loading'
    try {
      const res = await fetch(BASE + 'dunit.json', { cache: 'no-store' })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      data.value = await res.json()
      status.value = 'ready'
    } catch (e) {
      status.value = 'error'
    }
  }

  const packs = computed(() => data.value?.packs || [])
  const lines = computed(() => data.value?.lines || [])

  const lineById = computed(() => {
    const m = {}
    for (const l of lines.value) m[l.id] = { ...l, maxLevel: maxLevelForRank(l.rank) }
    return m
  })

  // digi-ovos (linhas) para o filtro
  const eggOptions = computed(() =>
    lines.value
      .map(l => ({ value: l.id, label: l.name }))
      .sort((a, b) => a.label.localeCompare(b.label))
  )

  // status/bônus distintos para o filtro
  const stats = computed(() => {
    const set = new Set()
    packs.value.forEach(p => (p.brackets || []).forEach(b => { if (b.stat) set.add(b.stat) }))
    return [...set].sort((a, b) => a.localeCompare(b))
  })

  return { status, load, packs, lines, lineById, eggOptions, stats }
}
