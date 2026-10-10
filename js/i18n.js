// i18n.js - Testi dell'interfaccia. Per aggiungere una lingua basta
// copiare il blocco "en", tradurlo e aggiungere il codice a INTERFACCE.
//
// Nei testi, {nome} viene sostituito con il parametro corrispondente.

import { impostazioni } from "./archivio.js";

// Lingue in cui può essere mostrata l'app
export const INTERFACCE = ["en", "it"];
// Lingue che si possono imparare
export const DA_IMPARARE = ["en", "fr", "ko"];

// Nome di ogni lingua nella lingua stessa
export const NOMI_NATIVI = { en: "English", it: "Italiano", fr: "Français", ko: "한국어" };

const TESTI = {
  en: {
    "app.nome": "Passo",
    "app.motto": "A little every day.",

    "lingua.en": "English",
    "lingua.it": "Italian",
    "lingua.fr": "French",
    "lingua.ko": "Korean",

    "home.interfaccia": "App language",
    "home.domanda": "What do you want to learn today?",
    "home.tua_lingua": "This is the app language",
    "home.nuova": "Start from zero",
    "home.avanzamento": "{fatte} of {totale} lessons · {xp} XP",

    "barra.lingue": "Languages",
    "barra.serie": "{n}-day streak",
    "barra.xp": "{n} XP",
    "barra.impostazioni": "Settings",

    "nav.vocabolario": "Vocabulary",
    "nav.ascolto": "Listening",
    "nav.conversazione": "Conversation",
    "nav.simboli": "Alphabet",

    "percorso.unita": "Unit {n}",
    "percorso.lezione.0": "Words 1",
    "percorso.lezione.1": "Words 2",
    "percorso.lezione.2": "Sentences",
    "percorso.lezione.3": "Review",
    "percorso.bloccata": "Finish the previous lesson to unlock this one.",
    "percorso.inizia": "Start",
    "percorso.ripasso": "Practice difficult words",
    "percorso.ripasso_nota": "Words you got wrong most often",
    "percorso.consiglio_hangul": "New to Korean? Learn the alphabet first in the Alphabet tab.",

    "es.nuova": "New word",
    "es.scegli-significato": "What does this mean?",
    "es.scegli-parola": "Choose the right word for “{testo}”",
    "es.ascolta": "What do you hear?",
    "es.ascolta-frase": "What does this sentence mean?",
    "es.abbina": "Match the pairs",
    "es.componi": "Translate this sentence",
    "es.componi-ascolto": "Write what you hear",
    "es.traduci": "Translate this sentence",
    "es.parla": "Say it out loud",

    "btn.controlla": "Check",
    "btn.continua": "Continue",
    "btn.salta": "Skip",
    "btn.non_posso_parlare": "Can't speak now",
    "btn.ascolta": "Listen",
    "btn.lento": "Slowly",
    "btn.esci": "Quit",
    "btn.indietro": "Back",
    "btn.rifai": "Do it again",

    "esci.domanda": "Quit the lesson? Your progress in this lesson will be lost.",
    "esci.resta": "Keep learning",
    "esci.conferma": "Quit",

    "esito.giusto": ["Great!", "Correct!", "Well done!", "Perfect!"],
    "esito.sbagliato": "Correct answer:",
    "esito.sentito": "I heard: “{testo}”",
    "esito.abbinate": "All pairs matched!",

    "parla.tocca": "Tap the microphone and speak",
    "parla.ascolto": "Listening…",
    "parla.riprova": "Not quite. Try again!",
    "parla.niente": "I didn't hear anything. Try again, a little closer to the microphone.",
    "parla.permesso": "Microphone access was denied. Allow it in your browser settings for this site.",
    "parla.errore": "Speech recognition isn't working right now.",

    "fine.titolo": "Lesson complete!",
    "fine.titolo_ascolto": "Listening practice complete!",
    "fine.titolo_ripasso": "Review complete!",
    "fine.xp": "XP earned",
    "fine.precisione": "Accuracy",
    "fine.serie": "Streak",
    "fine.giorni": "{n} days",
    "fine.giorno": "1 day",

    "ascolto.titolo": "Listening",
    "ascolto.sottotitolo": "Train your ear with each unit's words and sentences.",
    "ascolto.pratica": "Listening practice",
    "ascolto.bloccata": "Start this unit in Vocabulary first.",
    "ascolto.fatta": "Done {n} times",
    "ascolto.video": "Videos on YouTube",
    "ascolto.video_nota": "Searches with videos for learners: they open YouTube.",

    "conv.titolo": "Conversation",
    "conv.sottotitolo": "Short guided dialogues: choose what to say, then say it out loud.",
    "conv.bloccata": "Finish the “Sentences” lesson of this unit first.",
    "conv.fatta": "Done {n} times",
    "conv.traduzioni": "Show translations",
    "conv.scegli": "What do you answer?",
    "conv.ripeti": "Now say it out loud",
    "conv.non_adatta": "That doesn't fit here. Try again!",
    "conv.fine": "Conversation complete!",
    "conv.tu": "You",

    "simboli.titolo": "Hangul",
    "simboli.sottotitolo": "The Korean alphabet: 14 consonants and 10 basic vowels.",
    "simboli.tab.lettere": "Letters",
    "simboli.tab.sillabe": "Syllables",
    "simboli.tab.quiz": "Quiz",
    "simboli.tab.leggi": "Read",
    "simboli.tocca": "Tap a letter to hear it and see how it is pronounced.",
    "simboli.esempio": "Example:",
    "simboli.quiz_tutte": "All",
    "simboli.quiz_domanda": "How is it pronounced?",
    "simboli.leggi_nota": "Read the word in hangul and choose how it is pronounced. Many come from English: if you recognise it, you read it right!",
    "simboli.punteggio": "{giuste} correct out of {fatte}",
    "simboli.no_voce": "This browser can't read aloud, so letter audio is not available.",
    "sillabe.intro": "In Korean, letters are not written one after the other: the letters of each syllable are drawn together inside a little square. Each block is a syllable and always starts with a consonant.",
    "sillabe.verticale.titolo": "1. Consonant + vertical vowel",
    "sillabe.verticale.testo": "“Standing” vowels (ㅏ ㅑ ㅓ ㅕ ㅣ) go to the right of the consonant.",
    "sillabe.orizzontale.titolo": "2. Consonant + horizontal vowel",
    "sillabe.orizzontale.testo": "“Lying” vowels (ㅗ ㅛ ㅜ ㅠ ㅡ) go under the consonant.",
    "sillabe.muta.titolo": "3. A syllable starting with a vowel",
    "sillabe.muta.testo": "If the syllable starts with a vowel sound, a silent ㅇ takes the place of the consonant.",
    "sillabe.batchim.titolo": "4. Final consonant (batchim)",
    "sillabe.batchim.testo": "A consonant at the end of the syllable goes at the bottom. It is called 받침 (batchim).",
    "sillabe.fine": "So 한국 (Korea) = 한 + 국 = han + guk.",

    "imp.titolo": "Settings",
    "imp.interfaccia": "App language",
    "imp.romanizzazione": "Show Korean romanization (e.g. annyeonghaseyo)",
    "imp.parlato": "Speaking exercises (microphone)",
    "imp.parlato_nota": "They use your browser's free speech recognition. If it isn't available they are skipped.",
    "imp.azzera": "Reset {lingua} progress",
    "imp.azzera_conferma": "Tap again to reset {lingua}",
    "imp.azzerato": "{lingua} progress has been reset.",
    "imp.backup": "Backup",
    "imp.backup_nota": "Progress is saved only in this browser. To move to another device, download the backup and load it there.",
    "imp.scarica": "Download backup",
    "imp.carica": "Load backup",
    "imp.caricato": "Backup loaded.",
    "imp.errore_backup": "This file is not a backup of the app.",
    "imp.voci": "Voices on this device",
    "imp.voci_nota": "If a language has no voice, install it in your phone's text-to-speech settings.",
    "imp.voce_si": "available",
    "imp.voce_no": "missing",
    "imp.salvato": "Saved.",
  },

  it: {
    "app.nome": "Passo",
    "app.motto": "Un po' ogni giorno.",

    "lingua.en": "Inglese",
    "lingua.it": "Italiano",
    "lingua.fr": "Francese",
    "lingua.ko": "Coreano",

    "home.interfaccia": "Lingua dell'app",
    "home.domanda": "Cosa vuoi imparare oggi?",
    "home.tua_lingua": "È la lingua dell'app",
    "home.nuova": "Parti da zero",
    "home.avanzamento": "{fatte} lezioni su {totale} · {xp} XP",

    "barra.lingue": "Lingue",
    "barra.serie": "{n} giorni di fila",
    "barra.xp": "{n} XP",
    "barra.impostazioni": "Impostazioni",

    "nav.vocabolario": "Vocabolario",
    "nav.ascolto": "Ascolto",
    "nav.conversazione": "Conversazione",
    "nav.simboli": "Alfabeto",

    "percorso.unita": "Unità {n}",
    "percorso.lezione.0": "Parole 1",
    "percorso.lezione.1": "Parole 2",
    "percorso.lezione.2": "Frasi",
    "percorso.lezione.3": "Ripasso",
    "percorso.bloccata": "Completa la lezione precedente per sbloccare questa.",
    "percorso.inizia": "Inizia",
    "percorso.ripasso": "Ripassa le parole difficili",
    "percorso.ripasso_nota": "Le parole che hai sbagliato più spesso",
    "percorso.consiglio_hangul": "Parti da zero col coreano? Impara prima l'alfabeto nella scheda Alfabeto.",

    "es.nuova": "Nuova parola",
    "es.scegli-significato": "Cosa significa?",
    "es.scegli-parola": "Scegli la parola giusta per “{testo}”",
    "es.ascolta": "Cosa senti?",
    "es.ascolta-frase": "Cosa significa questa frase?",
    "es.abbina": "Abbina le coppie",
    "es.componi": "Traduci questa frase",
    "es.componi-ascolto": "Componi quello che senti",
    "es.traduci": "Traduci questa frase",
    "es.parla": "Dillo ad alta voce",

    "btn.controlla": "Controlla",
    "btn.continua": "Continua",
    "btn.salta": "Salta",
    "btn.non_posso_parlare": "Non posso parlare ora",
    "btn.ascolta": "Ascolta",
    "btn.lento": "Lento",
    "btn.esci": "Esci",
    "btn.indietro": "Indietro",
    "btn.rifai": "Rifalla",

    "esci.domanda": "Vuoi uscire? I progressi di questa lezione andranno persi.",
    "esci.resta": "Continua la lezione",
    "esci.conferma": "Esci",

    "esito.giusto": ["Ottimo!", "Giusto!", "Perfetto!", "Ben fatto!"],
    "esito.sbagliato": "Risposta corretta:",
    "esito.sentito": "Ho sentito: “{testo}”",
    "esito.abbinate": "Tutte le coppie abbinate!",

    "parla.tocca": "Tocca il microfono e parla",
    "parla.ascolto": "Ti ascolto…",
    "parla.riprova": "Non ancora. Riprova!",
    "parla.niente": "Non ho sentito niente. Riprova, un po' più vicino al microfono.",
    "parla.permesso": "Il permesso per il microfono è stato negato. Consentilo dalle impostazioni del browser per questo sito.",
    "parla.errore": "Il riconoscimento vocale ora non funziona.",

    "fine.titolo": "Lezione completata!",
    "fine.titolo_ascolto": "Esercizi di ascolto completati!",
    "fine.titolo_ripasso": "Ripasso completato!",
    "fine.xp": "XP guadagnati",
    "fine.precisione": "Precisione",
    "fine.serie": "Serie",
    "fine.giorni": "{n} giorni",
    "fine.giorno": "1 giorno",

    "ascolto.titolo": "Ascolto",
    "ascolto.sottotitolo": "Allena l'orecchio con le parole e le frasi di ogni unità.",
    "ascolto.pratica": "Esercizi di ascolto",
    "ascolto.bloccata": "Inizia prima questa unità in Vocabolario.",
    "ascolto.fatta": "Fatto {n} volte",
    "ascolto.video": "Video su YouTube",
    "ascolto.video_nota": "Ricerche con video per chi impara: si aprono su YouTube.",

    "conv.titolo": "Conversazione",
    "conv.sottotitolo": "Brevi dialoghi guidati: scegli cosa dire, poi dillo ad alta voce.",
    "conv.bloccata": "Completa prima la lezione “Frasi” di questa unità.",
    "conv.fatta": "Fatta {n} volte",
    "conv.traduzioni": "Mostra le traduzioni",
    "conv.scegli": "Cosa rispondi?",
    "conv.ripeti": "Ora dillo ad alta voce",
    "conv.non_adatta": "Qui non c'entra. Riprova!",
    "conv.fine": "Conversazione completata!",
    "conv.tu": "Tu",

    "simboli.titolo": "Hangul",
    "simboli.sottotitolo": "L'alfabeto coreano: 14 consonanti e 10 vocali di base.",
    "simboli.tab.lettere": "Lettere",
    "simboli.tab.sillabe": "Sillabe",
    "simboli.tab.quiz": "Quiz",
    "simboli.tab.leggi": "Leggi",
    "simboli.tocca": "Tocca una lettera per sentirla e leggere come si pronuncia.",
    "simboli.esempio": "Esempio:",
    "simboli.quiz_tutte": "Tutte",
    "simboli.quiz_domanda": "Come si pronuncia?",
    "simboli.leggi_nota": "Leggi la parola in hangul e scegli come si pronuncia. Molte vengono dall'inglese: se la riconosci, l'hai letta bene!",
    "simboli.punteggio": "{giuste} giuste su {fatte}",
    "simboli.no_voce": "Questo browser non sa leggere ad alta voce: l'audio delle lettere non è disponibile.",
    "sillabe.intro": "In coreano non si scrive una lettera dopo l'altra: le lettere di ogni sillaba vengono disegnate insieme dentro un quadratino. Ogni blocco è una sillaba e inizia sempre con una consonante.",
    "sillabe.verticale.titolo": "1. Consonante + vocale verticale",
    "sillabe.verticale.testo": "Le vocali \"in piedi\" (ㅏ ㅑ ㅓ ㅕ ㅣ) vanno a destra della consonante.",
    "sillabe.orizzontale.titolo": "2. Consonante + vocale orizzontale",
    "sillabe.orizzontale.testo": "Le vocali \"sdraiate\" (ㅗ ㅛ ㅜ ㅠ ㅡ) vanno sotto la consonante.",
    "sillabe.muta.titolo": "3. Sillaba che inizia con una vocale",
    "sillabe.muta.testo": "Se la sillaba inizia con un suono vocale, una ㅇ muta prende il posto della consonante.",
    "sillabe.batchim.titolo": "4. Consonante finale (batchim)",
    "sillabe.batchim.testo": "Una consonante in fondo alla sillaba va sotto a tutto. Si chiama 받침 (batchim).",
    "sillabe.fine": "Così 한국 (Corea) = 한 + 국 = han + guk.",

    "imp.titolo": "Impostazioni",
    "imp.interfaccia": "Lingua dell'app",
    "imp.romanizzazione": "Mostra la romanizzazione del coreano (es. annyeonghaseyo)",
    "imp.parlato": "Esercizi di pronuncia (microfono)",
    "imp.parlato_nota": "Usano il riconoscimento vocale gratuito del browser. Se non è disponibile vengono saltati.",
    "imp.azzera": "Azzera i progressi di {lingua}",
    "imp.azzera_conferma": "Tocca di nuovo per azzerare {lingua}",
    "imp.azzerato": "Progressi di {lingua} azzerati.",
    "imp.backup": "Backup",
    "imp.backup_nota": "I progressi sono salvati solo in questo browser. Per passare a un altro dispositivo scarica il backup e caricalo lì.",
    "imp.scarica": "Scarica il backup",
    "imp.carica": "Carica un backup",
    "imp.caricato": "Backup caricato.",
    "imp.errore_backup": "Questo file non è un backup dell'app.",
    "imp.voci": "Voci su questo dispositivo",
    "imp.voci_nota": "Se una lingua non ha la voce, installala nelle impostazioni di sintesi vocale del telefono.",
    "imp.voce_si": "disponibile",
    "imp.voce_no": "mancante",
    "imp.salvato": "Salvato.",
  },
};

export function linguaInterfaccia() {
  const scelta = impostazioni().interfaccia;
  return INTERFACCE.includes(scelta) ? scelta : "en";
}

export function t(chiave, parametri = {}) {
  const testo = TESTI[linguaInterfaccia()][chiave] ?? TESTI.en[chiave] ?? chiave;
  if (typeof testo !== "string") return testo;
  return testo.replace(/\{(\w+)\}/g, (_, nome) => parametri[nome] ?? "");
}

// Per i testi dei contenuti scritti come { en: "...", it: "..." }
export function tr(oggetto) {
  return oggetto?.[linguaInterfaccia()] ?? oggetto?.en ?? "";
}
