/**
 * Bir başvurunun veri yapısı (arayüz tanımı).
 * @typedef {Object} Basvuru
 * @property {string} id
 * @property {string} sirket
 * @property {string} pozisyon
 * @property {'Staj'|'Tam Zamanlı'|'Yarı Zamanlı'} tur
 * @property {'Hazırlanıyor'|'Başvuruldu'|'Mülakat'|'Teklif'|'Reddedildi'} durum
 * @property {string} tarih      ISO tarih (YYYY-MM-DD)
 * @property {string} baglanti   İlan bağlantısı (isteğe bağlı)
 * @property {string} not        Kısa not (isteğe bağlı)
 */

export const DURUMLAR = ['Hazırlanıyor', 'Başvuruldu', 'Mülakat', 'Teklif', 'Reddedildi']
export const TURLER = ['Staj', 'Tam Zamanlı', 'Yarı Zamanlı']

export const DURUM_RENKLERI = {
  Hazırlanıyor: 'bg-slate-100 text-slate-700 ring-slate-200',
  Başvuruldu: 'bg-blue-50 text-blue-700 ring-blue-200',
  Mülakat: 'bg-amber-50 text-amber-700 ring-amber-200',
  Teklif: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Reddedildi: 'bg-rose-50 text-rose-700 ring-rose-200',
}

/** @returns {Omit<Basvuru,'id'>} */
export const bosBasvuru = () => ({
  sirket: '',
  pozisyon: '',
  tur: 'Staj',
  durum: 'Başvuruldu',
  tarih: new Date().toISOString().slice(0, 10),
  baglanti: '',
  not: '',
})

/** İlk açılışta gösterilen örnek kayıtlar (kurgusal şirketler). */
export const ORNEK_BASVURULAR = [
  { id: 'o1', sirket: 'Anka Yazılım', pozisyon: 'Yapay Zeka Stajyeri', tur: 'Staj', durum: 'Mülakat', tarih: '2026-09-22', baglanti: '', not: 'Teknik mülakat 8 Ekim 14:00' },
  { id: 'o2', sirket: 'Mavi Bulut Teknoloji', pozisyon: 'Backend Geliştirici (Python)', tur: 'Tam Zamanlı', durum: 'Başvuruldu', tarih: '2026-09-28', baglanti: '', not: 'FastAPI ve Docker deneyimi isteniyor' },
  { id: 'o3', sirket: 'Kuzey Veri Analitiği', pozisyon: 'Veri Bilimi Stajyeri', tur: 'Staj', durum: 'Teklif', tarih: '2026-09-10', baglanti: '', not: 'Teklif 15 Ekim\'e kadar geçerli' },
  { id: 'o4', sirket: 'Atlas Savunma Sistemleri', pozisyon: 'Yazılım Mühendisi Adayı', tur: 'Tam Zamanlı', durum: 'Hazırlanıyor', tarih: '2026-10-04', baglanti: '', not: 'Motivasyon mektubu hazırlanacak' },
  { id: 'o5', sirket: 'Pera Fintech', pozisyon: 'Frontend Stajyeri', tur: 'Yarı Zamanlı', durum: 'Reddedildi', tarih: '2026-09-05', baglanti: '', not: '' },
]
