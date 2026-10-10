# Passo

App web in stile Duolingo per imparare inglese, francese e coreano un po'
ogni giorno. Funziona nel browser del telefono, è gratuita e non usa chiavi
API né server: tutto gira nella pagina.

- **Lingua dell'app**: inglese (predefinita) o italiano, si cambia dalla home.
- **Lingua da imparare**: inglese, francese o coreano (quella dell'app è
  esclusa).

Per ogni lingua ci sono queste sezioni:

1. **Vocabolario**: il percorso. 6 unità (saluti, presentarsi, cibo,
   numeri, famiglia, la giornata), ognuna con 4 lezioni che si sbloccano in
   ordine: Parole 1, Parole 2, Frasi, Ripasso. C'è anche il ripasso delle
   parole sbagliate più spesso.
2. **Ascolto**: esercizi solo audio per ogni unità iniziata, più ricerche
   YouTube con video per chi impara.
3. **Conversazione**: dialoghi guidati. L'altra persona parla, tu scegli la
   risposta giusta tra tre e poi la ripeti al microfono.
4. **Alfabeto** (solo coreano): l'hangul, come si formano le sillabe e due
   quiz.

XP e serie di giorni consecutivi come in Duolingo.

## Esercizi delle lezioni

| Tipo | Cosa fai |
|---|---|
| Nuova parola | Vedi e senti la parola con la traduzione |
| Cosa significa? | Parola → scegli la traduzione tra 4 |
| Scegli la parola | Traduzione → scegli la parola tra 4 |
| Cosa senti? | Solo audio → scegli la parola |
| Abbina le coppie | 5 parole con le loro traduzioni |
| Traduci / Componi | Componi la frase toccando le tessere |
| Componi quello che senti | Solo audio → componi la frase |
| Dillo ad alta voce | Ripeti al microfono |

Gli esercizi sbagliati tornano in fondo alla lezione, fino a 3 volte.

## Voce e microfono (gratis, senza chiavi)

- **Pronuncia**: la sintesi vocale del telefono. Se una lingua non ha la
  voce, va installata nelle impostazioni di sintesi vocale del telefono.
  In Impostazioni l'app mostra quali voci ci sono.
- **Microfono**: il riconoscimento vocale del browser (Web Speech API).
  Funziona su Chrome per Android e su Safari per iPhone. Il confronto è
  tollerante: basta una somiglianza del 75% (`SOGLIA_PRONUNCIA` in
  `js/utili.js`). Con "Non posso parlare ora" gli esercizi di pronuncia
  vengono saltati per 15 minuti; da Impostazioni si possono disattivare.

## Dove sono i dati

Progressi, XP e impostazioni sono nel `localStorage` del browser: restano
su quel dispositivo, separati per lingua. Da **Impostazioni** > **Backup**
si scarica un file da ricaricare su un altro dispositivo. Ogni persona usa
il proprio telefono, quindi i progressi di due persone non si mescolano.

## Pubblicarla su GitHub Pages

Come per l'app di coreano: un nuovo repository pubblico (es. `passo`),
**Add file** > **Upload files** trascinando **il contenuto** di questa
cartella (non la cartella stessa), poi **Settings** > **Pages** > branch
`main`, cartella `/ (root)`. L'indirizzo sarà
`https://TUO-NOME.github.io/passo/`.

## Provarla sul PC

Serve un piccolo server (i moduli JavaScript non funzionano aprendo il file
con doppio clic). Dalla cartella:

```
py -m http.server 8000
```

poi <http://localhost:8000>.

## Aggiungere contenuti

Tutto il corso è in `js/contenuti/corso.js`. Ogni parola e frase è scritta
una volta sola in tutte le lingue dell'app:

```js
F("acqua", "water", "l'acqua", "l'eau", "물", "mul"),
//  id      en       it         fr       ko    romanizzazione
```

così funziona qualunque coppia di lingue. Per aggiungere un'unità basta
copiarne una: 10 parole, 4-5 frasi e un dialogo (`LUI` = battuta dell'altra
persona, `TU` = la risposta giusta seguita da due sbagliate).

Per aggiungere una **lingua da imparare** (es. spagnolo): aggiungere il
campo `es` a ogni parola e frase, il codice in `DA_IMPARARE` e il nome in
`NOMI_NATIVI` (`js/i18n.js`), le ricerche in `RICERCHE_VIDEO` e il codice
voce in `CODICI_VOCE` (`js/utili.js`).

Per aggiungere una **lingua dell'app**: copiare il blocco `en` di `TESTI` in
`js/i18n.js`, tradurlo e aggiungere il codice a `INTERFACCE` (serve anche il
campo nei contenuti, come sopra).

## Organizzazione

```
Lingue/
├── index.html, stile.css, manifest.webmanifest, icone
└── js/
    ├── app.js            ← sceglie la schermata dall'indirizzo (#fr/ascolto...)
    ├── i18n.js           ← testi dell'interfaccia (en, it) e lingue
    ├── archivio.js       ← impostazioni, progressi, XP, serie, backup
    ├── lezioni.js        ← quali esercizi in ogni lezione, sblocchi
    ├── esercizi.js       ← il motore delle lezioni e tutti i tipi di esercizio
    ├── utili.js          ← funzioni comuni, pronuncia, riconoscimento vocale
    ├── contenuti/
    │   ├── corso.js      ← unità, parole, frasi, dialoghi, video
    │   └── hangul.js     ← alfabeto coreano
    └── viste/            ← home, vocabolario, ascolto, conversazione,
                            simboli, impostazioni
```
