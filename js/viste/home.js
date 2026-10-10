// home.js - Schermata iniziale: lingua dell'app e "cosa vuoi imparare oggi?"

import { aggiornaImpostazioni, progresso, serieAttuale } from "../archivio.js";
import { DA_IMPARARE, INTERFACCE, NOMI_NATIVI, linguaInterfaccia, t } from "../i18n.js";
import { TOTALE_LEZIONI, lezioniFatte } from "../lezioni.js";
import { el, icona, riempi } from "../utili.js";

// Una parola di saluto per ogni lingua, come "copertina" della scheda
const SALUTI = { en: "Hello", fr: "Bonjour", ko: "안녕", it: "Ciao" };

export function mostra(radice, ridisegna) {
  const ui = linguaInterfaccia();
  const serie = serieAttuale();

  riempi(radice,
    el("main.vista.home", {},
      el("header.testata-home", {},
        el("div", {},
          el("h1.marchio", {}, t("app.nome")),
          el("p.sottotitolo", {}, t("app.motto"))),
        el("div.contatori", {},
          serie > 0 && el("span.contatore.serie", { title: t("barra.serie", { n: serie }) }, icona("fiamma"), String(serie)),
          el("a.icona-bottone", { href: "#impostazioni", "aria-label": t("barra.impostazioni") }, icona("ingranaggio")))),

      el("section.scelta-interfaccia", { "aria-labelledby": "titolo-interfaccia" },
        el("h2.etichetta-piccola", { id: "titolo-interfaccia" }, t("home.interfaccia")),
        el("div.chip-gruppo", { role: "radiogroup", "aria-labelledby": "titolo-interfaccia" },
          INTERFACCE.map((codice) => el("button.chip", {
            type: "button",
            role: "radio",
            lang: codice,
            "aria-checked": String(codice === ui),
            onclick: () => { aggiornaImpostazioni({ interfaccia: codice }); ridisegna(); },
          }, NOMI_NATIVI[codice])))),

      el("h2.domanda-home", {}, t("home.domanda")),
      el("ul.lista-lingue", {}, DA_IMPARARE.map((codice) => el("li", {}, schedaLingua(codice, ui)))),
    ),
  );
}

function schedaLingua(codice, ui) {
  const contenuto = [
    el("span.copertina", { lang: codice, "aria-hidden": "true" }, SALUTI[codice]),
    el("span.testi", {},
      el("span.nome", {}, t(`lingua.${codice}`)),
      el("span.nativo", { lang: codice }, NOMI_NATIVI[codice]),
      el("span.avanzamento", {}, codice === ui ? t("home.tua_lingua") : descriviAvanzamento(codice))),
  ];
  if (codice === ui) return el("div.scheda-lingua.disattivata", { dataset: { lingua: codice } }, contenuto);
  return el("a.scheda-lingua", { href: `#${codice}/vocabolario`, dataset: { lingua: codice } }, contenuto);
}

function descriviAvanzamento(codice) {
  const fatte = lezioniFatte(codice);
  if (!fatte) return t("home.nuova");
  return t("home.avanzamento", { fatte, totale: TOTALE_LEZIONI, xp: progresso(codice).xp });
}
