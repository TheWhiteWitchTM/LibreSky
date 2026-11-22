// Bluesky plays a picker GIF from the external embed URL, not from the raw file.
// Tenor and Klipy need height, width, and (for Klipy) the video filename slugs.
// An animated file is a video with presentation "gif". A one-frame GIF stays an image.

export function gifDescription(title, alt = '') {
  const preferred = String(alt || '').trim();
  if (preferred) return `Alt: ${preferred}`;
  return `ALT: ${title || ''}`;
}

function fileSlug(value) {
  const filename = String(value || '').split('/').pop() || '';
  const clean = filename.split('?')[0].split('#')[0];
  const dot = clean.lastIndexOf('.');
  return dot > 0 ? clean.slice(0, dot) : '';
}

export function gifRecordUrl(gif) {
  const media = gif?.media_formats?.gif;
  const gifUrl = String(media?.url || '');
  if (!gifUrl) return '';
  const dims = Array.isArray(media.dims) ? media.dims : [];
  const params = new URLSearchParams();
  const height = Number(dims[1]);
  const width = Number(dims[0]);
  if (height > 0) params.set('hh', String(height));
  if (width > 0) params.set('ww', String(width));
  try {
    const url = new URL(gifUrl);
    if (url.hostname === 'static.klipy.com') {
      const mp4 = fileSlug(gif.media_formats?.mp4?.url);
      const webm = fileSlug(gif.media_formats?.webm?.url);
      if (mp4) params.set('mp4', mp4);
      if (webm) params.set('webm', webm);
    }
  } catch {
    /* a relative address still keeps hh and ww */
  }
  const query = params.toString();
  if (!query) return gifUrl;
  return `${gifUrl}?${query}`;
}

function positiveDims(url) {
  const height = Number(url.searchParams.get('hh'));
  const width = Number(url.searchParams.get('ww'));
  if (!(height > 0) || !(width > 0)) return null;
  return { height, width };
}

function parseTenor(url) {
  if (url.hostname !== 'media.tenor.com') return null;
  const [, id, filename] = url.pathname.split('/');
  if (!id || !filename || !id.includes('AAAAC')) return null;
  const dimensions = positiveDims(url);
  if (!dimensions) return null;
  const webm = `https://t.gifs.bsky.app/${id.replace('AAAAC', 'AAAP3')}/${filename.replace('.gif', '.webm')}`;
  const mp4 = `https://t.gifs.bsky.app/${id.replace('AAAAC', 'AAAP1')}/${filename.replace('.gif', '.mp4')}`;
  return {
    width: dimensions.width,
    height: dimensions.height,
    sources: [
      { src: webm, type: 'video/webm' },
      { src: mp4, type: 'video/mp4' },
    ],
  };
}

function parseKlipy(url) {
  if (url.hostname !== 'static.klipy.com' || !url.pathname.startsWith('/ii/')) return null;
  const dimensions = positiveDims(url);
  if (!dimensions) return null;
  const webmSlug = url.searchParams.get('webm');
  const mp4Slug = url.searchParams.get('mp4');
  if (!webmSlug && !mp4Slug) return null;
  const base = new URL(url.href);
  base.hostname = 'k.gifs.bsky.app';
  base.searchParams.delete('hh');
  base.searchParams.delete('ww');
  base.searchParams.delete('mp4');
  base.searchParams.delete('webm');
  const videoUrl = (slug, ext) => {
    const next = new URL(base.href);
    const parts = next.pathname.split('/');
    parts[parts.length - 1] = `${slug}.${ext}`;
    next.pathname = parts.join('/');
    return next.href;
  };
  const sources = [];
  if (webmSlug) sources.push({ src: videoUrl(webmSlug, 'webm'), type: 'video/webm' });
  if (mp4Slug) sources.push({ src: videoUrl(mp4Slug, 'mp4'), type: 'video/mp4' });
  return { width: dimensions.width, height: dimensions.height, sources };
}

export function gifPlayer(href) {
  let url;
  try { url = new URL(String(href || '')); } catch { return null; }
  return parseTenor(url) || parseKlipy(url);
}

export function isAnimatedGif(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer || new ArrayBuffer(0));
  const sig = String.fromCharCode(...bytes.slice(0, 6));
  if (!sig.startsWith('GIF')) return { isGif: false, isAnimated: false, frames: 0 };
  let i = 13;
  if (bytes[10] & 0x80) {
    const table = 3 * (1 << ((bytes[10] & 0x07) + 1));
    i += table;
  }
  let frames = 0;
  while (i < bytes.length) {
    const block = bytes[i++];
    if (block === 0x2c) {
      frames += 1;
      i += 8;
      if (bytes[i] & 0x80) {
        const table = 3 * (1 << ((bytes[i] & 0x07) + 1));
        i += table + 1;
      } else i += 1;
      i += 1;
      while (bytes[i]) i += bytes[i] + 1;
      i += 1;
    } else if (block === 0x21) {
      i += 1;
      while (bytes[i]) i += bytes[i] + 1;
      i += 1;
    } else if (block === 0x3b) break;
  }
  return { isGif: true, isAnimated: frames > 1, frames };
}
