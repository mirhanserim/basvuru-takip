import { MotionConfig } from 'motion/react'
import AnaSayfa from './pages/AnaSayfa'

export default function App() {
  // Sistemde "hareketi azalt" açıksa animasyonlar otomatik olarak sadeleşir
  return (
    <MotionConfig reducedMotion="user">
      <AnaSayfa />
    </MotionConfig>
  )
}
