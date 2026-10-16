import { BarChart3, CornerDownLeft, Download, KanbanSquare, LayoutGrid, Plus, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import DurumRozeti from './DurumRozeti'

/** ⌘K / Ctrl+K ile açılan komut paleti: eylemler ve başvurular arasında klavyeyle hızlı gezinme. */
export default function KomutPaleti({ basvurular, onKapat, eylemler }) {
  const [sorgu, setSorgu] = useState('')
  const [secili, setSecili] = useState(0)
  const girdi = useRef(null)

  const ogeler = useMemo(() => {
    const q = sorgu.toLocaleLowerCase('tr').trim()
    const komutlar = [
      { id: 'yeni', ad: 'Yeni başvuru ekle', ikon: Plus, calistir: eylemler.yeni },
      { id: 'pano', ad: 'Pano görünümüne geç', ikon: LayoutGrid, calistir: () => eylemler.gorunum('pano') },
      { id: 'kanban', ad: 'Kanban görünümüne geç', ikon: KanbanSquare, calistir: () => eylemler.gorunum('kanban') },
      { id: 'analiz', ad: 'Analiz görünümüne geç', ikon: BarChart3, calistir: () => eylemler.gorunum('analiz') },
      { id: 'csv', ad: 'Başvuruları CSV olarak indir', ikon: Download, calistir: eylemler.csv },
    ].filter((k) => !q || k.ad.toLocaleLowerCase('tr').includes(q))
    const kayitlar = basvurular
      .filter((b) => !q || `${b.sirket} ${b.pozisyon} ${b.durum}`.toLocaleLowerCase('tr').includes(q))
      .slice(0, 6)
      .map((b) => ({ id: b.id, ad: b.pozisyon, alt: b.sirket, basvuru: b, calistir: () => eylemler.duzenle(b) }))
    return [...komutlar.map((k) => ({ ...k, grup: 'Eylemler' })), ...kayitlar.map((k) => ({ ...k, grup: 'Başvurular' }))]
  }, [sorgu, basvurular, eylemler])

  useEffect(() => girdi.current?.focus(), [])

  const sec = (o) => { onKapat(); o?.calistir() }
  const tus = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSecili((s) => Math.min(s + 1, ogeler.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSecili((s) => Math.max(s - 1, 0)) }
    if (e.key === 'Enter') { e.preventDefault(); sec(ogeler[secili]) }
    if (e.key === 'Escape') onKapat()
  }

  return (
    <motion.div className="fixed inset-0 z-[55] flex items-start justify-center p-4 pt-[14vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="fixed inset-0 bg-zemin/70 backdrop-blur-sm" onClick={onKapat} />
      <motion.div
        role="dialog"
        aria-label="Komut paleti"
        className="cam relative w-full max-w-xl overflow-hidden rounded-[24px] shadow-[0_40px_120px_-30px_rgb(0_0_0/1)]"
        initial={{ opacity: 0, y: -16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      >
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-altin/80 to-transparent" />
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-5">
          <Search size={17} className="text-altin" />
          <input
            ref={girdi}
            value={sorgu}
            onChange={(e) => { setSorgu(e.target.value); setSecili(0) }}
            onKeyDown={tus}
            placeholder="Başvuru ara veya komut yaz…"
            className="h-14 flex-1 bg-transparent text-[15px] text-metin outline-none placeholder:text-sonuk"
          />
          <kbd className="rounded-md bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-sonuk ring-1 ring-white/10">ESC</kbd>
        </div>
        <ul className="max-h-[52vh] overflow-y-auto p-2">
          {ogeler.length === 0 && <li className="px-3 py-8 text-center text-sm text-sonuk">Sonuç bulunamadı.</li>}
          {ogeler.map((o, i) => {
            const Ikon = o.ikon
            const aktif = i === secili
            const ilkGrup = i === 0 || ogeler[i - 1].grup !== o.grup
            return (
              <li key={o.id}>
                {ilkGrup && <div className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-sonuk">{o.grup}</div>}
                <button
                  onMouseEnter={() => setSecili(i)}
                  onClick={() => sec(o)}
                  className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${aktif ? 'text-metin' : 'text-soluk'}`}
                >
                  {aktif && <motion.span layoutId="palet-secim" className="absolute inset-0 rounded-xl bg-altin/[0.08] ring-1 ring-altin/25" transition={{ type: 'spring', stiffness: 600, damping: 40 }} />}
                  <span className="relative grid size-7 place-items-center rounded-lg bg-white/[0.04] ring-1 ring-white/10">
                    {Ikon ? <Ikon size={14} className={aktif ? 'text-altin-acik' : ''} /> : <span className="font-serif text-[11px] text-altin-soluk">{o.alt?.[0]}</span>}
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block truncate">{o.ad}</span>
                    {o.alt && <span className="block truncate text-xs text-sonuk">{o.alt}</span>}
                  </span>
                  {o.basvuru && <span className="relative"><DurumRozeti durum={o.basvuru.durum} /></span>}
                  {aktif && <CornerDownLeft size={14} className="relative text-altin" />}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="flex items-center gap-4 border-t border-white/[0.07] px-5 py-2.5 font-mono text-[10px] text-sonuk">
          <span>↑↓ gezin</span><span>↵ seç</span><span>esc kapat</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
