export interface LexiconDoc {
    lexicon: number;
    id: string;
    description?: string;
    defs: Record<string, unknown>;
}
export declare const LEXICONS: readonly LexiconDoc[];
export declare function lexiconRecord(doc: LexiconDoc): Record<string, unknown>;
export declare function sameLexicon(value: unknown, record: Record<string, unknown>): boolean;
