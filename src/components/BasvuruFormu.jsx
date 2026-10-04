import { useState } from 'react'
import { DURUMLAR, TURLER, bosBasvuru } from '../interfaces/basvuru'

const girdi = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-lacivert focus:ring-2 focus:ring-lacivert/15'
const etiket = 'mb-1 block text-xs font-semibold text-slate-600'

/** Hem ekleme hem güncelleme için kullanılan form. */
export default function BasvuruFormu({ baslangic, onKaydet, onIptal }) {
  const [form, setForm] = useState(baslangic ?? bosBasvuru())
  const [hata, setHata] = useState('')
  const duzenleme = Boolean(baslangic)
  const degistir = (alan) => (e) => setForm({ ...form, [alan]: e.target.value })

  const gonder = (e) => {
    e.preventDefault()
    if (!form.sirket.trim() || !form.pozisyon.trim()) {
      setHata('Şirket ve pozisyon alanları zorunludur.')
      return
    }
    onKaydet({ ...form, sirket: form.sirket.trim(), pozisyon: form.pozisyon.trim() })
    if (!duzenleme) setForm(bosBasvuru())
    setHata('')
  }

  return (
    <form onSubmit={gonder} className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className={etiket}>Şirket *</label>
        <input className={girdi} value={form.sirket} onChange={degistir('sirket')} placeholder="Örn. Anka Yazılım" />
      </div>
      <div>
        <label className={etiket}>Pozisyon *</label>
        <input className={girdi} value={form.pozisyon} onChange={degistir('pozisyon')} placeholder="Örn. Yapay Zeka Stajyeri" />
      </div>
      <div>
        <label className={etiket}>Tür</label>
        <select className={girdi} value={form.tur} onChange={degistir('tur')}>
          {TURLER.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className={etiket}>Durum</label>
        <select className={girdi} value={form.durum} onChange={degistir('durum')}>
          {DURUMLAR.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className={etiket}>Başvuru tarihi</label>
        <input type="date" className={girdi} value={form.tarih} onChange={degistir('tarih')} />
      </div>
      <div>
        <label className={etiket}>İlan bağlantısı</label>
        <input className={girdi} value={form.baglanti} onChange={degistir('baglanti')} placeholder="https://..." />
      </div>
      <div className="sm:col-span-2">
        <label className={etiket}>Not</label>
        <textarea rows={2} className={girdi} value={form.not} onChange={degistir('not')} placeholder="Mülakat tarihi, istenen beceriler..." />
      </div>
      {hata && <p className="text-sm text-rose-600 sm:col-span-2">{hata}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <button type="submit" className="rounded-lg bg-lacivert px-4 py-2 text-sm font-semibold text-white hover:bg-lacivert/90">
          {duzenleme ? 'Değişiklikleri kaydet' : 'Başvuru ekle'}
        </button>
        {onIptal && (
          <button type="button" onClick={onIptal} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Vazgeç
          </button>
        )}
      </div>
    </form>
  )
}
