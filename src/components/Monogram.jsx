import { basHarfler } from '../interfaces/basvuru'

/** Şirket baş harfleri: altın kabartma monogram. */
export default function Monogram({ ad, kucuk }) {
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden bg-[linear-gradient(145deg,#1d1810,#0d0d0c_60%)] ring-1 ring-altin/25 ${kucuk ? 'size-9 rounded-xl' : 'size-12 rounded-2xl'}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-altin-acik/60 to-transparent" />
      <span className={`altin-metin font-serif font-semibold ${kucuk ? 'text-sm' : 'text-lg'}`}>{basHarfler(ad)}</span>
    </div>
  )
}
