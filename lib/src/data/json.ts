export function toJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => toJsonValue(item));
  if (value && typeof value === 'object') {
    const toJSON = (value as { toJSON?: unknown }).toJSON;
    const constructor = (value as { constructor?: unknown }).constructor;
    if (typeof toJSON === 'function' && constructor !== Object) return toJSON.call(value);
  }
  return value;
}

export function jsonOf(value: object): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (item === undefined) continue;
    out[key] = toJsonValue(item);
  }
  return out;
}
