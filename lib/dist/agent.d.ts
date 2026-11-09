import { LexiconRegistry } from './lexicon/document.js';
import { XrpcClient } from './xrpc/client.js';
import type { FetchLike } from './xrpc/client.js';
export interface AgentCall {
    method?: string;
    params?: Record<string, unknown> | null;
    body?: unknown;
    blob?: Blob | Uint8Array | ArrayBuffer | null;
    headers?: HeadersInit;
    signal?: AbortSignal;
    raw?: boolean;
}
/**
 * Small client for new call sites. The page keeps its own session refresh.
 * A registered lexicon method wins. Subscriptions are rejected here.
 */
export declare class BskyAgent {
    readonly client: XrpcClient;
    readonly registry: LexiconRegistry;
    constructor(options: {
        service: string;
        fetch?: FetchLike;
        registry?: LexiconRegistry;
    });
    call(nsid: string, options?: AgentCall): Promise<unknown>;
}
