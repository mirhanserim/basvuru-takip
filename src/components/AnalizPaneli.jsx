import { BellRing } from 'lucide-react'
import { motion } from 'motion/react'
import { DURUMLAR, DURUM_META, TAKIP_ESIGI, TURLER, gunOnce } from '../interfaces/basvuru'
import Monogram from './Monogram'
import Sayac from './Sayac'

const yumusak = [0.16, 1, 0.3, 1]

function Panel({ ust, baslik, children, className = '', gecikme = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: gecikme, ease: yumusak }}
      className={`yuzey relative overflow-hidden rounded-[26px] p-6 ${className}`}
    >
      <div className="etiket-mono !text-[10px]">{ust}</div>
      <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-metin">{baslik}</h3>
      <div className="mt-5">{children}</div>
    </motion.section>
  )
}

/** Durum dağılımı: animasyonla çizilen halka grafik. */
function Halka({ basvurular }) {
  const toplam = basvurular.length || 1
  const C = 2 * Math.PI * 70
  const oranlar = DURUMLAR.map((d) => basvurular.filter((b) => b.durum === d).length / toplam)
  const dilimler = DURUMLAR.map((d, i) => ({ d, oran: oranlar[i], bas: oranlar.slice(0, i).reduce((t, o) => t + o, 0) }))
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative size-48 shrink-0">
        <svg viewBox="0 0 180 180" className="size-full -rotate-90">
          <circle cx="90" cy="90" r="70" fill="none" stroke="rgb(255 255 255 / 0.05)" strokeWidth="16" />
          {dilimler.map(({ d, oran, bas }, i) =>
            oran ? (
              <motion.circle
                key={d}
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke={DURUM_META[d].renk}
                strokeWidth="16"
                strokeLinecap="butt"
                strokeDasharray={`${Math.max(oran * C - 3, 0)} ${C}`}
                initial={{ strokeDashoffset: -bas * C + oran * C, opacity: 0 }}
                animate={{ strokeDashoffset: -bas * C, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.12, ease: yumusak }}
                style={{ filter: `drop-shadow(0 0 6px ${DURUM_META[d].renk}66)` }}
              />
            ) : null,
          )}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="font-serif text-4xl italic text-altin-acik"><Sayac deger={basvurular.length} /></div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-sonuk">toplam</div>
          </div>
        </div>
      </div>
      <ul className="grid w-full gap-2.5">
        {dilimler.map(({ d, oran }) => (
          <li key={d} className="flex items-center gap-3 text-sm">
            <span className="size-2 rounded-full" style={{ background: DURUM_META[d].renk }} />
            <span className="flex-1 text-soluk">{d}</span>
            <span className="font-mono text-xs text-metin">{Math.round(oran * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Gönderilen → yanıt → mülakat → teklif dönüşüm hunisi. */
function Huni({ basvurular }) {
  const say = (...d) => basvurular.filter((b) => d.includes(b.durum)).length
  const asamalar = [
    { ad: 'Gönderilen', sayi: say('Başvuruldu', 'Mülakat', 'Teklif', 'Reddedildi'), renk: '#8fb4e3' },
    { ad: 'Yanıt alınan', sayi: say('Mülakat', 'Teklif', 'Reddedildi'), renk: '#a9a59c' },
    { ad: 'Mülakata kalan', sayi: say('Mülakat', 'Teklif'), renk: '#e7cda0' },
    { ad: 'Teklif', sayi: say('Teklif'), renk: '#86d3a0' },
  ]
  const tepe = asamalar[0].sayi || 1
  return (
    <div className="grid gap-3.5">
      {asamalar.map((a, i) => (
        <div key={a.ad}>
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="text-soluk">{a.ad}</span>
            <span className="font-mono text-xs text-metin">
              {a.sayi}
              {i > 0 && <span className="ml-2 text-sonuk">{Math.round((a.sayi / tepe) * 100)}%</span>}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.04]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${a.renk}88, ${a.renk})`, boxShadow: `0 0 16px ${a.renk}55` }}
              initial={{ width: 0 }}
              animate={{ width: `${(a.sayi / tepe) * 100}%` }}
              transition={{ duration: 1.1, delay: 0.35 + i * 0.12, ease: yumusak }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Son 8 haftanın her biri için eklenen başvuru sayısı. */
function haftalikSayilar(basvurular) {
  const bugun = new Date()
  bugun.setHours(0, 0, 0, 0)
  return Array.from({ length: 8 }, (_, i) => {
    const bitis = new Date(bugun)
    bitis.setDate(bitis.getDate() - (7 - i) * 7 + 7)
    const bas = new Date(bitis)
    bas.setDate(bas.getDate() - 7)
    const sayi = basvurular.filter((b) => {
      const t = new Date(b.tarih + 'T00:00:00')
      return t >= bas && t < bitis
    }).length
    return { etiket: bas.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }), sayi }
  })
}

/** Son 8 haftada eklenen başvuru sayıları. */
function Haftalik({ basvurular }) {
  const haftalar = haftalikSayilar(basvurular)
  const tepe = Math.max(1, ...haftalar.map((h) => h.sayi))
  return (
    <div className="flex h-44 items-end gap-2.5">
      {haftalar.map((h, i) => (
        <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
          <span className="font-mono text-[10px] text-soluk opacity-0 transition group-hover:opacity-100">{h.sayi}</span>
          <motion.div
            className="w-full rounded-t-xl rounded-b-md bg-gradient-to-t from-altin-koyu/60 via-altin/80 to-altin-acik"
            style={{ boxShadow: h.sayi ? '0 0 22px -4px rgb(205 164 104 / 0.55)' : 'none', opacity: h.sayi ? 1 : 0.25 }}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max((h.sayi / tepe) * 100, 4)}%` }}
            transition={{ duration: 1, delay: 0.3 + i * 0.07, ease: yumusak }}
          />
          <span className="whitespace-nowrap font-mono text-[9.5px] text-sonuk">{h.etiket}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalizPaneli({ basvurular, onDuzenle }) {
  const takip = basvurular.filter((b) => b.durum === 'Başvuruldu' && gunOnce(b.tarih) >= TAKIP_ESIGI)
  const tur = TURLER.map((t) => ({ t, sayi: basvurular.filter((b) => b.tur === t).length }))
  const turTepe = Math.max(1, ...tur.map((x) => x.sayi))

  return (
    <div className="grid gap-4 lg:grid-cols-6">
      <Panel ust="Dağılım" baslik="Süreç durumu" className="lg:col-span-3">
        <Halka basvurular={basvurular} />
      </Panel>
      <Panel ust="Dönüşüm" baslik="Başvuru hunisi" className="lg:col-span-3" gecikme={0.08}>
        <Huni basvurular={basvurular} />
      </Panel>
      <Panel ust="Zaman" baslik="Haftalık aktivite" className="lg:col-span-4" gecikme={0.16}>
        <Haftalik basvurular={basvurular} />
      </Panel>
      <Panel ust="Tür" baslik="Pozisyon türleri" className="lg:col-span-2" gecikme={0.22}>
        <div className="grid gap-4">
          {tur.map(({ t, sayi }, i) => (
            <div key={t}>
              <div className="mb-1.5 flex justify-between text-sm"><span className="text-soluk">{t}</span><span className="font-mono text-xs">{sayi}</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-altin-koyu to-altin-acik" initial={{ width: 0 }} animate={{ width: `${(sayi / turTepe) * 100}%` }} transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: yumusak }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel ust="Hatırlatma" baslik={takip.length ? `${takip.length} başvuru takip bekliyor` : 'Takip bekleyen başvuru yok'} className="lg:col-span-6" gecikme={0.28}>
        {takip.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {takip.map((b) => (
              <li key={b.id}>
                <button onClick={() => onDuzenle(b)} className="flex w-full items-center gap-3 rounded-2xl bg-altin/[0.04] p-3 text-left ring-1 ring-altin/15 transition hover:ring-altin/40">
                  <Monogram ad={b.sirket} kucuk />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-metin">{b.pozisyon}</span>
                    <span className="block truncate text-xs text-soluk">{b.sirket}</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-altin-soluk"><BellRing size={12} /> {gunOnce(b.tarih)} gün</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-soluk">{TAKIP_ESIGI} günden uzun süredir yanıt beklenen başvuru yok. Harika gidiyorsun.</p>
        )}
      </Panel>
    </div>
  )
}
