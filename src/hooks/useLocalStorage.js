import { useEffect, useState } from 'react'

/** State'i tarayıcının LocalStorage alanında saklayan küçük yardımcı hook. */
export function useLocalStorage(anahtar, baslangic) {
  const [deger, setDeger] = useState(() => {
    try {
      const kayitli = localStorage.getItem(anahtar)
      return kayitli ? JSON.parse(kayitli) : baslangic
    } catch {
      return baslangic
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(anahtar, JSON.stringify(deger))
    } catch {
      /* gizli sekme vb. durumlarda kayıt yapılamazsa uygulama çalışmaya devam eder */
    }
  }, [anahtar, deger])

  return [deger, setDeger]
}
