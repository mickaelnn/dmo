// Formata uma porcentagem com vírgula decimal (padrão BR). Ex.: "15.3" -> "15,3"
export function fmtPct(v) {
  if (v === '' || v == null) return ''
  return String(v).replace('.', ',')
}
