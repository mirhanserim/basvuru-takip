import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'

/** Değer değiştikçe yumuşakça sayan sayı. */
export default function Sayac({ deger, sonek = '' }) {
  const mv = useMotionValue(0)
  const metin = useTransform(mv, (v) => `${Math.round(v)}${sonek}`)

  useEffect(() => {
    const kontrol = animate(mv, deger, { duration: 0.9, ease: [0.16, 1, 0.3, 1] })
    return () => kontrol.stop()
  }, [mv, deger])

  return <motion.span className="tabular-nums">{metin}</motion.span>
}
