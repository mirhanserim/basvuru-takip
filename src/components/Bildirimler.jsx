import { CheckCircle2, Info, PartyPopper, Trash2, Undo2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

const IKONLAR = {
  basari: <CheckCircle2 size={18} className="text-[#86d3a0]" />,
  kutlama: <PartyPopper size={18} className="text-altin-acik" />,
  silme: <Trash2 size={18} className="text-[#e2877c]" />,
  bilgi: <Info size={18} className="text-[#8fb4e3]" />,
}

/** Ekranın altında yığılan, kendiliğinden kaybolan bildirimler (silmede "Geri al" düğmesiyle). */
export default function Bildirimler({ liste, onKapat }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex flex-col items-center gap-2 px-4">
      <AnimatePresence initial={false}>
        {liste.map((b) => (
          <motion.div
            key={b.id}
            layout
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 12, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="cam pointer-events-auto relative flex w-full max-w-md items-center gap-3 overflow-hidden rounded-2xl py-3 pl-4 pr-3 text-sm text-metin shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9)]"
          >
            {IKONLAR[b.tur]}
            <span className="flex-1">{b.mesaj}</span>
            {b.geriAl && (
              <button
                onClick={() => { b.geriAl(); onKapat(b.id) }}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-altin-acik hover:bg-altin/10"
              >
                <Undo2 size={14} /> Geri al
              </button>
            )}
            <motion.span
              className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-altin-koyu via-altin to-altin-acik"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: b.sure / 1000, ease: 'linear' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
