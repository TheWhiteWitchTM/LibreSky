import { AtSyntaxError } from './errors.js';

const DID_MAX = 2048;
const DID_REGEX = /^did:[a-z]+:[a-zA-Z0-9._:%-]*[a-zA-Z0-9._-]$/;

const HANDLE_MAX = 253;
const HANDLE_REGEX = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

const NSID_MAX = 317;
const NSID_REGEX = /^[a-zA-Z](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?:\.[a-zA-Z](?:[a-zA-Z0-9]{0,62})?)$/;

const RECORD_KEY_REGEX = /^[a-zA-Z0-9_~.:-]{1,512}$/;
const RECORD_KEY_DOTS = new Set(['.', '..']);

const TID_REGEX = /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/;
const TID_ALPHABET = '234567abcdefghijklmnopqrstuvwxyz';

const URI_REGEX = /^\w+:(?:\/\/)?[^\s/][^\s]*$/;

const DATETIME_MAX = 64;
const DATETIME_REGEX = /^(?<full_year>[0-9]{4})-(?<date_month>0[1-9]|1[012])-(?<date_mday>[0-2][0-9]|3[01])T(?<time_hour>[0-1][0-9]|2[0-3]):(?<time_minute>[0-5][0-9]):(?<time_second>[0-5][0-9]|60)(?<time_secfrac>\.[0-9]+)?(?<time_offset>Z|(?<time_numoffset>[+-](?:[0-1][0-9]|2[0-3]):[0-5][0-9]))$/;

const CID_V0 = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
const CID_V1 = /^b[a-z2-7]{8,}$/;

const AT_URI_MAX = 8192;
const AT_URI_INVALID_CHAR = /[^a-zA-Z0-9._~:@!$&'()*+,;=%/\\[\]#?-]/;
const AT_URI_REGEX = /^(?<uri>at:\/\/(?<authority>[^/?#\s]+)(?:\/(?<collection>[^/?#\s]+)(?:\/(?<rkey>[^/?#\s]+))?)?(?<trailingSlash>\/)?)(?:\?(?<query>[^#\s]*))?(?:#(?<hash>[^\s]*))?$/;
const JSON_POINTER = /^\/[a-zA-Z0-9._~:@!$&')(*+,;=%[\]/-]*$/;

const BCP47_REGEXP = /^((?<grandfathered>(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))|((?<language>([A-Za-z]{2,3}(-(?<extlang>[A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?)|[A-Za-z]{4}|[A-Za-z]{5,8})(-(?<script>[A-Za-z]{4}))?(-(?<region>[A-Za-z]{2}|[0-9]{3}))?(-(?<variant>[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(-(?<extension>[0-9A-WY-Za-wy-z](-[A-Za-z0-9]{2,8})+))*(-(?<privateUseA>[xX](-[A-Za-z0-9]{1,8})+))?)|(?<privateUseB>[xX](-[A-Za-z0-9]{1,8})+))$/;

function fail(format: string, message: string): never {
  throw new AtSyntaxError(message, format);
}

export class Did {
  readonly value: string;

  static isValid(input: unknown): input is string {
    return typeof input === 'string' && input.length <= DID_MAX && DID_REGEX.test(input);
  }

  static parse(input: unknown): Did {
    if (!Did.isValid(input)) fail('did', 'Invalid DID.');
    return new Did(input);
  }

  private constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}

export class Handle {
  readonly value: string;

  static isValid(input: unknown): input is string {
    return typeof input === 'string' && input.length <= HANDLE_MAX && HANDLE_REGEX.test(input);
  }

  static equal(left: string, right: string): boolean {
    return left.toLowerCase() === right.toLowerCase();
  }

  static parse(input: unknown): Handle {
    if (!Handle.isValid(input)) fail('handle', 'Invalid handle.');
    return new Handle(input);
  }

  private constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}

export class Nsid {
  readonly value: string;
  readonly segments: readonly string[];

  static isValid(input: unknown): input is string {
    return typeof input === 'string' && input.length >= 5 && input.length <= NSID_MAX && NSID_REGEX.test(input);
  }

  static parse(input: unknown): Nsid {
    if (!Nsid.isValid(input)) fail('nsid', 'Invalid NSID.');
    return new Nsid(input);
  }

  private constructor(value: string) {
    this.value = value;
    this.segments = value.split('.');
  }

  get name(): string {
    return this.segments[this.segments.length - 1];
  }

  get authority(): string {
    return this.segments.slice(0, -1).slice().reverse().join('.');
  }

  toString(): string {
    return this.value;
  }
}

export class RecordKey {
  readonly value: string;

  static isValid(input: unknown): input is string {
    return typeof input === 'string'
      && input.length >= 1
      && input.length <= 512
      && RECORD_KEY_REGEX.test(input)
      && !RECORD_KEY_DOTS.has(input);
  }

  static parse(input: unknown): RecordKey {
    if (!RecordKey.isValid(input)) fail('record-key', 'Invalid record key.');
    return new RecordKey(input);
  }

  private constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}

let lastTid = 0n;

export class Tid {
  readonly value: string;

  static isValid(input: unknown): input is string {
    return typeof input === 'string' && input.length === 13 && TID_REGEX.test(input);
  }

  static parse(input: unknown): Tid {
    if (!Tid.isValid(input)) fail('tid', 'Invalid TID.');
    return new Tid(input);
  }

  /** Next id from the clock. The counter only moves forward inside this module. */
  static next(now = Date.now()): string {
    let value = BigInt(now) * 1000n;
    if (value <= lastTid) value = lastTid + 1n;
    lastTid = value;
    let out = '';
    let rest = value;
    for (let i = 0; i < 13; i += 1) {
      out = TID_ALPHABET[Number(rest & 31n)] + out;
      rest >>= 5n;
    }
    return out;
  }

  private constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}

export function nextTid(now = Date.now()): string {
  return Tid.next(now);
}

export class Uri {
  static isValid(input: unknown): input is string {
    return typeof input === 'string' && URI_REGEX.test(input);
  }
}

export class Cid {
  static isValid(input: unknown): input is string {
    return typeof input === 'string' && (CID_V0.test(input) || CID_V1.test(input));
  }
}

export class AtIdentifier {
  static isValid(input: unknown): input is string {
    if (typeof input !== 'string' || input.length === 0) return false;
    if (input.startsWith('did:')) return Did.isValid(input);
    return Handle.isValid(input);
  }
}

export class AtDatetime {
  static isValid(input: unknown): input is string {
    if (typeof input !== 'string') return false;
    if (input.length > DATETIME_MAX) return false;
    if (input.endsWith('-00:00')) return false;
    if (!DATETIME_REGEX.test(input)) return false;
    const year = new Date(input).getUTCFullYear();
    if (Number.isNaN(year) || year < 0 || year > 9999) return false;
    return true;
  }

  static parse(input: unknown): Date {
    if (!AtDatetime.isValid(input)) fail('datetime', 'Invalid datetime.');
    return new Date(input);
  }
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

function hasStrictPrimary(groups: { language?: string }): boolean {
  const language = groups.language;
  if (!language) return true;
  return /^[a-z]{2,3}$/.test(language.split('-')[0]);
}

function hasDuplicateVariantOrSingleton(input: string, groups: { grandfathered?: string; privateUseB?: string }): boolean {
  if (groups.grandfathered || groups.privateUseB) return false;
  const subtags = input.split('-');
  let i = 1;
  if (subtags[0].length === 2 || subtags[0].length === 3) {
    let count = 0;
    while (count < 3 && i < subtags.length && /^[A-Za-z]{3}$/.test(subtags[i])) {
      i += 1;
      count += 1;
    }
  }
  if (i < subtags.length && /^[A-Za-z]{4}$/.test(subtags[i])) i += 1;
  if (i < subtags.length && /^([A-Za-z]{2}|[0-9]{3})$/.test(subtags[i])) i += 1;
  const seenVariants = new Set<string>();
  while (i < subtags.length && /^([A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3})$/.test(subtags[i])) {
    const key = subtags[i].toLowerCase();
    if (seenVariants.has(key)) return true;
    seenVariants.add(key);
    i += 1;
  }
  const seenSingletons = new Set<string>();
  while (i < subtags.length && /^[0-9A-WYZa-wyz]$/.test(subtags[i])) {
    const singleton = subtags[i].toLowerCase();
    if (seenSingletons.has(singleton)) return true;
    seenSingletons.add(singleton);
    i += 1;
    while (i < subtags.length && /^[A-Za-z0-9]{2,8}$/.test(subtags[i])) i += 1;
  }
  return false;
}

export class Language {
  /** BCP 47 grammar only. Repeated subtags still pass. */
  static isValid(input: unknown): input is string {
    return typeof input === 'string' && BCP47_REGEXP.test(input);
  }

  /** Grammar, plus no repeated variant or singleton, plus a lowercase primary. */
  static parse(input: unknown): LanguageTag | null {
    if (typeof input !== 'string') return null;
    const parsed = input.match(BCP47_REGEXP);
    if (!parsed?.groups) return null;
    if (hasDuplicateVariantOrSingleton(input, parsed.groups)) return null;
    if (!hasStrictPrimary(parsed.groups)) return null;
    const groups = parsed.groups;
    return {
      grandfathered: groups.grandfathered,
      language: groups.language,
      extlang: groups.extlang,
      script: groups.script,
      region: groups.region,
      variant: groups.variant,
      extension: groups.extension,
      privateUse: groups.privateUseA || groups.privateUseB,
    };
  }
}

export interface ParsedAtUri {
  authority: string;
  collection?: string;
  rkey?: string;
  query?: string;
  hash?: string;
}

interface ParseOk {
  ok: true;
  value: ParsedAtUri;
}

interface ParseNo {
  ok: false;
  message: string;
}

function decodePointer(value: string, strict: boolean): ParseOk | ParseNo {
  if (!JSON_POINTER.test(value)) return { ok: false, message: 'Invalid JSON pointer.' };
  try {
    decodeURIComponent(value);
    return { ok: true, value: { authority: '' } };
  } catch {
    if (!strict) return { ok: true, value: { authority: '' } };
    return { ok: false, message: 'Invalid percent-encoding.' };
  }
}

function parseAtUri(input: unknown, options?: { strict?: boolean }): ParseOk | ParseNo {
  const strict = options?.strict !== false;
  if (typeof input !== 'string') return { ok: false, message: 'AT URI must be a string.' };
  if (input.length > AT_URI_MAX) return { ok: false, message: 'AT URI exceeds maximum length.' };
  if (AT_URI_INVALID_CHAR.test(input)) return { ok: false, message: 'Disallowed characters in AT URI.' };
  const match = input.match(AT_URI_REGEX);
  const groups = match?.groups;
  if (!groups?.authority) return { ok: false, message: 'AT URI does not match the expected format.' };
  if (!AtIdentifier.isValid(groups.authority)) return { ok: false, message: 'AT URI has an invalid authority.' };
  if (groups.collection != null && !Nsid.isValid(groups.collection)) return { ok: false, message: 'AT URI has an invalid collection.' };
  if (groups.hash != null) {
    const pointer = decodePointer(groups.hash, strict);
    if (!pointer.ok) return { ok: false, message: `AT URI has an invalid fragment (${pointer.message})` };
  }
  if (strict) {
    if (groups.trailingSlash != null) return { ok: false, message: 'AT URI cannot have a trailing slash.' };
    if (groups.query != null) return { ok: false, message: 'AT URI query part is not allowed.' };
    if (groups.rkey != null && !RecordKey.isValid(groups.rkey)) return { ok: false, message: 'AT URI has an invalid record key.' };
  }
  return {
    ok: true,
    value: {
      authority: groups.authority,
      collection: groups.collection,
      rkey: groups.rkey,
      query: groups.query,
      hash: groups.hash,
    },
  };
}

export interface LooseAtUriParts {
  repo: string;
  collection: string;
  rkey: string;
}

export class AtUri {
  readonly authority: string;
  readonly collection?: string;
  readonly rkey?: string;
  readonly query?: string;
  readonly hash?: string;

  static isValid(input: unknown, options?: { strict?: boolean }): input is string {
    return parseAtUri(input, options).ok;
  }

  static parse(input: unknown, options?: { strict?: boolean }): AtUri {
    const result = parseAtUri(input, options);
    if (!result.ok) fail('at-uri', result.message);
    return new AtUri(result.value);
  }

  /**
   * Repo, collection, and record key split used by deletes and updates.
   * The first slash and the last slash win, including extra path pieces.
   * This is not the strict AT URI grammar.
   */
  static parts(uri: unknown): LooseAtUriParts | null {
    const raw = String(uri || '').replace(/^at:\/\//, '');
    const first = raw.indexOf('/');
    const last = raw.lastIndexOf('/');
    if (first < 0 || last <= first) return null;
    return {
      repo: raw.slice(0, first),
      collection: raw.slice(first + 1, last),
      rkey: raw.slice(last + 1),
    };
  }

  private constructor(parts: ParsedAtUri) {
    this.authority = parts.authority;
    this.collection = parts.collection;
    this.rkey = parts.rkey;
    this.query = parts.query;
    this.hash = parts.hash;
  }

  toString(): string {
    let path = '';
    if (this.collection) path += `/${this.collection}`;
    if (this.rkey) path += `/${this.rkey}`;
    const query = this.query != null ? `?${this.query}` : '';
    const hash = this.hash != null ? `#${this.hash}` : '';
    return `at://${this.authority}${path}${query}${hash}`;
  }
}
