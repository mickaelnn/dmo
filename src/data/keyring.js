// Stats do Ghost Key Ring por nível (+0..+15) — fonte: dmowiki.com/Clothing
export const KEYRING_STATS = [
  { ht: 100, hp: 0, skill: 0 }, { ht: 150, hp: 0, skill: 0 }, { ht: 175, hp: 0, skill: 0 },
  { ht: 200, hp: 0, skill: 0 }, { ht: 225, hp: 0, skill: 0 }, { ht: 250, hp: 500, skill: 0 },
  { ht: 300, hp: 600, skill: 0 }, { ht: 350, hp: 700, skill: 0 }, { ht: 400, hp: 800, skill: 0 },
  { ht: 450, hp: 900, skill: 0 }, { ht: 500, hp: 1000, skill: 30 }, { ht: 550, hp: 1500, skill: 32 },
  { ht: 600, hp: 2000, skill: 35 }, { ht: 650, hp: 2500, skill: 37 }, { ht: 750, hp: 3000, skill: 40 },
  { ht: 1000, hp: 5000, skill: 50 }
]

export const KEYRING_LEVELS = KEYRING_STATS.map((_, i) => i) // 0..15

// texto de status para exibir no hover
export function krStatsText(level) {
  const s = KEYRING_STATS[level] || KEYRING_STATS[0]
  let t = `HT +${s.ht}, HP +${s.hp}`
  if (s.skill) t += `, Dano de Skill +${s.skill}%`
  return t
}
