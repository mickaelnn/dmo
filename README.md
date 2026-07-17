# Guia de Chaveiros — DMO

App em **Vue 3 + Vite** para visualizar os Digimon do *Digimon Masters Online*, agrupados por
família e rank, com um inventário pessoal (chaveiros +10, digivices e digimons que você possui)
salvo no navegador.

Projeto de portfólio de **Mickael**.

## Rodando localmente

```bash
npm install     # instala as dependências
npm run dev      # servidor de desenvolvimento (http://localhost:5173)
npm run build    # gera a versão de produção em dist/
npm run preview  # serve o build de produção localmente
```

> **Primeira vez nesta pasta:** apague a pasta `node_modules` antes de rodar `npm install`.
> Ela foi criada num ambiente Linux durante a migração e está incompleta/incompatível com o Windows.

## Estrutura

```
index.html                 entry do Vite
vite.config.js             config (base: './' para funcionar em subpastas)
public/
  data.json                base de dados dos Digimon (fonte única de verdade)
  assets/                  ícones (digimon, atributos, elementos, famílias)
src/
  main.js                  bootstrap da aplicação
  App.vue                  orquestra os componentes e a lógica de agrupamento/filtro
  styles/global.css        tema e variáveis de cor
  composables/
    useData.js             carrega o data.json + helper assetUrl()
    useInventory.js        estado do inventário + persistência em localStorage
  components/
    AppHeader.vue          cabeçalho (título/subtítulo)
    LegendBar.vue          legenda de atributos
    InventoryPanel.vue     painel de inventário (chaveiros + digivices)
    FilterBar.vue          filtro Todos / Que tenho / Que faltam
    SearchBox.vue          busca por nome
    ProgressBar.vue        contador de progresso (X/total coletados)
    FamilySection.vue      seção de uma família com grupos de rank
    DigimonCard.vue        card individual do Digimon
    StatBadge.vue          badge de atributo/elemento
    AssetImage.vue         imagem com fallback (some ou mostra placeholder)
    PortfolioFooter.vue    rodapé de portfólio
    DataLoader.vue         carregamento manual do JSON (fallback file://)
```

## Editando os dados

Edite **`public/data.json`**. Cada Digimon declara `image`, `attribute`, `element`, `rank`
e `families`; as seções e os "chaveiros" são montados automaticamente a partir disso.
