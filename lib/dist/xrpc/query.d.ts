/** Query string for XRPC. Null and empty strings are skipped. Zero and false stay. */
export declare function buildQuery(params?: Record<string, unknown> | null): string;
export declare function xrpcPath(nsid: string, params?: Record<string, unknown> | null): string;
