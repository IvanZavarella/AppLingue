// simboli.js - L'alfabeto della lingua (per ora solo l'hangul coreano):
// tabella delle lettere, come si formano le sillabe e due quiz a scelta
// multipla (lettera -> suono, parola -> lettura).

import { GRUPPI_HANGUL, PAROLE_DA_LEGGERE, SILLABE } from "../contenuti/hangul.js";
import { bottoneAudio } from "../esercizi.js";
import { linguaInterfaccia, t, tr } from "../i18n.js";
import { el, mescola, pronuncia, puoPronunciare, riempi } from "../utili.js";

const SCHEDE = ["lettere", "sillabe", "quiz", "leggi"];
let schedaAttiva = "lettere";
let insiemeQuiz = "vocali";

export function mostra(contenitore) {
  const corpo = el("div.corpo-scheda");
  riempi(contenitore,
    el("header.testata", {}, el("h1", { lang: "ko" }, t("simboli.titolo")), el("p.sottotitolo", {}, t("simboli.sottotitolo"))),
    el("div.segmenti", { role: "tablist" }, SCHEDE.map((id) => el("button", {
      type: "button",
      role: "tab",
      "aria-selected": String(id === schedaAttiva),
      onclick: () => { schedaAttiva = id; mostra(contenitore); },
    }, t(`simboli.tab.${id}`)))),
    !puoPronunciare() && el("p.avviso", {}, t("simboli.no_voce")),
    corpo);
  ({ lettere: mostraLettere, sillabe: mostraSillabe, quiz: mostraQuizLettere, leggi: mostraQuizParole })[schedaAttiva](corpo);
}

function mostraLettere(corpo) {
  const dettaglio = el("div.dettaglio-lettera", { "aria-live": "polite" }, el("p.suggerimento", {}, t("simboli.tocca")));
  corpo.append(dettaglio, ...GRUPPI_HANGUL.map((gruppo) => el("section.gruppo-lettere", {},
    el("h2", {}, tr(gruppo.titolo)),
    gruppo.nota && el("p.nota", {}, tr(gruppo.nota)),
    el("div.griglia-lettere", {}, gruppo.lettere.map((l) => el("button.tessera-lettera", {
      type: "button",
      onclick: () => {
        pronuncia(l.esempio, "ko");
        riempi(dettaglio,
          el("div.dettaglio-grande", { lang: "ko" }, l.lettera),
          el("div", {},
            el("p.dettaglio-rom", {}, l.rom),
            el("p", {}, tr(l.nota)),
            el("p.nota", {}, `${t("simboli.esempio")} `, el("span", { lang: "ko" }, l.esempio)),
            bottoneAudio(l.esempio, "ko")));
      },
    }, el("span.glifo", { lang: "ko" }, l.lettera), el("span.rom", {}, l.rom)))))));
}

function mostraSillabe(corpo) {
  corpo.append(el("article.testo", {},
    el("p", {}, t("sillabe.intro")),
    SILLABE.map((gruppo) => [
      el("h3", {}, t(`sillabe.${gruppo.regola}.titolo`)),
      el("p", {}, t(`sillabe.${gruppo.regola}.testo`)),
      gruppo.esempi.map(([sillaba, pezzi, rom]) => el("div.esempio-sillaba", {},
        el("span.sillaba", { lang: "ko" }, sillaba),
        el("span.uguale", {}, "="),
        el("span.pezzi", { lang: "ko" }, pezzi.join(" + ")),
        el("span.rom", {}, rom),
        bottoneAudio(sillaba, "ko"))),
    ]),
    el("p", {}, t("sillabe.fine"))));
}

function mostraQuizLettere(corpo) {
  const insiemi = [...GRUPPI_HANGUL.map((g) => ({ id: g.id, nome: tr(g.titolo), lettere: g.lettere })),
    { id: "tutte", nome: t("simboli.quiz_tutte"), lettere: GRUPPI_HANGUL.flatMap((g) => g.lettere) }];
  const insieme = insiemi.find((i) => i.id === insiemeQuiz) || insiemi[0];
  corpo.append(
    el("div.chip-gruppo", { role: "radiogroup" }, insiemi.map((i) => el("button.chip", {
      type: "button",
      role: "radio",
      "aria-checked": String(i.id === insieme.id),
      onclick: () => { insiemeQuiz = i.id; riempi(corpo); mostraQuizLettere(corpo); },
    }, i.nome))),
    quiz({
      elementi: insieme.lettere,
      domanda: (l) => el("div.domanda-grande", { lang: "ko" }, l.lettera),
      risposta: (l) => l.rom,
      dopo: (l) => { pronuncia(l.esempio, "ko"); return el("p.nota", {}, tr(l.nota)); },
    }),
  );
}

function mostraQuizParole(corpo) {
  const ui = linguaInterfaccia();
  corpo.append(
    el("p.nota", {}, t("simboli.leggi_nota")),
    quiz({
      elementi: PAROLE_DA_LEGGERE,
      domanda: (p) => el("div.domanda-grande.parola", { lang: "ko" }, p.ko),
      risposta: (p) => p.rom,
      dopo: (p) => { pronuncia(p.ko, "ko"); return el("p.traduzione", {}, `= ${p[ui]}`); },
    }),
  );
}

// Quiz a scelta multipla: un elemento alla volta, 4 risposte possibili
function quiz({ elementi, domanda, risposta, dopo }) {
  const riquadro = el("section.quiz", { "aria-live": "polite" });
  const punteggio = el("p.punteggio", {}, t("simboli.quiz_domanda"));
  let coda = [];
  let giuste = 0;
  let fatte = 0;

  function prossima() {
    if (!coda.length) coda = mescola(elementi);
    const elemento = coda.pop();
    const corretta = risposta(elemento);
    const altre = mescola([...new Set(elementi.map(risposta).filter((r) => r !== corretta))]).slice(0, 3);
    const esito = el("div.esito-quiz");
    const bottoni = mescola([corretta, ...altre]).map((opzione) => el("button.opzione", {
      type: "button",
      onclick: () => {
        fatte++;
        if (opzione === corretta) giuste++;
        for (const b of bottoni) {
          b.disabled = true;
          if (b.textContent === corretta) b.classList.add("giusta");
          else if (b.textContent === opzione) b.classList.add("sbagliata");
        }
        punteggio.textContent = t("simboli.punteggio", { giuste, fatte });
        riempi(esito,
          dopo(elemento),
          el("button.primario.grande", { type: "button", onclick: prossima }, t("btn.continua")));
        esito.querySelector("button").focus();
      },
    }, opzione));
    riempi(riquadro, punteggio, domanda(elemento), el("div.opzioni", {}, bottoni), esito);
  }

  prossima();
  return riquadro;
}
