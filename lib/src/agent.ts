import { ProtocolError } from './errors.js';
import { LexiconRegistry } from './lexicon/document.js';
import { XrpcClient } from './xrpc/client.js';
import type { FetchLike, XrpcRequest } from './xrpc/client.js';

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
export class BskyAgent {
  readonly client: XrpcClient;
  readonly registry: LexiconRegistry;

  constructor(options: { service: string; fetch?: FetchLike; registry?: LexiconRegistry }) {
    this.client = new XrpcClient(options.service, options.fetch);
    this.registry = options.registry ?? new LexiconRegistry();
  }

  async call(nsid: string, options: AgentCall = {}): Promise<unknown> {
    const listed = this.registry.httpMethod(nsid);
    if (listed === 'WEBSOCKET') throw new ProtocolError(`${nsid} is a websocket subscription.`);
    const method = options.method || listed || (options.body !== undefined || options.blob != null ? 'POST' : 'GET');
    const request: XrpcRequest = {
      nsid,
      method,
      params: options.params,
      body: options.body,
      blob: options.blob,
      headers: options.headers,
      signal: options.signal,
      raw: options.raw,
    };
    return this.client.request(request);
  }
}
