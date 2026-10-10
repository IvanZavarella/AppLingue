// corso.js - Il corso, uguale per tutte le lingue: ogni parola e ogni frase
// è scritta in tutte le lingue dell'app (en, it, fr, ko), così funziona
// qualunque coppia "lingua dell'interfaccia -> lingua da imparare".
//
// Per il coreano c'è anche la romanizzazione (ko_rom). Nelle parole
// francesi e italiane c'è l'articolo, così si impara anche il genere.
//
// Ogni unità ha:
//   - parole: il vocabolario (diviso in due lezioni)
//   - frasi: per la lezione "Frasi" e gli esercizi di ascolto
//   - dialogo: la conversazione guidata (sezione Conversazione)

// Parola o frase in tutte le lingue
const F = (id, en, it, fr, ko, ko_rom) => ({ id, en, it, fr, ko, ko_rom });

// Battuta del dialogo detta dall'altra persona
const LUI = (frase) => ({ chi: "altro", frase });
// Turno tuo: la prima opzione è quella giusta (l'ordine viene mescolato)
const TU = (giusta, ...sbagliate) => ({ chi: "tu", giusta, sbagliate });

export const UNITA = [
  {
    id: "saluti",
    titolo: { en: "Greetings", it: "Saluti" },
    parole: [
      F("ciao", "hello", "ciao", "bonjour", "안녕하세요", "annyeonghaseyo"),
      F("arrivederci", "goodbye", "arrivederci", "au revoir", "안녕히 가세요", "annyeonghi gaseyo"),
      F("grazie", "thank you", "grazie", "merci", "감사합니다", "gamsahamnida"),
      F("si", "yes", "sì", "oui", "네", "ne"),
      F("no", "no", "no", "non", "아니요", "aniyo"),
      F("scusa", "sorry", "scusa", "désolé", "미안해요", "mianhaeyo"),
      F("scusi", "excuse me", "scusi", "excusez-moi", "저기요", "jeogiyo"),
      F("buonanotte", "good night", "buonanotte", "bonne nuit", "안녕히 주무세요", "annyeonghi jumuseyo"),
      F("benvenuto", "welcome", "benvenuto", "bienvenue", "환영합니다", "hwanyeonghamnida"),
      F("nonfaniente", "it's okay", "non fa niente", "ce n'est pas grave", "괜찮아요", "gwaenchanayo"),
    ],
    frasi: [
      F("comestai", "Hello, how are you?", "Ciao, come stai?", "Bonjour, comment ça va ?", "안녕하세요, 잘 지내요?", "annyeonghaseyo, jal jinaeyo?"),
      F("stobene", "I am fine, thank you.", "Sto bene, grazie.", "Je vais bien, merci.", "잘 지내요, 감사합니다.", "jal jinaeyo, gamsahamnida."),
      F("piacere", "Nice to meet you.", "Piacere di conoscerti.", "Ravi de te rencontrer.", "만나서 반가워요.", "mannaseo bangawoyo."),
      F("adomani", "See you tomorrow.", "A domani.", "À demain.", "내일 봐요.", "naeil bwayo."),
      F("grazienille", "Thank you very much.", "Grazie mille.", "Merci beaucoup.", "정말 감사합니다.", "jeongmal gamsahamnida."),
    ],
    dialogo: {
      titolo: { en: "Meeting someone", it: "Incontrare qualcuno" },
      battute: [
        LUI(F("d-ciao", "Hello!", "Ciao!", "Bonjour !", "안녕하세요!", "annyeonghaseyo!")),
        TU(F("d-ciao2", "Hello!", "Ciao!", "Bonjour !", "안녕하세요!", "annyeonghaseyo!"),
          F("d-notte", "Good night!", "Buonanotte!", "Bonne nuit !", "안녕히 주무세요!", "annyeonghi jumuseyo!"),
          F("d-scusa", "Sorry!", "Scusa!", "Désolé !", "미안해요!", "mianhaeyo!")),
        LUI(F("d-comestai", "How are you?", "Come stai?", "Comment ça va ?", "잘 지내요?", "jal jinaeyo?")),
        TU(F("d-stobene", "I am fine, thank you.", "Sto bene, grazie.", "Je vais bien, merci.", "잘 지내요, 감사합니다.", "jal jinaeyo, gamsahamnida."),
          F("d-adomani", "See you tomorrow.", "A domani.", "À demain.", "내일 봐요.", "naeil bwayo."),
          F("d-benvenuto", "Welcome.", "Benvenuto.", "Bienvenue.", "환영합니다.", "hwanyeonghamnida.")),
        LUI(F("d-piacere", "Nice to meet you.", "Piacere di conoscerti.", "Ravi de te rencontrer.", "만나서 반가워요.", "mannaseo bangawoyo.")),
        TU(F("d-piacere2", "Nice to meet you too.", "Piacere mio.", "Moi aussi.", "저도 반가워요.", "jeodo bangawoyo."),
          F("d-no", "No.", "No.", "Non.", "아니요.", "aniyo."),
          F("d-scusi", "Excuse me.", "Scusi.", "Excusez-moi.", "저기요.", "jeogiyo.")),
        LUI(F("d-adomani2", "See you tomorrow!", "A domani!", "À demain !", "내일 봐요!", "naeil bwayo!")),
        TU(F("d-arrivederci", "Goodbye!", "Arrivederci!", "Au revoir !", "안녕히 가세요!", "annyeonghi gaseyo!"),
          F("d-ciao3", "Hello!", "Ciao!", "Bonjour !", "안녕하세요!", "annyeonghaseyo!"),
          F("d-benvenuto2", "Welcome!", "Benvenuto!", "Bienvenue !", "환영합니다!", "hwanyeonghamnida!")),
      ],
    },
  },

  {
    id: "presentarsi",
    titolo: { en: "Introductions", it: "Presentarsi" },
    parole: [
      F("io", "I", "io", "je", "저", "jeo"),
      F("nome", "name", "il nome", "le nom", "이름", "ireum"),
      F("amico", "friend", "l'amico", "l'ami", "친구", "chingu"),
      F("studente", "student", "lo studente", "l'étudiant", "학생", "haksaeng"),
      F("insegnante", "teacher", "l'insegnante", "le professeur", "선생님", "seonsaengnim"),
      F("persona", "person", "la persona", "la personne", "사람", "saram"),
      F("italia", "Italy", "l'Italia", "l'Italie", "이탈리아", "itallia"),
      F("francia", "France", "la Francia", "la France", "프랑스", "peurangseu"),
      F("corea", "Korea", "la Corea", "la Corée", "한국", "hanguk"),
      F("casa", "house", "la casa", "la maison", "집", "jip"),
    ],
    frasi: [
      F("michiamo", "My name is Anna.", "Mi chiamo Anna.", "Je m'appelle Anna.", "제 이름은 안나예요.", "je ireumeun annayeyo."),
      F("cometichiami", "What is your name?", "Come ti chiami?", "Comment tu t'appelles ?", "이름이 뭐예요?", "ireumi mwoyeyo?"),
      F("vengodallitalia", "I am from Italy.", "Vengo dall'Italia.", "Je viens d'Italie.", "저는 이탈리아에서 왔어요.", "jeoneun itallia-eseo wasseoyo."),
      F("abitoaroma", "I live in Rome.", "Abito a Roma.", "J'habite à Rome.", "저는 로마에 살아요.", "jeoneun roma-e sarayo."),
      F("mioamico", "This is my friend.", "Questo è il mio amico.", "C'est mon ami.", "제 친구예요.", "je chinguyeyo."),
    ],
    dialogo: {
      titolo: { en: "A new friend", it: "Un nuovo amico" },
      battute: [
        LUI(F("d-nome", "Hello! What is your name?", "Ciao! Come ti chiami?", "Bonjour ! Comment tu t'appelles ?", "안녕하세요! 이름이 뭐예요?", "annyeonghaseyo! ireumi mwoyeyo?")),
        TU(F("d-anna", "My name is Anna.", "Mi chiamo Anna.", "Je m'appelle Anna.", "제 이름은 안나예요.", "je ireumeun annayeyo."),
          F("d-roma", "I live in Rome.", "Abito a Roma.", "J'habite à Rome.", "저는 로마에 살아요.", "jeoneun roma-e sarayo."),
          F("d-grazie", "Thank you very much.", "Grazie mille.", "Merci beaucoup.", "정말 감사합니다.", "jeongmal gamsahamnida.")),
        LUI(F("d-dove", "Nice to meet you. Where are you from?", "Piacere. Di dove sei?", "Enchanté. Tu viens d'où ?", "반가워요. 어디에서 왔어요?", "bangawoyo. eodieseo wasseoyo?")),
        TU(F("d-italia", "I am from Italy.", "Vengo dall'Italia.", "Je viens d'Italie.", "저는 이탈리아에서 왔어요.", "jeoneun itallia-eseo wasseoyo."),
          F("d-amico", "This is my friend.", "Questo è il mio amico.", "C'est mon ami.", "제 친구예요.", "je chinguyeyo."),
          F("d-adomani", "See you tomorrow.", "A domani.", "À demain.", "내일 봐요.", "naeil bwayo.")),
        LUI(F("d-doveabiti", "Where do you live?", "Dove abiti?", "Où tu habites ?", "어디에 살아요?", "eodie sarayo?")),
        TU(F("d-roma2", "I live in Rome.", "Abito a Roma.", "J'habite à Rome.", "저는 로마에 살아요.", "jeoneun roma-e sarayo."),
          F("d-anna2", "My name is Anna.", "Mi chiamo Anna.", "Je m'appelle Anna.", "제 이름은 안나예요.", "je ireumeun annayeyo."),
          F("d-nonfa", "It's okay.", "Non fa niente.", "Ce n'est pas grave.", "괜찮아요.", "gwaenchanayo.")),
        LUI(F("d-bello", "Great! Rome is beautiful.", "Che bello! Roma è bellissima.", "Super ! Rome est très belle.", "좋아요! 로마는 정말 아름다워요.", "joayo! romaneun jeongmal areumdawoyo.")),
      ],
    },
  },

  {
    id: "cibo",
    titolo: { en: "Food and drinks", it: "Cibo e bevande" },
    parole: [
      F("acqua", "water", "l'acqua", "l'eau", "물", "mul"),
      F("caffe", "coffee", "il caffè", "le café", "커피", "keopi"),
      F("te", "tea", "il tè", "le thé", "차", "cha"),
      F("latte", "milk", "il latte", "le lait", "우유", "uyu"),
      F("birra", "beer", "la birra", "la bière", "맥주", "maekju"),
      F("pane", "bread", "il pane", "le pain", "빵", "ppang"),
      F("riso", "rice", "il riso", "le riz", "밥", "bap"),
      F("mela", "apple", "la mela", "la pomme", "사과", "sagwa"),
      F("carne", "meat", "la carne", "la viande", "고기", "gogi"),
      F("pesce", "fish", "il pesce", "le poisson", "생선", "saengseon"),
    ],
    frasi: [
      F("acquaperfavore", "Water, please.", "Acqua, per favore.", "De l'eau, s'il vous plaît.", "물 주세요.", "mul juseyo."),
      F("caffebuono", "The coffee is good.", "Il caffè è buono.", "Le café est bon.", "커피가 맛있어요.", "keopiga masisseoyo."),
      F("mangiopane", "I eat bread.", "Mangio il pane.", "Je mange du pain.", "저는 빵을 먹어요.", "jeoneun ppang-eul meogeoyo."),
      F("nonbevobirra", "I don't drink beer.", "Non bevo birra.", "Je ne bois pas de bière.", "저는 맥주를 안 마셔요.", "jeoneun maekjureul an masyeoyo."),
      F("tipiacepesce", "Do you like fish?", "Ti piace il pesce?", "Tu aimes le poisson ?", "생선 좋아해요?", "saengseon joahaeyo?"),
    ],
    dialogo: {
      titolo: { en: "At the café", it: "Al bar" },
      battute: [
        LUI(F("d-benvenuti", "Welcome!", "Benvenuti!", "Bienvenue !", "어서 오세요!", "eoseo oseyo!")),
        TU(F("d-acqua", "Water, please.", "Acqua, per favore.", "De l'eau, s'il vous plaît.", "물 주세요.", "mul juseyo."),
          F("d-nonbevo", "I don't drink beer.", "Non bevo birra.", "Je ne bois pas de bière.", "저는 맥주를 안 마셔요.", "jeoneun maekjureul an masyeoyo."),
          F("d-michiamo", "My name is Anna.", "Mi chiamo Anna.", "Je m'appelle Anna.", "제 이름은 안나예요.", "je ireumeun annayeyo.")),
        LUI(F("d-altro", "Anything else?", "Altro?", "Autre chose ?", "더 필요한 거 있으세요?", "deo piryohan geo isseuseyo?")),
        TU(F("d-pane", "Bread too, please.", "Anche del pane, per favore.", "Du pain aussi, s'il vous plaît.", "빵도 주세요.", "ppangdo juseyo."),
          F("d-italia", "I am from Italy.", "Vengo dall'Italia.", "Je viens d'Italie.", "저는 이탈리아에서 왔어요.", "jeoneun itallia-eseo wasseoyo."),
          F("d-notte", "Good night.", "Buonanotte.", "Bonne nuit.", "안녕히 주무세요.", "annyeonghi jumuseyo.")),
        LUI(F("d-ecco", "Here you are.", "Ecco a lei.", "Voilà.", "여기 있어요.", "yeogi isseoyo.")),
        TU(F("d-grazie", "Thank you!", "Grazie!", "Merci !", "감사합니다!", "gamsahamnida!"),
          F("d-piacere", "Nice to meet you!", "Piacere di conoscerti!", "Ravi de te rencontrer !", "만나서 반가워요!", "mannaseo bangawoyo!"),
          F("d-scusa", "Sorry!", "Scusa!", "Désolé !", "미안해요!", "mianhaeyo!")),
      ],
    },
  },

  {
    id: "numeri",
    titolo: { en: "Numbers", it: "Numeri" },
    // Per il coreano usiamo i numeri sino-coreani (prezzi, date, telefono)
    nota: {
      en: "Korean has two sets of numbers: here you learn the Sino-Korean ones, used for prices and dates.",
      it: "Il coreano ha due serie di numeri: qui impari quelli sino-coreani, usati per prezzi e date.",
    },
    parole: [
      F("uno", "one", "uno", "un", "일", "il"),
      F("due", "two", "due", "deux", "이", "i"),
      F("tre", "three", "tre", "trois", "삼", "sam"),
      F("quattro", "four", "quattro", "quatre", "사", "sa"),
      F("cinque", "five", "cinque", "cinq", "오", "o"),
      F("sei", "six", "sei", "six", "육", "yuk"),
      F("sette", "seven", "sette", "sept", "칠", "chil"),
      F("otto", "eight", "otto", "huit", "팔", "pal"),
      F("nove", "nine", "nove", "neuf", "구", "gu"),
      F("dieci", "ten", "dieci", "dix", "십", "sip"),
    ],
    frasi: [
      F("quantocosta", "How much is it?", "Quanto costa?", "C'est combien ?", "얼마예요?", "eolmayeyo?"),
      F("dieceuro", "It is ten euros.", "Costa dieci euro.", "C'est dix euros.", "십 유로예요.", "sip yuroyeyo."),
      F("uncaffe", "One coffee, please.", "Un caffè, per favore.", "Un café, s'il vous plaît.", "커피 한 잔 주세요.", "keopi han jan juseyo."),
      F("ecco", "Here you are.", "Ecco a lei.", "Voilà.", "여기 있어요.", "yeogi isseoyo."),
    ],
    dialogo: {
      titolo: { en: "At the shop", it: "Al negozio" },
      battute: [
        LUI(F("d-benvenuti", "Welcome!", "Benvenuti!", "Bienvenue !", "어서 오세요!", "eoseo oseyo!")),
        TU(F("d-quanto", "How much is it?", "Quanto costa?", "C'est combien ?", "얼마예요?", "eolmayeyo?"),
          F("d-adomani", "See you tomorrow.", "A domani.", "À demain.", "내일 봐요.", "naeil bwayo."),
          F("d-pesce", "Do you like fish?", "Ti piace il pesce?", "Tu aimes le poisson ?", "생선 좋아해요?", "saengseon joahaeyo?")),
        LUI(F("d-dieci", "It is ten euros.", "Costa dieci euro.", "C'est dix euros.", "십 유로예요.", "sip yuroyeyo.")),
        TU(F("d-ecco", "Here you are.", "Ecco a lei.", "Voilà.", "여기 있어요.", "yeogi isseoyo."),
          F("d-notte", "Good night.", "Buonanotte.", "Bonne nuit.", "안녕히 주무세요.", "annyeonghi jumuseyo."),
          F("d-nonbevo", "I don't drink beer.", "Non bevo birra.", "Je ne bois pas de bière.", "저는 맥주를 안 마셔요.", "jeoneun maekjureul an masyeoyo.")),
        LUI(F("d-grazie", "Thank you! Goodbye!", "Grazie! Arrivederci!", "Merci ! Au revoir !", "감사합니다! 안녕히 가세요!", "gamsahamnida! annyeonghi gaseyo!")),
        // In coreano chi se ne va dice 안녕히 계세요 ("stai bene", a chi resta)
        TU(F("d-arrivederci", "Goodbye!", "Arrivederci!", "Au revoir !", "안녕히 계세요!", "annyeonghi gyeseyo!"),
          F("d-ciao", "Hello!", "Ciao!", "Bonjour !", "안녕하세요!", "annyeonghaseyo!"),
          F("d-benvenuto", "Welcome!", "Benvenuto!", "Bienvenue !", "환영합니다!", "hwanyeonghamnida!")),
      ],
    },
  },

  {
    id: "famiglia",
    titolo: { en: "Family", it: "Famiglia" },
    parole: [
      F("famiglia", "family", "la famiglia", "la famille", "가족", "gajok"),
      F("madre", "mother", "la madre", "la mère", "어머니", "eomeoni"),
      F("padre", "father", "il padre", "le père", "아버지", "abeoji"),
      F("mamma", "mom", "la mamma", "maman", "엄마", "eomma"),
      F("papa", "dad", "il papà", "papa", "아빠", "appa"),
      F("fratellominore", "younger brother", "il fratello minore", "le petit frère", "남동생", "namdongsaeng"),
      F("sorellaminore", "younger sister", "la sorella minore", "la petite sœur", "여동생", "yeodongsaeng"),
      F("bambino", "child", "il bambino", "l'enfant", "아이", "ai"),
      F("marito", "husband", "il marito", "le mari", "남편", "nampyeon"),
      F("moglie", "wife", "la moglie", "la femme", "아내", "anae"),
    ],
    frasi: [
      F("miamadre", "This is my mother.", "Questa è mia madre.", "C'est ma mère.", "우리 어머니예요.", "uri eomeoniyeyo."),
      F("fratello", "I have a younger brother.", "Ho un fratello minore.", "J'ai un petit frère.", "남동생이 있어요.", "namdongsaengi isseoyo."),
      F("amofamiglia", "I love my family.", "Amo la mia famiglia.", "J'aime ma famille.", "저는 우리 가족을 사랑해요.", "jeoneun uri gajogeul saranghaeyo."),
      F("papacasa", "Dad is at home.", "Papà è a casa.", "Papa est à la maison.", "아빠는 집에 있어요.", "appaneun jibe isseoyo."),
    ],
    dialogo: {
      titolo: { en: "Family photos", it: "Foto di famiglia" },
      battute: [
        LUI(F("d-fratelli", "Do you have brothers or sisters?", "Hai fratelli o sorelle?", "Tu as des frères et sœurs ?", "형제가 있어요?", "hyeongjega isseoyo?")),
        TU(F("d-fratello", "I have a younger brother.", "Ho un fratello minore.", "J'ai un petit frère.", "남동생이 있어요.", "namdongsaengi isseoyo."),
          F("d-papa", "Dad is at home.", "Papà è a casa.", "Papa est à la maison.", "아빠는 집에 있어요.", "appaneun jibe isseoyo."),
          F("d-acqua", "Water, please.", "Acqua, per favore.", "De l'eau, s'il vous plaît.", "물 주세요.", "mul juseyo.")),
        LUI(F("d-chi", "Who is this?", "Chi è?", "C'est qui ?", "이 사람은 누구예요?", "i sarameun nuguyeyo?")),
        TU(F("d-madre", "This is my mother.", "Questa è mia madre.", "C'est ma mère.", "우리 어머니예요.", "uri eomeoniyeyo."),
          F("d-roma", "I live in Rome.", "Abito a Roma.", "J'habite à Rome.", "저는 로마에 살아요.", "jeoneun roma-e sarayo."),
          F("d-grazie", "Thank you very much.", "Grazie mille.", "Merci beaucoup.", "정말 감사합니다.", "jeongmal gamsahamnida.")),
        LUI(F("d-bella", "Your family is lovely!", "La tua famiglia è bellissima!", "Ta famille est adorable !", "가족이 정말 좋네요!", "gajogi jeongmal jonneyo!")),
        TU(F("d-amo", "I love my family.", "Amo la mia famiglia.", "J'aime ma famille.", "저는 우리 가족을 사랑해요.", "jeoneun uri gajogeul saranghaeyo."),
          F("d-quanto", "How much is it?", "Quanto costa?", "C'est combien ?", "얼마예요?", "eolmayeyo?"),
          F("d-benvenuto", "Welcome.", "Benvenuto.", "Bienvenue.", "환영합니다.", "hwanyeonghamnida.")),
      ],
    },
  },

  {
    id: "giornata",
    titolo: { en: "My day", it: "La giornata" },
    parole: [
      F("mangiare", "to eat", "mangiare", "manger", "먹다", "meokda"),
      F("bere", "to drink", "bere", "boire", "마시다", "masida"),
      F("andare", "to go", "andare", "aller", "가다", "gada"),
      F("venire", "to come", "venire", "venir", "오다", "oda"),
      F("dormire", "to sleep", "dormire", "dormir", "자다", "jada"),
      F("guardare", "to watch", "guardare", "regarder", "보다", "boda"),
      F("studiare", "to study", "studiare", "étudier", "공부하다", "gongbuhada"),
      F("lavorare", "to work", "lavorare", "travailler", "일하다", "ilhada"),
      F("leggere", "to read", "leggere", "lire", "읽다", "ikda"),
      F("piacere-v", "to like", "piacere", "aimer", "좋아하다", "joahada"),
    ],
    frasi: [
      F("vadoacasa", "I go home.", "Vado a casa.", "Je rentre à la maison.", "집에 가요.", "jibe gayo."),
      F("studioognigiorno", "I study every day.", "Studio ogni giorno.", "J'étudie tous les jours.", "매일 공부해요.", "maeil gongbuhaeyo."),
      F("leggolibro", "I read a book.", "Leggo un libro.", "Je lis un livre.", "책을 읽어요.", "chaegeul ilgeoyo."),
      F("domanilavoro", "I work tomorrow.", "Domani lavoro.", "Je travaille demain.", "내일 일해요.", "naeil ilhaeyo."),
      F("guardiamofilm", "We watch a movie.", "Guardiamo un film.", "Nous regardons un film.", "우리는 영화를 봐요.", "urineun yeonghwareul bwayo."),
    ],
    dialogo: {
      titolo: { en: "Weekend plans", it: "Programmi" },
      battute: [
        LUI(F("d-domani", "What are you doing tomorrow?", "Cosa fai domani?", "Qu'est-ce que tu fais demain ?", "내일 뭐 해요?", "naeil mwo haeyo?")),
        TU(F("d-lavoro", "I work tomorrow.", "Domani lavoro.", "Je travaille demain.", "내일 일해요.", "naeil ilhaeyo."),
          F("d-mangio", "I eat bread.", "Mangio il pane.", "Je mange du pain.", "저는 빵을 먹어요.", "jeoneun ppang-eul meogeoyo."),
          F("d-piacere", "Nice to meet you.", "Piacere di conoscerti.", "Ravi de te rencontrer.", "만나서 반가워요.", "mannaseo bangawoyo.")),
        LUI(F("d-stasera", "And this evening?", "E stasera?", "Et ce soir ?", "오늘 저녁은요?", "oneul jeonyeogeunyo?")),
        TU(F("d-film", "We watch a movie.", "Guardiamo un film.", "Nous regardons un film.", "우리는 영화를 봐요.", "urineun yeonghwareul bwayo."),
          F("d-italia", "I am from Italy.", "Vengo dall'Italia.", "Je viens d'Italie.", "저는 이탈리아에서 왔어요.", "jeoneun itallia-eseo wasseoyo."),
          F("d-quanto", "How much is it?", "Quanto costa?", "C'est combien ?", "얼마예요?", "eolmayeyo?")),
        LUI(F("d-bene", "Great! See you tomorrow!", "Bene! A domani!", "Super ! À demain !", "좋아요! 내일 봐요!", "joayo! naeil bwayo!")),
        TU(F("d-adomani", "See you tomorrow!", "A domani!", "À demain !", "내일 봐요!", "naeil bwayo!"),
          F("d-benvenuto", "Welcome!", "Benvenuto!", "Bienvenue !", "환영합니다!", "hwanyeonghamnida!"),
          F("d-scusa", "Sorry!", "Scusa!", "Désolé !", "미안해요!", "mianhaeyo!")),
      ],
    },
  },
];

// Ricerche YouTube da proporre nella sezione Ascolto (link sempre reali)
export const RICERCHE_VIDEO = {
  en: [
    { testo: "English listening practice for beginners slow", livello: "A1" },
    { testo: "easy English conversation for beginners", livello: "A1" },
    { testo: "short English stories for beginners", livello: "A2" },
    { testo: "English street interviews with subtitles", livello: "B1" },
    { testo: "6 Minute English BBC", livello: "B1" },
  ],
  fr: [
    { testo: "français facile pour débutants dialogue", livello: "A1" },
    { testo: "comprehensible input French beginner", livello: "A1" },
    { testo: "histoires en français pour débutants", livello: "A2" },
    { testo: "Easy French street interviews", livello: "B1" },
    { testo: "Français Authentique podcast", livello: "B1" },
  ],
  ko: [
    { testo: "Korean listening practice for beginners", livello: "A1" },
    { testo: "Talk To Me In Korean level 1", livello: "A1" },
    { testo: "korean comprehensible input beginner", livello: "A1" },
    { testo: "easy Korean conversation with subtitles", livello: "A2" },
    { testo: "Korean vlog with Korean subtitles", livello: "B1" },
  ],
};
