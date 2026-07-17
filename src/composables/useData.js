import { ref, computed } from 'vue'

const BASE = import.meta.env.BASE_URL // respeita vite base (ex.: './' ou '/dmo/')

/**
 * Resolve um caminho de asset vindo do data.json (ex.: "assets/digimon/x.png")
 * para uma URL que funciona em dev e em produção, considerando o base do Vite.
 */
export function assetUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return BASE + path.replace(/^\//, '')
}

const data = ref(null)
const status = ref('loading') // 'loading' | 'ready' | 'error'
const error = ref(null)

/**
 * Carrega o data.json uma única vez. Retorna refs reativos compartilhados.
 */
export function useData() {
  async function load() {
    status.value = 'loading'
    error.value = null
    try {
      const res = await fetch(BASE + 'data.json', { cache: 'no-store' })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      data.value = await res.json()
      status.value = 'ready'
    } catch (e) {
      error.value = e
      status.value = 'error'
    }
  }

  // Permite carregar manualmente um arquivo (drag & drop / seletor),
  // útil ao abrir via file:// onde o fetch é bloqueado.
  function loadFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          data.value = JSON.parse(reader.result)
          status.value = 'ready'
          resolve(data.value)
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsText(file)
    })
  }

  const config = computed(() => data.value?.config || {})
  const attributes = computed(() => data.value?.attributes || {})
  const elements = computed(() => data.value?.elements || {})
  const families = computed(() => data.value?.families || {})
  const digimons = computed(() => data.value?.digimons || {})
  const rankOrder = computed(() => data.value?.rankOrder || [])

  // Famílias e atributos efetivamente presentes nos digimons
  const availableFamilies = computed(() => {
    const fromDigi = new Set()
    Object.values(digimons.value).forEach(d => (d.families || []).forEach(f => fromDigi.add(f)))
    const known = Object.keys(families.value).filter(f => fromDigi.has(f))
    const extra = [...fromDigi].filter(f => !(f in families.value))
    return [...known, ...extra]
  })

  const availableAttributes = computed(() =>
    Object.keys(attributes.value).filter(a => attributes.value[a].label !== 'None')
  )

  // Elementos efetivamente presentes nos digimons
  const availableElements = computed(() => {
    const fromDigi = new Set()
    Object.values(digimons.value).forEach(d => { if (d.element) fromDigi.add(d.element) })
    const known = Object.keys(elements.value).filter(e => fromDigi.has(e))
    const extra = [...fromDigi].filter(e => !(e in elements.value))
    return [...known, ...extra]
  })

  return {
    data, status, error, load, loadFromFile,
    config, attributes, elements, families, digimons, rankOrder,
    availableFamilies, availableAttributes, availableElements
  }
}
