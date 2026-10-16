const RENKLER = ['#f0dab0', '#cda468', '#e7cda0', '#8a6a3e', '#f6f4f0', '#86d3a0']

/** Rastgele konfeti parçaları üretir (olay anında çağrılır, render sırasında değil). */
export const konfetiUret = () =>
  Array.from({ length: 64 }, (_, i) => ({
    i,
    x: (Math.random() - 0.5) * Math.min(window.innerWidth, 1100),
    y: -(Math.random() * 0.45 + 0.35) * window.innerHeight,
    dusus: window.innerHeight,
    donus: Math.random() * 900 - 450,
    renk: RENKLER[i % RENKLER.length],
    en: 5 + Math.random() * 6,
    boy: 8 + Math.random() * 11,
    gecikme: Math.random() * 0.2,
  }))
