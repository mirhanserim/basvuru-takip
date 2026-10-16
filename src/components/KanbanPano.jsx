import { GripVertical, Pencil } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { DURUMLAR, DURUM_META, tarihYaz } from '../interfaces/basvuru'
import Monogram from './Monogram'

/** Sürükle-bırak ile durum değiştirilebilen beş sütunlu süreç panosu. */
export default function KanbanPano({ basvurular, onDurumDegistir, onDuzenle }) {
  const [surukelenen, setSurukelenen] = useState(null)
  const [hedef, setHedef] = useState(null)

  const birak = (durum) => {
    if (surukelenen && surukelenen.durum !== durum) onDurumDegistir(surukelenen.id, durum)
    setSurukelenen(null)
    setHedef(null)
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-4">
      <div className="grid min-w-[1060px] grid-cols-5 gap-3">
        {DURUMLAR.map((durum, k) => {
          const { renk, aciklama } = DURUM_META[durum]
          const liste = basvurular.filter((b) => b.durum === durum).sort((a, b) => b.tarih.localeCompare(a.tarih))
          const aktif = hedef === durum && surukelenen?.durum !== durum
          return (
            <motion.section
              key={durum}
              aria-label={`${durum} sütunu`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * k, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onDragOver={(e) => { e.preventDefault(); setHedef(durum) }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHedef(null) }}
              onDrop={(e) => { e.preventDefault(); birak(durum) }}
              className={`yuzey isin-kenar relative flex min-h-[460px] flex-col rounded-[24px] p-3 transition-colors duration-300 ${aktif ? 'aktif bg-altin/[0.04]' : ''}`}
            >
              <header className="mb-3 flex items-center justify-between px-2 pt-1.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: renk, boxShadow: `0 0 12px ${renk}` }} />
                    <h3 className="text-sm font-semibold text-metin">{durum}</h3>
                  </div>
                  <p className="mt-1 font-mono text-[10px] tracking-wide text-sonuk">{aciklama}</p>
                </div>
                <span className="grid min-w-7 place-items-center rounded-full bg-white/[0.04] px-2 py-0.5 font-mono text-xs text-soluk ring-1 ring-white/10">{liste.length}</span>
              </header>

              <div className="flex flex-1 flex-col gap-2">
                <AnimatePresence mode="popLayout">
                  {liste.map((b) => (
                    <motion.div
                      key={b.id}
                      layout
                      layoutId={`kanban-${b.id}`}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: surukelenen?.id === b.id ? 0.4 : 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    >
                      <div
                        draggable
                        onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', b.id); setSurukelenen(b) }}
                        onDragEnd={() => { setSurukelenen(null); setHedef(null) }}
                        className="group relative cursor-grab rounded-2xl bg-white/[0.025] p-3 ring-1 ring-white/[0.07] transition hover:bg-white/[0.045] hover:ring-altin/30 active:cursor-grabbing"
                      >
                        <div className="absolute inset-y-3 left-0 w-px rounded-full" style={{ background: renk }} />
                        <div className="flex items-start gap-2.5">
                          <Monogram ad={b.sirket} kucuk />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-[13px] font-medium leading-snug text-metin">{b.pozisyon}</p>
                            <p className="mt-0.5 truncate text-xs text-soluk">{b.sirket}</p>
                          </div>
                          <GripVertical size={14} className="mt-0.5 shrink-0 text-sonuk opacity-0 transition group-hover:opacity-100" />
                        </div>
                        <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-sonuk">
                          <span>{tarihYaz(b.tarih)} · {b.tur}</span>
                          <button onClick={() => onDuzenle(b)} aria-label={`${b.sirket} düzenle`} className="rounded-md p-1 text-sonuk opacity-0 transition hover:text-altin-acik group-hover:opacity-100 focus:opacity-100">
                            <Pencil size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className={`mt-auto grid place-items-center rounded-2xl border border-dashed py-4 font-mono text-[10px] uppercase tracking-[0.18em] transition ${aktif ? 'border-altin/60 text-altin-acik' : 'border-white/[0.07] text-sonuk/70'}`}>
                  {aktif ? 'buraya bırak' : liste.length ? 'sürükle · bırak' : 'boş'}
                </div>
              </div>
            </motion.section>
          )
        })}
      </div>
    </div>
  )
}
