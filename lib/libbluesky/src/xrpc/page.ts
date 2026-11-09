export interface Page<T> {
  cursor?: string;
  items: readonly T[];
}

/** Walk cursor pages. Stops when the cursor is missing or does not move. */
export async function paginate<T>(load: (cursor?: string) => Promise<Page<T>>, options: { maxPages?: number } = {}): Promise<T[]> {
  const maxPages = options.maxPages ?? 40;
  const items: T[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < maxPages; page += 1) {
    const next = await load(cursor);
    items.push(...next.items);
    if (!next.cursor || next.cursor === cursor) break;
    cursor = next.cursor;
  }
  return items;
}
