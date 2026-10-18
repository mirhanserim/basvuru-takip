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

/** @typedef {'pano'|'kanban'|'analiz'} Gorunum */

export const DURUMLAR = ['Hazırlanıyor', 'Başvuruldu', 'Mülakat', 'Teklif', 'Reddedildi']
export const TURLER = ['Staj', 'Tam Zamanlı', 'Yarı Zamanlı']

/** Her durumun rengi ve rozet sınıfları (Quantrophic sıcak paleti). */
export const DURUM_META = {
  Hazırlanıyor: { renk: '#a9a59c', aciklama: 'Belgeler hazırlanıyor', rozet: 'bg-[#a9a59c]/10 text-[#c8c5be] ring-[#a9a59c]/25' },
  Başvuruldu: { renk: '#8fb4e3', aciklama: 'Yanıt bekleniyor', rozet: 'bg-[#8fb4e3]/10 text-[#b9d0ee] ring-[#8fb4e3]/30' },
  Mülakat: { renk: '#e7cda0', aciklama: 'Görüşme aşamasında', rozet: 'bg-[#e7cda0]/10 text-[#f0dab0] ring-[#e7cda0]/35' },
  Teklif: { renk: '#86d3a0', aciklama: 'Teklif alındı', rozet: 'bg-[#86d3a0]/10 text-[#b5e6c4] ring-[#86d3a0]/30' },
  Reddedildi: { renk: '#e2877c', aciklama: 'Olumsuz sonuçlandı', rozet: 'bg-[#e2877c]/10 text-[#efb2aa] ring-[#e2877c]/30' },
}

export const SIRALAMALAR = [
  { id: 'yeni', ad: 'En yeni' },
  { id: 'eski', ad: 'En eski' },
  { id: 'sirket', ad: 'Şirket (A–Z)' },
]

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

/** Bir ISO tarihten bugüne geçen gün sayısı. */
export const gunOnce = (iso) => Math.floor((Date.now() - new Date(iso + 'T00:00:00')) / 86400000)

/** ISO tarihi "4 Eki 2026" biçiminde yazar. */
export const tarihYaz = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })

/** Şirket adının ilk iki kelimesinin baş harfleri ("Anka Yazılım" → "AY"). */
export const basHarfler = (ad) => ad.split(/\s+/).filter(Boolean).slice(0, 2).map((k) => k[0]).join('').toLocaleUpperCase('tr')

/** Takip e-postası önerisi için bekleme eşiği (gün). */
export const TAKIP_ESIGI = 14

/** İlk açılışta gösterilen örnek kayıtlar (kurgusal şirketler). */
export const ORNEK_BASVURULAR = [
  { id: 'o1', sirket: 'Anka Yazılım', pozisyon: 'Yapay Zeka Stajyeri', tur: 'Staj', durum: 'Mülakat', tarih: '2026-09-22', baglanti: '', not: 'Teknik mülakat 8 Ekim 14:00' },
  { id: 'o2', sirket: 'Mavi Bulut Teknoloji', pozisyon: 'Backend Geliştirici (Python)', tur: 'Tam Zamanlı', durum: 'Başvuruldu', tarih: '2026-09-28', baglanti: '', not: 'FastAPI ve Docker deneyimi isteniyor' },
  { id: 'o3', sirket: 'Kuzey Veri Analitiği', pozisyon: 'Veri Bilimi Stajyeri', tur: 'Staj', durum: 'Teklif', tarih: '2026-09-10', baglanti: '', not: 'Teklif 15 Ekim\'e kadar geçerli' },
  { id: 'o4', sirket: 'Atlas Savunma Sistemleri', pozisyon: 'Yazılım Mühendisi Adayı', tur: 'Tam Zamanlı', durum: 'Hazırlanıyor', tarih: '2026-10-04', baglanti: '', not: 'Motivasyon mektubu hazırlanacak' },
  { id: 'o5', sirket: 'Pera Fintech', pozisyon: 'Frontend Stajyeri', tur: 'Yarı Zamanlı', durum: 'Reddedildi', tarih: '2026-09-05', baglanti: '', not: '' },
  { id: 'o6', sirket: 'Lidya Robotik', pozisyon: 'Görüntü İşleme Stajyeri', tur: 'Staj', durum: 'Başvuruldu', tarih: '2026-10-09', baglanti: '', not: 'OpenCV ve PyTorch portfolyosu gönderildi' },
  { id: 'o7', sirket: 'Ege Enerji Analitik', pozisyon: 'Zaman Serisi Analisti', tur: 'Yarı Zamanlı', durum: 'Mülakat', tarih: '2026-09-30', baglanti: '', not: 'LSTM/GRU projesi soruldu, vaka çalışması bekleniyor' },
  { id: 'o8', sirket: 'Kapadokya Yazılım', pozisyon: 'Full-Stack Stajyer', tur: 'Staj', durum: 'Reddedildi', tarih: '2026-08-27', baglanti: '', not: '' },
]
