/**
 * Read an XRPC HTTP response.
 * An empty success body becomes {}. Errors keep `status` and `data`.
 * A success body that is not JSON becomes `{ message }` so callers can still read it.
 */
export declare function readXrpcResponse(res: Response): Promise<unknown>;
