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
    input?: {
        encoding?: string;
        schema?: LexiconSchema;
    };
    output?: {
        encoding?: string;
        schema?: LexiconSchema;
    };
    errors?: {
        name?: string;
        description?: string;
    }[];
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
export interface LexiconSchema extends LexiconDef {
}
export interface LexiconDocumentJson {
    lexicon: 1;
    id: string;
    description?: string;
    defs: Record<string, LexiconDef>;
}
export declare class LexiconDocument {
    readonly id: string;
    readonly description?: string;
    readonly defs: Record<string, LexiconDef>;
    static parse(input: unknown): LexiconDocument;
    constructor(raw: LexiconDocumentJson);
    def(name?: string): LexiconDef | undefined;
    httpMethod(): HttpMethod | undefined;
}
/** In-memory lexicon set. `register` always replaces an NSID. Nothing is registered on import. */
export declare class LexiconRegistry {
    private readonly docs;
    register(doc: LexiconDocument): void;
    get(nsid: string): LexiconDocument | undefined;
    ids(): string[];
    /** A registered document wins over the compiled method map. */
    httpMethod(nsid: string): HttpMethod | undefined;
}
export declare function installCatalog(docs: readonly unknown[], registry: LexiconRegistry): LexiconRegistry;
