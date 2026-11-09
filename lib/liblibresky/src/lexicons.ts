import { articleDoc, highlightDoc, linksDoc } from './generated/docs.js';
import { LEXICON_COLLECTION } from './ids.js';

export interface LexiconDoc {
  lexicon: number;
  id: string;
  description?: string;
  defs: Record<string, unknown>;
}

export const LEXICONS: readonly LexiconDoc[] = [linksDoc, highlightDoc, articleDoc];

export function lexiconRecord(doc: LexiconDoc): Record<string, unknown> {
  const record: Record<string, unknown> = {
    $type: LEXICON_COLLECTION,
    lexicon: doc.lexicon,
    id: doc.id,
    defs: doc.defs,
  };
  if (doc.description) record.description = doc.description;
  return record;
}

export function sameLexicon(value: unknown, record: Record<string, unknown>): boolean {
  if (!value || typeof value !== 'object') return false;
  const current = value as Record<string, unknown>;
  return current.id === record.id && JSON.stringify(current.defs) === JSON.stringify(record.defs);
}
