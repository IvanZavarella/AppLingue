// esercizi.js - Il "motore" delle lezioni, in stile Duolingo: mostra un
// esercizio alla volta con la barra di avanzamento, controlla la risposta
// e rimette in fondo alla coda quelli sbagliati, finché non li indovini
// (al massimo 3 tentativi). Alla fine assegna gli XP.
//
// Tipi di esercizio (vedi lezioni.js per come vengono scelti):
//   nuova               presenta una parola nuova
//   scegli-significato  parola -> 4 traduzioni possibili
//   scegli-parola       traduzione -> 4 parole possibili
//   ascolta             audio -> 4 parole possibili
//   ascolta-frase       audio di una frase -> 3 traduzioni possibili
//   abbina              abbina 5 parole alle loro traduzioni
//   componi             traduzione -> componi la frase con le tessere
//   componi-ascolto     audio -> componi la frase con le tessere
//   traduci             frase -> componi la traduzione con le tessere
//   parla               ripeti la parola o la frase al microfono

import { aggiornaImpostazioni, impostazioni, registraParola, registraXp, serieAttuale } from "./archivio.js";
import { linguaInterfaccia, t } from "./i18n.js";
import { TUTTE_LE_FRASI } from "./lezioni.js";
import {
  SOGLIA_PRONUNCIA, el, icona, mescola, normalizza, prendi, pronuncia, riconosci, riempi, somiglianza, tessere,
} from "./utili.js";

// Esercizi su singole parole: aggiornano le statistiche per il ripasso
const TIPI_PAROLA = new Set(["scegli-significato", "scegli-parola", "ascolta"]);
const TENTATIVI_MASSIMI = 3;
const MINUTI_SENZA_PARLATO = 15;

export function romanizzazione(voce, lingua) {
  return lingua === "ko" && impostazioni().romanizzazione ? voce.ko_rom : "";
}

export function bottoneAudio(frase, lingua, { lento = false, grande = false } = {}) {
  return el(`button.audio${grande ? ".grande" : ""}${lento ? ".lento" : ""}`, {
    type: "button",
    "aria-label": lento ? t("btn.lento") : t("btn.ascolta"),
    onclick: (e) => { e.stopPropagation(); pronuncia(frase, lingua, lento); },
  }, icona(lento ? "lumaca" : "altoparlante"));
}

// Testo nella lingua da imparare, con la romanizzazione sotto (coreano)
function testoStraniero(voce, lingua, classe = "frase-straniera") {
  const rom = romanizzazione(voce, lingua);
  return el(`div.${classe}`, {},
    el("p.testo", { lang: lingua }, voce[lingua]),
    rom && el("p.rom", {}, rom));
}

function rigaAudio(frase, lingua, grande = false) {
  return el("div.riga-audio", {}, bottoneAudio(frase, lingua, { grande }), bottoneAudio(frase, lingua, { lento: true }));
}

// --- Sessione ---------------------------------------------------------------

// registra: chiamata appena la sessione è completata (prima del riepilogo)
// alFine: dopo il "Continua" del riepilogo; alUscita: se si esce prima
export function avviaSessione(contenitore, { lingua, esercizi, titoloFine, registra, alFine, alUscita }) {
  const coda = esercizi.map((es) => ({ ...es, tentativi: 0 }));
  const totale = coda.length;
  let completati = 0;
  let valutati = 0;
  let giustiAlPrimo = 0;

  const riempimento = el("div.riempimento");
  const barra = el("div.barra-progresso", { role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(totale) }, riempimento);
  const corpo = el("main.esercizio");
  const piede = el("footer.piede");

  const chiediUscita = () => {
    const pannello = el("div.conferma-uscita", { role: "alertdialog", "aria-label": t("esci.domanda") },
      el("p", {}, t("esci.domanda")),
      el("button.primario", { type: "button", onclick: () => pannello.remove() }, t("esci.resta")),
      el("button.pericolo", { type: "button", onclick: alUscita }, t("esci.conferma")));
    schermo.append(pannello);
    pannello.querySelector("button").focus();
  };

  const schermo = el("div.sessione", {},
    el("header.testa-sessione", {},
      el("button.icona-bottone", { type: "button", "aria-label": t("btn.esci"), onclick: chiediUscita }, icona("chiudi")),
      barra),
    corpo,
    piede);
  riempi(contenitore, schermo);

  const aggiornaBarra = () => {
    riempimento.style.width = `${(completati / totale) * 100}%`;
    barra.setAttribute("aria-valuenow", String(completati));
  };

  function prossimo() {
    aggiornaBarra();
    piede.className = "piede";
    if (!coda.length) { fine(); return; }
    const es = coda.shift();

    let bottone = null;
    const ctx = {
      lingua,
      ui: linguaInterfaccia(),
      pronto: (si) => { if (bottone) bottone.disabled = !si; },
      completa: (risultato) => esito(es, risultato),
      // "Non posso parlare ora": niente esercizi di pronuncia per un po'
      sospendiParlato: () => {
        aggiornaImpostazioni({ parlatoSospesoFino: Date.now() + MINUTI_SENZA_PARLATO * 60000 });
        const tolti = coda.filter((e) => e.tipo === "parla").length;
        coda.splice(0, coda.length, ...coda.filter((e) => e.tipo !== "parla"));
        completati += tolti + 1;
        prossimo();
      },
      salta: () => { completati++; prossimo(); },
    };

    const vista = DISEGNA[es.tipo](es, ctx);
    riempi(corpo, el("h2.consegna", {}, consegna(es, ctx)), vista.nodo);

    if (es.tipo === "nuova") {
      bottone = el("button.primario.grande", { type: "button", onclick: () => { completati++; prossimo(); } }, t("btn.continua"));
    } else if (vista.controlla) {
      bottone = el("button.primario.grande", {
        type: "button",
        disabled: true,
        onclick: () => esito(es, vista.controlla()),
      }, t("btn.controlla"));
    }
    riempi(piede, el("div.azioni-piede", {}, vista.extra, bottone));
    if (bottone && !bottone.disabled) bottone.focus();
  }

  function esito(es, risultato) {
    if (es.tentativi === 0) {
      valutati++;
      if (risultato.giusto) giustiAlPrimo++;
    }
    es.tentativi++;

    if (TIPI_PAROLA.has(es.tipo)) registraParola(lingua, es.voce.id, risultato.giusto);
    for (const id of risultato.errate || []) registraParola(lingua, id, false);

    const finito = risultato.giusto || risultato.nonRipetere || es.tentativi >= TENTATIVI_MASSIMI;
    if (finito) completati++;
    else coda.push(es);

    const giusto = risultato.giusto || risultato.nonRipetere;
    const frasi = t("esito.giusto");
    piede.className = `piede ${giusto ? "giusto" : "sbagliato"}`;
    riempi(piede,
      el("div.messaggio-esito", { role: "status" },
        el("p.titolo-esito", {}, risultato.messaggio || (giusto ? frasi[Math.floor(Math.random() * frasi.length)] : t("esito.sbagliato"))),
        !giusto && risultato.soluzione && el("div.soluzione", {}, risultato.soluzione),
        risultato.nota && el("p.nota-esito", {}, risultato.nota)),
      el("div.azioni-piede", {},
        el(`button.grande.${giusto ? "conferma" : "pericolo"}`, { type: "button", onclick: prossimo }, t("btn.continua"))));
    piede.querySelector("button").focus();
  }

  function fine() {
    const precisione = valutati ? Math.round((giustiAlPrimo / valutati) * 100) : 100;
    const xp = 10 + (precisione === 100 ? 5 : 0);
    registra?.();
    registraXp(lingua, xp);
    const serie = serieAttuale();

    const casella = (etichetta, valore, classe) => el(`div.casella-fine.${classe}`, {},
      el("span.etichetta", {}, etichetta), el("span.valore", {}, valore));

    riempi(contenitore,
      el("div.schermo-fine", {},
        el("div.medaglia", { "aria-hidden": "true" }, icona("stella")),
        el("h1", {}, titoloFine || t("fine.titolo")),
        el("div.caselle-fine", {},
          casella(t("fine.xp"), `+${xp}`, "xp"),
          casella(t("fine.precisione"), `${precisione}%`, "precisione"),
          casella(t("fine.serie"), serie === 1 ? t("fine.giorno") : t("fine.giorni", { n: serie }), "serie")),
        el("button.primario.grande", { type: "button", onclick: alFine }, t("btn.continua"))));
    contenitore.querySelector("button").focus();
  }

  prossimo();
}

function consegna(es, ctx) {
  if (es.tipo === "scegli-parola") return t("es.scegli-parola", { testo: es.voce[ctx.ui] });
  return t(`es.${es.tipo}`);
}

// --- Esercizi ---------------------------------------------------------------

const DISEGNA = {
  nuova(es, { lingua, ui }) {
    pronuncia(es.voce[lingua], lingua);
    return {
      nodo: el("div.carta-nuova", {},
        testoStraniero(es.voce, lingua, "parola-grande"),
        rigaAudio(es.voce[lingua], lingua),
        el("p.glossa", {}, es.voce[ui])),
    };
  },

  "scegli-significato"(es, ctx) {
    const { lingua, ui } = ctx;
    pronuncia(es.voce[lingua], lingua);
    return sceltaMultipla(ctx, {
      domanda: el("div.domanda", {}, testoStraniero(es.voce, lingua, "parola-grande"), bottoneAudio(es.voce[lingua], lingua)),
      opzioni: opzioniDa(es.voce, es.gruppo, ui, 4).map((v) => ({ id: v.id, etichetta: v[ui] })),
      corretta: es.voce.id,
      soluzione: es.voce[ui],
    });
  },

  "scegli-parola"(es, ctx) {
    const { lingua } = ctx;
    return sceltaMultipla(ctx, {
      opzioni: opzioniDa(es.voce, es.gruppo, lingua, 4).map((v) => ({
        id: v.id, etichetta: etichettaStraniera(v, lingua), lang: lingua, parla: v[lingua],
      })),
      corretta: es.voce.id,
      soluzione: testoStraniero(es.voce, lingua),
    });
  },

  ascolta(es, ctx) {
    const { lingua } = ctx;
    pronuncia(es.voce[lingua], lingua);
    return sceltaMultipla(ctx, {
      domanda: rigaAudio(es.voce[lingua], lingua, true),
      opzioni: opzioniDa(es.voce, es.gruppo, lingua, 4).map((v) => ({
        id: v.id, etichetta: etichettaStraniera(v, lingua), lang: lingua, parla: v[lingua],
      })),
      corretta: es.voce.id,
      soluzione: testoStraniero(es.voce, lingua),
    });
  },

  "ascolta-frase"(es, ctx) {
    const { lingua, ui } = ctx;
    pronuncia(es.voce[lingua], lingua);
    return sceltaMultipla(ctx, {
      domanda: rigaAudio(es.voce[lingua], lingua, true),
      opzioni: opzioniDa(es.voce, es.gruppo, ui, 3).map((v) => ({ id: v.id, etichetta: v[ui] })),
      corretta: es.voce.id,
      soluzione: el("div", {}, testoStraniero(es.voce, lingua), el("p", {}, es.voce[ui])),
    });
  },

  abbina(es, ctx) {
    return abbinamento(es.voci, ctx);
  },

  componi(es, ctx) {
    const { lingua, ui } = ctx;
    return composizione(ctx, {
      domanda: el("p.frase-da-tradurre", {}, es.voce[ui]),
      soluzione: es.voce[lingua],
      linguaTessere: lingua,
      altreFrasi: TUTTE_LE_FRASI.map((f) => f[lingua]),
      parlaTessere: true,
      mostraSoluzione: testoStraniero(es.voce, lingua),
    });
  },

  "componi-ascolto"(es, ctx) {
    const { lingua, ui } = ctx;
    pronuncia(es.voce[lingua], lingua);
    return composizione(ctx, {
      domanda: rigaAudio(es.voce[lingua], lingua, true),
      soluzione: es.voce[lingua],
      linguaTessere: lingua,
      altreFrasi: TUTTE_LE_FRASI.map((f) => f[lingua]),
      parlaTessere: false,
      mostraSoluzione: el("div", {}, testoStraniero(es.voce, lingua), el("p", {}, es.voce[ui])),
    });
  },

  traduci(es, ctx) {
    const { lingua, ui } = ctx;
    pronuncia(es.voce[lingua], lingua);
    return composizione(ctx, {
      domanda: el("div.domanda", {}, testoStraniero(es.voce, lingua), bottoneAudio(es.voce[lingua], lingua)),
      soluzione: es.voce[ui],
      linguaTessere: ui,
      altreFrasi: TUTTE_LE_FRASI.map((f) => f[ui]),
      parlaTessere: false,
      mostraSoluzione: el("p", {}, es.voce[ui]),
    });
  },

  parla(es, ctx) {
    return pronunciaAlMicrofono(es.voce, ctx);
  },
};

// Parola corretta + distrattori dello stesso gruppo, tutti con testo diverso
function opzioniDa(voce, gruppo, lingua, quante) {
  const visti = new Set([normalizza(voce[lingua], lingua)]);
  const altre = [];
  for (const v of mescola(gruppo)) {
    const chiave = normalizza(v[lingua], lingua);
    if (v.id === voce.id || visti.has(chiave)) continue;
    visti.add(chiave);
    altre.push(v);
    if (altre.length === quante - 1) break;
  }
  return mescola([voce, ...altre]);
}

function etichettaStraniera(voce, lingua) {
  const rom = romanizzazione(voce, lingua);
  return [el("span", { lang: lingua }, voce[lingua]), rom && el("small.rom", {}, rom)];
}

function sceltaMultipla(ctx, { domanda = null, opzioni, corretta, soluzione }) {
  let scelta = null;
  const bottoni = opzioni.map((opzione) => {
    const bottone = el("button.opzione", {
      type: "button",
      dataset: { id: opzione.id },
      onclick: () => {
        scelta = opzione.id;
        for (const b of bottoni) b.setAttribute("aria-pressed", String(b === bottone));
        if (opzione.parla) pronuncia(opzione.parla, ctx.lingua);
        ctx.pronto(true);
      },
    }, opzione.etichetta);
    return bottone;
  });

  return {
    nodo: el("div.scelta-multipla", {}, domanda, el("div.opzioni", {}, bottoni)),
    controlla() {
      for (const b of bottoni) {
        b.disabled = true;
        if (b.dataset.id === corretta) b.classList.add("giusta");
        else if (b.dataset.id === scelta) b.classList.add("sbagliata");
      }
      return { giusto: scelta === corretta, soluzione };
    },
  };
}

function composizione(ctx, { domanda, soluzione, linguaTessere, altreFrasi, parlaTessere, mostraSoluzione }) {
  const giuste = tessere(soluzione);
  const giusteNormalizzate = new Set(giuste.map((p) => normalizza(p, linguaTessere)));
  const candidati = [...new Set(altreFrasi.flatMap(tessere))]
    .filter((p) => !giusteNormalizzate.has(normalizza(p, linguaTessere)));
  const extra = prendi(candidati, Math.min(4, Math.max(2, Math.ceil(giuste.length / 2))));
  const banca = mescola([...giuste, ...extra]).map((parola, id) => ({ parola, id }));
  const scelte = [];

  const zonaRisposta = el("div.zona-risposta", { "aria-live": "polite" });
  const bottoniBanca = banca.map((tessera) => el("button.tessera", {
    type: "button",
    lang: linguaTessere,
    onclick: (e) => {
      if (e.currentTarget.classList.contains("usata")) return;
      e.currentTarget.classList.add("usata");
      e.currentTarget.disabled = true;
      scelte.push(tessera.id);
      if (parlaTessere) pronuncia(tessera.parola, linguaTessere);
      disegnaRisposta();
    },
  }, tessera.parola));

  function disegnaRisposta() {
    riempi(zonaRisposta, scelte.map((id) => el("button.tessera", {
      type: "button",
      lang: linguaTessere,
      onclick: () => {
        scelte.splice(scelte.indexOf(id), 1);
        bottoniBanca[banca.findIndex((t) => t.id === id)].classList.remove("usata");
        bottoniBanca[banca.findIndex((t) => t.id === id)].disabled = false;
        disegnaRisposta();
      },
    }, banca.find((t) => t.id === id).parola)));
    ctx.pronto(scelte.length > 0);
  }

  return {
    nodo: el("div.composizione", {}, domanda, zonaRisposta, el("div.banca", {}, bottoniBanca)),
    controlla() {
      for (const b of [...bottoniBanca, ...zonaRisposta.children]) b.disabled = true;
      const composta = scelte.map((id) => banca.find((t) => t.id === id).parola).join(" ");
      return {
        giusto: normalizza(composta, linguaTessere) === normalizza(giuste.join(" "), linguaTessere),
        soluzione: mostraSoluzione,
      };
    },
  };
}

function abbinamento(voci, ctx) {
  const { lingua, ui } = ctx;
  const errate = new Set();
  let fatte = 0;
  let selezionati = { s: null, d: null };

  const crea = (voce, lato) => el(`button.coppia.${lato}`, {
    type: "button",
    lang: lato === "s" ? lingua : ui,
    dataset: { id: voce.id },
    onclick: (e) => scegli(lato, e.currentTarget, voce),
  }, lato === "s" ? voce[lingua] : voce[ui]);

  const sinistra = mescola(voci).map((v) => crea(v, "s"));
  const destra = mescola(voci).map((v) => crea(v, "d"));

  function scegli(lato, bottone, voce) {
    if (lato === "s") pronuncia(voce[lingua], lingua);
    selezionati[lato]?.setAttribute("aria-pressed", "false");
    selezionati[lato] = bottone;
    bottone.setAttribute("aria-pressed", "true");
    const { s, d } = selezionati;
    if (!s || !d) return;
    selezionati = { s: null, d: null };
    if (s.dataset.id === d.dataset.id) {
      for (const b of [s, d]) { b.classList.add("fatta"); b.disabled = true; b.setAttribute("aria-pressed", "false"); }
      fatte++;
      if (fatte === voci.length) {
        ctx.completa({ giusto: errate.size === 0, nonRipetere: true, errate: [...errate], messaggio: t("esito.abbinate") });
      }
    } else {
      errate.add(s.dataset.id);
      errate.add(d.dataset.id);
      for (const b of [s, d]) {
        b.classList.add("errore");
        b.setAttribute("aria-pressed", "false");
        setTimeout(() => b.classList.remove("errore"), 600);
      }
    }
  }

  return { nodo: el("div.abbinamento", {}, el("div.colonna", {}, sinistra), el("div.colonna", {}, destra)) };
}

function pronunciaAlMicrofono(voce, ctx) {
  const { lingua, ui } = ctx;
  let tentativi = 0;
  const stato = el("p.stato-microfono", { role: "status" }, t("parla.tocca"));
  const salta = el("button", { type: "button", hidden: true, onclick: ctx.salta }, t("btn.salta"));

  const microfono = el("button.microfono", {
    type: "button",
    "aria-label": t("parla.tocca"),
    onclick: async () => {
      microfono.disabled = true;
      microfono.classList.add("attivo");
      stato.textContent = t("parla.ascolto");
      try {
        const sentite = await riconosci(lingua);
        if (!sentite.length) {
          stato.textContent = t("parla.niente");
        } else {
          const migliore = sentite
            .map((testo) => ({ testo, punteggio: somiglianza(voce[lingua], testo, lingua) }))
            .sort((a, b) => b.punteggio - a.punteggio)[0];
          if (migliore.punteggio >= SOGLIA_PRONUNCIA) {
            ctx.completa({ giusto: true, nota: t("esito.sentito", { testo: migliore.testo }) });
            return;
          }
          tentativi++;
          stato.textContent = `${t("parla.riprova")} ${t("esito.sentito", { testo: migliore.testo })}`;
        }
      } catch (errore) {
        tentativi = Math.max(tentativi, 2);
        stato.textContent = /not-allowed|service-not-allowed/.test(errore.message) ? t("parla.permesso")
          : errore.message === "no-speech" ? t("parla.niente") : t("parla.errore");
      }
      if (tentativi >= 2) salta.hidden = false;
      microfono.disabled = false;
      microfono.classList.remove("attivo");
    },
  }, icona("microfono"));

  pronuncia(voce[lingua], lingua);
  return {
    nodo: el("div.parla", {},
      el("div.domanda", {}, testoStraniero(voce, lingua, "parola-grande"), rigaAudio(voce[lingua], lingua)),
      el("p.glossa", {}, voce[ui]),
      microfono,
      stato),
    extra: [
      el("button.testo-link", { type: "button", onclick: ctx.sospendiParlato }, t("btn.non_posso_parlare")),
      salta,
    ],
  };
}
