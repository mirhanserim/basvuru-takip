import { motion } from 'motion/react'
import { DURUM_META } from '../interfaces/basvuru'

export default function DurumRozeti({ durum }) {
  const { renk, rozet } = DURUM_META[durum]
  return (
    <motion.span
      key={durum}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 26 }}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${rozet}`}
    >
      <span className="relative flex size-1.5">
        {(durum === 'Mülakat' || durum === 'Teklif') && (
          <span className="absolute inline-flex size-full animate-ping rounded-full opacity-60" style={{ background: renk }} />
        )}
        <span className="relative inline-flex size-1.5 rounded-full" style={{ background: renk }} />
      </span>
      {durum}
    </motion.span>
  )
}
