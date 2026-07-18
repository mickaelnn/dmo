import { reactive, watch } from 'vue'

const STORAGE_KEY = 'dmo_inv'

function loadInv() {
  let o = {}
  try {
    o = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch (e) { /* ignora storage corrompido */ }

  const seals = (o.seals && typeof o.seals === 'object' && !Array.isArray(o.seals)) ? o.seals : {}

  // keyrings agora é um mapa { família: nível(0..15) }.
  // Migração: se vier no formato antigo (array de famílias), assume nível +10.
  let keyrings = {}
  if (Array.isArray(o.keyrings)) {
    o.keyrings.forEach(f => { keyrings[f] = 10 })
  } else if (o.keyrings && typeof o.keyrings === 'object') {
    keyrings = o.keyrings
  }

  // digivices agora é uma coleção de itens { id, type, note }.
  // Descarta o formato antigo (strings "attr|elem").
  const digivices = Array.isArray(o.digivices)
    ? o.digivices.filter(d => d && typeof d === 'object' && d.type)
    : []

  return {
    keyrings,
    digivices,
    digimons: Array.isArray(o.digimons) ? o.digimons : [],
    seals // mapa sealId -> nível atual (0..6)
  }
}

let _id = 0
function uid() { return `${Date.now().toString(36)}${(_id++).toString(36)}` }

// Estado único compartilhado por toda a aplicação
const inv = reactive(loadInv())

// Persiste automaticamente a cada mudança
watch(inv, () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inv))
  } catch (e) { /* storage indisponível */ }
}, { deep: true })

export function useInventory() {
  // ---- Chaveiro Ghost (por família, nível 0..15) ----
  function setKeyring(fam, level) { inv.keyrings[fam] = level }
  function removeKeyring(fam) { delete inv.keyrings[fam] }
  function hasKeyring(fam) { return fam in inv.keyrings }
  function keyringLevel(fam) { return fam in inv.keyrings ? inv.keyrings[fam] : null }

  // melhor chaveiro entre as famílias de um digimon (maior nível)
  function bestKeyring(families) {
    let best = null
    for (const f of (families || [])) {
      if (f in inv.keyrings) {
        const lvl = inv.keyrings[f]
        if (!best || lvl > best.level) best = { family: f, level: lvl }
      }
    }
    return best
  }

  // ---- Digivices (coleção de itens do usuário) ----
  // type = id do catálogo (digivices.json); attr/elem selecionados; attrPct/elemPct = % opcionais
  function addDigivice({ type, attr = '', elem = '', attrPct = '', elemPct = '' }) {
    inv.digivices.push({
      id: uid(), type,
      attr, elem,
      attrPct: String(attrPct).trim(),
      elemPct: String(elemPct).trim()
    })
  }
  function removeDigivice(id) {
    inv.digivices = inv.digivices.filter(d => d.id !== id)
  }
  // possui algum digivice que casa com o atributo + elemento do digimon?
  function hasDigivice(attr, elem) {
    return inv.digivices.some(d => d.attr === attr && d.elem === elem)
  }
  // retorna o digivice possuído que casa e é o mais forte (ou null).
  // força = % de atributo valendo o dobro da % de elemento.
  function matchingDigivice(attr, elem) {
    const matches = inv.digivices.filter(d => d.attr === attr && d.elem === elem)
    if (!matches.length) return null
    const score = d => (parseFloat(d.attrPct) || 0) * 2 + (parseFloat(d.elemPct) || 0)
    return matches.reduce((best, d) => (score(d) > score(best) ? d : best))
  }

  // ---- Digimons possuídos ----
  function toggleDigimon(name) {
    const i = inv.digimons.indexOf(name)
    if (i >= 0) inv.digimons.splice(i, 1)
    else inv.digimons.push(name)
  }
  function ownsDigimon(name) { return inv.digimons.includes(name) }

  // ---- Selos (nível por selo: 0=Fechado .. 6=Mestre) ----
  function getSealTier(sealId) { return inv.seals[sealId] || 0 }
  function setSealTier(sealId, tier) {
    if (tier > 0) inv.seals[sealId] = tier
    else delete inv.seals[sealId]
  }

  // cópia dos dados atuais (para exportar backup)
  function snapshot() {
    return {
      keyrings: { ...inv.keyrings },
      digivices: [...inv.digivices],
      digimons: [...inv.digimons],
      seals: { ...inv.seals }
    }
  }

  // substitui todo o inventário (para importar backup)
  function replaceAll(data) {
    const kr = data?.keyrings
    if (Array.isArray(kr)) {
      const m = {}; kr.forEach(f => { m[f] = 10 }); inv.keyrings = m
    } else {
      inv.keyrings = (kr && typeof kr === 'object') ? kr : {}
    }
    inv.digivices = Array.isArray(data?.digivices)
      ? data.digivices.filter(d => d && typeof d === 'object' && d.type) : []
    inv.digimons = Array.isArray(data?.digimons) ? data.digimons : []
    inv.seals = (data?.seals && typeof data.seals === 'object' && !Array.isArray(data.seals)) ? data.seals : {}
  }

  return {
    inv,
    setKeyring, removeKeyring, hasKeyring, keyringLevel, bestKeyring,
    addDigivice, removeDigivice, hasDigivice, matchingDigivice,
    toggleDigimon, ownsDigimon,
    getSealTier, setSealTier,
    snapshot, replaceAll
  }
}
