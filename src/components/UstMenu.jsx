import { Command, Plus } from 'lucide-react'
import { motion } from 'motion/react'
import GorunumSekmeleri from './GorunumSekmeleri'

/** Yapışkan cam üst menü: marka, görünüm sekmeleri, komut paleti ve yeni başvuru. */
export default function UstMenu({ gorunum, onGorunum, onPalet, onYeni }) {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-3 z-40 mx-auto mt-3 max-w-[1200px] px-4 sm:top-4 sm:mt-4"
    >
      <nav className="cam flex items-center gap-3 rounded-[22px] py-2 pl-3 pr-2 shadow-[0_20px_50px_-25px_rgb(0_0_0/0.9)]">
        <a href="#" className="flex items-center gap-2.5 pr-2" aria-label="MMSerim Kariyer ana sayfa">
          <img src="/logo.png" alt="" className="size-9 drop-shadow-[0_0_12px_rgb(205_164_104/0.45)]" />
          <span className="leading-none">
            <span className="block text-[15px] font-semibold tracking-tight text-metin"><b className="font-extrabold">MM</b>Serim</span>
            <span className="mt-1 block font-mono text-[9.5px] tracking-[0.28em] text-altin-soluk">KARİYER</span>
          </span>
        </a>

        <div className="mx-auto hidden md:block">
          <GorunumSekmeleri gorunum={gorunum} onDegis={onGorunum} kimlik="ust" />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            onClick={onPalet}
            aria-label="Komut paletini aç"
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-[13px] text-soluk ring-1 ring-white/[0.08] transition hover:text-metin hover:ring-white/15 sm:flex"
          >
            <Command size={14} /> Ara
            <kbd className="rounded-md bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-sonuk ring-1 ring-white/10">⌘K</kbd>
          </button>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={onYeni}
            className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold text-altin-acik ring-1 ring-altin/40 transition hover:bg-altin/10"
          >
            <Plus size={15} strokeWidth={2.5} /> <span className="hidden sm:inline">Yeni başvuru</span><span className="sm:hidden">Yeni</span>
          </motion.button>
        </div>
      </nav>
    </motion.header>
  )
}
