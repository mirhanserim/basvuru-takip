import { X } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect } from 'react'

/** Animasyonlu modal pencere (ekleme, düzenleme ve silme onayı için). Ebeveyn AnimatePresence ile sarar. */
export default function Pencere({ baslik, ust, ikon, children, onKapat }) {
  useEffect(() => {
    const tus = (e) => e.key === 'Escape' && onKapat()
    window.addEventListener('keydown', tus)
    return () => window.removeEventListener('keydown', tus)
  }, [onKapat])

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="fixed inset-0 bg-zemin/75 backdrop-blur-md" onClick={onKapat} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={baslik}
        className="yuzey relative my-auto w-full max-w-xl rounded-[28px] p-6 sm:p-8"
        initial={{ opacity: 0, y: 34, scale: 0.94, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: 16, scale: 0.97, filter: 'blur(4px)' }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      >
        <div className="pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-altin to-transparent" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-2/3 -translate-x-1/2 rounded-full bg-altin/10 blur-3xl" />
        <div className="relative mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {ikon && <span className="grid size-10 place-items-center rounded-2xl bg-altin/[0.07] text-altin-acik ring-1 ring-altin/25">{ikon}</span>}
            <div>
              {ust && <div className="etiket-mono !text-[10px]">{ust}</div>}
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-metin">{baslik}</h2>
            </div>
          </div>
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onKapat}
            aria-label="Kapat"
            className="grid size-9 place-items-center rounded-xl text-soluk hover:bg-white/5 hover:text-metin"
          >
            <X size={18} />
          </motion.button>
        </div>
        <div className="relative">{children}</div>
      </motion.div>
    </motion.div>
  )
}
