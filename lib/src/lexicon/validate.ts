import type { ValidationIssue } from '../errors.js';
import { ValidationError } from '../errors.js';
import {
  AtDatetime,
  AtIdentifier,
  AtUri,
  Cid,
  Did,
  Handle,
  Language,
  Nsid,
  RecordKey,
  Tid,
  Uri,
} from '../syntax.js';
import type { LexiconDef, LexiconRegistry, LexiconSchema } from './document.js';

const MAX_DEPTH = 32;

interface RefTarget {
  nsid: string;
  def: string;
  id: string;
}

function joinPath(path: string, key: string): string {
  return path ? `${path}/${key}` : key;
}

function parseRef(ref: string, owner: string): RefTarget {
  let nsid = owner;
  let def = 'main';
  if (ref.startsWith('#')) {
    def = ref.slice(1) || 'main';
  } else if (ref.includes('#')) {
    const [id, name] = ref.split('#');
    nsid = id;
    def = name || 'main';
  } else {
    nsid = ref;
    def = 'main';
  }
  const id = def === 'main' ? nsid : `${nsid}#${def}`;
  return { nsid, def, id };
}

function graphemeCount(value: string): number {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  let count = 0;
  for (const _segment of segmenter.segment(value)) count += 1;
  return count;
}

const FORMATS: Record<string, (value: string) => boolean> = {
  did: (value) => Did.isValid(value),
  handle: (value) => Handle.isValid(value),
  nsid: (value) => Nsid.isValid(value),
  tid: (value) => Tid.isValid(value),
  'record-key': (value) => RecordKey.isValid(value),
  datetime: (value) => AtDatetime.isValid(value),
  language: (value) => Language.isValid(value),
  cid: (value) => Cid.isValid(value),
  uri: (value) => Uri.isValid(value),
  'at-uri': (value) => AtUri.isValid(value),
  'at-identifier': (value) => AtIdentifier.isValid(value),
};

function checkSchema(
  registry: LexiconRegistry,
  schema: LexiconSchema,
  value: unknown,
  owner: string,
  path: string,
  issues: ValidationIssue[],
  depth: number,
): void {
  if (depth > MAX_DEPTH) {
    issues.push({ path, message: 'Schema is nested too deeply.' });
    return;
  }
  const type = schema?.type;
  if (type === 'unknown') return;
  if (type === 'ref' && typeof schema.ref === 'string') {
    checkRef(registry, schema.ref, value, owner, path, issues, depth + 1);
    return;
  }
  if (type === 'union') {
    checkUnion(registry, schema, value, owner, path, issues, depth + 1);
    return;
  }
  if (type === 'array') {
    if (!Array.isArray(value)) {
      issues.push({ path, message: 'Expected an array.' });
      return;
    }
    if (schema.minLength != null && value.length < schema.minLength) {
      issues.push({ path, message: `Must contain at least ${schema.minLength} items.` });
    }
    if (schema.maxLength != null && value.length > schema.maxLength) {
      issues.push({ path, message: `Must contain at most ${schema.maxLength} items.` });
    }
    if (schema.items) {
      value.forEach((item, index) => {
        checkSchema(registry, schema.items as LexiconSchema, item, owner, joinPath(path, String(index)), issues, depth + 1);
      });
    }
    return;
  }
  if (type === 'object' || type === 'params') {
    checkObject(registry, schema, value, owner, path, issues, depth + 1);
    return;
  }
  if (type === 'string') {
    checkString(schema, value, path, issues);
    return;
  }
  if (type === 'integer') {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      issues.push({ path, message: 'Expected an integer.' });
      return;
    }
    if (schema.minimum != null && value < schema.minimum) issues.push({ path, message: `Must be at least ${schema.minimum}.` });
    if (schema.maximum != null && value > schema.maximum) issues.push({ path, message: `Must be at most ${schema.maximum}.` });
    return;
  }
  if (type === 'boolean') {
    if (typeof value !== 'boolean') {
      issues.push({ path, message: 'Expected a boolean.' });
      return;
    }
    if (schema.const === true && value !== true) issues.push({ path, message: 'Must be true.' });
    return;
  }
  if (type === 'blob') {
    checkBlob(schema, value, path, issues);
    return;
  }
  if (type === 'bytes') {
    if (!value || typeof value !== 'object' || typeof (value as { $bytes?: unknown }).$bytes !== 'string') {
      issues.push({ path, message: 'Expected bytes.' });
    }
    return;
  }
  if (type === 'cid-link') {
    if (!value || typeof value !== 'object' || typeof (value as { $link?: unknown }).$link !== 'string') {
      issues.push({ path, message: 'Expected a CID link.' });
    }
    return;
  }
  issues.push({ path, message: `Unsupported schema type ${String(type)}.` });
}

function checkString(schema: LexiconSchema, value: unknown, path: string, issues: ValidationIssue[]): void {
  if (typeof value !== 'string') {
    issues.push({ path, message: 'Expected a string.' });
    return;
  }
  if (schema.minLength != null && value.length < schema.minLength) {
    issues.push({ path, message: `Must be at least ${schema.minLength} characters.` });
  }
  if (schema.maxLength != null && value.length > schema.maxLength) {
    issues.push({ path, message: `Must be at most ${schema.maxLength} characters.` });
  }
  if (schema.minGraphemes != null || schema.maxGraphemes != null) {
    const count = graphemeCount(value);
    if (schema.minGraphemes != null && count < schema.minGraphemes) {
      issues.push({ path, message: `Must be at least ${schema.minGraphemes} characters.` });
    }
    if (schema.maxGraphemes != null && count > schema.maxGraphemes) {
      issues.push({ path, message: `Must be at most ${schema.maxGraphemes} characters.` });
    }
  }
  if (schema.format) {
    const check = FORMATS[schema.format];
    if (check && !check(value)) issues.push({ path, message: `Must be a valid ${schema.format}.` });
  }
}

function checkObject(
  registry: LexiconRegistry,
  schema: LexiconSchema,
  value: unknown,
  owner: string,
  path: string,
  issues: ValidationIssue[],
  depth: number,
): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    issues.push({ path, message: 'Expected an object.' });
    return;
  }
  const record = value as Record<string, unknown>;
  const required = schema.required || [];
  const nullable = new Set(schema.nullable || []);
  const properties = schema.properties || {};
  for (const key of required) {
    const present = record[key];
    if (present === undefined || (present === null && !nullable.has(key))) {
      issues.push({ path: joinPath(path, key), message: 'Required.' });
    }
  }
  for (const [key, prop] of Object.entries(properties)) {
    if (!(key in record) || record[key] === undefined) continue;
    if (record[key] === null) {
      if (!nullable.has(key)) issues.push({ path: joinPath(path, key), message: 'Must not be null.' });
      continue;
    }
    checkSchema(registry, prop, record[key], owner, joinPath(path, key), issues, depth);
  }
}

function checkUnion(
  registry: LexiconRegistry,
  schema: LexiconSchema,
  value: unknown,
  owner: string,
  path: string,
  issues: ValidationIssue[],
  depth: number,
): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    issues.push({ path, message: 'Expected an object.' });
    return;
  }
  const type = (value as { $type?: unknown }).$type;
  const refs = schema.refs || [];
  let matched: string | undefined;
  if (typeof type === 'string') {
    matched = refs.find((ref) => parseRef(ref, owner).id === type);
  }
  if (!matched) {
    if (schema.closed) issues.push({ path: joinPath(path, '$type'), message: 'Unknown union type.' });
    return;
  }
  checkRef(registry, matched, value, owner, path, issues, depth);
}

function checkRef(
  registry: LexiconRegistry,
  ref: string,
  value: unknown,
  owner: string,
  path: string,
  issues: ValidationIssue[],
  depth: number,
): void {
  const target = parseRef(ref, owner);
  const doc = registry.get(target.nsid);
  const def = doc?.def(target.def);
  if (!doc || !def) {
    issues.push({ path, message: `Unknown reference ${target.id}.` });
    return;
  }
  checkDef(registry, def, value, target.nsid, target.def, path, issues, depth, false);
}

function checkBlob(schema: LexiconSchema, value: unknown, path: string, issues: ValidationIssue[]): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    issues.push({ path, message: 'Expected a blob.' });
    return;
  }
  const blob = value as { ref?: { $link?: unknown }; mimeType?: unknown; size?: unknown };
  if (!blob.ref || typeof blob.ref !== 'object' || typeof blob.ref.$link !== 'string' || !blob.ref.$link) {
    issues.push({ path: joinPath(path, 'ref'), message: 'Expected a blob ref.' });
  }
  if (typeof blob.mimeType !== 'string' || !blob.mimeType) {
    issues.push({ path: joinPath(path, 'mimeType'), message: 'Expected a mime type.' });
  }
  if (blob.size != null && (typeof blob.size !== 'number' || !Number.isInteger(blob.size) || blob.size < 0)) {
    issues.push({ path: joinPath(path, 'size'), message: 'Expected a blob size.' });
  }
  const maxSize = schema.maxSize;
  if (typeof maxSize === 'number' && typeof blob.size === 'number' && blob.size > maxSize) {
    issues.push({ path: joinPath(path, 'size'), message: `Must be at most ${maxSize} bytes.` });
  }
}

function checkDef(
  registry: LexiconRegistry,
  def: LexiconDef,
  value: unknown,
  nsid: string,
  defName: string,
  path: string,
  issues: ValidationIssue[],
  depth: number,
  top: boolean,
): void {
  if (def.type === 'record') {
    if (top && value && typeof value === 'object' && !Array.isArray(value)) {
      const typed = (value as { $type?: unknown }).$type;
      if (typeof typed === 'string' && typed !== nsid) {
        issues.push({ path: joinPath(path, '$type'), message: `Expected ${nsid}.` });
      }
    }
    if (def.record) checkSchema(registry, def.record, value, nsid, path, issues, depth);
    else issues.push({ path, message: 'Record schema is missing.' });
    return;
  }
  if (def.type === 'object') {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const typed = (value as { $type?: unknown }).$type;
      const expected = defName === 'main' ? nsid : `${nsid}#${defName}`;
      if (typeof typed === 'string' && typed !== expected) {
        issues.push({ path: joinPath(path, '$type'), message: `Expected ${expected}.` });
      }
    }
    checkSchema(registry, def, value, nsid, path, issues, depth);
    return;
  }
  if (def.type === 'query' || def.type === 'subscription') {
    if (def.parameters) checkSchema(registry, def.parameters, value, nsid, path, issues, depth);
    return;
  }
  if (def.type === 'procedure') {
    if (def.input?.schema) checkSchema(registry, def.input.schema, value, nsid, path, issues, depth);
    return;
  }
  if (def.type === 'string' || def.type === 'array' || def.type === 'boolean' || def.type === 'integer') {
    checkSchema(registry, def, value, nsid, path, issues, depth);
    return;
  }
  if (def.type === 'token') {
    const expected = defName === 'main' ? nsid : `${nsid}#${defName}`;
    if (value !== expected) issues.push({ path, message: `Expected ${expected}.` });
    return;
  }
  issues.push({ path, message: `Cannot validate ${def.type || 'definition'}.` });
}

export function validate(registry: LexiconRegistry, value: unknown, nsid: string, defName = 'main'): void {
  const doc = registry.get(nsid);
  if (!doc) throw new ValidationError([{ path: '', message: `Unknown lexicon ${nsid}.` }]);
  const def = doc.def(defName);
  if (!def) throw new ValidationError([{ path: '', message: `Unknown definition ${nsid}#${defName}.` }]);
  const issues: ValidationIssue[] = [];
  checkDef(registry, def, value, nsid, defName, '', issues, 0, true);
  if (issues.length) throw new ValidationError(issues);
}
