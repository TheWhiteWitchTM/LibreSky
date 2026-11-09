export declare class Did {
    readonly value: string;
    static isValid(input: unknown): input is string;
    static parse(input: unknown): Did;
    private constructor();
    toString(): string;
}
export declare class Handle {
    readonly value: string;
    static isValid(input: unknown): input is string;
    static equal(left: string, right: string): boolean;
    static parse(input: unknown): Handle;
    private constructor();
    toString(): string;
}
export declare class Nsid {
    readonly value: string;
    readonly segments: readonly string[];
    static isValid(input: unknown): input is string;
    static parse(input: unknown): Nsid;
    private constructor();
    get name(): string;
    get authority(): string;
    toString(): string;
}
export declare class RecordKey {
    readonly value: string;
    static isValid(input: unknown): input is string;
    static parse(input: unknown): RecordKey;
    private constructor();
    toString(): string;
}
export declare class Tid {
    readonly value: string;
    static isValid(input: unknown): input is string;
    static parse(input: unknown): Tid;
    /** Next id from the clock. The counter only moves forward inside this module. */
    static next(now?: number): string;
    private constructor();
    toString(): string;
}
export declare function nextTid(now?: number): string;
export declare class Uri {
    static isValid(input: unknown): input is string;
}
export declare class Cid {
    static isValid(input: unknown): input is string;
}
export declare class AtIdentifier {
    static isValid(input: unknown): input is string;
}
export declare class AtDatetime {
    static isValid(input: unknown): input is string;
    static parse(input: unknown): Date;
}
export interface LanguageTag {
    grandfathered?: string;
    language?: string;
    extlang?: string;
    script?: string;
    region?: string;
    variant?: string;
    extension?: string;
    privateUse?: string;
}
export declare class Language {
    /** BCP 47 grammar only. Repeated subtags still pass. */
    static isValid(input: unknown): input is string;
    /** Grammar, plus no repeated variant or singleton, plus a lowercase primary. */
    static parse(input: unknown): LanguageTag | null;
}
export interface ParsedAtUri {
    authority: string;
    collection?: string;
    rkey?: string;
    query?: string;
    hash?: string;
}
export interface LooseAtUriParts {
    repo: string;
    collection: string;
    rkey: string;
}
export declare class AtUri {
    readonly authority: string;
    readonly collection?: string;
    readonly rkey?: string;
    readonly query?: string;
    readonly hash?: string;
    static isValid(input: unknown, options?: {
        strict?: boolean;
    }): input is string;
    static parse(input: unknown, options?: {
        strict?: boolean;
    }): AtUri;
    /**
     * Repo, collection, and record key split used by deletes and updates.
     * The first slash and the last slash win, including extra path pieces.
     * This is not the strict AT URI grammar.
     */
    static parts(uri: unknown): LooseAtUriParts | null;
    private constructor();
    toString(): string;
}
