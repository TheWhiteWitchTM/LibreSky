const LEARNED_KEY = 'libresky.words';
const LATIN = /^[A-Za-z\u00C0-\u024F](?:[A-Za-z\u00C0-\u024F]|['’\-]){1,40}$/;

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

function learnedWords() {
  try {
    const list = JSON.parse(localStorage.getItem(LEARNED_KEY) || '[]');
    return Array.isArray(list) ? list.filter((word) => typeof word === 'string' && LATIN.test(word)) : [];
  } catch {
    return [];
  }
}

export function rememberWords(text) {
  const found = String(text || '').match(/[A-Za-z\u00C0-\u024F](?:[A-Za-z\u00C0-\u024F]|['’\-]){3,40}/g) || [];
  if (!found.length) return;
  try {
    const next = [...found, ...learnedWords()].filter((word, index, all) => all.findIndex((item) => item.toLowerCase() === word.toLowerCase()) === index).slice(0, 400);
    localStorage.setItem(LEARNED_KEY, JSON.stringify(next));
  } catch {
    /* this browser is not storing words */
  }
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
