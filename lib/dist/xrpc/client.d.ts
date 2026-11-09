export interface XrpcRequest {
    nsid: string;
    method?: string;
    params?: Record<string, unknown> | null;
    body?: unknown;
    blob?: Blob | Uint8Array | ArrayBuffer | null;
    headers?: HeadersInit;
    signal?: AbortSignal;
    raw?: boolean;
}
export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;
/**
 * One XRPC service. `fetch` is touched only when `request` runs.
 * Pass `fetch` in tests. The app keeps its own session and retry loop.
 */
export declare class XrpcClient {
    readonly service: string;
    private readonly fetchImpl?;
    constructor(service: string, fetchImpl?: FetchLike);
    request(call: XrpcRequest): Promise<unknown>;
}
