// hangul.js - L'alfabeto coreano per la sezione Simboli.
// esempio = sillaba da far pronunciare (una lettera da sola verrebbe letta
// col suo nome, es. ㄱ = "giyeok"). La romanizzazione segue il sistema
// ufficiale sudcoreano (Revised Romanization).

const L = (lettera, rom, esempio, en, it) => ({ lettera, rom, esempio, nota: { en, it } });

export const GRUPPI_HANGUL = [
  {
    id: "vocali",
    titolo: { en: "Vowels", it: "Vocali" },
    nota: { en: "They are always written with a silent ㅇ in front: 아, 오, 이...", it: "Si scrivono sempre con una ㅇ muta davanti: 아, 오, 이..." },
    lettere: [
      L("ㅏ", "a", "아", "a as in \"father\"", "a di casa"),
      L("ㅑ", "ya", "야", "ya as in \"yard\"", "ia di piano"),
      L("ㅓ", "eo", "어", "a very open o, close to \"u\" in \"up\"", "o molto aperta, quasi una a"),
      L("ㅕ", "yeo", "여", "y + the open o of ㅓ", "i + o molto aperta"),
      L("ㅗ", "o", "오", "closed o, rounded lips", "o chiusa, labbra arrotondate"),
      L("ㅛ", "yo", "요", "yo as in \"yoga\"", "io di iogurt"),
      L("ㅜ", "u", "우", "oo as in \"moon\"", "u di luna"),
      L("ㅠ", "yu", "유", "you", "iu di fiume"),
      L("ㅡ", "eu", "으", "a u with spread lips, not rounded", "una u con le labbra tirate, senza arrotondarle"),
      L("ㅣ", "i", "이", "ee as in \"see\"", "i di riso"),
    ],
  },
  {
    id: "consonanti",
    titolo: { en: "Consonants", it: "Consonanti" },
    lettere: [
      L("ㄱ", "g / k", "가", "g as in \"go\"; at the start of a word almost a k", "g di gatto; a inizio parola quasi una k"),
      L("ㄴ", "n", "나", "n as in \"no\"", "n di naso"),
      L("ㄷ", "d / t", "다", "d as in \"do\"; at the start of a word almost a t", "d di dado; a inizio parola quasi una t"),
      L("ㄹ", "r / l", "라", "between r and l; at the end of a syllable it is an l", "a metà tra r e l; in fondo alla sillaba è una l"),
      L("ㅁ", "m", "마", "m as in \"mom\"", "m di mamma"),
      L("ㅂ", "b / p", "바", "b as in \"boy\"; at the start of a word almost a p", "b di bocca; a inizio parola quasi una p"),
      L("ㅅ", "s", "사", "s as in \"sun\"; before ㅣ it sounds like \"sh\"", "s di sole; davanti a ㅣ diventa quasi \"sci\""),
      L("ㅇ", "– / ng", "아", "silent at the start of a syllable; ng as in \"song\" at the end", "muta all'inizio della sillaba; in fondo è ng come in \"song\""),
      L("ㅈ", "j", "자", "j as in \"jam\"", "g di giallo"),
      L("ㅊ", "ch", "차", "ch as in \"church\", with a puff of air", "c di ciao, con un soffio d'aria"),
      L("ㅋ", "k", "카", "k with a puff of air", "k con un soffio d'aria"),
      L("ㅌ", "t", "타", "t with a puff of air", "t con un soffio d'aria"),
      L("ㅍ", "p", "파", "p with a puff of air", "p con un soffio d'aria"),
      L("ㅎ", "h", "하", "h as in \"hello\"", "h aspirata, come in inglese \"hello\""),
    ],
  },
  {
    id: "doppie",
    titolo: { en: "Double consonants", it: "Consonanti doppie" },
    nota: { en: "Like the simple ones, but tense and without a puff of air.", it: "Come le semplici, ma più tese e senza soffio d'aria." },
    lettere: [
      L("ㄲ", "kk", "까", "tense k, no air", "k tesa e secca, senza soffio"),
      L("ㄸ", "tt", "따", "tense t, no air", "t tesa e secca, senza soffio"),
      L("ㅃ", "pp", "빠", "tense p, no air", "p tesa e secca, senza soffio"),
      L("ㅆ", "ss", "싸", "strong, tense s", "s tesa e forte"),
      L("ㅉ", "jj", "짜", "tense j, like \"ts\" in \"pizza\"", "z di pizza, tesa"),
    ],
  },
  {
    id: "composte",
    titolo: { en: "Compound vowels", it: "Vocali composte" },
    nota: { en: "Two basic vowels joined together.", it: "Unione di due vocali di base." },
    lettere: [
      L("ㅐ", "ae", "애", "e as in \"bed\"", "è aperta, come in bello"),
      L("ㅒ", "yae", "얘", "ye as in \"yes\"", "i + è aperta"),
      L("ㅔ", "e", "에", "e as in \"bed\"; today it sounds almost like ㅐ", "é chiusa; oggi suona quasi uguale a ㅐ"),
      L("ㅖ", "ye", "예", "ye as in \"yes\"", "ie di ieri"),
      L("ㅘ", "wa", "와", "wa as in \"water\"", "ua di quadro"),
      L("ㅙ", "wae", "왜", "we as in \"wet\"", "uè"),
      L("ㅚ", "oe", "외", "today pronounced like \"we\" in \"wet\"", "oggi si pronuncia uè"),
      L("ㅝ", "wo", "워", "wo as in \"wonder\"", "u + o molto aperta"),
      L("ㅞ", "we", "웨", "we as in \"wet\"", "ue di guerra"),
      L("ㅟ", "wi", "위", "wee as in \"week\"", "ui di guida"),
      L("ㅢ", "ui", "의", "ㅡ + i, gliding quickly", "ㅡ + i, scivolando veloce"),
    ],
  },
];

// Esempi di composizione delle sillabe: [sillaba, lettere, romanizzazione]
export const SILLABE = [
  { regola: "verticale", esempi: [["가", ["ㄱ", "ㅏ"], "ga"], ["나", ["ㄴ", "ㅏ"], "na"], ["미", ["ㅁ", "ㅣ"], "mi"]] },
  { regola: "orizzontale", esempi: [["고", ["ㄱ", "ㅗ"], "go"], ["두", ["ㄷ", "ㅜ"], "du"], ["스", ["ㅅ", "ㅡ"], "seu"]] },
  { regola: "muta", esempi: [["아", ["ㅇ", "ㅏ"], "a"], ["우", ["ㅇ", "ㅜ"], "u"]] },
  { regola: "batchim", esempi: [["한", ["ㅎ", "ㅏ", "ㄴ"], "han"], ["국", ["ㄱ", "ㅜ", "ㄱ"], "guk"], ["방", ["ㅂ", "ㅏ", "ㅇ"], "bang"]] },
];

// Parole facili da leggere (molte prese dall'inglese)
export const PAROLE_DA_LEGGERE = [
  { ko: "커피", rom: "keopi", en: "coffee", it: "caffè" },
  { ko: "바나나", rom: "banana", en: "banana", it: "banana" },
  { ko: "피자", rom: "pija", en: "pizza", it: "pizza" },
  { ko: "택시", rom: "taeksi", en: "taxi", it: "taxi" },
  { ko: "버스", rom: "beoseu", en: "bus", it: "autobus" },
  { ko: "호텔", rom: "hotel", en: "hotel", it: "hotel" },
  { ko: "카메라", rom: "kamera", en: "camera", it: "macchina fotografica" },
  { ko: "라디오", rom: "radio", en: "radio", it: "radio" },
  { ko: "아이스크림", rom: "aiseukeurim", en: "ice cream", it: "gelato" },
  { ko: "컴퓨터", rom: "keompyuteo", en: "computer", it: "computer" },
  { ko: "우유", rom: "uyu", en: "milk", it: "latte" },
  { ko: "나무", rom: "namu", en: "tree", it: "albero" },
  { ko: "모자", rom: "moja", en: "hat", it: "cappello" },
  { ko: "김치", rom: "gimchi", en: "kimchi", it: "kimchi" },
  { ko: "한국", rom: "hanguk", en: "Korea", it: "Corea" },
  { ko: "서울", rom: "seoul", en: "Seoul", it: "Seul" },
  { ko: "사랑", rom: "sarang", en: "love", it: "amore" },
  { ko: "친구", rom: "chingu", en: "friend", it: "amico" },
  { ko: "엄마", rom: "eomma", en: "mom", it: "mamma" },
  { ko: "물", rom: "mul", en: "water", it: "acqua" },
  { ko: "밥", rom: "bap", en: "rice / meal", it: "riso / pasto" },
  { ko: "이탈리아", rom: "itallia", en: "Italy", it: "Italia" },
];
