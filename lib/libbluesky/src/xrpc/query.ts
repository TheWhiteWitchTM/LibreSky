/** Query string for XRPC. Null and empty strings are skipped. Zero and false stay. */
export function buildQuery(params?: Record<string, unknown> | null): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value == null || value === '') continue;
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, String(item));
    } else {
      search.set(key, String(value));
    }
  }
  const text = search.toString();
  return text ? `?${text}` : '';
}

export function xrpcPath(nsid: string, params?: Record<string, unknown> | null): string {
  return `/xrpc/${nsid}${buildQuery(params)}`;
}
