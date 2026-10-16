import { ArrowRight, Check, Save } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import { DURUMLAR, DURUM_META, TURLER, bosBasvuru } from '../interfaces/basvuru'

const etiket = 'mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-sonuk'

/** Kayan vurgu göstergeli seçim düğmeleri (Tür ve Durum için). */
function Secici({ ad, secenekler, deger, onDegis, renkli }) {
  const grup = useId()
  return (
    <div role="radiogroup" aria-label={ad} className="grid grid-cols-6 gap-1 rounded-2xl bg-white/[0.02] p-1 ring-1 ring-white/[0.07]">
      {secenekler.map((s, i) => {
        const aktif = s === deger
        const renk = renkli ? DURUM_META[s].renk : '#cda468'
        // 3 seçenek: tek satır; 5 seçenek: 3 + 2 düzeninde iki satır
        const genislik = secenekler.length === 5 && i >= 3 ? 'col-span-3' : 'col-span-2'
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={aktif}
            onClick={() => onDegis(s)}
            className={`relative ${genislik} flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2 text-xs font-medium transition-colors ${aktif ? 'text-metin' : 'text-sonuk hover:text-soluk'}`}
          >
            {aktif && (
              <motion.span
                layoutId={`${grup}-vurgu`}
                className="absolute inset-0 rounded-xl"
                style={{ background: `linear-gradient(180deg, ${renk}1f, ${renk}0a)`, boxShadow: `inset 0 0 0 1px ${renk}59` }}
                transition={{ type: 'spring', stiffness: 500, damping: 36 }}
              />
            )}
            {renkli && <span className="relative size-1.5 rounded-full" style={{ background: renk, opacity: aktif ? 1 : 0.5 }} />}
            <span className="relative">{s}</span>
          </button>
        )
      })}
    </div>
  )
}

/** Hem ekleme hem güncelleme için kullanılan form. */
export default function BasvuruFormu({ baslangic, onKaydet, onIptal, odakId }) {
  const [form, setForm] = useState(baslangic ?? bosBasvuru())
  const [hata, setHata] = useState('')
  const [basarili, setBasarili] = useState(false)
  const duzenleme = Boolean(baslangic?.id)
  const ayarla = (alan, deger) => setForm((f) => ({ ...f, [alan]: deger }))
  const degistir = (alan) => (e) => ayarla(alan, e.target.value)

  const gonder = (e) => {
    e.preventDefault()
    if (!form.sirket.trim() || !form.pozisyon.trim()) {
      setHata('Şirket ve pozisyon alanları zorunludur.')
      return
    }
    onKaydet({ ...form, sirket: form.sirket.trim(), pozisyon: form.pozisyon.trim() })
    setHata('')
    if (!duzenleme) {
      setForm(bosBasvuru())
      setBasarili(true)
      setTimeout(() => setBasarili(false), 1400)
    }
  }

  return (
    <form onSubmit={gonder} className="grid gap-5 sm:grid-cols-2" noValidate>
      <div>
        <label htmlFor={odakId} className={etiket}>Şirket *</label>
        <input id={odakId} className="girdi" value={form.sirket} onChange={degistir('sirket')} placeholder="Örn. Anka Yazılım" autoComplete="off" />
      </div>
      <div>
        <label className={etiket}>Pozisyon *</label>
        <input className="girdi" value={form.pozisyon} onChange={degistir('pozisyon')} placeholder="Örn. YZ Stajyeri" autoComplete="off" />
      </div>
      <div className="sm:col-span-2">
        <span className={etiket}>Tür</span>
        <Secici ad="Tür" secenekler={TURLER} deger={form.tur} onDegis={(v) => ayarla('tur', v)} />
      </div>
      <div className="sm:col-span-2">
        <span className={etiket}>Durum</span>
        <Secici ad="Durum" secenekler={DURUMLAR} deger={form.durum} onDegis={(v) => ayarla('durum', v)} renkli />
      </div>
      <div>
        <label className={etiket}>Başvuru tarihi</label>
        <input type="date" className="girdi" value={form.tarih} onChange={degistir('tarih')} />
      </div>
      <div>
        <label className={etiket}>İlan bağlantısı</label>
        <input type="url" className="girdi" value={form.baglanti} onChange={degistir('baglanti')} placeholder="https://..." />
      </div>
      <div className="sm:col-span-2">
        <label className={etiket}>Not</label>
        <textarea rows={2} className="girdi resize-none" value={form.not} onChange={degistir('not')} placeholder="Mülakat tarihi, istenen beceriler..." />
      </div>

      <AnimatePresence>
        {hata && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', x: [0, -6, 6, -4, 4, 0] }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-[#efb2aa] sm:col-span-2"
          >
            {hata}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex gap-2 sm:col-span-2">
        <motion.button
          type="submit"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="altin-buton group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3.5 text-sm font-semibold"
        >
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/50 opacity-0 blur-md group-hover:animate-[parilti_1s_ease] group-hover:opacity-100" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={basarili ? 'ok' : 'normal'}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              className="relative flex items-center gap-2"
            >
              {basarili ? (
                <><Check size={16} strokeWidth={3} /> Eklendi</>
              ) : duzenleme ? (
                <><Save size={16} /> Değişiklikleri kaydet</>
              ) : (
                <>Başvuru ekle <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        {onIptal && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onIptal}
            className="rounded-full px-5 py-3.5 text-sm font-medium text-soluk ring-1 ring-white/10 hover:bg-white/5 hover:text-metin"
          >
            Vazgeç
          </motion.button>
        )}
      </div>
    </form>
  )
}
