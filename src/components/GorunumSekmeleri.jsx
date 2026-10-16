import { BarChart3, KanbanSquare, LayoutGrid } from 'lucide-react'
import { motion } from 'motion/react'

const GORUNUMLER = [
  { id: 'pano', ad: 'Pano', ikon: LayoutGrid },
  { id: 'kanban', ad: 'Kanban', ikon: KanbanSquare },
  { id: 'analiz', ad: 'Analiz', ikon: BarChart3 },
]

/** Görünüm sekmeleri; seçili sekmenin altında kayan altın çizgi. */
export default function GorunumSekmeleri({ gorunum, onDegis, kimlik, tam }) {
  return (
    <div role="tablist" aria-label="Görünüm" className={`flex items-center gap-1 ${tam ? 'cam w-full justify-between rounded-2xl p-1' : ''}`}>
      {GORUNUMLER.map(({ id, ad, ikon: Ikon }) => {
        const aktif = gorunum === id
        return (
          <button
            key={id}
            role="tab"
            aria-selected={aktif}
            onClick={() => onDegis(id)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium transition-colors ${aktif ? 'text-altin-acik' : 'text-soluk hover:text-metin'}`}
          >
            {aktif && (
              <motion.span
                layoutId={`${kimlik}-sekme`}
                className="absolute inset-0 rounded-xl bg-altin/[0.08] ring-1 ring-altin/25"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {aktif && (
              <motion.span
                layoutId={`${kimlik}-cizgi`}
                className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-altin to-transparent"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <Ikon size={15} className="relative" />
            <span className="relative">{ad}</span>
          </button>
        )
      })}
    </div>
  )
}
