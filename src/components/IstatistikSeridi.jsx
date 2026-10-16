import { motion } from 'motion/react'
import { DURUMLAR, DURUM_META } from '../interfaces/basvuru'
import Sayac from './Sayac'

/** Durum filtreleri: her biri kendi sayacıyla; seçili filtrenin arkasında kayan bir altın vurgu. */
export default function IstatistikSeridi({ basvurular, secili, onSec }) {
  const sayac = (d) => basvurular.filter((b) => b.durum === d).length
  const kutular = [{ ad: 'Tümü', sayi: basvurular.length, renk: '#cda468' }, ...DURUMLAR.map((d) => ({ ad: d, sayi: sayac(d), renk: DURUM_META[d].renk }))]

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {kutular.map(({ ad, sayi, renk }, i) => {
        const aktif = secili === ad
        return (
          <motion.button
            key={ad}
            onClick={() => onSec(ad)}
            aria-pressed={aktif}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="yuzey relative overflow-hidden rounded-2xl px-3.5 py-3 text-left"
          >
            {aktif && (
              <motion.span
                layoutId="filtre-vurgu"
                className="absolute inset-0 rounded-2xl"
                style={{ background: `linear-gradient(170deg, ${renk}26, transparent 70%)`, boxShadow: `inset 0 0 0 1px ${renk}66` }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <div className="relative flex items-center justify-between">
              <span className={`text-2xl font-semibold tracking-tight ${aktif ? 'text-metin' : 'text-[#d9d6cf]'}`}>
                <Sayac deger={sayi} />
              </span>
              <span className="size-1.5 rounded-full" style={{ background: renk, boxShadow: `0 0 10px ${renk}` }} />
            </div>
            <div className={`relative mt-1 font-mono text-[10px] uppercase tracking-[0.12em] ${aktif ? 'text-altin-soluk' : 'text-sonuk'}`}>{ad}</div>
          </motion.button>
        )
      })}
    </div>
  )
}
