export interface DidService {
    id?: string;
    type?: string;
    serviceEndpoint?: unknown;
}
/** Pure view of a DID document. Fetching the document stays with the caller. */
export declare class DidDocument {
    readonly alsoKnownAs: readonly string[];
    readonly service: readonly DidService[];
    constructor(doc: {
        alsoKnownAs?: unknown;
        service?: unknown;
    } | null | undefined);
    claimsHandle(handle: string): boolean;
    pdsEndpoint(): string | undefined;
}
