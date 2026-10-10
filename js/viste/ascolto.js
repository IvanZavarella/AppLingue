// ascolto.js - Esercizi di ascolto per ogni unità già iniziata, più
// alcune ricerche YouTube con video per chi impara (link sempre reali).

import { progresso, registraPratica } from "../archivio.js";
import { RICERCHE_VIDEO, UNITA } from "../contenuti/corso.js";
import { avviaSessione } from "../esercizi.js";
import { t, tr } from "../i18n.js";
import { eserciziAscolto, unitaIniziata, unitaPerId } from "../lezioni.js";
import { el, icona, riempi } from "../utili.js";

export function mostra(contenitore, lingua) {
  const fatte = progresso(lingua).ascolto;
  riempi(contenitore,
    el("header.testata", {}, el("h1", {}, t("ascolto.titolo")), el("p.sottotitolo", {}, t("ascolto.sottotitolo"))),
    el("ul.lista-attivita", {}, UNITA.map((unita, i) => el("li", {},
      voceAttivita({
        sbloccata: unitaIniziata(lingua, unita.id),
        href: `#${lingua}/pratica-ascolto/${unita.id}`,
        titolo: `${t("percorso.unita", { n: i + 1 })} · ${tr(unita.titolo)}`,
        dettaglio: fatte[unita.id] ? t("ascolto.fatta", { n: fatte[unita.id] }) : t("ascolto.pratica"),
        motivoBlocco: t("ascolto.bloccata"),
      })))),
    el("section.video", {},
      el("h2", {}, t("ascolto.video")),
      el("p.nota", {}, t("ascolto.video_nota")),
      el("ul.lista-video", {}, RICERCHE_VIDEO[lingua].map((r) => el("li", {},
        el("a", { href: `https://www.youtube.com/results?search_query=${encodeURIComponent(r.testo)}`, target: "_blank", rel: "noopener" },
          el("span.livello", {}, r.livello),
          el("span", {}, r.testo)))))),
  );
}

// Riga di un elenco di attività (usata anche da Conversazione)
export function voceAttivita({ sbloccata, href, titolo, dettaglio, motivoBlocco, icona: nomeIcona = "altoparlante" }) {
  if (!sbloccata) {
    return el("div.attivita.bloccata", { "aria-disabled": "true" },
      el("span.cerchio-piccolo", {}, icona("lucchetto")),
      el("span.testi", {}, el("strong", {}, titolo), el("span", {}, motivoBlocco)));
  }
  return el("a.attivita", { href },
    el("span.cerchio-piccolo", {}, icona(nomeIcona)),
    el("span.testi", {}, el("strong", {}, titolo), el("span", {}, dettaglio)));
}

export function avviaPratica(radice, lingua, idUnita) {
  const unita = unitaPerId(idUnita);
  const torna = () => { location.hash = `#${lingua}/ascolto`; };
  if (!unita || !unitaIniziata(lingua, idUnita)) { torna(); return; }
  avviaSessione(radice, {
    lingua,
    esercizi: eserciziAscolto(unita),
    titoloFine: t("fine.titolo_ascolto"),
    registra: () => registraPratica(lingua, "ascolto", idUnita),
    alFine: torna,
    alUscita: torna,
  });
}
