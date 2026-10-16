const ALANLAR = [
  ['sirket', 'Şirket'],
  ['pozisyon', 'Pozisyon'],
  ['tur', 'Tür'],
  ['durum', 'Durum'],
  ['tarih', 'Başvuru tarihi'],
  ['baglanti', 'İlan bağlantısı'],
  ['not', 'Not'],
]

const hucre = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`

/** Başvuruları Excel'in Türkçe karakterleri doğru açtığı (BOM'lu) CSV olarak indirir. */
export function csvIndir(basvurular) {
  const satirlar = [ALANLAR.map(([, b]) => hucre(b)).join(';'), ...basvurular.map((b) => ALANLAR.map(([a]) => hucre(b[a])).join(';'))]
  const blob = new Blob(['﻿' + satirlar.join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: `basvurular-${new Date().toISOString().slice(0, 10)}.csv` })
  document.body.append(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
