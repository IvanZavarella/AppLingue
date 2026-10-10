// lezioni.js - Costruisce la lista di esercizi di ogni lezione a partire
// dai contenuti dell'unità. Ogni unità ha 4 lezioni:
//   0. Parole 1  - le prime 5 parole
//   1. Parole 2  - le altre parole
//   2. Frasi     - comporre e tradurre le frasi
//   3. Ripasso   - un po' di tutto
// più gli esercizi di ascolto (sezione Ascolto) e il ripasso delle parole
// sbagliate più spesso.

import { lezioneFatta, parlatoAttivo, progresso } from "./archivio.js";
import { UNITA } from "./contenuti/corso.js";
import { mescola, prendi, puoRiconoscere } from "./utili.js";

export const LEZIONI_PER_UNITA = 4;

export const TUTTE_LE_PAROLE = UNITA.flatMap((u) => u.parole);
export const TUTTE_LE_FRASI = UNITA.flatMap((u) => u.frasi);

function conParlato() {
  return parlatoAttivo() && puoRiconoscere();
}

export function unitaPerId(id) {
  return UNITA.find((u) => u.id === id);
}

// --- Sblocco ---------------------------------------------------------------

export function lezioneSbloccata(lingua, indiceUnita, n) {
  if (n > 0) return lezioneFatta(lingua, UNITA[indiceUnita].id, n - 1);
  if (indiceUnita === 0) return true;
  return lezioneFatta(lingua, UNITA[indiceUnita - 1].id, LEZIONI_PER_UNITA - 1);
}

export function unitaIniziata(lingua, idUnita) {
  return lezioneFatta(lingua, idUnita, 0);
}

export function dialogoSbloccato(lingua, idUnita) {
  return lezioneFatta(lingua, idUnita, 2);
}

export function lezioniFatte(lingua) {
  return Object.keys(progresso(lingua).lezioni).length;
}

export const TOTALE_LEZIONI = UNITA.length * LEZIONI_PER_UNITA;

// --- Esercizi --------------------------------------------------------------

export function eserciziLezione(unita, n) {
  const parole = unita.parole;
  const frasi = unita.frasi;

  if (n === 0 || n === 1) {
    const gruppo = n === 0 ? parole.slice(0, 5) : parole.slice(5);
    // Ogni parola nuova viene presentata e subito chiesta
    const introduzione = gruppo.flatMap((p) => [
      { tipo: "nuova", voce: p },
      { tipo: "scegli-significato", voce: p, gruppo: parole },
    ]);
    const pratica = [
      ...prendi(gruppo, 3).map((p) => ({ tipo: "scegli-parola", voce: p, gruppo: parole })),
      ...prendi(gruppo, 2).map((p) => ({ tipo: "ascolta", voce: p, gruppo: parole })),
      { tipo: "abbina", voci: gruppo },
    ];
    if (conParlato()) pratica.push({ tipo: "parla", voce: prendi(gruppo, 1)[0] });
    return [...introduzione, ...mescola(pratica)];
  }

  if (n === 2) {
    const pratica = [
      ...frasi.map((f) => ({ tipo: "componi", voce: f })),
      ...prendi(frasi, 2).map((f) => ({ tipo: "traduci", voce: f })),
      { tipo: "componi-ascolto", voce: prendi(frasi, 1)[0] },
    ];
    if (conParlato()) pratica.push({ tipo: "parla", voce: prendi(frasi, 1)[0] });
    return [{ tipo: "abbina", voci: prendi(parole, 5) }, ...mescola(pratica)];
  }

  // Ripasso dell'unità
  const pratica = [
    ...prendi(parole, 2).map((p) => ({ tipo: "scegli-significato", voce: p, gruppo: parole })),
    ...prendi(parole, 2).map((p) => ({ tipo: "scegli-parola", voce: p, gruppo: parole })),
    ...prendi(parole, 2).map((p) => ({ tipo: "ascolta", voce: p, gruppo: parole })),
    ...prendi(frasi, 2).map((f) => ({ tipo: "componi", voce: f })),
    { tipo: "traduci", voce: prendi(frasi, 1)[0] },
    { tipo: "componi-ascolto", voce: prendi(frasi, 1)[0] },
    { tipo: "abbina", voci: prendi(parole, 5) },
  ];
  if (conParlato()) pratica.push({ tipo: "parla", voce: prendi([...parole, ...frasi], 1)[0] });
  return mescola(pratica);
}

export function eserciziAscolto(unita) {
  return mescola([
    ...prendi(unita.parole, 4).map((p) => ({ tipo: "ascolta", voce: p, gruppo: unita.parole })),
    ...prendi(unita.frasi, 3).map((f) => ({ tipo: "ascolta-frase", voce: f, gruppo: TUTTE_LE_FRASI })),
    ...prendi(unita.frasi, 3).map((f) => ({ tipo: "componi-ascolto", voce: f })),
  ]);
}

// Parole già incontrate, ordinate da quella sbagliata più spesso
export function paroleDifficili(lingua, quante = 8) {
  const statistiche = progresso(lingua).parole;
  return TUTTE_LE_PAROLE
    .filter((p) => statistiche[p.id]?.sbagliate > 0)
    .sort((a, b) => {
      const sa = statistiche[a.id];
      const sb = statistiche[b.id];
      return (sb.sbagliate - sb.giuste / 2) - (sa.sbagliate - sa.giuste / 2);
    })
    .slice(0, quante);
}

export function eserciziRipasso(lingua) {
  const parole = paroleDifficili(lingua);
  if (!parole.length) return [];
  const tipi = ["scegli-significato", "scegli-parola", "ascolta"];
  const esercizi = mescola(parole.map((p, i) => ({ tipo: tipi[i % tipi.length], voce: p, gruppo: TUTTE_LE_PAROLE })));
  if (parole.length >= 3) esercizi.push({ tipo: "abbina", voci: prendi(parole, 5) });
  return esercizi;
}
