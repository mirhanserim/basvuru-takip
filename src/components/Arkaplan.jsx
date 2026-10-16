import { useEffect, useRef } from 'react'

const gurultu =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Fareye hafifçe tepki veren, yavaşça süzülüp parıldayan altın toz parçacıkları. */
function AltinToz() {
  const tuval = useRef(null)

  useEffect(() => {
    const c = tuval.current
    const ctx = c.getContext('2d')
    const sakin = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let en, boy, parcalar, kare
    const fare = { x: 0, y: 0, hx: 0, hy: 0 }

    const kur = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      en = window.innerWidth
      boy = window.innerHeight
      c.width = en * dpr
      c.height = boy * dpr
      c.style.width = `${en}px`
      c.style.height = `${boy}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const adet = Math.round(Math.min(140, (en * boy) / 11000))
      parcalar = Array.from({ length: adet }, () => ({
        x: Math.random() * en,
        y: Math.random() * boy,
        r: Math.random() * 1.3 + 0.25,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(Math.random() * 0.14 + 0.03),
        derinlik: Math.random() * 0.9 + 0.1,
        faz: Math.random() * Math.PI * 2,
        hiz: Math.random() * 0.02 + 0.006,
      }))
    }

    const ciz = () => {
      ctx.clearRect(0, 0, en, boy)
      fare.hx += (fare.x - fare.hx) * 0.04
      fare.hy += (fare.y - fare.hy) * 0.04
      for (const p of parcalar) {
        p.x += p.vx
        p.y += p.vy
        p.faz += p.hiz
        if (p.y < -10) { p.y = boy + 10; p.x = Math.random() * en }
        if (p.x < -10) p.x = en + 10
        if (p.x > en + 10) p.x = -10
        const px = p.x + fare.hx * 18 * p.derinlik
        const py = p.y + fare.hy * 18 * p.derinlik
        const a = (0.25 + 0.55 * (0.5 + 0.5 * Math.sin(p.faz))) * p.derinlik
        ctx.beginPath()
        ctx.fillStyle = `rgba(232, 200, 140, ${a})`
        ctx.shadowColor = 'rgba(205, 164, 104, 0.9)'
        ctx.shadowBlur = p.r * 6
        ctx.arc(px, py, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!sakin) kare = requestAnimationFrame(ciz)
    }

    const hareket = (e) => {
      fare.x = e.clientX / en - 0.5
      fare.y = e.clientY / boy - 0.5
    }

    kur()
    ciz()
    window.addEventListener('resize', kur)
    window.addEventListener('pointermove', hareket)
    return () => {
      cancelAnimationFrame(kare)
      window.removeEventListener('resize', kur)
      window.removeEventListener('pointermove', hareket)
    }
  }, [])

  return <canvas ref={tuval} className="absolute inset-0" />
}

/** Sayfa arkası: derin siyah zemin, altın ışık halesi, toz parçacıkları ve film greni. */
export default function Arkaplan() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-zemin">
      <div className="absolute left-1/2 top-[-30rem] h-[60rem] w-[90rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(205_164_104/0.16),transparent)]" />
      <div className="absolute -left-60 top-1/3 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgb(138_106_62/0.14),transparent)]" />
      <div className="absolute -right-60 bottom-[-10rem] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(205_164_104/0.08),transparent)]" />
      <AltinToz />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent_80%)]" />
      <div className="absolute inset-0 opacity-[0.045] mix-blend-overlay" style={{ backgroundImage: gurultu }} />
    </div>
  )
}
