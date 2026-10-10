// vocabolario.js - Il percorso delle lezioni (unità una sotto l'altra, tutte
// apribili da subito: viene solo suggerita la prossima lezione da fare) e
// l'avvio di lezioni e ripasso.

import { lezioneFatta, registraLezione } from "../archivio.js";
import { UNITA } from "../contenuti/corso.js";
import { avviaSessione } from "../esercizi.js";
import { t, tr } from "../i18n.js";
import {
  LEZIONI_PER_UNITA, eserciziLezione, eserciziRipasso, lezioniFatte, paroleDifficili, prossimaLezione,
} from "../lezioni.js";
import { el, icona, riempi } from "../utili.js";

export function mostra(contenitore, lingua) {
  const difficili = paroleDifficili(lingua);
  const attuale = prossimaLezione(lingua);

  riempi(contenitore,
    lingua === "ko" && lezioniFatte(lingua) === 0
      && el("a.avviso-link", { href: "#ko/simboli" }, t("percorso.consiglio_hangul")),
    difficili.length > 0 && el("a.bottone-ripasso", { href: `#${lingua}/ripasso` },
      el("strong", {}, t("percorso.ripasso")),
      el("span", {}, t("percorso.ripasso_nota"))),
    el("ol.percorso", {}, UNITA.map((unita, i) => el("li.unita", { dataset: { stato: statoUnita(lingua, unita) } },
      el("header", {},
        el("p.etichetta-piccola", {}, t("percorso.unita", { n: i + 1 })),
        el("h2", {}, tr(unita.titolo)),
        lingua === "ko" && unita.nota && el("p.nota", {}, tr(unita.nota))),
      el("ol.lezioni", {}, Array.from({ length: LEZIONI_PER_UNITA }, (_, n) =>
        el("li", {}, nodoLezione(lingua, unita, n, attuale === `${unita.id}-${n}`))))))),
  );
}

function statoUnita(lingua, unita) {
  if (lezioneFatta(lingua, unita.id, LEZIONI_PER_UNITA - 1)) return "completata";
  if (lezioneFatta(lingua, unita.id, 0)) return "iniziata";
  return "nuova";
}

function nodoLezione(lingua, unita, n, attuale) {
  const nome = t(`percorso.lezione.${n}`);
  const fatta = lezioneFatta(lingua, unita.id, n);
  return el(`a.nodo${fatta ? ".fatto" : ""}${attuale ? ".attuale" : ""}`, {
    href: `#${lingua}/lezione/${unita.id}/${n}`,
    "aria-label": `${tr(unita.titolo)}: ${nome}`,
  },
  attuale && el("span.fumetto", {}, t("percorso.inizia")),
  el("span.cerchio", {}, fatta ? icona("spunta") : String(n + 1)),
  el("span.nome-nodo", {}, nome));
}

export function avviaLezione(radice, lingua, idUnita, n) {
  const indice = UNITA.findIndex((u) => u.id === idUnita);
  const torna = () => { location.hash = `#${lingua}/vocabolario`; };
  if (indice === -1 || !(n >= 0 && n < LEZIONI_PER_UNITA)) { torna(); return; }
  avviaSessione(radice, {
    lingua,
    esercizi: eserciziLezione(UNITA[indice], n),
    registra: () => registraLezione(lingua, idUnita, n),
    alFine: torna,
    alUscita: torna,
  });
}

export function avviaRipasso(radice, lingua) {
  const torna = () => { location.hash = `#${lingua}/vocabolario`; };
  const esercizi = eserciziRipasso(lingua);
  if (!esercizi.length) { torna(); return; }
  avviaSessione(radice, { lingua, esercizi, titoloFine: t("fine.titolo_ripasso"), alFine: torna, alUscita: torna });
}
