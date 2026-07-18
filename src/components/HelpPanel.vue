<script setup>
import Icon from './Icon.vue'

// ---- CONTATO (edite aqui) ----
const EMAIL = 'mickael.naumann@gmail.com'

// FAQ — mantenha em dia sempre que uma funcionalidade maior mudar.
const faqs = [
  {
    q: 'O que é este site?',
    a: 'Um guia de progresso não-oficial de Digimon Masters Online. Ele ajuda a acompanhar o que você já tem — digimons, chaveiros +10, digivices e selos — e o que ainda falta, tudo salvo no seu navegador.'
  },
  {
    q: 'Aba Digimons — como funciona?',
    a: 'Os digimons ficam agrupados por rank. Use a busca para achar pelo nome e os filtros “Todos / Que tenho / Que faltam”. Clique num card para marcar/desmarcar que você possui aquele digimon (ao desmarcar, ele pede confirmação). No rodapé de cada card aparecem os ícones de chaveiro e digivice (apagados quando faltam) e o selo “Possuído”.'
  },
  {
    q: 'Aba Progresso — o que ela mostra?',
    a: 'Uma barra da sua coleção (X de Y digimons), a lista dos digimons que você possui — com indicação de quais já têm chaveiro e digivice — e o painel “Cobertura & próximos passos”, com barras de quantos digimons já estão cobertos por chaveiro/digivice e listas do que falta. Clique num item para ver quais digimons dependem dele. Você pode calcular sobre todos os digimons ou só os que possui.'
  },
  {
    q: 'Aba Selos — como marcar?',
    a: 'Os selos ficam agrupados por status (AT, HP, CT...). Em cada selo, escolha no seletor o nível que você já alcançou (Fechado → Normal → Bronze → Prata → Ouro → Platina → Mestre) — o valor e os totais recalculam na hora. No topo há a tabela de totais por status (seu total atual vs. o máximo possível). Use os filtros por status, a busca e o “Só os que tenho”.'
  },
  {
    q: 'Aba Inventário — para que serve?',
    a: 'É onde você cadastra os chaveiros +10 que possui e os digivices (por atributo + elemento). Isso alimenta os indicadores de cobertura nas outras abas. Aqui também fica o backup do seu progresso.'
  },
  {
    q: 'Meus dados somem quando o site atualiza?',
    a: 'Não. O progresso fica salvo no seu navegador (localStorage) e o deploy nunca apaga isso. Só lembre que cada endereço (localhost e o site publicado) guarda os dados separadamente. Para não perder nada — e migrar entre navegadores/computadores — use Exportar/Importar no Inventário.'
  },
  {
    q: 'Como faço backup do progresso?',
    a: 'Na aba Inventário, em “Backup do progresso”, clique em Exportar para baixar um arquivo .json com tudo. Para restaurar (ou levar para outro dispositivo), use Importar e selecione esse arquivo.'
  }
]
</script>

<template>
  <div class="help">
    <header class="hd">
      <h1>Ajuda <span>&amp; FAQ</span></h1>
      <p class="sub">Como usar o sistema e como falar comigo para sugestões e correções.</p>
    </header>

    <div class="faq">
      <details v-for="(f, i) in faqs" :key="i" class="item">
        <summary>
          <span>{{ f.q }}</span>
          <span class="chev"><Icon name="chevron" :size="18" /></span>
        </summary>
        <p>{{ f.a }}</p>
      </details>
    </div>

    <section class="contact">
      <h2>Contato</h2>
      <p class="c-desc">Encontrou um bug ou tem uma sugestão de melhoria? Fala comigo:</p>
      <div class="c-links">
        <a class="c-btn" :href="`mailto:${EMAIL}?subject=DMO%20Progresso%20-%20feedback`">
          <Icon name="mail" :size="18" /> {{ EMAIL }}
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.help { margin-top: 8px; }
.hd { margin-top: 20px; }
.hd h1 { font-size: clamp(22px, 4vw, 32px); font-weight: 700; }
.hd h1 span { color: var(--accent); }
.hd .sub { color: var(--muted); font-size: 14px; line-height: 1.6; margin-top: 8px; max-width: 680px; }

.faq { margin-top: 22px; display: flex; flex-direction: column; gap: 8px; }
.item {
  background: var(--panel); border: 1px solid var(--line); border-radius: 10px; overflow: hidden;
}
.item summary {
  list-style: none; cursor: pointer; padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
  font-weight: 600; font-size: 14px; color: var(--text); user-select: none;
}
.item summary::-webkit-details-marker { display: none; }
.item summary span:first-child { flex: 1; }
.chev { color: var(--muted); display: flex; transition: transform .2s; }
.item[open] .chev { transform: rotate(180deg); }
.item p {
  padding: 0 16px 16px; color: var(--muted); font-size: 13.5px; line-height: 1.7;
  border-top: 1px solid var(--line); padding-top: 12px; margin-top: 2px;
}

.contact {
  margin-top: 28px; background: var(--panel); border: 1px solid var(--line);
  border-radius: 12px; padding: 18px;
}
.contact h2 {
  font-family: 'Rajdhani', sans-serif; font-size: 18px; letter-spacing: 3px; text-transform: uppercase;
}
.c-desc { color: var(--muted); font-size: 13px; margin: 8px 0 14px; }
.c-links { display: flex; flex-wrap: wrap; gap: 10px; }
.c-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: #0d122a; border: 1px solid var(--line); border-radius: 8px;
  padding: 10px 14px; font-size: 13px; font-weight: 600; color: var(--text); text-decoration: none;
}
.c-btn:hover { border-color: var(--accent); }
.c-btn.discord:hover { border-color: #5865f2; }
.c-btn.ghost { color: var(--muted); cursor: default; }
.c-btn.ghost:hover { border-color: var(--line); }
</style>
