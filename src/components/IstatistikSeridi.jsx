import { DURUMLAR } from '../interfaces/basvuru'

export default function IstatistikSeridi({ basvurular, secili, onSec }) {
  const sayac = (d) => basvurular.filter((b) => b.durum === d).length
  const kutular = [{ ad: 'Tümü', sayi: basvurular.length }, ...DURUMLAR.map((d) => ({ ad: d, sayi: sayac(d) }))]

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {kutular.map(({ ad, sayi }) => {
        const aktif = secili === ad
        return (
          <button
            key={ad}
            onClick={() => onSec(ad)}
            className={`rounded-xl border px-3 py-3 text-left transition ${
              aktif ? 'border-lacivert bg-lacivert text-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`text-2xl font-bold ${aktif ? 'text-white' : 'text-lacivert'}`}>{sayi}</div>
            <div className={`text-xs ${aktif ? 'text-slate-200' : 'text-slate-500'}`}>{ad}</div>
          </button>
        )
      })}
    </div>
  )
}
