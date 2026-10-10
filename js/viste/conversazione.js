// conversazione.js - Dialoghi guidati: l'altra persona parla (sintesi
// vocale), tu scegli la risposta adatta tra tre e poi la ripeti al
// microfono (riconoscimento vocale del browser, gratuito). Niente API.

import { leggi, parlatoAttivo, progresso, registraPratica, registraXp, scrivi } from "../archivio.js";
import { UNITA } from "../contenuti/corso.js";
import { bottoneAudio, romanizzazione } from "../esercizi.js";
import { linguaInterfaccia, t, tr } from "../i18n.js";
import { dialogoSbloccato, unitaPerId } from "../lezioni.js";
import {
  SOGLIA_PRONUNCIA, el, icona, mescola, pronuncia, puoRiconoscere, riconosci, riempi, somiglianza,
} from "../utili.js";
import { voceAttivita } from "./ascolto.js";

export function mostra(contenitore, lingua) {
  const fatte = progresso(lingua).dialoghi;
  riempi(contenitore,
    el("header.testata", {}, el("h1", {}, t("conv.titolo")), el("p.sottotitolo", {}, t("conv.sottotitolo"))),
    el("ul.lista-attivita", {}, UNITA.map((unita, i) => el("li", {},
      voceAttivita({
        sbloccata: dialogoSbloccato(lingua, unita.id),
        href: `#${lingua}/dialogo/${unita.id}`,
        titolo: `${t("percorso.unita", { n: i + 1 })} · ${tr(unita.dialogo.titolo)}`,
        dettaglio: fatte[unita.id] ? t("conv.fatta", { n: fatte[unita.id] }) : tr(unita.titolo),
        motivoBlocco: t("conv.bloccata"),
        icona: "microfono",
      })))),
  );
}

export function avviaDialogo(radice, lingua, idUnita) {
  const unita = unitaPerId(idUnita);
  const torna = () => { location.hash = `#${lingua}/conversazione`; };
  if (!unita || !dialogoSbloccato(lingua, idUnita)) { torna(); return null; }

  const ui = linguaInterfaccia();
  const battute = unita.dialogo.battute;
  const conVoce = parlatoAttivo() && puoRiconoscere();
  let indice = 0;
  let errori = 0;
  let attivo = true;

  const chat = el("ol.chat", { "aria-live": "polite" });
  const zona = el("div.zona-turno");
  const interruttore = el("input", {
    type: "checkbox",
    id: "mostra-traduzioni",
    checked: leggi("traduzioniDialogo", false),
    onchange: (e) => {
      scrivi("traduzioniDialogo", e.target.checked);
      schermo.classList.toggle("con-traduzioni", e.target.checked);
    },
  });

  const schermo = el(`div.dialogo${interruttore.checked ? ".con-traduzioni" : ""}`, {},
    el("header.testa-sessione", {},
      el("button.icona-bottone", { type: "button", "aria-label": t("btn.esci"), onclick: torna }, icona("chiudi")),
      el("h1", {}, tr(unita.dialogo.titolo))),
    el("label.interruttore", { for: "mostra-traduzioni" }, interruttore, el("span", {}, t("conv.traduzioni"))),
    chat,
    zona);
  riempi(radice, schermo);

  const testoFrase = (frase) => {
    const rom = romanizzazione(frase, lingua);
    return [
      el("p.testo", { lang: lingua }, frase[lingua]),
      rom && el("p.rom", {}, rom),
      el("p.traduzione", {}, frase[ui]),
    ];
  };

  const bolla = (chi, frase) => {
    const nodo = el(`li.bolla.${chi}`, {},
      el("span.chi", {}, chi === "tu" ? t("conv.tu") : ""),
      el("div.contenuto-bolla", {}, testoFrase(frase)),
      bottoneAudio(frase[lingua], lingua));
    chat.append(nodo);
    nodo.scrollIntoView({ block: "end", behavior: "smooth" });
  };

  function avanti() {
    if (!attivo) return;
    if (indice >= battute.length) { fine(); return; }
    const battuta = battute[indice++];
    if (battuta.chi === "altro") {
      bolla("altro", battuta.frase);
      pronuncia(battuta.frase[lingua], lingua);
      // Se tocca ancora all'altro, aspettiamo un tocco per proseguire
      if (indice < battute.length && battute[indice].chi === "altro") {
        riempi(zona, el("button.primario.grande", { type: "button", onclick: avanti }, t("btn.continua")));
      } else {
        avanti();
      }
      return;
    }
    turnoUtente(battuta);
  }

  function turnoUtente(battuta) {
    const messaggio = el("p.messaggio-turno", { role: "status" });
    const opzioni = mescola([battuta.giusta, ...battuta.sbagliate]).map((frase) => el("button.opzione-dialogo", {
      type: "button",
      onclick: (e) => {
        pronuncia(frase[lingua], lingua);
        if (frase !== battuta.giusta) {
          errori++;
          e.currentTarget.classList.add("sbagliata");
          e.currentTarget.disabled = true;
          messaggio.textContent = t("conv.non_adatta");
          return;
        }
        bolla("tu", frase);
        if (conVoce) ripeti(frase);
        else riempi(zona, el("button.primario.grande", { type: "button", onclick: avanti }, t("btn.continua")));
      },
    }, testoFrase(frase)));
    riempi(zona, el("h2.consegna", {}, t("conv.scegli")), el("div.opzioni-dialogo", {}, opzioni), messaggio);
  }

  // Dopo aver scelto la risposta, la ripeti al microfono
  function ripeti(frase) {
    const stato = el("p.stato-microfono", { role: "status" }, t("parla.tocca"));
    let tentativi = 0;
    const salta = el("button", { type: "button", onclick: avanti }, t("btn.salta"));
    const microfono = el("button.microfono", {
      type: "button",
      "aria-label": t("parla.tocca"),
      onclick: async () => {
        microfono.disabled = true;
        microfono.classList.add("attivo");
        stato.textContent = t("parla.ascolto");
        try {
          const sentite = await riconosci(lingua);
          const migliore = sentite
            .map((testo) => ({ testo, punteggio: somiglianza(frase[lingua], testo, lingua) }))
            .sort((a, b) => b.punteggio - a.punteggio)[0];
          if (migliore && migliore.punteggio >= SOGLIA_PRONUNCIA) {
            stato.textContent = t("esito.sentito", { testo: migliore.testo });
            stato.classList.add("bene");
            setTimeout(avanti, 900);
            return;
          }
          tentativi++;
          stato.textContent = migliore ? `${t("parla.riprova")} ${t("esito.sentito", { testo: migliore.testo })}` : t("parla.niente");
        } catch (errore) {
          stato.textContent = /not-allowed|service-not-allowed/.test(errore.message) ? t("parla.permesso")
            : errore.message === "no-speech" ? t("parla.niente") : t("parla.errore");
        }
        microfono.disabled = false;
        microfono.classList.remove("attivo");
        if (tentativi >= 3) salta.classList.add("primario");
      },
    }, icona("microfono"));
    riempi(zona,
      el("h2.consegna", {}, t("conv.ripeti")),
      el("div.parla-dialogo", {}, microfono, stato),
      el("div.azioni-piede", {}, salta));
  }

  function fine() {
    registraPratica(lingua, "dialoghi", idUnita);
    const xp = 10 + (errori === 0 ? 5 : 0);
    registraXp(lingua, xp);
    riempi(zona,
      el("div.fine-dialogo", {},
        el("div.medaglia", { "aria-hidden": "true" }, icona("stella")),
        el("h2", {}, t("conv.fine")),
        el("p.xp-guadagnati", {}, `+${xp} XP`),
        el("div.azioni-piede", {},
          el("button", { type: "button", onclick: () => avviaDialogo(radice, lingua, idUnita) }, t("btn.rifai")),
          el("button.primario", { type: "button", onclick: torna }, t("btn.continua")))));
  }

  avanti();
  // Chiamata quando si cambia pagina: ferma il dialogo
  return () => { attivo = false; };
}
