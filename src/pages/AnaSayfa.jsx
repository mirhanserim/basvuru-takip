import { ArrowDownWideNarrow, ArrowRight, BellRing, Download, Inbox, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AnalizPaneli from '../components/AnalizPaneli'
import Arkaplan from '../components/Arkaplan'
import BasvuruFormu from '../components/BasvuruFormu'
import BasvuruKarti from '../components/BasvuruKarti'
import Bildirimler from '../components/Bildirimler'
import GorunumSekmeleri from '../components/GorunumSekmeleri'
import IstatistikSeridi from '../components/IstatistikSeridi'
import KanbanPano from '../components/KanbanPano'
import Konfeti from '../components/Konfeti'
import KomutPaleti from '../components/KomutPaleti'
import Pencere from '../components/Pencere'
import Sayac from '../components/Sayac'
import UstMenu from '../components/UstMenu'
import Yorunge from '../components/Yorunge'
import { useKisayollar } from '../hooks/useKisayollar'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ORNEK_BASVURULAR, SIRALAMALAR, TAKIP_ESIGI, gunOnce } from '../interfaces/basvuru'
import { csvIndir } from '../utils/disaAktar'
import { konfetiUret } from '../utils/konfeti'

const yumusak = [0.16, 1, 0.3, 1]
const gecis = { initial: { opacity: 0, y: 18, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: -10, filter: 'blur(4px)' }, transition: { duration: 0.5, ease: yumusak } }

const SATIRLAR = [
  [{ k: 'Başvurularını', s: 0 }, { k: 'izle.', s: 1 }],
  [{ k: 'Fırsatı', s: 2 }, { k: 'yakala.', s: 3, vurgu: true }],
]

function Baslik() {
  return (
    <h1 className="text-[44px] font-extrabold leading-[1.02] tracking-[-0.035em] text-metin sm:text-[68px]">
      {SATIRLAR.map((satir, i) => (
        <span key={i} className="block">
          {satir.map(({ k, s, vurgu }) => (
            <motion.span
              key={k}
              className={`mr-[0.22em] inline-block ${vurgu ? 'altin-metin pr-1 font-serif font-medium italic tracking-[-0.02em]' : ''}`}
              initial={{ opacity: 0, y: 34, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.15 + s * 0.09, ease: yumusak }}
            >
              {k}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  )
}

export default function AnaSayfa() {
  const [basvurular, setBasvurular] = useLocalStorage('basvuru-takip/v1', ORNEK_BASVURULAR)
  const [gorunum, setGorunum] = useLocalStorage('basvuru-takip/gorunum', 'pano')
  const [filtre, setFiltre] = useState('Tümü')
  const [arama, setArama] = useState('')
  const [siralama, setSiralama] = useState('yeni')
  const [duzenlenen, setDuzenlenen] = useState(null)
  const [yeniAcik, setYeniAcik] = useState(false)
  const [silinecek, setSilinecek] = useState(null)
  const [paletAcik, setPaletAcik] = useState(false)
  const [bildirimler, setBildirimler] = useState([])
  const [konfeti, setKonfeti] = useState(null)
  const aramaRef = useRef(null)
  const icerikRef = useRef(null)

  // Bildirimler ve kutlama
  const bildirimKapat = useCallback((id) => setBildirimler((l) => l.filter((b) => b.id !== id)), [])
  const bildir = useCallback(
    (mesaj, tur = 'basari', geriAl) => {
      const id = crypto.randomUUID()
      const sure = geriAl ? 6000 : 3200
      setBildirimler((l) => [...l.slice(-2), { id, mesaj, tur, geriAl, sure }])
      setTimeout(() => bildirimKapat(id), sure)
    },
    [bildirimKapat],
  )
  const kutla = (durum) => {
    if (durum !== 'Teklif') return
    const id = crypto.randomUUID()
    setKonfeti({ id, parcalar: konfetiUret() })
    setTimeout(() => setKonfeti((k) => (k?.id === id ? null : k)), 2800)
  }

  // CRUD işlemleri
  const ekle = (yeni) => {
    setBasvurular((l) => [{ ...yeni, id: crypto.randomUUID() }, ...l])
    setYeniAcik(false)
    bildir(`${yeni.sirket} başvurusu eklendi`)
    kutla(yeni.durum)
  }
  const guncelle = (b) => {
    const eski = basvurular.find((x) => x.id === b.id)
    setBasvurular((l) => l.map((x) => (x.id === b.id ? b : x)))
    setDuzenlenen(null)
    bildir('Değişiklikler kaydedildi')
    if (eski?.durum !== b.durum) kutla(b.durum)
  }
  const durumDegistir = (id, durum) => {
    setBasvurular((l) => l.map((x) => (x.id === id ? { ...x, durum } : x)))
    bildir(durum === 'Teklif' ? 'Tebrikler, teklif aldın!' : `Durum “${durum}” olarak güncellendi`, durum === 'Teklif' ? 'kutlama' : 'bilgi')
    kutla(durum)
  }
  const sil = (hedef) => {
    const sira = basvurular.findIndex((x) => x.id === hedef.id)
    setBasvurular((l) => l.filter((x) => x.id !== hedef.id))
    setSilinecek(null)
    bildir(`${hedef.sirket} başvurusu silindi`, 'silme', () =>
      setBasvurular((l) => {
        const kopya = [...l]
        kopya.splice(sira, 0, hedef)
        return kopya
      }),
    )
  }

  // Listeleme: filtre + arama + sıralama
  const liste = useMemo(() => {
    const q = arama.toLocaleLowerCase('tr')
    const sirala = {
      yeni: (a, b) => b.tarih.localeCompare(a.tarih),
      eski: (a, b) => a.tarih.localeCompare(b.tarih),
      sirket: (a, b) => a.sirket.localeCompare(b.sirket, 'tr'),
    }[siralama]
    return basvurular
      .filter((b) => filtre === 'Tümü' || b.durum === filtre)
      .filter((b) => !q || `${b.sirket} ${b.pozisyon} ${b.not}`.toLocaleLowerCase('tr').includes(q))
      .sort(sirala)
  }, [basvurular, filtre, arama, siralama])

  // Özet göstergeler
  const ozet = useMemo(() => {
    const say = (d) => basvurular.filter((b) => b.durum === d).length
    const gonderilen = basvurular.length - say('Hazırlanıyor')
    return {
      aktif: say('Başvuruldu') + say('Mülakat'),
      olumlu: gonderilen ? Math.round(((say('Mülakat') + say('Teklif')) / gonderilen) * 100) : 0,
      teklif: say('Teklif'),
      takip: basvurular.filter((b) => b.durum === 'Başvuruldu' && gunOnce(b.tarih) >= TAKIP_ESIGI).length,
    }
  }, [basvurular])

  const yeniBasvuru = useCallback(() => {
    if (gorunum === 'pano') {
      icerikRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => document.getElementById('yeni-sirket')?.focus({ preventScroll: true }), 450)
    } else setYeniAcik(true)
  }, [gorunum])
  const gorunumSec = useCallback((g) => setGorunum(g), [setGorunum])
  const csv = useCallback(() => {
    csvIndir(basvurular)
    bildir(`${basvurular.length} başvuru CSV olarak indirildi`, 'bilgi')
  }, [basvurular, bildir])

  const kisayollar = useMemo(
    () => ({
      '/': () => { gorunumSec('pano'); setTimeout(() => aramaRef.current?.focus(), 60) },
      n: yeniBasvuru,
      1: () => gorunumSec('pano'),
      2: () => gorunumSec('kanban'),
      3: () => gorunumSec('analiz'),
    }),
    [yeniBasvuru, gorunumSec],
  )
  useKisayollar(kisayollar)

  // ⌘K / Ctrl+K: komut paleti
  useEffect(() => {
    const tus = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletAcik((a) => !a)
      }
    }
    window.addEventListener('keydown', tus)
    return () => window.removeEventListener('keydown', tus)
  }, [])

  const paletEylemleri = useMemo(() => ({ yeni: yeniBasvuru, gorunum: gorunumSec, csv, duzenle: setDuzenlenen }), [yeniBasvuru, gorunumSec, csv])

  const gostergeler = [
    { ad: 'Aktif süreç', deger: ozet.aktif },
    { ad: 'Olumlu dönüş', deger: ozet.olumlu, sonek: '%' },
    { ad: 'Teklif', deger: ozet.teklif },
  ]

  return (
    <div className="relative isolate min-h-screen overflow-x-clip">
      <Arkaplan />
      <UstMenu gorunum={gorunum} onGorunum={gorunumSec} onPalet={() => setPaletAcik(true)} onYeni={yeniBasvuru} />

      {/* Kahraman alanı */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-6 px-4 pb-6 pt-14 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div>
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: yumusak }} className="etiket-mono flex items-center gap-3">
            <span className="h-px w-9 bg-gradient-to-r from-transparent to-altin" /> Kariyer panosu · 2026
          </motion.div>
          <div className="mt-6"><Baslik /></div>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: yumusak }} className="mt-6 max-w-[520px] text-[16px] leading-relaxed text-soluk">
            Staj ve iş başvurularını tek yerde topla; durumlarını sürükle-bırak ile güncelle, süreç hunini analiz et ve takip edilmesi gereken hiçbir fırsatı kaçırma.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.62, ease: yumusak }} className="mt-8 flex flex-wrap items-center gap-3">
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={yeniBasvuru} className="altin-buton group flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold">
              Başvuru ekle <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => gorunumSec('analiz')} className="flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-medium text-metin ring-1 ring-white/12 transition hover:bg-white/[0.04] hover:ring-white/20">
              Analizi gör
              <span className="grid size-5 place-items-center rounded-full ring-1 ring-white/30"><span className="ml-px border-y-[4px] border-l-[6px] border-y-transparent border-l-metin" /></span>
            </motion.button>
          </motion.div>

          <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-12 grid max-w-[520px] grid-cols-3 divide-x divide-white/[0.07] border-y border-white/[0.07]">
            {gostergeler.map(({ ad, deger, sonek }) => (
              <div key={ad} className="px-4 py-4 first:pl-0">
                <dd className="text-[28px] font-semibold tracking-tight text-metin"><Sayac deger={deger} sonek={sonek} /></dd>
                <dt className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-sonuk">{ad}</dt>
              </div>
            ))}
          </motion.dl>
        </div>
        <Yorunge basvurular={basvurular} />
      </section>

      {/* İçerik */}
      <main ref={icerikRef} className="mx-auto max-w-[1200px] scroll-mt-28 px-4 pb-6 pt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="etiket-mono flex items-center gap-3">
              <span className="h-px w-9 bg-gradient-to-r from-transparent to-altin" />
              {gorunum === 'pano' ? 'Başvurular' : gorunum === 'kanban' ? 'Süreç panosu' : 'İçgörüler'}
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-metin sm:text-[40px]">
              {gorunum === 'pano' && <>Tüm <span className="font-serif font-medium italic text-altin-soluk">başvurular</span></>}
              {gorunum === 'kanban' && <>Sürükle, <span className="font-serif font-medium italic text-altin-soluk">ilerlet</span></>}
              {gorunum === 'analiz' && <>Veriden <span className="font-serif font-medium italic text-altin-soluk">içgörüye</span></>}
            </h2>
          </div>
          <div className="w-full md:hidden"><GorunumSekmeleri gorunum={gorunum} onDegis={gorunumSec} kimlik="mobil" tam /></div>
          {ozet.takip > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => { setFiltre('Başvuruldu'); gorunumSec('pano') }}
              className="flex items-center gap-2.5 rounded-full bg-altin/[0.06] py-2 pl-2 pr-4 text-xs font-medium text-altin-soluk ring-1 ring-altin/25 transition hover:bg-altin/10"
            >
              <span className="grid size-6 place-items-center rounded-full bg-altin/20 text-altin-acik"><BellRing size={12} /></span>
              {ozet.takip} başvuru takip bekliyor
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {gorunum === 'pano' && (
            <motion.div key="pano" {...gecis} className="grid gap-6 lg:grid-cols-[390px_1fr]">
              <section className="yuzey relative h-fit overflow-hidden rounded-[28px] p-6 lg:sticky lg:top-28">
                <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-altin/15 blur-3xl" />
                <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-altin/70 to-transparent" />
                <div className="relative mb-6 flex items-start justify-between">
                  <div>
                    <div className="etiket-mono !text-[10px]">Yeni kayıt</div>
                    <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-metin">Başvuru ekle</h3>
                  </div>
                  <kbd className="rounded-md bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-sonuk ring-1 ring-white/10" title="Kısayol: N">N</kbd>
                </div>
                <div className="relative"><BasvuruFormu onKaydet={ekle} odakId="yeni-sirket" /></div>
              </section>

              <section className="flex min-w-0 flex-col gap-4">
                <IstatistikSeridi basvurular={basvurular} secili={filtre} onSec={setFiltre} />
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="group relative flex-1">
                    <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sonuk transition group-focus-within:text-altin" />
                    <input ref={aramaRef} value={arama} onChange={(e) => setArama(e.target.value)} placeholder="Şirket, pozisyon veya notlarda ara..." className="girdi !rounded-full !py-3 !pl-11 !pr-14" />
                    {arama ? (
                      <button onClick={() => setArama('')} aria-label="Aramayı temizle" className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-soluk hover:bg-white/5 hover:text-metin"><X size={14} /></button>
                    ) : (
                      <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-sonuk ring-1 ring-white/10">/</kbd>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <label className="relative flex items-center">
                      <ArrowDownWideNarrow size={15} className="pointer-events-none absolute left-3.5 text-sonuk" />
                      <select aria-label="Sırala" value={siralama} onChange={(e) => setSiralama(e.target.value)} className="girdi !w-auto cursor-pointer appearance-none !rounded-full !py-3 !pl-10 !pr-5">
                        {SIRALAMALAR.map((s) => <option key={s.id} value={s.id}>{s.ad}</option>)}
                      </select>
                    </label>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={csv} title="CSV olarak indir" aria-label="CSV olarak indir" className="girdi !w-auto flex items-center gap-2 !rounded-full !px-4 !py-3 text-soluk hover:text-altin-acik">
                      <Download size={15} /> <span className="hidden sm:inline">CSV</span>
                    </motion.button>
                  </div>
                </div>

                <motion.div layout className="grid gap-4 md:grid-cols-2">
                  <AnimatePresence mode="popLayout">
                    {liste.map((b) => (
                      <BasvuruKarti key={b.id} basvuru={b} onDuzenle={setDuzenlenen} onSil={setSilinecek} onDurumDegistir={durumDegistir} />
                    ))}
                    {liste.length === 0 && (
                      <motion.div key="bos" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="yuzey flex flex-col items-center gap-3 rounded-[28px] px-6 py-16 text-center md:col-span-2">
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} className="grid size-14 place-items-center rounded-2xl bg-altin/[0.06] ring-1 ring-altin/25">
                          <Inbox size={22} className="text-altin-soluk" />
                        </motion.div>
                        <p className="mt-1 text-lg font-semibold text-metin">Burada henüz <span className="font-serif italic text-altin-soluk">başvuru</span> yok</p>
                        <p className="max-w-xs text-sm text-soluk">{arama ? 'Aramanla eşleşen bir kayıt bulunamadı.' : 'Bu filtrede başvuru yok. Soldaki formdan yeni bir başvuru ekleyebilirsin.'}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </section>
            </motion.div>
          )}

          {gorunum === 'kanban' && (
            <motion.div key="kanban" {...gecis}>
              <KanbanPano basvurular={basvurular} onDurumDegistir={durumDegistir} onDuzenle={setDuzenlenen} />
            </motion.div>
          )}

          {gorunum === 'analiz' && (
            <motion.div key="analiz" {...gecis}>
              <AnalizPaneli basvurular={basvurular} onDuzenle={setDuzenlenen} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mx-auto mt-16 max-w-[1200px] px-4 pb-24">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-8 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" width="24" height="28" className="h-7 w-auto opacity-80" />
            <span className="text-sm text-soluk"><b className="font-semibold text-metin">MMSerim</b> Kariyer · Muhammed Mirhan Serim</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sonuk">Veriler yalnızca bu tarayıcıda (LocalStorage) saklanır · Software Persona YZ Programı</span>
        </div>
      </footer>

      <AnimatePresence>
        {yeniAcik && (
          <Pencere key="yeni" ust="Yeni kayıt" baslik="Başvuru ekle" ikon={<Plus size={17} />} onKapat={() => setYeniAcik(false)}>
            <BasvuruFormu onKaydet={ekle} onIptal={() => setYeniAcik(false)} odakId="modal-sirket" />
          </Pencere>
        )}
        {duzenlenen && (
          <Pencere key="duzenle" ust={duzenlenen.sirket} baslik="Başvuruyu düzenle" ikon={<Pencil size={16} />} onKapat={() => setDuzenlenen(null)}>
            <BasvuruFormu baslangic={duzenlenen} onKaydet={guncelle} onIptal={() => setDuzenlenen(null)} />
          </Pencere>
        )}
        {silinecek && (
          <Pencere key="sil" ust="Onay" baslik="Başvuruyu sil" ikon={<Trash2 size={16} className="text-[#e2877c]" />} onKapat={() => setSilinecek(null)}>
            <p className="text-sm leading-relaxed text-soluk">
              <b className="font-semibold text-metin">{silinecek.sirket}</b> · {silinecek.pozisyon} başvurusu silinecek. Silme sonrası birkaç saniye içinde geri alabilirsin.
            </p>
            <div className="mt-7 flex justify-end gap-2">
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setSilinecek(null)} className="rounded-full px-5 py-2.5 text-sm font-medium text-soluk ring-1 ring-white/10 hover:bg-white/5 hover:text-metin">Vazgeç</motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => sil(silinecek)} className="rounded-full bg-gradient-to-br from-[#e9a197] to-[#c96b5f] px-5 py-2.5 text-sm font-semibold text-[#1c0907] shadow-[0_10px_30px_-10px_rgb(226_135_124/0.7)]">Sil</motion.button>
            </div>
          </Pencere>
        )}
        {paletAcik && <KomutPaleti key="palet" basvurular={basvurular} eylemler={paletEylemleri} onKapat={() => setPaletAcik(false)} />}
      </AnimatePresence>

      <Bildirimler liste={bildirimler} onKapat={bildirimKapat} />
      <Konfeti patlama={konfeti} />
    </div>
  )
}
