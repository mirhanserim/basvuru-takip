import { useMemo, useState } from 'react'
import BasvuruFormu from '../components/BasvuruFormu'
import BasvuruKarti from '../components/BasvuruKarti'
import IstatistikSeridi from '../components/IstatistikSeridi'
import Pencere from '../components/Pencere'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ORNEK_BASVURULAR } from '../interfaces/basvuru'

export default function AnaSayfa() {
  const [basvurular, setBasvurular] = useLocalStorage('basvuru-takip/v1', ORNEK_BASVURULAR)
  const [filtre, setFiltre] = useState('Tümü')
  const [arama, setArama] = useState('')
  const [duzenlenen, setDuzenlenen] = useState(null)
  const [silinecek, setSilinecek] = useState(null)

  // CRUD işlemleri
  const ekle = (yeni) => setBasvurular([{ ...yeni, id: crypto.randomUUID() }, ...basvurular])
  const guncelle = (b) => { setBasvurular(basvurular.map((x) => (x.id === b.id ? b : x))); setDuzenlenen(null) }
  const durumDegistir = (id, durum) => setBasvurular(basvurular.map((x) => (x.id === id ? { ...x, durum } : x)))
  const sil = (id) => { setBasvurular(basvurular.filter((x) => x.id !== id)); setSilinecek(null) }

  // Listeleme: filtre + arama + tarihe göre sıralama
  const liste = useMemo(() => {
    const q = arama.toLocaleLowerCase('tr')
    return basvurular
      .filter((b) => filtre === 'Tümü' || b.durum === filtre)
      .filter((b) => !q || `${b.sirket} ${b.pozisyon} ${b.not}`.toLocaleLowerCase('tr').includes(q))
      .sort((a, b) => b.tarih.localeCompare(a.tarih))
  }, [basvurular, filtre, arama])

  return (
    <div className="min-h-screen">
      <header className="bg-lacivert text-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-sm font-semibold tracking-wide text-turuncu">KARİYER PANOSU</p>
          <h1 className="mt-1 text-3xl font-bold">Başvuru Takip</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Staj ve iş başvurularını tek yerden yönet: ekle, durumunu güncelle, filtrele ve hiçbir fırsatı gözden kaçırma.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[360px_1fr]">
        <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
          <h2 className="mb-4 text-lg font-bold text-lacivert">Yeni başvuru</h2>
          <BasvuruFormu onKaydet={ekle} />
        </section>

        <section className="flex flex-col gap-4">
          <IstatistikSeridi basvurular={basvurular} secili={filtre} onSec={setFiltre} />
          <input
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder="Şirket, pozisyon veya notlarda ara..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-lacivert focus:ring-2 focus:ring-lacivert/15"
          />
          {liste.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Bu filtrede başvuru yok. Soldaki formdan yeni bir başvuru ekleyebilirsin.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {liste.map((b) => (
                <BasvuruKarti key={b.id} basvuru={b} onDuzenle={setDuzenlenen} onSil={setSilinecek} onDurumDegistir={durumDegistir} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="pb-8 text-center text-xs text-slate-400">
        Veriler yalnızca bu tarayıcıda (LocalStorage) saklanır · Muhammed Mirhan Serim · Software Persona YZ Programı
      </footer>

      {duzenlenen && (
        <Pencere baslik="Başvuruyu düzenle" onKapat={() => setDuzenlenen(null)}>
          <BasvuruFormu baslangic={duzenlenen} onKaydet={guncelle} onIptal={() => setDuzenlenen(null)} />
        </Pencere>
      )}
      {silinecek && (
        <Pencere baslik="Başvuruyu sil" onKapat={() => setSilinecek(null)}>
          <p className="text-sm text-slate-700">
            <b>{silinecek.sirket}</b> · {silinecek.pozisyon} başvurusu kalıcı olarak silinecek. Emin misin?
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setSilinecek(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Vazgeç</button>
            <button onClick={() => sil(silinecek.id)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">Sil</button>
          </div>
        </Pencere>
      )}
    </div>
  )
}
