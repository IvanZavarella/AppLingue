// archivio.js - Tutto quello che l'app ricorda sta nel localStorage del
// browser: resta solo su questo dispositivo. I progressi sono separati per
// lingua da imparare, così passare dal francese al coreano non mescola
// niente. Da Impostazioni si può esportare un backup.

import { oggi } from "./utili.js";

const PREFISSO = "passo.";

export function leggi(chiave, predefinito) {
  try {
    const valore = localStorage.getItem(PREFISSO + chiave);
    return valore === null ? predefinito : JSON.parse(valore);
  } catch {
    return predefinito;
  }
}

export function scrivi(chiave, valore) {
  try {
    localStorage.setItem(PREFISSO + chiave, JSON.stringify(valore));
    return true;
  } catch {
    return false;
  }
}

// --- Impostazioni ---------------------------------------------------------

const PREDEFINITE = {
  interfaccia: "en",
  // Mostrare la romanizzazione sotto l'hangul
  romanizzazione: true,
  // Esercizi in cui si parla al microfono
  parlato: true,
  // "Non posso parlare ora": esercizi di pronuncia sospesi fino a quest'ora
  parlatoSospesoFino: 0,
};

export function impostazioni() {
  return { ...PREDEFINITE, ...leggi("impostazioni", {}) };
}

export function aggiornaImpostazioni(modifiche) {
  return scrivi("impostazioni", { ...impostazioni(), ...modifiche });
}

export function parlatoAttivo() {
  const imp = impostazioni();
  return imp.parlato && Date.now() > imp.parlatoSospesoFino;
}

// --- Progressi per lingua -------------------------------------------------

function progressoVuoto() {
  return {
    xp: 0,
    lezioni: {}, // "saluti-0": true
    dialoghi: {}, // "saluti": volte completato
    ascolto: {}, // "saluti": volte completato
    parole: {}, // id: { giuste, sbagliate }
  };
}

export function progresso(lingua) {
  return { ...progressoVuoto(), ...leggi(`progresso.${lingua}`, {}) };
}

function salvaProgresso(lingua, dati) {
  scrivi(`progresso.${lingua}`, dati);
}

export function lezioneFatta(lingua, idUnita, n) {
  return !!progresso(lingua).lezioni[`${idUnita}-${n}`];
}

export function registraLezione(lingua, idUnita, n) {
  const p = progresso(lingua);
  p.lezioni[`${idUnita}-${n}`] = true;
  salvaProgresso(lingua, p);
}

export function registraPratica(lingua, tipo, idUnita) {
  const p = progresso(lingua);
  p[tipo][idUnita] = (p[tipo][idUnita] || 0) + 1;
  salvaProgresso(lingua, p);
}

export function registraParola(lingua, id, giusta) {
  const p = progresso(lingua);
  const stat = p.parole[id] || { giuste: 0, sbagliate: 0 };
  if (giusta) stat.giuste++;
  else stat.sbagliate++;
  p.parole[id] = stat;
  salvaProgresso(lingua, p);
}

// Aggiunge XP e aggiorna la serie di giorni consecutivi
export function registraXp(lingua, xp) {
  const p = progresso(lingua);
  p.xp += xp;
  salvaProgresso(lingua, p);

  const serie = leggi("serie", { ultimoGiorno: null, giorni: 0 });
  const adesso = oggi();
  if (serie.ultimoGiorno !== adesso) {
    const ieri = new Date();
    ieri.setDate(ieri.getDate() - 1);
    const stringaIeri = `${ieri.getFullYear()}-${String(ieri.getMonth() + 1).padStart(2, "0")}-${String(ieri.getDate()).padStart(2, "0")}`;
    serie.giorni = serie.ultimoGiorno === stringaIeri ? serie.giorni + 1 : 1;
    serie.ultimoGiorno = adesso;
    scrivi("serie", serie);
  }
}

// Giorni di fila, ancora validi solo se l'ultimo è oggi o ieri
export function serieAttuale() {
  const serie = leggi("serie", { ultimoGiorno: null, giorni: 0 });
  if (!serie.ultimoGiorno) return 0;
  const giorni = Math.round((new Date(oggi()) - new Date(serie.ultimoGiorno)) / 86400000);
  return giorni <= 1 ? serie.giorni : 0;
}

export function azzeraProgresso(lingua) {
  salvaProgresso(lingua, progressoVuoto());
}

// --- Backup ---------------------------------------------------------------

export function esportaBackup() {
  const dati = {};
  for (let i = 0; i < localStorage.length; i++) {
    const chiave = localStorage.key(i);
    if (chiave.startsWith(PREFISSO)) dati[chiave.slice(PREFISSO.length)] = leggi(chiave.slice(PREFISSO.length));
  }
  return { app: "passo", versione: 1, data: new Date().toISOString(), dati };
}

export function importaBackup(backup) {
  if (backup?.app !== "passo" || typeof backup.dati !== "object") {
    throw new Error("not-a-backup");
  }
  for (const [chiave, valore] of Object.entries(backup.dati)) scrivi(chiave, valore);
}
