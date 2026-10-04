/** Basit modal pencere (düzenleme ve silme onayı için). */
export default function Pencere({ baslik, children, onKapat }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onKapat}>
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-lacivert">{baslik}</h2>
          <button onClick={onKapat} aria-label="Kapat" className="rounded-lg px-2 text-xl text-slate-400 hover:bg-slate-100">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
