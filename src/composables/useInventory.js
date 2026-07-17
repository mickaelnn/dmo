import { reactive, watch } from 'vue'

const STORAGE_KEY = 'dmo_inv'

function loadInv() {
  let o = {}
  try {
    o = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch (e) { /* ignora storage corrompido */ }
  return {
    keyrings: Array.isArray(o.keyrings) ? o.keyrings : [],
    digivices: Array.isArray(o.digivices) ? o.digivices : [],
    digimons: Array.isArray(o.digimons) ? o.digimons : []
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

  return {
    inv,
    toggleKeyring, addDigivice, removeDigivice, toggleDigimon,
    hasKeyring, hasDigivice, ownsDigimon
  }
}
