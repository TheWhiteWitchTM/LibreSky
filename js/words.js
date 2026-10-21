import { englishExtends, englishWord } from './dict-en.js';
import { currentDid } from './session.js';

const LEARNED_KEY = 'libresky.words';
const LATIN = /^[A-Za-z\u00C0-\u024F](?:[A-Za-z\u00C0-\u024F]|['’\-]){1,40}$/;
const EXTRA_SOURCE = `dont doesn't don't cant can't wont won't isnt isn't arent aren't wasnt wasn't werent weren't hasnt hasn't havent haven't hadnt hadn't couldnt couldn't wouldnt wouldn't shouldnt shouldn't thats that's theres there's heres here's whats what's lets let's im i'm ive i've ill i'll youre you're youve you've youll you'll theyre they're theyve they've theyll they'll its it's whos who's hows how's aint ain't yall y'all gotta gonna wanna bluesky bsky libresky gif gifs url urls http https www oauth api apis dm dms fyi imo imho tbh nsfw ok okay yeah yep nope lol lmao omg idk irl brb afk`;

const WORDS = {
  en: `the and you for are but not can all her his was one our out day get has him how its may new now old see two way who did let put say she too use yes yet any big few own why how this that with have from they been more will your what when time just like know them then some into over only also back after first well year much make even most give many well life love good very look take come made work long here want need feel such last over before where those still being right great little world house place while found again three never every those people because through should around another without something between always thought family friend friends message messages picture pictures video videos voice follow following language languages please thanks thank hello morning evening tomorrow yesterday today tonight together really maybe already someone anyone everyone nothing anything everything beautiful important interesting different possible available remember understand question answer story stories music happy sorry welcome check checking complete writing reading talking listening waiting starting coming going living making working trying calling sharing posting reply replies comment comments profile account accounts bluesky image images photo photos link links emoji smile smiles gif gifs hello world`,
  es: `hola gracias porque también cuando donde siempre alguien nosotros ustedes ustedes ahora mismo todavía después antes mejor nunca puede quiero tienes estamos hablando mensaje mensajes mañana noche amigo amigos familia pueblo ciudad tiempo mundo foto fotos video idioma idiomas seguir siguiendo publicar escribir`,
  pt: `olá obrigado porque também quando onde sempre alguém agora mesmo ainda depois antes melhor nunca posso quero estamos mensagem mensagens amanhã noite amigo amigos família tempo mundo foto fotos vídeo idioma idiomas seguir seguindo publicar escrever`,
  fr: `bonjour merci parce aussi quand où toujours quelqu'un maintenant encore après avant mieux jamais peux veux message messages demain soir ami amis famille temps monde photo photos vidéo langue langues suivre suivant publier écrire`,
  de: `hallo danke bitte weil auch wenn immer jemand jetzt noch nachher vorher besser niemals kann will nachricht nachrichten morgen abend freund freunde familie zeit welt foto fotos video sprache sprachen folgen veröffentlichen schreiben`,
  it: `ciao grazie perché anche quando dove sempre qualcuno adesso ancora dopo prima meglio mai posso voglio messaggio messaggi domani sera amico amici famiglia tempo mondo foto foto video lingua lingue seguire pubblicare scrivere`,
  nl: `hallo dank omdat ook wanneer waar altijd iemand nu nog daarna voordat beter nooit bericht berichten morgen avond vriend vrienden familie tijd wereld foto fotos video taal talen volgen plaatsen schrijven`,
  sv: `hej tack eftersom också när var alltid någon nu fortfarande efter innan bättre aldrig meddelande meddelanden imorgon kväll vän vänner familj tid värld foto foton video språk språk följa publicera skriva`,
  pl: `cześć dzięki ponieważ także kiedy gdzie zawsze ktoś teraz jeszcze potem zanim lepiej nigdy wiadomość wiadomości jutro wieczór przyjaciel przyjaciele rodzina czas świat zdjęcie zdjęcia wideo język języki obserwować publikować pisać`,
  da: `hej tak fordi også når hvor altid nogen nu stadig efter før bedre aldrig besked beskeder i morgen aften ven venner familie tid verden foto fotos video sprog sprog følge udgive skrive`,
  tr: `merhaba teşekkür çünkü ayrıca şimdi sonra önce daha asla mesaj mesajlar yarın akşam arkadaş arkadaşlar aile zaman dünya fotoğraf video dil diller takip yayınlamak yazmak`,
  id: `halo terima karena juga ketika dimana selalu seseorang sekarang masih setelah sebelum lebih tidak pesan pesan besok malam teman teman keluarga waktu dunia foto video bahasa bahasa ikuti terbitkan menulis`,
};

function splitWords(source) {
  return [...new Set(String(source || '').split(/\s+/).map((word) => word.trim()).filter((word) => LATIN.test(word)))];
}

const LISTS = Object.fromEntries(Object.entries(WORDS).map(([code, source]) => [code, splitWords(source)]));
const EXTRA = new Set(splitWords(`${EXTRA_SOURCE} ${Object.values(WORDS).join(' ')}`).map((word) => word.toLowerCase().replace(/’/g, "'")));

let wordsWatch = () => {};

export function watchWords(fn) {
  wordsWatch = typeof fn === 'function' ? fn : () => {};
}

function wordsKey() {
  const did = currentDid();
  return did ? `${LEARNED_KEY}:${did}` : LEARNED_KEY;
}

function readWordList(key) {
  try {
    const list = JSON.parse(localStorage.getItem(key) || 'null');
    return Array.isArray(list) ? list.filter((word) => typeof word === 'string' && LATIN.test(word)) : [];
  } catch {
    return [];
  }
}

function learnedWords() {
  const did = currentDid();
  const key = wordsKey();
  try {
    if (localStorage.getItem(key) != null) return readWordList(key);
  } catch {
    return [];
  }
  if (!did) return [];
  const legacy = readWordList(LEARNED_KEY);
  if (!legacy.length) return [];
  try {
    localStorage.setItem(key, JSON.stringify(legacy));
    localStorage.removeItem(LEARNED_KEY);
  } catch {
    /* the list is still returned for this view */
  }
  return legacy;
}

export function learnedWordList() {
  return learnedWords();
}

export function replaceLearnedWords(list, options = {}) {
  const next = [];
  (Array.isArray(list) ? list : []).forEach((word) => {
    const clean = String(word || '').trim();
    if (!LATIN.test(clean) || next.some((item) => item.toLowerCase() === clean.toLowerCase())) return;
    next.push(clean);
  });
  const saved = next.slice(0, 400);
  try {
    const key = wordsKey();
    if (saved.length) localStorage.setItem(key, JSON.stringify(saved));
    else localStorage.removeItem(key);
    if (currentDid()) localStorage.removeItem(LEARNED_KEY);
  } catch {
    /* this browser is not storing words */
  }
  if (!options.quiet) wordsWatch();
  return saved;
}

export function rememberWords(text) {
  const found = String(text || '').match(/[A-Za-z\u00C0-\u024F](?:[A-Za-z\u00C0-\u024F]|['’\-]){3,40}/g) || [];
  if (!found.length) return;
  const next = [...found, ...learnedWords()].filter((word, index, all) => all.findIndex((item) => item.toLowerCase() === word.toLowerCase()) === index).slice(0, 400);
  replaceLearnedWords(next);
}

function applyCase(prefix, word) {
  if (prefix === prefix.toUpperCase() && /[A-ZÀ-Ý]/.test(prefix)) return word.toUpperCase();
  if (prefix[0] && prefix[0] === prefix[0].toUpperCase() && prefix[0] !== prefix[0].toLowerCase()) {
    return word[0].toUpperCase() + word.slice(1);
  }
  return word;
}

function matches(list, lower) {
  return list
    .filter((word) => word.toLowerCase().startsWith(lower) && word.toLowerCase() !== lower)
    .sort((a, b) => a.length - b.length || a.localeCompare(b));
}

export function completeWord(prefix, langs) {
  const query = String(prefix || '');
  if (!LATIN.test(query) || query.length < 2) return [];
  const lower = query.toLowerCase();
  const codes = [...new Set((langs || []).map((code) => String(code || '').slice(0, 2).toLowerCase()))];
  const pools = [matches(learnedWords(), lower)];
  const chosen = codes.length ? codes : ['en'];
  chosen.forEach((code) => pools.push(matches(LISTS[code] || [], lower)));
  if (!pools.some((list) => list.length) && !chosen.includes('en')) pools.push(matches(LISTS.en || [], lower));
  const seen = new Set();
  const out = [];
  pools.flat().forEach((word) => {
    const key = word.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(applyCase(query, word));
  });
  return out.slice(0, 6);
}

function activeCodes(langs) {
  const codes = [...new Set((langs || []).map((code) => String(code || '').slice(0, 2).toLowerCase()).filter(Boolean))];
  return codes.length ? codes : ['en'];
}

function oneEdit(a, b) {
  if (a === b) return false;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  if (la === lb) {
    let diff = 0;
    for (let i = 0; i < la; i += 1) if (a[i] !== b[i] && ++diff > 1) return false;
    return diff === 1;
  }
  const shorter = la < lb ? a : b;
  const longer = la < lb ? b : a;
  let i = 0;
  let j = 0;
  let diff = 0;
  while (i < shorter.length && j < longer.length) {
    if (shorter[i] === longer[j]) {
      i += 1;
      j += 1;
    } else {
      if (++diff > 1) return false;
      j += 1;
    }
  }
  return true;
}

function knownWord(lower, ctx) {
  if (!lower) return true;
  if (ctx.learned.has(lower) || EXTRA.has(lower)) return true;
  const plain = lower.replace(/['-]/g, '');
  if (plain !== lower && (EXTRA.has(plain) || ctx.learned.has(plain))) return true;
  if (ctx.english && (englishWord(lower) || (plain !== lower && plain.length >= 3 && englishWord(plain)))) return true;
  if (ctx.pools.some((word) => word === lower)) return true;
  const parts = lower.split(/['-]/).filter((part) => part.length >= 3);
  if (parts.length > 1 && parts.every((part) => knownWord(part, ctx))) return true;
  return false;
}

function extendsKnown(lower, ctx) {
  if (lower.length < 4) return false;
  const max = lower.length + 6;
  const hit = (word) => {
    const value = String(word || '').toLowerCase();
    return value.length > lower.length && value.length <= max && value.startsWith(lower);
  };
  if ([...EXTRA, ...ctx.learned, ...ctx.pools].some(hit)) return true;
  return ctx.english && englishExtends(lower);
}

export function typoWords(text, langs, caret) {
  const source = String(text || '');
  const at = caret == null || Number.isNaN(Number(caret)) ? null : Math.max(0, Math.min(source.length, Number(caret)));
  const codes = activeCodes(langs);
  const ctx = {
    english: codes.includes('en'),
    pools: codes.filter((code) => code !== 'en').flatMap((code) => (LISTS[code] || []).map((word) => word.toLowerCase())),
    learned: new Set(learnedWords().map((word) => word.toLowerCase().replace(/’/g, "'"))),
  };
  const urls = [];
  const urlRe = /https?:\/\/\S+/gi;
  let urlMatch = urlRe.exec(source);
  while (urlMatch) {
    urls.push([urlMatch.index, urlMatch.index + urlMatch[0].length]);
    urlMatch = urlRe.exec(source);
  }
  const bad = [];
  const re = /[A-Za-z\u00C0-\u024F](?:[A-Za-z\u00C0-\u024F]|['’\-]){2,40}/g;
  let match = re.exec(source);
  while (match) {
    const word = match[0];
    const start = match.index;
    const end = start + word.length;
    const prev = start ? source[start - 1] : '';
    const lower = word.toLowerCase().replace(/’/g, "'");
    const caretHere = at != null && at >= start && at <= end;
    if (word === word.toLowerCase() && !/[@#./]/.test(prev) && !urls.some(([from, to]) => start >= from && start < to) && !knownWord(lower, ctx)) {
      if (!(caretHere && extendsKnown(lower, ctx)) && (ctx.english || ctx.pools.some((item) => oneEdit(item, lower)))) bad.push(lower);
    }
    match = re.exec(source);
  }
  return bad;
}
