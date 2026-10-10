// utili.js - Aiuti condivisi: creazione di elementi HTML, mescolamento,
// pronuncia (sintesi vocale del telefono) e riconoscimento vocale (Web
// Speech API del browser: gratuito, senza chiavi).

// el("button.primario", {onclick}, "Testo", altroElemento)
export function el(descrizione, attributi = {}, ...figli) {
  const [tag, ...classi] = descrizione.split(".");
  const nodo = document.createElement(tag || "div");
  if (classi.length) nodo.className = classi.join(" ");
  for (const [nome, valore] of Object.entries(attributi || {})) {
    if (valore === undefined || valore === null || valore === false) continue;
    if (nome.startsWith("on")) nodo.addEventListener(nome.slice(2), valore);
    else if (nome === "dataset") Object.assign(nodo.dataset, valore);
    else if (nome in nodo && typeof valore !== "string") nodo[nome] = valore;
    else nodo.setAttribute(nome, valore === true ? "" : valore);
  }
  aggiungi(nodo, figli);
  return nodo;
}

function aggiungi(nodo, figli) {
  for (const figlio of figli.flat(Infinity)) {
    if (figlio === null || figlio === undefined || figlio === false) continue;
    nodo.append(figlio instanceof Node ? figlio : document.createTextNode(String(figlio)));
  }
}

// Come nodo.replaceChildren, ma salta i figli null/false
export function riempi(nodo, ...figli) {
  nodo.replaceChildren();
  aggiungi(nodo, figli);
}

export function svg(contenuto, viewBox = "0 0 24 24") {
  const nodo = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  nodo.setAttribute("viewBox", viewBox);
  nodo.setAttribute("aria-hidden", "true");
  nodo.innerHTML = contenuto;
  return nodo;
}

export const ICONE = {
  altoparlante: '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  lumaca: '<path d="M3 17h13a5 5 0 0 0 0-10 5 5 0 0 0-5 5 2.5 2.5 0 0 0 5 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 7l1-3M19 8l2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  microfono: '<rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  chiudi: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',
  fiamma: '<path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2.5 1.2-4 2.5-5 .2 1.8 1 3 2 3.5C11 9 11 5 12 2z" fill="currentColor"/>',
  stella: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor"/>',
  lucchetto: '<rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/>',
  spunta: '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
  ingranaggio: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="7" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="17" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/>',
  indietro: '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>',
};

export function icona(nome) {
  return svg(ICONE[nome]);
}

export function mescola(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function prendi(lista, quanti) {
  return mescola(lista).slice(0, quanti);
}

export function oggi() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// --- Testo ----------------------------------------------------------------

// Divide una frase nelle "tessere" da comporre: parole senza punteggiatura
export function tessere(frase) {
  return frase.split(/\s+/)
    .map((t) => t.replace(/^[¿¡"«“]+|[.,!?;:"»”…]+$/g, ""))
    .filter(Boolean);
}

// Per confrontare risposte: minuscole, senza accenti né punteggiatura
export function normalizza(testo, lingua) {
  let t = testo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC");
  t = t.replace(/[’']/g, "'").replace(/[.,!?;:¿¡"«»“”…-]/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  // In coreano gli spazi riconosciuti a voce sono spesso diversi
  if (lingua === "ko") t = t.replace(/\s/g, "");
  return t;
}

// --- Pronuncia ------------------------------------------------------------

const CODICI_VOCE = { en: "en-US", fr: "fr-FR", ko: "ko-KR", it: "it-IT" };
const voci = {};

function cercaVoci() {
  if (!("speechSynthesis" in window)) return;
  const tutte = speechSynthesis.getVoices();
  for (const [lingua, codice] of Object.entries(CODICI_VOCE)) {
    voci[lingua] = tutte.find((v) => v.lang === codice && v.localService)
      || tutte.find((v) => v.lang === codice)
      || tutte.find((v) => v.lang?.replace("_", "-").startsWith(lingua)) || null;
  }
}

if ("speechSynthesis" in window) {
  cercaVoci();
  speechSynthesis.addEventListener?.("voiceschanged", cercaVoci);
}

export function puoPronunciare() {
  return "speechSynthesis" in window;
}

export function pronuncia(testo, lingua, lento = false) {
  if (!puoPronunciare() || !testo) return;
  speechSynthesis.cancel();
  const frase = new SpeechSynthesisUtterance(testo);
  frase.lang = CODICI_VOCE[lingua] || lingua;
  if (voci[lingua]) frase.voice = voci[lingua];
  frase.rate = lento ? 0.55 : 0.9;
  speechSynthesis.speak(frase);
}

// --- Riconoscimento vocale --------------------------------------------------

const Riconoscitore = window.SpeechRecognition || window.webkitSpeechRecognition;

export function puoRiconoscere() {
  return !!Riconoscitore;
}

// Ascolta una frase e restituisce le possibili trascrizioni
export function riconosci(lingua) {
  return new Promise((risolvi, rifiuta) => {
    const r = new Riconoscitore();
    r.lang = CODICI_VOCE[lingua] || lingua;
    r.interimResults = false;
    r.maxAlternatives = 5;
    let risultati = [];
    r.onresult = (e) => {
      risultati = [...e.results[0]].map((alt) => alt.transcript);
    };
    r.onerror = (e) => rifiuta(new Error(e.error));
    r.onend = () => risolvi(risultati);
    speechSynthesis?.cancel();
    r.start();
  });
}

// Il riconoscimento scrive spesso i numeri in cifre: li riportiamo a parole
const NUMERI = {
  en: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
  fr: ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"],
  ko: ["영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구", "십"],
  it: ["zero", "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci"],
};

function numeriInParole(testo, lingua) {
  const nomi = NUMERI[lingua];
  if (!nomi) return testo;
  return testo.replace(/\d+/g, (n) => (Number(n) <= 10 ? ` ${nomi[Number(n)]} ` : n));
}

function distanza(a, b) {
  const riga = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let precedente = riga[0];
    riga[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = riga[j];
      riga[j] = Math.min(riga[j] + 1, riga[j - 1] + 1, precedente + (a[i - 1] === b[j - 1] ? 0 : 1));
      precedente = tmp;
    }
  }
  return riga[b.length];
}

// Quanto somiglia quello che hai detto alla frase attesa (0-1)
export function somiglianza(atteso, sentito, lingua) {
  const a = normalizza(atteso, lingua);
  const s = normalizza(numeriInParole(sentito, lingua), lingua);
  if (!a.length) return 0;
  return 1 - distanza(a, s) / Math.max(a.length, s.length);
}

export const SOGLIA_PRONUNCIA = 0.75;
