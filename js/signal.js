export const SIGNAL_URL = 'https://libresky-server.sociallydead.me/api/signal';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz23456789';

export function signalCode(length) {
  const size = Math.max(8, Math.min(24, Number(length) || 12));
  const bytes = new Uint8Array(size);
  const cryptoRef = globalThis.crypto;
  if (cryptoRef?.getRandomValues) cryptoRef.getRandomValues(bytes);
  else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
  return [...bytes].map((byte) => ALPHABET[byte % ALPHABET.length]).join('');
}

export async function signalPost(body) {
  const response = await fetch(SIGNAL_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.ok === false) {
    const error = new Error(data?.error || 'The call server did not answer.');
    error.status = response.status;
    throw error;
  }
  return data;
}

function signalWait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Try again when the call server is busy or out of reach. A bad request is not tried again. */
export async function signalSend(body, tries = 4) {
  let last;
  const times = Math.max(1, Math.min(6, Number(tries) || 4));
  for (let attempt = 0; attempt < times; attempt += 1) {
    try {
      return await signalPost(body);
    } catch (error) {
      last = error;
      const status = Number(error?.status) || 0;
      if (status === 400 || status === 401 || status === 404 || status === 429) throw error;
      if (attempt + 1 < times) await signalWait(250 * (attempt + 1));
    }
  }
  throw last;
}
