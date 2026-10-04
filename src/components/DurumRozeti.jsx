import { DURUM_RENKLERI } from '../interfaces/basvuru'

export default function DurumRozeti({ durum }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${DURUM_RENKLERI[durum]}`}>
      {durum}
    </span>
  )
}
