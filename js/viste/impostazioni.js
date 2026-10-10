// impostazioni.js - Lingua dell'app, romanizzazione, esercizi di
// pronuncia, voci disponibili, azzeramento dei progressi e backup.

import {
  aggiornaImpostazioni, azzeraProgresso, esportaBackup, importaBackup, impostazioni, leggi,
} from "../archivio.js";
import { DA_IMPARARE, INTERFACCE, NOMI_NATIVI, linguaInterfaccia, t } from "../i18n.js";
import { el, icona, puoRiconoscere, riempi } from "../utili.js";

export function mostra(radice, ridisegna, messaggio = null) {
  const ui = linguaInterfaccia();
  const imp = impostazioni();
  const ultima = leggi("ultimaLingua", null);
  const indietro = ultima && ultima !== ui ? `#${ultima}/vocabolario` : "#home";
  const ricarica = (testo) => mostra(radice, ridisegna, testo && el("p.avviso", { role: "status" }, testo));

  const interruttore = (id, etichetta, valore, chiave, nota) => el("div.campo", {},
    el("label.interruttore", { for: id },
      el("input", { type: "checkbox", id, checked: valore, onchange: (e) => aggiornaImpostazioni({ [chiave]: e.target.checked }) }),
      el("span", {}, etichetta)),
    nota && el("p.nota", {}, nota));

  const voci = "speechSynthesis" in window ? speechSynthesis.getVoices() : [];
  const haVoce = (codice) => voci.some((v) => v.lang?.replace("_", "-").startsWith(codice));

  const inputBackup = el("input", { type: "file", id: "file-backup", accept: ".json,application/json", hidden: true });
  inputBackup.addEventListener("change", async () => {
    const file = inputBackup.files?.[0];
    if (!file) return;
    try {
      importaBackup(JSON.parse(await file.text()));
      ricarica(t("imp.caricato"));
    } catch {
      ricarica(t("imp.errore_backup"));
    }
  });

  riempi(radice,
    el("main.vista", {},
      el("header.barra-semplice", {},
        el("a.indietro", { href: indietro }, icona("indietro"), el("span", {}, t("btn.indietro"))),
        el("h1", {}, t("imp.titolo"))),
      messaggio,

      el("section.scheda", {},
        el("h2", {}, t("imp.interfaccia")),
        el("div.chip-gruppo", { role: "radiogroup" }, INTERFACCE.map((codice) => el("button.chip", {
          type: "button",
          role: "radio",
          lang: codice,
          "aria-checked": String(codice === ui),
          onclick: () => { aggiornaImpostazioni({ interfaccia: codice }); ricarica(); },
        }, NOMI_NATIVI[codice])))),

      el("section.scheda", {},
        interruttore("romanizzazione", t("imp.romanizzazione"), imp.romanizzazione, "romanizzazione"),
        puoRiconoscere() && interruttore("parlato", t("imp.parlato"), imp.parlato, "parlato", t("imp.parlato_nota"))),

      voci.length > 0 && el("section.scheda", {},
        el("h2", {}, t("imp.voci")),
        el("ul.lista-voci", {}, DA_IMPARARE.map((codice) => el("li", {},
          el("span", {}, t(`lingua.${codice}`)),
          el(`span.stato-voce.${haVoce(codice) ? "si" : "no"}`, {}, haVoce(codice) ? t("imp.voce_si") : t("imp.voce_no"))))),
        el("p.nota", {}, t("imp.voci_nota"))),

      el("section.scheda", {},
        el("h2", {}, t("imp.backup")),
        el("p.nota", {}, t("imp.backup_nota")),
        el("div.azioni", {},
          el("button", { type: "button", onclick: scaricaBackup }, t("imp.scarica")),
          inputBackup,
          el("label.bottone", { for: "file-backup" }, t("imp.carica")))),

      el("section.scheda", {},
        el("div.azioni", {}, DA_IMPARARE.map((codice) => {
          const nome = t(`lingua.${codice}`);
          return el("button.pericolo-leggero", {
            type: "button",
            onclick: (e) => {
              if (!e.currentTarget.dataset.conferma) {
                e.currentTarget.dataset.conferma = "1";
                e.currentTarget.textContent = t("imp.azzera_conferma", { lingua: nome });
                return;
              }
              azzeraProgresso(codice);
              ricarica(t("imp.azzerato", { lingua: nome }));
            },
          }, t("imp.azzera", { lingua: nome }));
        }))),
    ),
  );
}

function scaricaBackup() {
  const blob = new Blob([JSON.stringify(esportaBackup(), null, 2)], { type: "application/json" });
  const link = el("a", { href: URL.createObjectURL(blob), download: `passo-backup-${new Date().toISOString().slice(0, 10)}.json` });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
