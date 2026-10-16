import { useEffect } from 'react'

/**
 * Klavye kısayolları: "/" aramaya, "n" yeni başvuru formuna odaklanır.
 * Bir girdi alanına yazı yazılırken kısayollar devre dışıdır.
 */
export function useKisayollar(eslemeler) {
  useEffect(() => {
    const tus = (e) => {
      const hedef = e.target
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (hedef.closest('input, textarea, select, [contenteditable="true"]')) return
      const islem = eslemeler[e.key.toLocaleLowerCase('tr')]
      if (islem) {
        e.preventDefault()
        islem()
      }
    }
    window.addEventListener('keydown', tus)
    return () => window.removeEventListener('keydown', tus)
  }, [eslemeler])
}
