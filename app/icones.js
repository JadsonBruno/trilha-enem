// Ícones SVG inline (currentColor).
const S = (p, extra = "") => `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${p}</svg>`;
const F = (p) => `<svg class="i" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${p}</svg>`;
export const ICON = {
  flame: F('<path d="M12 2c1.2 4 5.5 5.6 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.3 1.1-3.9 2.3-5 0 2.2 1 3.3 2.2 3.3 0-3.3-1.3-5.4 1-8.8z"/>'),
  bolt: F('<path d="M13.5 2 4 14h7l-1.5 8L19 10h-7z"/>'),
  heart: F('<path d="M12 21s-7.5-4.6-9.6-9.2A5.2 5.2 0 0 1 12 6.4a5.2 5.2 0 0 1 9.6 5.4C19.5 16.4 12 21 12 21z"/>'),
  heartBroken: S('<path d="M12 21s-7.5-4.6-9.6-9.2A5.2 5.2 0 0 1 12 6.4a5.2 5.2 0 0 1 9.6 5.4C19.5 16.4 12 21 12 21z"/><path d="m12 6.4-2 4 3 2-2 4.5"/>'),
  lock: S('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  play: F('<path d="M8 5v14l11-7z"/>'),
  check: S('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 'stroke-width="3"'),
  x: S('<path d="M6 6l12 12M18 6 6 18"/>', 'stroke-width="2.6"'),
  star: F('<path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/>'),
  trophy: S('<path d="M8 4h8v6a4 4 0 0 1-8 0zM8 6H4v1a3 3 0 0 0 4 2.8M16 6h4v1a3 3 0 0 1-4 2.8M12 14v4M8.5 20h7"/>'),
  settings: S('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>'),
  bulb: S('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'),
  trilha: S('<rect x="3" y="13" width="8" height="7" rx="2"/><rect x="13" y="13" width="8" height="7" rx="2"/><rect x="8" y="4" width="8" height="7" rx="2"/>'),
  revisao: S('<path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/>'),
  mapa: S('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 17.5h7M17.5 14v7"/>'),
  perfil: S('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'),
  // cartões de ensino
  conceito: S('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20"/>'),
  analogia: S('<path d="M9 8h-3a4 4 0 0 0 0 8h3M15 8h3a4 4 0 0 1 0 8h-3M8.5 12h7"/>'),
  exemplo: S('<path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3M7.5 15h9"/>'),
  enem: S('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>'),
  pegadinha: S('<path d="M12 3 2.5 20h19zM12 10v4.5M12 17.5v.2"/>'),
  sound: S('<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>'),
  copy: S('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'),
  book: S('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20"/>'),
};
export const ROTULO_CARTAO = { conceito: "Conceito", analogia: "Analogia", exemplo: "Exemplo", enem: "Como cai no ENEM", pegadinha: "Pegadinha" };
