export interface DidService {
  id?: string;
  type?: string;
  serviceEndpoint?: unknown;
}

/** Pure view of a DID document. Fetching the document stays with the caller. */
export class DidDocument {
  readonly alsoKnownAs: readonly string[];
  readonly service: readonly DidService[];

  constructor(doc: { alsoKnownAs?: unknown; service?: unknown } | null | undefined) {
    const source = doc || {};
    this.alsoKnownAs = Array.isArray(source.alsoKnownAs) ? source.alsoKnownAs.map((name) => String(name)) : [];
    this.service = Array.isArray(source.service)
      ? source.service.filter((item): item is DidService => Boolean(item) && typeof item === 'object')
      : [];
  }

  claimsHandle(handle: string): boolean {
    const wanted = `at://${handle.toLowerCase()}`;
    return this.alsoKnownAs.some((name) => name.toLowerCase() === wanted);
  }

  pdsEndpoint(): string | undefined {
    const service = this.service.find((item) => item.type === 'AtprotoPersonalDataServer' || item.id === '#atproto_pds');
    return typeof service?.serviceEndpoint === 'string' ? service.serviceEndpoint : undefined;
  }
}
