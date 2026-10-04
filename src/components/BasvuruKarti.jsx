import { DURUMLAR } from '../interfaces/basvuru'
import DurumRozeti from './DurumRozeti'

const tarihYaz = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
const gunOnce = (iso) => Math.floor((Date.now() - new Date(iso + 'T00:00:00')) / 86400000)

export default function BasvuruKarti({ basvuru, onDuzenle, onSil, onDurumDegistir }) {
  const bekleyen = basvuru.durum === 'Başvuruldu' && gunOnce(basvuru.tarih) >= 14

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lacivert">{basvuru.pozisyon}</h3>
          <p className="text-sm text-slate-600">{basvuru.sirket} · {basvuru.tur}</p>
        </div>
        <DurumRozeti durum={basvuru.durum} />
      </div>
      <p className="text-xs text-slate-500">Başvuru: {tarihYaz(basvuru.tarih)}</p>
      {basvuru.not && <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{basvuru.not}</p>}
      {bekleyen && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {gunOnce(basvuru.tarih)} gündür yanıt yok. Takip e-postası göndermeyi düşünebilirsin.
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <select
          aria-label="Durumu güncelle"
          value={basvuru.durum}
          onChange={(e) => onDurumDegistir(basvuru.id, e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
        >
          {DURUMLAR.map((d) => <option key={d}>{d}</option>)}
        </select>
        {basvuru.baglanti && (
          <a href={basvuru.baglanti} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-700 hover:underline">
            İlan ↗
          </a>
        )}
        <div className="ml-auto flex gap-1">
          <button onClick={() => onDuzenle(basvuru)} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-lacivert hover:bg-slate-100">
            Düzenle
          </button>
          <button onClick={() => onSil(basvuru)} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50">
            Sil
          </button>
        </div>
      </div>
    </article>
  )
}
