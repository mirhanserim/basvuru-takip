import { motion } from 'motion/react'
import { DURUMLAR, DURUM_META } from '../interfaces/basvuru'
import Sayac from './Sayac'

const YORUNGELER = [
  { rx: 192, ry: 74, egim: -16, sure: 34 },
  { rx: 156, ry: 60, egim: 12, sure: 27 },
  { rx: 120, ry: 46, egim: -4, sure: 21 },
]
const elipsYolu = (rx, ry) => `M ${rx},0 A ${rx},${ry} 0 1 1 ${-rx},0 A ${rx},${ry} 0 1 1 ${rx},0`

/** Quantrophic logosunun etrafında, her durumu temsil eden ışık noktalarının döndüğü yörünge görseli. */
export default function Yorunge({ basvurular }) {
  const say = (d) => basvurular.filter((b) => b.durum === d).length

  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[420px] select-none">
      <div className="absolute inset-[20%] rounded-full bg-[radial-gradient(closest-side,rgb(205_164_104/0.32),transparent)] blur-2xl" />
      <motion.svg
        viewBox="-210 -210 420 420"
        className="absolute inset-0 size-full overflow-visible"
        initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <defs>
          <linearGradient id="yorunge-cizgi" x1="0" x2="1">
            <stop offset="0" stopColor="#cda468" stopOpacity="0.05" />
            <stop offset=".5" stopColor="#f0dab0" stopOpacity=".6" />
            <stop offset="1" stopColor="#cda468" stopOpacity="0.05" />
          </linearGradient>
          <filter id="yorunge-isik" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {YORUNGELER.map((y, i) => (
          <g key={i} transform={`rotate(${y.egim})`}>
            <ellipse rx={y.rx} ry={y.ry} fill="none" stroke="url(#yorunge-cizgi)" strokeWidth="1" />
            <ellipse rx={y.rx + 8} ry={y.ry + 3} fill="none" stroke="#cda468" strokeOpacity=".07" strokeWidth="1" strokeDasharray="1 7" />
          </g>
        ))}

        {/* Durum noktaları: her biri kendi yörüngesinde, başvuru sayısıyla büyüyen ışık */}
        {DURUMLAR.map((d, i) => {
          const y = YORUNGELER[i % YORUNGELER.length]
          const adet = say(d)
          const r = 2.6 + Math.min(adet, 6) * 0.9
          const sure = y.sure + i * 2.5
          return (
            <g key={d} transform={`rotate(${y.egim})`}>
              <circle r={r} fill={DURUM_META[d].renk} opacity={adet ? 1 : 0.35} filter="url(#yorunge-isik)">
                <title>{`${d}: ${adet}`}</title>
                <animateMotion dur={`${sure}s`} begin={`${-i * (sure / 5)}s`} repeatCount="indefinite" path={elipsYolu(y.rx, y.ry)} />
              </circle>
            </g>
          )
        })}

        {/* Küçük altın tozlar */}
        {Array.from({ length: 14 }, (_, i) => {
          const y = YORUNGELER[i % 3]
          return (
            <g key={`t${i}`} transform={`rotate(${y.egim})`}>
              <circle r={0.9} fill="#f0dab0" opacity=".7">
                <animateMotion dur={`${y.sure * 1.6}s`} begin={`${-i * 3.1}s`} repeatCount="indefinite" path={elipsYolu(y.rx, y.ry)} />
              </circle>
            </g>
          )
        })}
      </motion.svg>

      <motion.div className="absolute inset-0 grid place-items-center" animate={{ y: [0, -7, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="flex flex-col items-center">
          <motion.img
            src="/logo.png"
            alt=""
            className="w-[30%] min-w-24 drop-shadow-[0_0_38px_rgb(205_164_104/0.55)]"
            initial={{ scale: 0.6, opacity: 0, filter: 'blur(14px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-center"
      >
        <div className="font-serif text-[34px] italic leading-none text-altin-acik"><Sayac deger={basvurular.length} /></div>
        <div className="etiket-mono mt-1.5 !text-[9.5px] !tracking-[0.3em] !text-sonuk">başvuru yörüngede</div>
      </motion.div>
    </div>
  )
}
