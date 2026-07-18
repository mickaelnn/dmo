import { reactive, watch } from 'vue'

const STORAGE_KEY = 'dmo_inv'

function loadInv() {
  let o = {}
  try {
    o = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch (e) { /* ignora storage corrompido */ }
  const seals = (o.seals && typeof o.seals === 'object' && !Array.isArray(o.seals)) ? o.seals : {}
  return {
    keyrings: Array.isArray(o.keyrings) ? o.keyrings : [],
    digivices: Array.isArray(o.digivices) ? o.digivices : [],
    digimons: Array.isArray(o.digimons) ? o.digimons : [],
    seals // mapa sealId -> nível atual (0..6)
  }
}

// Estado único compartilhado por toda a aplicação
const inv = reactive(loadInv())

// Persiste automaticamente a cada mudança
watch(inv, () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inv))
  } catch (e) { /* storage indisponível */ }
}, { deep: true })

export function useInventory() {
  function toggleKeyring(fam) {
    const i = inv.keyrings.indexOf(fam)
    if (i >= 0) inv.keyrings.splice(i, 1)
    else inv.keyrings.push(fam)
  }

  // Um digivice é identificado por atributo + elemento
  function addDigivice(attr, elem) {
    const key = `${attr}|${elem}`
    if (!inv.digivices.includes(key)) inv.digivices.push(key)
  }

  function removeDigivice(key) {
    inv.digivices = inv.digivices.filter(d => d !== key)
  }

  function toggleDigimon(name) {
    const i = inv.digimons.indexOf(name)
    if (i >= 0) inv.digimons.splice(i, 1)
    else inv.digimons.push(name)
  }

  function hasKeyring(fam) { return inv.keyrings.includes(fam) }
  function hasDigivice(attr, elem) { return inv.digivices.includes(`${attr}|${elem}`) }
  function ownsDigimon(name) { return inv.digimons.includes(name) }

  // ---- Selos (nível por selo: 0=Fechado .. 6=Mestre) ----
  function getSealTier(sealId) { return inv.seals[sealId] || 0 }
  function setSealTier(sealId, tier) {
    if (tier > 0) inv.seals[sealId] = tier
    else delete inv.seals[sealId] // 0 = não guarda (mantém o mapa enxuto)
  }

  // cópia dos dados atuais (para exportar backup)
  function snapshot() {
    return {
      keyrings: [...inv.keyrings],
      digivices: [...inv.digivices],
      digimons: [...inv.digimons],
      seals: { ...inv.seals }
    }
  }

  // substitui todo o inventário (para importar backup)
  function replaceAll(data) {
    inv.keyrings = Array.isArray(data?.keyrings) ? data.keyrings : []
    inv.digivices = Array.isArray(data?.digivices) ? data.digivices : []
    inv.digimons = Array.isArray(data?.digimons) ? data.digimons : []
    inv.seals = (data?.seals && typeof data.seals === 'object' && !Array.isArray(data.seals)) ? data.seals : {}
  }

  return {
    inv,
    toggleKeyring, addDigivice, removeDigivice, toggleDigimon,
    hasKeyring, hasDigivice, ownsDigimon,
    getSealTier, setSealTier,
    snapshot, replaceAll
  }
}
