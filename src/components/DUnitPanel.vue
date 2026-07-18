<script setup>
import { ref } from 'vue'
import { useInventory } from '../composables/useInventory.js'
import { useConfirm } from '../composables/useConfirm.js'

const { inv, addDunit, removeDunit } = useInventory()
const { confirm } = useConfirm()

const name = ref('')

function onAdd() {
  const n = name.value.trim()
  if (!n) return
  addDunit(n)
  name.value = ''
}

async function onRemove(unit) {
  const ok = await confirm(`Remover o D-Unit "${unit.name}"?`)
  if (ok) removeDunit(unit.id)
}
</script>

<template>
  <div class="dunit">
    <div class="d-head">
      <h2>D-Unit</h2>
      <span class="d-count">{{ inv.dunits.length }}</span>
    </div>
    <p class="desc">
      Sua seleção de D-Units (inclui os que são combo de vários digimons). Adicione à vontade,
      sem limite.
    </p>

    <div class="add">
      <input v-model="name" class="in-name" placeholder="Nome do D-Unit" @keyup.enter="onAdd">
      <button class="btn" @click="onAdd">+ Adicionar</button>
    </div>

    <div class="list">
      <p v-if="!inv.dunits.length" class="empty">Nenhum D-Unit cadastrado ainda.</p>
      <template v-else>
        <span class="chip" v-for="u in inv.dunits" :key="u.id">
          {{ u.name }}
          <button class="x" title="remover" @click="onRemove(u)">×</button>
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.dunit {
  margin-top: 20px; background: var(--panel);
  border: 1px solid var(--line); border-radius: 12px; padding: 18px;
}
.d-head { display: flex; align-items: center; gap: 10px; }
.d-head h2 {
  font-family: 'Rajdhani', sans-serif; font-size: 18px;
  letter-spacing: 3px; text-transform: uppercase;
}
.d-count {
  font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 14px;
  color: #3fa9ff; background: rgba(63, 169, 255, .1);
  border: 1px solid rgba(63, 169, 255, .4); border-radius: 999px; padding: 2px 12px;
}
.desc { color: var(--muted); font-size: 13px; line-height: 1.6; margin: 10px 0 14px; max-width: 620px; }

.add { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.add input {
  background: #0d122a; color: var(--text); border: 1px solid var(--line);
  border-radius: 8px; padding: 9px 12px; font-family: inherit; font-size: 13px;
  width: 240px;
}
.btn {
  background: var(--accent); color: #0b0e1a; font-weight: 700; border: none;
  border-radius: 8px; padding: 10px 16px; font-family: inherit; font-size: 13px;
  cursor: pointer; letter-spacing: .3px;
}
.btn:hover { filter: brightness(1.08); }

.list { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px; }
.empty { color: var(--muted); font-size: 13px; }
.chip {
  display: inline-flex; align-items: center; gap: 8px;
  background: #0d122a; border: 1px solid var(--line); border-radius: 8px;
  padding: 6px 6px 6px 12px; font-size: 13px; font-weight: 600; color: var(--text);
}
.x {
  background: none; border: none; color: var(--muted); cursor: pointer;
  font-size: 16px; line-height: 1; padding: 2px 6px; border-radius: 5px;
}
.x:hover { color: #ff6a6a; background: rgba(255, 106, 106, .1); }
</style>
