<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer>
    <p class="note">
      Inventário salvo neste navegador. Clique num card para marcar que possui o digimon;
      use o painel acima para chaveiros e digivices. Os dados vêm de <code>data.json</code>.
    </p>

    <div class="portfolio">
      <div class="who">
        <span class="by">Projeto de</span>
        <strong>Mickael</strong>
      </div>
      <div class="stack">
        <span class="tag">Vue 3</span>
        <span class="tag">Vite</span>
        <span class="tag">Composition API</span>
        <span class="tag">localStorage</span>
      </div>
      <div class="meta">© {{ year }} · Fan project não-oficial de Digimon Masters Online</div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  margin-top: 56px; color: var(--muted); font-size: 12px; line-height: 1.7;
  border-top: 1px solid var(--line); padding-top: 16px;
}
.note code {
  background: #0b0e1a; border: 1px solid var(--line);
  border-radius: 5px; padding: 2px 7px; color: var(--accent);
}
.portfolio {
  margin-top: 18px; display: flex; flex-wrap: wrap; align-items: center;
  gap: 12px 18px;
}
.who { display: flex; align-items: baseline; gap: 8px; }
.who .by { text-transform: uppercase; letter-spacing: 2px; font-size: 11px; }
.who strong {
  color: var(--text); font-family: 'Rajdhani', sans-serif;
  font-size: 18px; letter-spacing: 1px;
}
.stack { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  border: 1px solid var(--line); background: var(--panel);
  border-radius: 999px; padding: 4px 11px; font-size: 11px; font-weight: 600;
  color: var(--text);
}
.meta { margin-left: auto; font-size: 11px; }
@media (max-width: 560px) { .meta { margin-left: 0; } }
</style>
