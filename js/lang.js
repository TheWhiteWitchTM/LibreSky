const KEY = 'libresky.languages';

export const LANGUAGES = [
  ['en', 'English'],
  ['es', 'Spanish'],
  ['pt', 'Portuguese'],
  ['ja', 'Japanese'],
  ['de', 'German'],
  ['ko', 'Korean'],
  ['fr', 'French'],
  ['it', 'Italian'],
  ['zh', 'Chinese'],
  ['nl', 'Dutch'],
  ['sv', 'Swedish'],
  ['pl', 'Polish'],
  ['tr', 'Turkish'],
  ['ru', 'Russian'],
  ['uk', 'Ukrainian'],
  ['ar', 'Arabic'],
  ['hi', 'Hindi'],
  ['id', 'Indonesian'],
  ['vi', 'Vietnamese'],
  ['th', 'Thai'],
  ['da', 'Danish'],
  ['fi', 'Finnish'],
  ['no', 'Norwegian'],
  ['cs', 'Czech'],
  ['el', 'Greek'],
  ['ro', 'Romanian'],
  ['hu', 'Hungarian'],
  ['he', 'Hebrew'],
  ['fa', 'Persian'],
  ['ca', 'Catalan'],
];

const KNOWN = new Set(LANGUAGES.map(([code]) => code));

export function languageCode(value) {
  const primary = String(value || '').trim().toLowerCase().replace(/_/g, '-').split('-')[0];
  return /^[a-z]{2,3}$/.test(primary) ? primary : '';
}

function clean(list, max) {
  const out = [];
  (Array.isArray(list) ? list : []).forEach((item) => {
    const code = languageCode(item);
    if (!code || !KNOWN.has(code) || out.includes(code) || out.length >= max) return;
    out.push(code);
  });
  return out;
}

function browserLanguage() {
  const code = languageCode(typeof navigator !== 'undefined' ? navigator.language : 'en');
  return KNOWN.has(code) ? code : 'en';
}

function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    return saved && typeof saved === 'object' ? saved : null;
  } catch {
    return null;
  }
}

export function languagePrefs() {
  const saved = readSaved();
  const fallback = browserLanguage();
  const posts = saved && Array.isArray(saved.posts) ? clean(saved.posts, 3) : [fallback];
  const content = saved && Array.isArray(saved.content) ? clean(saved.content, 8) : [fallback];
  return {
    content,
    posts: posts.length ? posts : [fallback],
  };
}

export function saveLanguagePrefs(next) {
  const current = languagePrefs();
  const content = clean(next?.content ?? current.content, 8);
  const posts = clean(next?.posts ?? current.posts, 3);
  const saved = { content, posts: posts.length ? posts : languagePrefs().posts };
  try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* the choice stays for this view */ }
  return { content: saved.content, posts: saved.posts };
}

export function postInLanguages(post, wanted) {
  const targets = (wanted || []).map(languageCode).filter((code, index, all) => code && all.indexOf(code) === index);
  if (!targets.length) return true;
  const langs = (post?.record?.langs || post?.langs || []).map(languageCode).filter(Boolean);
  if (!langs.length) return false;
  return langs.some((code) => targets.includes(code));
}
