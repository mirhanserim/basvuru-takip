import { motion } from 'motion/react'

/** "Teklif" alındığında ekranın altından fışkıran konfeti. */
export default function Konfeti({ patlama }) {
  if (!patlama) return null
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {patlama.parcalar.map((p) => (
        <motion.span
          key={`${patlama.id}-${p.i}`}
          className="absolute bottom-0 left-1/2 rounded-[2px]"
          style={{ width: p.en, height: p.boy, background: p.renk }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: [0, p.x * 0.7, p.x], y: [0, p.y, p.y + p.dusus], rotate: p.donus, opacity: [1, 1, 0] }}
          transition={{ duration: 2.4, delay: p.gecikme, times: [0, 0.4, 1], ease: ['easeOut', 'easeIn'] }}
        />
      ))}
    </div>
  )
}
