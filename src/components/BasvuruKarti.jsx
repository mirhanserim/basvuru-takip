import { BellRing, CalendarDays, ChevronDown, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { forwardRef, useRef } from 'react'
import { DURUMLAR, DURUM_META, TAKIP_ESIGI, gunOnce, tarihYaz } from '../interfaces/basvuru'
import DurumRozeti from './DurumRozeti'
import Monogram from './Monogram'

const goreli = (g) =>
  g < 0 ? 'planlandı' : g === 0 ? 'bugün' : g === 1 ? 'dün' : g < 7 ? `${g} gün önce` : g < 30 ? `${Math.floor(g / 7)} hafta önce` : `${Math.floor(g / 30)} ay önce`

const BasvuruKarti = forwardRef(function BasvuruKarti({ basvuru, onDuzenle, onSil, onDurumDegistir }, disRef) {
  const ic = useRef(null)
  const gun = gunOnce(basvuru.tarih)
  const bekleyen = basvuru.durum === 'Başvuruldu' && gun >= TAKIP_ESIGI
  const renk = DURUM_META[basvuru.durum].renk

  // İmleci takip eden yumuşak altın ışık
  const isikla = (e) => {
    const r = ic.current.getBoundingClientRect()
    ic.current.style.setProperty('--x', `${e.clientX - r.left}px`)
    ic.current.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <motion.article
      ref={disRef}
      layout
      initial={{ opacity: 0, y: 26, scale: 0.97, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.92, filter: 'blur(10px)', transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 240, damping: 28 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div
        ref={ic}
        onMouseMove={isikla}
        className="yuzey isin-kenar relative flex h-full flex-col gap-4 overflow-hidden rounded-[24px] p-5 transition-shadow duration-500 hover:shadow-[0_40px_80px_-40px_rgb(205_164_104/0.35)]"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(420px circle at var(--x) var(--y), rgb(205 164 104 / 0.09), transparent 45%)' }}
        />
        <div className="absolute left-5 top-0 h-px w-16" style={{ background: `linear-gradient(90deg, ${renk}, transparent)` }} />

        <div className="relative flex items-start gap-3.5">
          <Monogram ad={basvuru.sirket} />
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-metin">{basvuru.pozisyon}</h3>
            <p className="mt-1 text-[13px] text-soluk">
              {basvuru.sirket} <span className="text-sonuk">·</span> {basvuru.tur}
            </p>
          </div>
        </div>

        <div className="relative flex items-center gap-1.5 font-mono text-[11px] text-sonuk" title={tarihYaz(basvuru.tarih)}>
          <CalendarDays size={12} />
          <span className="whitespace-nowrap">{tarihYaz(basvuru.tarih)}</span>
          <span>·</span>
          <span className="whitespace-nowrap text-soluk">{goreli(gun)}</span>
          <span className="ml-auto pl-2 font-sans"><DurumRozeti durum={basvuru.durum} /></span>
        </div>

        {basvuru.not && (
          <p className="relative border-l border-altin/30 pl-3.5 text-[13px] leading-relaxed text-[#c8c5be]">{basvuru.not}</p>
        )}

        {bekleyen && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex items-start gap-2.5 rounded-2xl bg-altin/[0.06] px-3.5 py-2.5 text-xs leading-relaxed text-altin-soluk ring-1 ring-altin/20"
          >
            <BellRing size={14} className="mt-0.5 shrink-0 animate-[wiggle_1.2s_ease-in-out_infinite]" />
            <span><b className="font-semibold text-altin-acik">{gun} gündür</b> yanıt yok. Takip e-postası göndermeyi düşünebilirsin.</span>
          </motion.p>
        )}

        <div className="relative mt-auto flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
          <div className="relative">
            <select
              aria-label="Durumu güncelle"
              value={basvuru.durum}
              onChange={(e) => onDurumDegistir(basvuru.id, e.target.value)}
              className="cursor-pointer appearance-none rounded-full bg-white/[0.03] py-1.5 pl-3.5 pr-8 text-xs font-medium text-metin ring-1 ring-white/10 outline-none transition hover:ring-altin/40 focus:ring-altin/60"
            >
              {DURUMLAR.map((d) => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-sonuk" />
          </div>
          {basvuru.baglanti && (
            <a href={basvuru.baglanti} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-altin-soluk hover:bg-altin/10">
              İlan <ExternalLink size={12} />
            </a>
          )}
          <div className="ml-auto flex gap-0.5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onDuzenle(basvuru)}
              aria-label="Düzenle"
              title="Düzenle"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-soluk hover:bg-white/[0.05] hover:text-metin"
            >
              <Pencil size={13} /> Düzenle
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onSil(basvuru)}
              aria-label="Sil"
              title="Sil"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[#e2877c] hover:bg-[#e2877c]/10"
            >
              <Trash2 size={13} /> Sil
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  )
})

export default BasvuruKarti
