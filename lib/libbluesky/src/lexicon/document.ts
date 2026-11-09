import { ValidationError } from '../errors.js';
import { lexiconHttpMethod } from '../generated/ids.js';
import { Nsid } from '../syntax.js';

export type HttpMethod = 'GET' | 'POST' | 'WEBSOCKET';

export interface LexiconDef {
  type?: string;
  description?: string;
  key?: string;
  required?: string[];
  nullable?: string[];
  properties?: Record<string, LexiconSchema>;
  record?: LexiconSchema;
  parameters?: LexiconSchema;
  input?: { encoding?: string; schema?: LexiconSchema };
  output?: { encoding?: string; schema?: LexiconSchema };
  errors?: { name?: string; description?: string }[];
  knownValues?: string[];
  refs?: string[];
  closed?: boolean;
  items?: LexiconSchema;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  minGraphemes?: number;
  maxGraphemes?: number;
  format?: string;
  const?: boolean;
  default?: unknown;
  title?: string;
  detail?: string;
  permissions?: unknown;
  [key: string]: unknown;
}

export interface LexiconSchema extends LexiconDef {}

export interface LexiconDocumentJson {
  lexicon: 1;
  id: string;
  description?: string;
  defs: Record<string, LexiconDef>;
}

export class LexiconDocument {
  readonly id: string;
  readonly description?: string;
  readonly defs: Record<string, LexiconDef>;

  static parse(input: unknown): LexiconDocument {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      throw new ValidationError([{ path: '', message: 'Lexicon must be an object.' }]);
    }
    const doc = input as Record<string, unknown>;
    if (doc.lexicon !== 1) {
      throw new ValidationError([{ path: 'lexicon', message: 'Only lexicon version 1 is supported.' }]);
    }
    if (typeof doc.id !== 'string' || !Nsid.isValid(doc.id)) {
      throw new ValidationError([{ path: 'id', message: 'Lexicon id must be an NSID.' }]);
    }
    if (!doc.defs || typeof doc.defs !== 'object' || Array.isArray(doc.defs)) {
      throw new ValidationError([{ path: 'defs', message: 'Lexicon defs must be an object.' }]);
    }
    return new LexiconDocument(doc as unknown as LexiconDocumentJson);
  }

  constructor(raw: LexiconDocumentJson) {
    this.id = raw.id;
    this.description = raw.description;
    this.defs = raw.defs;
  }

  def(name = 'main'): LexiconDef | undefined {
    return this.defs[name];
  }

  httpMethod(): HttpMethod | undefined {
    const type = this.defs.main?.type;
    if (type === 'query') return 'GET';
    if (type === 'procedure') return 'POST';
    if (type === 'subscription') return 'WEBSOCKET';
    return undefined;
  }
}

/** In-memory lexicon set. `register` always replaces an NSID. Nothing is registered on import. */
export class LexiconRegistry {
  private readonly docs = new Map<string, LexiconDocument>();

  register(doc: LexiconDocument): void {
    this.docs.set(doc.id, doc);
  }

  get(nsid: string): LexiconDocument | undefined {
    return this.docs.get(nsid);
  }

  ids(): string[] {
    return [...this.docs.keys()].sort();
  }

  /** A registered document wins over the compiled method map. */
  httpMethod(nsid: string): HttpMethod | undefined {
    return this.docs.get(nsid)?.httpMethod() ?? lexiconHttpMethod(nsid);
  }
}

export function installCatalog(docs: readonly unknown[], registry: LexiconRegistry): LexiconRegistry {
  for (const doc of docs) registry.register(LexiconDocument.parse(doc));
  return registry;
}
