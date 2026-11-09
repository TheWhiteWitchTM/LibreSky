import { ProtocolError } from '../errors.js';
import { Nsid } from '../syntax.js';
import { xrpcPath } from './query.js';
import { readXrpcResponse } from './response.js';

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
export class XrpcClient {
  readonly service: string;
  private readonly fetchImpl?: FetchLike;

  constructor(service: string, fetchImpl?: FetchLike) {
    this.service = service;
    this.fetchImpl = fetchImpl;
  }

  async request(call: XrpcRequest): Promise<unknown> {
    if (!Nsid.isValid(call.nsid)) throw new ProtocolError(`Invalid XRPC method: ${call.nsid}`);
    const method = call.method ?? (call.body !== undefined || call.blob != null ? 'POST' : 'GET');
    if (method === 'WEBSOCKET') throw new ProtocolError(`${call.nsid} is a websocket subscription.`);
    const headers = new Headers(call.headers || {});
    let body: BodyInit | undefined;
    if (call.blob != null) {
      if (!headers.has('Content-Type')) {
        const blob = call.blob;
        const type = typeof Blob !== 'undefined' && blob instanceof Blob ? (blob.type || 'application/octet-stream') : 'application/octet-stream';
        headers.set('Content-Type', type);
      }
      body = call.blob as BodyInit;
    } else if (call.body !== undefined) {
      if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
      body = JSON.stringify(call.body);
    }
    const base = this.service.replace(/\/$/, '');
    const path = xrpcPath(call.nsid, call.params);
    const fetchImpl = this.fetchImpl ?? globalThis.fetch;
    if (typeof fetchImpl !== 'function') throw new ProtocolError('fetch is not available.');
    let res: Response;
    try {
      res = await fetchImpl(base + path, { method, headers, body, signal: call.signal });
    } catch (error) {
      throw error;
    }
    if (call.raw) {
      if (!res.ok) return readXrpcResponse(res);
      return res.arrayBuffer();
    }
    return readXrpcResponse(res);
  }
}
