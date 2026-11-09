import { XrpcError } from '../errors.js';

/**
 * Read an XRPC HTTP response.
 * An empty success body becomes {}. Errors keep `status` and `data`.
 * A success body that is not JSON becomes `{ message }` so callers can still read it.
 */
export async function readXrpcResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text.slice(0, 240) };
    }
  }
  if (!res.ok) {
    const body = data && typeof data === 'object' ? data as { message?: unknown; error?: unknown } : null;
    const message = body?.message || body?.error || `Bluesky request failed (${res.status})`;
    throw new XrpcError(String(message), res.status, data);
  }
  return data ?? {};
}
