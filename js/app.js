// app.js - Sceglie cosa mostrare in base all'indirizzo, così il tasto
// "indietro" del telefono funziona:
//   #home                          scelta della lingua
//   #impostazioni
//   #fr/vocabolario                percorso delle lezioni (idem ascolto,
//   #fr/ascolto                    conversazione e, per il coreano,
//   #fr/conversazione              simboli)
//   #fr/lezione/saluti/0           una lezione
//   #fr/ripasso                    ripasso delle parole difficili
//   #fr/pratica-ascolto/saluti     esercizi di ascolto di un'unità
//   #fr/dialogo/saluti             un dialogo guidato

import { progresso, scrivi, serieAttuale } from "./archivio.js";
import { DA_IMPARARE, NOMI_NATIVI, linguaInterfaccia, t } from "./i18n.js";
import { el, icona, riempi, svg } from "./utili.js";
import * as ascolto from "./viste/ascolto.js";
import * as conversazione from "./viste/conversazione.js";
import * as home from "./viste/home.js";
import * as impostazioni from "./viste/impostazioni.js";
import * as simboli from "./viste/simboli.js";
import * as vocabolario from "./viste/vocabolario.js";

const radice = document.getElementById("app");
let pulisci = null;

const ICONE_SCHEDE = {
  vocabolario: '<rect x="4" y="5" width="13" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 3h10a2 2 0 0 1 2 2v12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  ascolto: '<path d="M4 14v-2a8 8 0 0 1 16 0v2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="4" height="6" rx="1.5" fill="currentColor"/><rect x="17" y="14" width="4" height="6" rx="1.5" fill="currentColor"/>',
  conversazione: '<path d="M4 5h16v10H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
};

const SEZIONI = { vocabolario, ascolto, conversazione, simboli };

function schedeDisponibili(lingua) {
  return lingua === "ko" ? ["vocabolario", "ascolto", "conversazione", "simboli"] : ["vocabolario", "ascolto", "conversazione"];
}

// Barra in alto e schede in basso per le sezioni di una lingua
function guscio(lingua, sezione) {
  const contenuto = el("main.vista");
  const p = progresso(lingua);
  riempi(radice,
    el("header.barra-lingua", {},
      el("a.indietro", { href: "#home" }, icona("indietro"), el("span", {}, t("barra.lingue"))),
      el("span.nome-lingua", { lang: lingua }, NOMI_NATIVI[lingua]),
      el("span.contatori", {},
        el("span.contatore.serie", { title: t("barra.serie", { n: serieAttuale() }) }, icona("fiamma"), String(serieAttuale())),
        el("span.contatore.xp", { title: t("barra.xp", { n: p.xp }) }, icona("stella"), String(p.xp))),
      el("a.icona-bottone", { href: "#impostazioni", "aria-label": t("barra.impostazioni") }, icona("ingranaggio"))),
    contenuto,
    el("nav.navigazione", { "aria-label": NOMI_NATIVI[lingua] },
      schedeDisponibili(lingua).map((s) => el("a", {
        href: `#${lingua}/${s}`,
        "aria-current": s === sezione ? "page" : null,
      },
      s === "simboli"
        ? el("span.icona", { lang: "ko", "aria-hidden": "true" }, "한")
        : el("span.icona", {}, svg(ICONE_SCHEDE[s])),
      el("span", {}, t(`nav.${s}`))))),
  );
  return contenuto;
}

function apri() {
  pulisci?.();
  pulisci = null;
  window.speechSynthesis?.cancel();
  const ui = linguaInterfaccia();
  document.documentElement.lang = ui;
  window.scrollTo(0, 0);

  const [primo = "home", sezione = "vocabolario", ...resto] = location.hash.slice(1).split("/").filter(Boolean);
  delete document.body.dataset.lingua;

  if (primo === "impostazioni") {
    impostazioni.mostra(radice, apri);
    return;
  }
  if (!DA_IMPARARE.includes(primo) || primo === ui) {
    home.mostra(radice, apri);
    return;
  }

  const lingua = primo;
  document.body.dataset.lingua = lingua;
  scrivi("ultimaLingua", lingua);

  switch (sezione) {
    case "lezione": vocabolario.avviaLezione(radice, lingua, resto[0], Number(resto[1])); return;
    case "ripasso": vocabolario.avviaRipasso(radice, lingua); return;
    case "pratica-ascolto": ascolto.avviaPratica(radice, lingua, resto[0]); return;
    case "dialogo": pulisci = conversazione.avviaDialogo(radice, lingua, resto[0]); return;
    default: {
      const nome = schedeDisponibili(lingua).includes(sezione) ? sezione : "vocabolario";
      SEZIONI[nome].mostra(guscio(lingua, nome), lingua);
    }
  }
}

window.addEventListener("hashchange", apri);
apri();
