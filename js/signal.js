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
