import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lexiconRoot = path.join(root, 'lexicons');
const outDir = path.join(root, 'src', 'generated');

const PROTOCOL_SOURCE = {
  repository: 'https://github.com/bluesky-social/atproto',
  revision: '7a467120982d9ff1559afeb3a26989dad5877d17',
  fetchedAt: '2026-11-09T13:07:59Z',
};

const RESERVED = new Set(`break case catch class const continue debugger default delete do else export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with enum await implements interface let package private protected public static yield constructor`.split(/\s+/));
const CLASH = new Set(['nsid', 'def', 'kind', 'http', 'from', 'errorNames', 'recordKey', 'prototype', 'length', 'name', 'check', 'constructor', 'toJSON', 'toParams', 'toBody', 'send', 'call', 'arguments', 'caller']);

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.json')) files.push(full);
  }
  return files;
}

function pascal(input) {
  return String(input)
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function quoteKey(name) {
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) && !RESERVED.has(name)) return name;
  return JSON.stringify(name);
}

function attachKey(name) {
  return CLASH.has(name) ? `${name}Def` : name;
}

function jsdoc(text) {
  if (typeof text !== 'string' || !text.trim()) return '';
  const clean = text.replace(/\s+/g, ' ').replace(/\*\//g, '* /').trim().slice(0, 240);
  return clean ? `/** ${clean} */\n` : '';
}

function isJsonEncoding(encoding) {
  if (!encoding) return false;
  return String(encoding).split(';')[0].trim().toLowerCase() === 'application/json';
}

function wrapUnion(type) {
  return type.includes('|') ? `(${type})` : type;
}

function knownType(values) {
  if (!Array.isArray(values) || !values.length) return 'string';
  return `${values.map((value) => JSON.stringify(value)).join(' | ')} | (string & {})`;
}

function parseRef(ref, owner) {
  if (typeof ref !== 'string' || !ref) return null;
  if (ref.startsWith('#')) return { nsid: owner, def: ref.slice(1) || 'main' };
  if (ref.includes('#')) {
    const [nsid, def] = ref.split('#');
    return { nsid, def: def || 'main' };
  }
  return { nsid: ref, def: 'main' };
}

const docs = [];
for (const file of await walk(lexiconRoot)) {
  const json = JSON.parse(await readFile(file, 'utf8'));
  if (!json || json.lexicon !== 1 || typeof json.id !== 'string' || !json.defs) {
    throw new Error(`Bad lexicon file: ${file}`);
  }
  docs.push(json);
}
docs.sort((a, b) => a.id.localeCompare(b.id));

const usedNames = new Set();
function unique(name) {
  let next = name || 'Lexicon';
  let n = 2;
  while (usedNames.has(next)) {
    next = `${name}${n}`;
    n += 1;
  }
  usedNames.add(next);
  return next;
}

function defOrder(defs) {
  return Object.keys(defs).sort((a, b) => {
    if (a === 'main') return -1;
    if (b === 'main') return 1;
    return a.localeCompare(b);
  });
}

const index = new Map();
for (const doc of docs) {
  for (const defName of defOrder(doc.defs)) {
    const base = doc.id.split('.').map(pascal).join('');
    const raw = defName === 'main' ? base : base + pascal(defName);
    const name = unique(raw);
    index.set(`${doc.id}#${defName}`, { doc, defName, def: doc.defs[defName], name });
  }
}

function tsTypeOf(schema, owner) {
  if (!schema || typeof schema !== 'object') return 'unknown';
  if (schema.type === 'string') return knownType(schema.knownValues);
  if (schema.type === 'integer') return 'number';
  if (schema.type === 'boolean') return schema.const === true ? 'true' : 'boolean';
  if (schema.type === 'unknown') return 'unknown';
  if (schema.type === 'bytes') return '{ $bytes: string }';
  if (schema.type === 'cid-link') return '{ $link: string }';
  if (schema.type === 'blob') return 'RepoBlobJson';
  if (schema.type === 'ref') return refType(schema.ref, owner);
  if (schema.type === 'union') {
    const parts = (schema.refs || []).map((ref) => refType(ref, owner));
    if (!schema.closed) parts.push('{ $type?: string }');
    return parts.length ? parts.join(' | ') : 'unknown';
  }
  if (schema.type === 'array') {
    const item = schema.items ? tsTypeOf(schema.items, owner) : 'unknown';
    return `Array<${wrapUnion(item)}>`;
  }
  if (schema.type === 'object' || schema.type === 'params') return inlineObject(schema, owner);
  return 'unknown';
}

function refType(ref, owner) {
  const parsed = parseRef(ref, owner);
  if (!parsed) return 'unknown';
  const found = index.get(`${parsed.nsid}#${parsed.def}`);
  if (!found) return 'unknown';
  if (found.def.type === 'token') {
    return JSON.stringify(found.defName === 'main' ? found.doc.id : `${found.doc.id}#${found.defName}`);
  }
  if (found.def.type === 'string') return knownType(found.def.knownValues);
  if (found.def.type === 'integer') return 'number';
  if (found.def.type === 'boolean') return 'boolean';
  return found.name;
}

function inlineObject(schema, owner) {
  const required = new Set(schema.required || []);
  const nullable = new Set(schema.nullable || []);
  const props = Object.entries(schema.properties || {});
  if (!props.length) return 'Record<string, unknown>';
  const fields = props.map(([name, prop]) => {
    let type = tsTypeOf(prop, owner);
    if (nullable.has(name)) type = `${wrapUnion(type)} | null`;
    const optional = required.has(name) ? '' : '?';
    return `${quoteKey(name)}${optional}: ${type}`;
  });
  return `{ ${fields.join('; ')} }`;
}

function fieldsFrom(schema, owner) {
  if (!schema || (schema.type !== 'object' && schema.type !== 'params')) return [];
  const required = new Set(schema.required || []);
  const nullable = new Set(schema.nullable || []);
  return Object.entries(schema.properties || {}).map(([name, prop]) => ({
    name,
    schema: prop,
    required: required.has(name),
    nullable: nullable.has(name),
    ts: tsTypeOf(prop, owner),
  }));
}

function fieldDecl(field) {
  let type = field.ts;
  if (field.nullable) type = `${wrapUnion(type)} | null`;
  return `  ${quoteKey(field.name)}${field.required ? '!' : '?'}: ${type};`;
}

function access(name) {
  return `this[${JSON.stringify(name)}]`;
}

function emitCheck(fields) {
  const lines = ['  check(): void {', '    const issues: { path: string; message: string }[] = [];'];
  for (const field of fields) {
    const value = access(field.name);
    const prop = JSON.stringify(field.name);
    if (field.required && field.nullable) {
      lines.push(`    if (${value} === undefined) issues.push({ path: ${prop}, message: 'Required.' });`);
    } else if (field.required) {
      lines.push(`    if (${value} == null) issues.push({ path: ${prop}, message: 'Required.' });`);
    }
    if (field.schema?.type === 'string' && field.schema.maxLength != null) {
      lines.push(`    if (typeof ${value} === 'string' && ${value}.length > ${Number(field.schema.maxLength)}) issues.push({ path: ${prop}, message: 'Must be at most ${Number(field.schema.maxLength)} characters.' });`);
    }
    if (field.schema?.type === 'integer') {
      lines.push(`    if (${value} != null) {`);
      lines.push(`      if (!Number.isInteger(${value})) issues.push({ path: ${prop}, message: 'Must be an integer.' });`);
      if (field.schema.minimum != null) {
        lines.push(`      else if (${value} < ${Number(field.schema.minimum)}) issues.push({ path: ${prop}, message: 'Must be at least ${Number(field.schema.minimum)}.' });`);
      }
      if (field.schema.maximum != null) {
        lines.push(`      else if (${value} > ${Number(field.schema.maximum)}) issues.push({ path: ${prop}, message: 'Must be at most ${Number(field.schema.maximum)}.' });`);
      }
      lines.push('    }');
    }
    if (field.schema?.type === 'boolean' && field.schema.const === true) {
      lines.push(`    if (${value} != null && ${value} !== true) issues.push({ path: ${prop}, message: 'Must be true.' });`);
    }
  }
  lines.push('    if (issues.length) throw new ValidationError(issues);');
  lines.push('  }');
  return lines.join('\n');
}

function emitJson(method, fields, typeId) {
  const props = [];
  if (typeId) props.push('$type: this.$type');
  for (const field of fields) props.push(`${quoteKey(field.name)}: ${access(field.name)}`);
  const body = props.length ? `\n      ${props.join(',\n      ')},\n    ` : '';
  return `  ${method}(): Record<string, unknown> {\n    return jsonOf({${body}});\n  }`;
}

function emitFrom(name) {
  return `  static from(value: unknown): ${name} {
    if (value == null || typeof value !== 'object' || Array.isArray(value)) {
      throw new ValidationError([{ path: '', message: 'Expected an object.' }]);
    }
    const record = new ${name}(value as Partial<${name}>);
    record.check();
    return record;
  }`;
}

function emitSend(name, http, raw, shape) {
  if (http === 'WEBSOCKET') {
    return `  async send(_client: XrpcClient, _options: SendOptions = {}): Promise<never> {
    throw new ProtocolError(${JSON.stringify(`${name} is a websocket subscription.`)});
  }`;
  }
  const lines = [
    '      nsid: ' + name + '.nsid,',
    `      method: ${JSON.stringify(http)},`,
    '      params: this.toParams(),',
  ];
  if (shape === 'body') lines.push('      body: this.toBody(),');
  if (shape === 'blob') lines.push('      blob: this.payload,');
  if (raw) lines.push('      raw: true,');
  lines.push('      headers: options.headers,', '      signal: options.signal,');
  return `  async send(client: XrpcClient, options: SendOptions = {}): Promise<unknown> {
    this.check();
    return client.request({
${lines.join('\n')}
    });
  }`;
}

const chunks = [];
const methods = {};
const lexRoot = { children: {} };
const nsRoot = { children: {} };

function insert(root, nsid, code) {
  const parts = nsid.split('.');
  let node = root;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i];
    node.children ||= {};
    if (node.value) throw new Error(`Prefix collision at ${nsid}`);
    if (!node.children[part]) node.children[part] = { children: {} };
    if (node.children[part].value) throw new Error(`Prefix collision at ${nsid}`);
    node = node.children[part];
  }
  const leaf = parts[parts.length - 1];
  node.children ||= {};
  const existing = node.children[leaf];
  if (existing?.children && Object.keys(existing.children).length) {
    throw new Error(`Prefix collision, ${nsid} is both a lexicon and a parent`);
  }
  node.children[leaf] = { value: code };
}

for (const doc of docs) {
  const pieces = [];
  let mainName = '';
  const extras = [];
  for (const defName of defOrder(doc.defs)) {
    const found = index.get(`${doc.id}#${defName}`);
    const def = found.def;
    const name = found.name;
    const docComment = jsdoc(def.description || (defName === 'main' ? doc.description : ''));
    if (def.type === 'record' || def.type === 'object') {
      const typeId = defName === 'main' ? doc.id : `${doc.id}#${defName}`;
      const schema = def.type === 'record' ? def.record : def;
      const fields = fieldsFrom(schema, doc.id);
      const lines = [];
      lines.push(`${docComment}export class ${name} {`);
      lines.push(`  static readonly nsid = ${JSON.stringify(doc.id)};`);
      lines.push(`  static readonly def = ${JSON.stringify(defName)};`);
      lines.push(`  static readonly kind = ${JSON.stringify(def.type)} as const;`);
      if (def.type === 'record' && def.key) lines.push(`  static readonly recordKey = ${JSON.stringify(def.key)};`);
      lines.push('  $type: string;');
      for (const field of fields) lines.push(fieldDecl(field));
      lines.push('');
      lines.push('  constructor(input: Partial<' + name + '> = {}) {');
      lines.push('    const source = { ...(input as object) } as Record<string, unknown>;');
      lines.push('    delete source.$type;');
      lines.push('    Object.assign(this, source);');
      lines.push(`    this.$type = ${JSON.stringify(typeId)};`);
      lines.push('  }');
      lines.push('');
      lines.push(emitCheck(fields));
      lines.push('');
      lines.push(emitJson('toJSON', fields, typeId));
      lines.push('');
      lines.push(emitFrom(name));
      lines.push('}');
      pieces.push(lines.join('\n'));
    } else if (def.type === 'query' || def.type === 'procedure' || def.type === 'subscription') {
      const http = def.type === 'query' ? 'GET' : def.type === 'subscription' ? 'WEBSOCKET' : 'POST';
      const params = fieldsFrom(def.parameters, doc.id);
      let body = [];
      let payload = false;
      let nested = false;
      if (def.type === 'procedure' && def.input) {
        const json = isJsonEncoding(def.input.encoding);
        if (!json || !def.input.schema) payload = true;
        else if (def.input.schema.type !== 'object') nested = true;
        else {
          body = fieldsFrom(def.input.schema, doc.id);
          const names = new Set(params.map((field) => field.name));
          if (body.some((field) => names.has(field.name))) nested = true;
        }
      }
      if (nested) body = [];
      const fields = payload || nested ? [...params] : [...params, ...body];
      if (payload) {
        fields.push({
          name: 'payload',
          required: true,
          nullable: false,
          ts: 'Blob | Uint8Array | ArrayBuffer',
          schema: { type: 'bytes' },
        });
      }
      if (nested) {
        fields.push({
          name: 'input',
          required: true,
          nullable: false,
          ts: tsTypeOf(def.input.schema, doc.id),
          schema: def.input.schema,
        });
      }
      const raw = Boolean(def.output?.encoding) && !isJsonEncoding(def.output.encoding);
      const outputType = raw
        ? 'ArrayBuffer'
        : def.output?.schema
          ? tsTypeOf(def.output.schema, doc.id)
          : 'Record<string, unknown>';
      const outputName = unique(`${name}Output`);
      const lines = [];
      lines.push(`${docComment}export class ${name} {`);
      lines.push(`  static readonly nsid = ${JSON.stringify(doc.id)};`);
      lines.push(`  static readonly def = ${JSON.stringify(defName)};`);
      lines.push(`  static readonly kind = ${JSON.stringify(def.type)} as const;`);
      lines.push(`  static readonly http = ${JSON.stringify(http)} as const;`);
      const errorNames = (def.errors || []).map((error) => error?.name).filter((errorName) => typeof errorName === 'string');
      lines.push(`  static readonly errorNames = ${JSON.stringify(errorNames)} as const;`);
      for (const field of fields) lines.push(fieldDecl(field));
      lines.push('');
      lines.push(`  constructor(input: Partial<${name}> = {}) {`);
      lines.push('    Object.assign(this, input);');
      lines.push('  }');
      lines.push('');
      lines.push(emitJson('toParams', params));
      let shape = 'none';
      if (payload) shape = 'blob';
      else if (def.type === 'procedure' && def.input) {
        shape = 'body';
        lines.push('');
        if (nested) {
          lines.push(`  toBody(): Record<string, unknown> {
    const input = this[${JSON.stringify('input')}];
    return jsonOf(input && typeof input === 'object' ? input as object : {});
  }`);
        } else lines.push(emitJson('toBody', body));
      }
      lines.push('');
      lines.push(emitCheck(fields));
      lines.push('');
      lines.push(emitSend(name, http, raw, shape));
      lines.push('');
      lines.push(emitFrom(name));
      lines.push('}');
      lines.push('');
      lines.push(`export type ${outputName} = ${outputType};`);
      pieces.push(lines.join('\n'));
      if (defName === 'main' && (def.type === 'query' || def.type === 'procedure' || def.type === 'subscription')) {
        methods[doc.id] = http;
      }
    } else if (def.type === 'token') {
      const value = defName === 'main' ? doc.id : `${doc.id}#${defName}`;
      const description = typeof def.description === 'string' ? def.description : '';
      pieces.push(`${docComment}export class ${name} {
  static readonly nsid = ${JSON.stringify(doc.id)};
  static readonly def = ${JSON.stringify(defName)};
  static readonly kind = 'token' as const;
  static readonly value = ${JSON.stringify(value)};
  static readonly description = ${JSON.stringify(description)};
  private constructor() {}
}`);
    } else if (def.type === 'string') {
      const values = Array.isArray(def.knownValues) ? def.knownValues : [];
      pieces.push(`${docComment}export class ${name} {
  static readonly nsid = ${JSON.stringify(doc.id)};
  static readonly def = ${JSON.stringify(defName)};
  static readonly kind = 'string' as const;
  static readonly knownValues = ${JSON.stringify(values)} as const;
  static includes(value: string): boolean {
    return (${name}.knownValues as readonly string[]).includes(value);
  }
  private constructor() {}
}`);
    } else if (def.type === 'array') {
      const type = tsTypeOf(def, doc.id);
      pieces.push(`${docComment}export type ${name} = ${type};
export const ${name} = { nsid: ${JSON.stringify(doc.id)}, def: ${JSON.stringify(defName)}, kind: 'array' as const };`);
    } else if (def.type === 'permission-set') {
      pieces.push(`${docComment}export class ${name} {
  static readonly nsid = ${JSON.stringify(doc.id)};
  static readonly def = ${JSON.stringify(defName)};
  static readonly kind = 'permission-set' as const;
  static readonly title = ${JSON.stringify(def.title || '')};
  static readonly detail = ${JSON.stringify(def.detail || '')};
  static readonly permissions = ${JSON.stringify(def.permissions || [])} as const;
  private constructor() {}
  static toJSON() {
    return { title: ${name}.title, detail: ${name}.detail, permissions: ${name}.permissions };
  }
}`);
    } else {
      pieces.push(`export type ${name} = unknown;\nexport const ${name} = { nsid: ${JSON.stringify(doc.id)}, def: ${JSON.stringify(defName)}, kind: ${JSON.stringify(def.type || 'unknown')} as const };`);
    }
    if (defName === 'main') mainName = name;
    else extras.push({ defName, name });
    chunks.push(pieces[pieces.length - 1]);
  }
  let leaf = mainName || '{}';
  if (mainName && extras.length) {
    const assigns = extras
      .slice()
      .sort((a, b) => a.defName.localeCompare(b.defName))
      .map((extra) => `${quoteKey(attachKey(extra.defName))}: ${extra.name}`)
      .join(', ');
    leaf = `Object.assign(${mainName}, { ${assigns} })`;
  } else if (!mainName) {
    const assigns = extras
      .slice()
      .sort((a, b) => a.defName.localeCompare(b.defName))
      .map((extra) => `${quoteKey(attachKey(extra.defName))}: ${extra.name}`)
      .join(', ');
    leaf = `{ ${assigns} }`;
  }
  insert(lexRoot, doc.id, leaf);
  insert(nsRoot, doc.id, JSON.stringify(doc.id));
}

function emitTree(node, indent) {
  if (node.value) return node.value;
  const keys = Object.keys(node.children || {}).sort();
  const pad = `${indent}  `;
  const lines = keys.map((key) => `${pad}${quoteKey(key)}: ${emitTree(node.children[key], pad)},`);
  return `{\n${lines.join('\n')}\n${indent}}`;
}

const header = `// Generated from lexicon JSON. Do not edit by hand.
// ${PROTOCOL_SOURCE.repository} @ ${PROTOCOL_SOURCE.revision} (${PROTOCOL_SOURCE.fetchedAt})

import { ProtocolError, ValidationError } from '../errors.js';
import { jsonOf } from '../data/json.js';
import type { RepoBlobJson } from '../data/blob.js';
import type { XrpcClient } from '../xrpc/client.js';

type SendOptions = { headers?: HeadersInit; signal?: AbortSignal };
`;

const models = `${header}\n${chunks.join('\n\n')}\n\nexport const lex = ${emitTree(lexRoot, '')};\n`;

const ids = `// Generated from lexicon JSON. Do not edit by hand.
// ${PROTOCOL_SOURCE.repository} @ ${PROTOCOL_SOURCE.revision} (${PROTOCOL_SOURCE.fetchedAt})

export const PROTOCOL_SOURCE = ${JSON.stringify(PROTOCOL_SOURCE, null, 2)} as const;

export const LEXICON_METHODS = ${JSON.stringify(methods, null, 2)} as const;

export function lexiconHttpMethod(nsid: string): 'GET' | 'POST' | 'WEBSOCKET' | undefined {
  return (LEXICON_METHODS as Record<string, 'GET' | 'POST' | 'WEBSOCKET' | undefined>)[nsid];
}

export const ns = ${emitTree(nsRoot, '')} as const;
`;

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, 'models.ts'), models);
await writeFile(path.join(outDir, 'ids.ts'), ids);
console.log(`Generated ${docs.length} lexicons, ${index.size} definitions, ${Object.keys(methods).length} methods.`);
