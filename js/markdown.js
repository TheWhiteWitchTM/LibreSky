import { eachLink, escapeHtml, safeUrl } from './util.js';

function parseLink(src, index) {
  if (src[index] !== '[') return null;
  const close = src.indexOf(']', index + 1);
  if (close < 0 || src[close + 1] !== '(') return null;
  const urlEnd = src.indexOf(')', close + 2);
  if (urlEnd < 0) return null;
  return {
    text: src.slice(index + 1, close),
    url: src.slice(close + 2, urlEnd).trim(),
    end: urlEnd + 1,
  };
}

function inline(raw) {
  const src = String(raw ?? '');
  const links = eachLink(src);
  let linkAt = 0;
  let out = '';
  let index = 0;
  while (index < src.length) {
    if (src[index] === '`') {
      const end = src.indexOf('`', index + 1);
      if (end > index + 1) {
        out += `<code>${escapeHtml(src.slice(index + 1, end))}</code>`;
        index = end + 1;
        continue;
      }
    }
    if (src[index] === '!' && src[index + 1] === '[') {
      const parsed = parseLink(src, index + 1);
      if (parsed) {
        const href = safeUrl(parsed.url);
        out += href
          ? `<img src="${escapeHtml(href)}" alt="${escapeHtml(parsed.text)}">`
          : escapeHtml(parsed.text);
        index = parsed.end;
        continue;
      }
    }
    if (src[index] === '[') {
      const parsed = parseLink(src, index);
      if (parsed) {
        const href = safeUrl(parsed.url);
        out += href
          ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${inline(parsed.text)}</a>`
          : inline(parsed.text);
        index = parsed.end;
        continue;
      }
    }
    if (src.startsWith('**', index) || src.startsWith('__', index)) {
      const mark = src.slice(index, index + 2);
      const end = src.indexOf(mark, index + 2);
      if (end > index + 2) {
        out += `<strong>${inline(src.slice(index + 2, end))}</strong>`;
        index = end + 2;
        continue;
      }
    }
    if (src.startsWith('~~', index)) {
      const end = src.indexOf('~~', index + 2);
      if (end > index + 2) {
        out += `<del>${inline(src.slice(index + 2, end))}</del>`;
        index = end + 2;
        continue;
      }
    }
    if ((src[index] === '*' || src[index] === '_') && src[index + 1] !== src[index]) {
      const mark = src[index];
      const end = src.indexOf(mark, index + 1);
      if (end > index + 1 && src[index + 1] !== ' ' && src[end - 1] !== ' ') {
        out += `<em>${inline(src.slice(index + 1, end))}</em>`;
        index = end + 1;
        continue;
      }
    }
    while (linkAt < links.length && links[linkAt].index < index) linkAt += 1;
    const link = links[linkAt];
    if (link && link.index === index) {
      const href = safeUrl(link.uri);
      if (href) {
        out += `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.shown)}</a>`;
        index += link.shown.length;
        linkAt += 1;
        continue;
      }
    }
    out += escapeHtml(src[index]);
    index += 1;
  }
  return out;
}

function isBlock(line) {
  const text = String(line || '');
  return /^```/.test(text.trim())
    || /^(#{1,3})\s+\S/.test(text)
    || /^>\s?/.test(text)
    || /^[-*]\s+\S/.test(text)
    || /^\d+\.\s+\S/.test(text)
    || /^(-{3,}|\*{3,})$/.test(text.trim());
}

export function renderMarkdown(source) {
  const lines = String(source ?? '').replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim().startsWith('```')) {
      const buf = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        buf.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      out.push(`<pre><code>${escapeHtml(buf.join('\n'))}</code></pre>`);
      continue;
    }
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      out.push('<hr>');
      index += 1;
      continue;
    }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length + 2;
      out.push(`<h${level}>${inline(heading[2].trim())}</h${level}>`);
      index += 1;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        buf.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      out.push(`<blockquote>${renderMarkdown(buf.join('\n'))}</blockquote>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(`<li>${inline(lines[index].replace(/^[-*]\s+/, ''))}</li>`);
        index += 1;
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(`<li>${inline(lines[index].replace(/^\d+\.\s+/, ''))}</li>`);
        index += 1;
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }
    const buf = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isBlock(lines[index])) {
      buf.push(lines[index]);
      index += 1;
    }
    out.push(`<p>${buf.map((part) => inline(part)).join('<br>')}</p>`);
  }
  return out.join('');
}

export function markdownPlain(text) {
  return String(text || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/[*_~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
