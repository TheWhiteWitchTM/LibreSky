import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  AtDatetime,
  AtUri,
  BskyAgent,
  BlockRecord,
  ChatDeclarationRecord,
  Cid,
  DeleteWrite,
  Did,
  DidDocument,
  ExternalEmbed,
  FollowRecord,
  Handle,
  ImagesEmbed,
  Language,
  LexiconDocument,
  LexiconRegistry,
  LikeRecord,
  ListRecord,
  Nsid,
  PostRecord,
  ProtocolError,
  RecordEmbed,
  RecordKey,
  RecordWithMediaEmbed,
  RepoRef,
  RepostRecord,
  StrongRef,
  ThreadgateRecord,
  Tid,
  TypedStrongRef,
  ValidationError,
  VideoEmbed,
  XrpcClient,
  XrpcError,
  applySavedFeeds,
  buildQuery,
  installCatalog,
  isMissingRecord,
  lexiconHttpMethod,
  nextTid,
  ns,
  paginate,
  readXrpcResponse,
  savedFeedItems,
  validate,
  xrpcPath,
} from '../dist/index.js';
import { AppBskyFeedGetTimeline, AppBskyFeedPost, lex } from '../dist/lexicons.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');

function lines(name) {
  return readFileSync(path.join(here, 'fixtures', 'syntax', name), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}

function expectValid(check, file) {
  for (const value of lines(file)) assert.equal(check(value), true, value);
}

function expectInvalid(check, file) {
  for (const value of lines(file)) assert.equal(check(value), false, value);
}

async function lexiconFiles(dir = path.join(here, '..', 'lexicons')) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await lexiconFiles(full));
    else if (entry.name.endsWith('.json')) found.push(full);
  }
  return found;
}

test('syntax fixtures', () => {
  expectValid((value) => Did.isValid(value), 'did_syntax_valid.txt');
  expectInvalid((value) => Did.isValid(value), 'did_syntax_invalid.txt');
  expectValid((value) => Handle.isValid(value), 'handle_syntax_valid.txt');
  expectInvalid((value) => Handle.isValid(value), 'handle_syntax_invalid.txt');
  expectValid((value) => Nsid.isValid(value), 'nsid_syntax_valid.txt');
  expectInvalid((value) => Nsid.isValid(value), 'nsid_syntax_invalid.txt');
  expectValid((value) => RecordKey.isValid(value), 'recordkey_syntax_valid.txt');
  expectInvalid((value) => RecordKey.isValid(value), 'recordkey_syntax_invalid.txt');
  expectValid((value) => Tid.isValid(value), 'tid_syntax_valid.txt');
  expectInvalid((value) => Tid.isValid(value), 'tid_syntax_invalid.txt');
  expectValid((value) => AtUri.isValid(value), 'aturi_syntax_valid.txt');
  expectInvalid((value) => AtUri.isValid(value), 'aturi_syntax_invalid.txt');
  expectValid((value) => AtDatetime.isValid(value), 'datetime_syntax_valid.txt');
  expectInvalid((value) => AtDatetime.isValid(value), 'datetime_syntax_invalid.txt');
  expectInvalid((value) => AtDatetime.isValid(value), 'datetime_parse_invalid.txt');
  expectValid((value) => Language.isValid(value), 'language_syntax_valid.txt');
  expectInvalid((value) => Language.isValid(value), 'language_syntax_invalid.txt');
  for (const value of lines('language_syntax_valid.txt')) assert.ok(Language.parse(value), value);
  for (const value of lines('language_syntax_invalid.txt')) assert.equal(Language.parse(value), null, value);
  for (const value of lines('language_parse_invalid.txt')) {
    assert.equal(Language.isValid(value), true, value);
    assert.equal(Language.parse(value), null, value);
  }
  assert.equal(AtUri.isValid('at://did:plc:asdf123#/frag'), true);
  assert.equal(AtUri.isValid('at://did:plc:asdf123?a'), false);
  assert.equal(AtUri.isValid('at://did:plc:asdf123/'), false);
  assert.equal(AtUri.isValid('at://did:plc:asdf123/', { strict: false }), true);
  assert.equal(Cid.isValid('bafyreig'), false);
  assert.equal(Cid.isValid('bafyreigur'), true);
  assert.equal(Cid.isValid(`Qm${'1'.repeat(43)}`), false);
  assert.equal(Cid.isValid(`Qm${'1'.repeat(44)}`), true);
});

test('loose AT URI parts match the app splitter', () => {
  const samples = [
    'at://did:plc:abc/app.bsky.feed.post/xyz',
    'at://did:plc:abc',
    'at://did:plc:abc/app.bsky.feed.post/a/b',
    '',
    null,
    'did:plc:abc/app.bsky.feed.post/xyz',
  ];
  for (const uri of samples) {
    const raw = String(uri || '').replace(/^at:\/\//, '');
    const first = raw.indexOf('/');
    const last = raw.lastIndexOf('/');
    const legacy = first < 0 || last <= first ? null : {
      repo: raw.slice(0, first),
      collection: raw.slice(first + 1, last),
      rkey: raw.slice(last + 1),
    };
    assert.deepEqual(AtUri.parts(uri), legacy);
  }
});

test('tids stay in the record-key alphabet', () => {
  const first = nextTid();
  const second = nextTid();
  assert.match(first, /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/);
  assert.match(second, /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/);
  assert.notEqual(first, second);
});

test('query strings keep zero and false and skip blanks', () => {
  assert.equal(buildQuery({ a: 1, b: null, c: '', d: false, e: 0, f: ['x', 'y'] }), '?a=1&d=false&e=0&f=x&f=y');
  assert.equal(xrpcPath('app.bsky.feed.getTimeline', { limit: 10 }), '/xrpc/app.bsky.feed.getTimeline?limit=10');
  assert.equal(lexiconHttpMethod('app.bsky.feed.getTimeline'), 'GET');
  assert.equal(lexiconHttpMethod('com.atproto.repo.createRecord'), 'POST');
  assert.equal(lexiconHttpMethod('com.atproto.sync.subscribeRepos'), 'WEBSOCKET');
  assert.equal(ns.app.bsky.feed.post, 'app.bsky.feed.post');
});

test('XRPC responses keep the error shape', async () => {
  const missing = await assert.rejects(
    readXrpcResponse(new Response(JSON.stringify({ error: 'RecordNotFound', message: '' }), { status: 400 })),
    (error) => {
      assert.equal(error.name, 'XrpcError');
      assert.ok(error instanceof XrpcError);
      assert.equal(error.status, 400);
      assert.equal(error.data.error, 'RecordNotFound');
      assert.equal(error.message, 'RecordNotFound');
      assert.equal(isMissingRecord(error), true);
      return true;
    },
  );
  assert.equal(missing, undefined);
  const plain = await readXrpcResponse(new Response(null, { status: 204 }));
  assert.deepEqual(plain, {});
  await assert.rejects(
    readXrpcResponse(new Response('nope', { status: 500 })),
    (error) => error.message === 'nope' && error.status === 500,
  );
});

test('XRPC client uses the injected fetch and leaves aborts alone', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), method: init.method, body: init.body, headers: Object.fromEntries(init.headers.entries()) });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };
  const client = new XrpcClient('https://pds.example/', fetchImpl);
  const data = await client.request({
    nsid: 'com.atproto.repo.getRecord',
    params: { repo: 'did:plc:abc', collection: 'app.bsky.feed.post', rkey: 'x', empty: '', skip: null, flag: false, n: 0 },
  });
  assert.deepEqual(data, { ok: true });
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url, 'https://pds.example/xrpc/com.atproto.repo.getRecord?repo=did%3Aplc%3Aabc&collection=app.bsky.feed.post&rkey=x&flag=false&n=0');
  await assert.rejects(client.request({ nsid: 'not a method' }), ProtocolError);
  assert.equal(calls.length, 1);
  await assert.rejects(client.request({ nsid: 'com.atproto.sync.subscribeRepos', method: 'WEBSOCKET' }), ProtocolError);
  const aborted = new DOMException('The operation was aborted.', 'AbortError');
  const failing = new XrpcClient('https://pds.example/', async () => { throw aborted; });
  await assert.rejects(failing.request({ nsid: 'app.bsky.feed.getTimeline' }), (error) => error === aborted);

  const bytes = new Uint8Array([1, 2, 3]);
  const rawFetch = async () => new Response(bytes, { status: 200 });
  const raw = await new XrpcClient('https://pds.example/', rawFetch).request({
    nsid: 'com.atproto.sync.getBlob',
    method: 'GET',
    params: { did: 'did:plc:abc', cid: 'bafyreigur' },
    raw: true,
  });
  assert.ok(raw instanceof ArrayBuffer);
  assert.equal(new Uint8Array(raw)[0], 1);
  const rawError = new XrpcClient('https://pds.example/', async () => new Response(JSON.stringify({ error: 'NotFound' }), { status: 404 }));
  await assert.rejects(rawError.request({ nsid: 'com.atproto.sync.getBlob', raw: true }), (error) => error.status === 404);
});

test('agent prefers a registered method and rejects subscriptions', async () => {
  const calls = [];
  const agent = new BskyAgent({
    service: 'https://pds.example',
    fetch: async (url, init) => {
      calls.push({ url: String(url), method: init.method, body: init.body });
      return new Response('{}', { status: 200 });
    },
  });
  await agent.call('app.bsky.feed.getTimeline', { params: { limit: 5 } });
  assert.equal(calls[0].method, 'GET');
  assert.match(calls[0].url, /\/xrpc\/app\.bsky\.feed\.getTimeline\?limit=5$/);
  await agent.call('com.atproto.server.deleteSession');
  assert.equal(calls[1].method, 'POST');
  assert.equal(calls[1].body, undefined);
  await assert.rejects(() => agent.call('com.atproto.sync.subscribeRepos'), ProtocolError);
  agent.registry.register(LexiconDocument.parse({
    lexicon: 1,
    id: 'app.bsky.feed.getTimeline',
    defs: { main: { type: 'procedure' } },
  }));
  await agent.call('app.bsky.feed.getTimeline');
  assert.equal(calls[2].method, 'POST');
  const other = new LexiconRegistry();
  assert.equal(other.httpMethod('app.bsky.feed.getTimeline'), 'GET');
});

test('generated classes check records without changing the json shape', () => {
  const post = new AppBskyFeedPost({ text: '', createdAt: '2024-01-15T12:30:00.000Z' });
  post.check();
  assert.equal(post.$type, 'app.bsky.feed.post');
  assert.equal(post.toJSON().text, '');
  const broken = new AppBskyFeedPost({});
  assert.throws(() => broken.check(), ValidationError);
  assert.doesNotThrow(() => broken.toJSON());
  assert.throws(() => AppBskyFeedPost.from('nope'), ValidationError);
  assert.equal(lex.app.bsky.feed.post.replyRef.nsid, 'app.bsky.feed.post');
  const timeline = new AppBskyFeedGetTimeline({ limit: 0 });
  assert.throws(() => timeline.check(), ValidationError);
});

test('record json matches the shapes the app sends', () => {
  const createdAt = '2020-01-01T00:00:00.000Z';
  const uri = 'at://did:plc:abc/app.bsky.feed.post/xyz';
  const cid = `Qm${'1'.repeat(44)}`;
  assert.deepEqual(new LikeRecord({ uri, cid, createdAt }).toJSON(), {
    $type: 'app.bsky.feed.like',
    subject: { uri, cid },
    createdAt,
  });
  assert.deepEqual(new RepostRecord({ uri, cid, createdAt }).toJSON().$type, 'app.bsky.feed.repost');
  assert.equal(new LikeRecord({ uri, cid, createdAt }).toJSON().subject.$type, undefined);
  assert.deepEqual(new FollowRecord({ did: 'did:plc:abc', createdAt }).toJSON(), {
    $type: 'app.bsky.graph.follow',
    subject: 'did:plc:abc',
    createdAt,
  });
  assert.equal(new BlockRecord({ did: 'did:plc:abc', createdAt }).toJSON().$type, 'app.bsky.graph.block');
  assert.deepEqual(new ListRecord({ name: 'People', description: '', purpose: '', createdAt }).toJSON(), {
    $type: 'app.bsky.graph.list',
    purpose: 'app.bsky.graph.defs#curatelist',
    name: 'People',
    createdAt,
  });
  assert.deepEqual(new ThreadgateRecord({ post: uri, allow: [], createdAt }).toJSON(), {
    $type: 'app.bsky.feed.threadgate',
    post: uri,
    allow: [],
    createdAt,
  });
  assert.deepEqual(new ExternalEmbed({ url: 'https://example.com', title: 't'.repeat(400), description: 'd'.repeat(1200) }).toJSON(), {
    $type: 'app.bsky.embed.external',
    external: { uri: 'https://example.com', title: 't'.repeat(300), description: 'd'.repeat(1000) },
  });
  assert.deepEqual(new ImagesEmbed([{ blob: { ref: { $link: 'bafy' } } }]).toJSON(), {
    $type: 'app.bsky.embed.images',
    images: [{ alt: '', image: { ref: { $link: 'bafy' } } }],
  });
  const video = new VideoEmbed({ video: { ref: { $link: 'bafy' } }, alt: 'a'.repeat(2001), aspectRatio: { width: 0, height: 10 } }).toJSON();
  assert.equal(video.alt.length, 2000);
  assert.equal(video.aspectRatio, undefined);
  assert.deepEqual(new RecordEmbed({ uri, cid }).toJSON(), {
    $type: 'app.bsky.embed.record',
    record: { uri, cid },
  });
  assert.equal(new RecordWithMediaEmbed({ uri, cid, media: { $type: 'app.bsky.embed.images' } }).toJSON().record.$type, 'app.bsky.embed.record');
  assert.deepEqual(new ChatDeclarationRecord('nope').toJSON(), {
    $type: 'chat.bsky.actor.declaration',
    allowIncoming: 'all',
  });
  assert.equal(new ChatDeclarationRecord('none').toJSON().allowIncoming, 'none');
  assert.deepEqual(new DeleteWrite({ collection: 'app.bsky.feed.post', rkey: 'xyz' }).toJSON(), {
    $type: 'com.atproto.repo.applyWrites#delete',
    collection: 'app.bsky.feed.post',
    rkey: 'xyz',
  });
  assert.deepEqual(new TypedStrongRef({ uri, cid }).toJSON().$type, 'com.atproto.repo.strongRef');
  assert.equal(new RepoRef('did:plc:abc').toJSON().$type, 'com.atproto.admin.defs#repoRef');
  assert.equal(new StrongRef().toJSON().$type, undefined);
  assert.throws(() => new LikeRecord({ createdAt }).check(), ValidationError);
  assert.doesNotThrow(() => new LikeRecord({}).toJSON());
  const post = new PostRecord({ text: 'hi', createdAt, facets: [], langs: [], embed: null }).toJSON();
  assert.deepEqual(post, { $type: 'app.bsky.feed.post', text: 'hi', createdAt });
});

test('saved feeds keep both preference versions', () => {
  const feedPrefs = [{
    $type: 'app.bsky.actor.defs#savedFeedsPref',
    pinned: ['at://did:example/app.bsky.feed.generator/hot'],
    saved: ['at://did:example/app.bsky.feed.generator/hot', 'at://did:example/app.bsky.graph.list/people'],
  }, {
    $type: 'app.bsky.actor.defs#adultContentPref',
    enabled: true,
  }];
  const feedItems = savedFeedItems(feedPrefs);
  assert.equal(feedItems.length, 2);
  assert.equal(feedItems[1].type, 'list');
  const written = applySavedFeeds(feedPrefs, feedItems.filter((item) => item.type !== 'list').map((item) => ({ ...item, pinned: false })));
  const v2 = written.find((pref) => pref.$type === 'app.bsky.actor.defs#savedFeedsPrefV2');
  assert.equal(v2.items.length, 1);
  assert.equal(v2.items[0].pinned, false);
  assert.match(v2.items[0].id, /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/);
  const v1 = written.find((pref) => pref.$type === 'app.bsky.actor.defs#savedFeedsPref');
  assert.deepEqual(v1.pinned, []);
  assert.deepEqual(v1.saved, ['at://did:example/app.bsky.feed.generator/hot']);
  assert.equal(written.find((pref) => pref.$type === 'app.bsky.actor.defs#adultContentPref').enabled, true);
  assert.deepEqual(feedPrefs[0].pinned, ['at://did:example/app.bsky.feed.generator/hot']);
});

test('DID documents find the handle and the server', () => {
  const doc = new DidDocument({
    alsoKnownAs: ['at://Alice.Bsky.Social'],
    service: [{ id: '#atproto_pds', type: 'AtprotoPersonalDataServer', serviceEndpoint: 'https://pds.example' }],
  });
  assert.equal(doc.claimsHandle('alice.bsky.social'), true);
  assert.equal(doc.claimsHandle('bob.bsky.social'), false);
  assert.equal(doc.pdsEndpoint(), 'https://pds.example');
  assert.equal(new DidDocument({ service: [{ type: 'Other', serviceEndpoint: 12 }] }).pdsEndpoint(), undefined);
});

test('pagination stops when the cursor repeats', async () => {
  const seen = [];
  const items = await paginate(async (cursor) => {
    seen.push(cursor);
    if (!cursor) return { cursor: 'a', items: [1] };
    return { cursor: 'a', items: [2] };
  });
  assert.deepEqual(items, [1, 2]);
  assert.deepEqual(seen, [undefined, 'a']);
});

test('the lexicon catalog loads and validates records', async () => {
  const files = await lexiconFiles();
  assert.equal(files.length, 311);
  const docs = await Promise.all(files.map(async (file) => JSON.parse(await readFile(file, 'utf8'))));
  const registry = new LexiconRegistry();
  installCatalog(docs, registry);
  assert.equal(registry.ids().length, 311);
  const untouched = new LexiconRegistry();
  assert.equal(untouched.ids().length, 0);
  validate(registry, {
    text: 'hello',
    createdAt: '2024-01-15T12:30:00.000Z',
    embed: { $type: 'com.example.custom' },
  }, 'app.bsky.feed.post');
  assert.throws(() => validate(registry, { createdAt: '2024-01-15T12:30:00.000Z' }, 'app.bsky.feed.post'), ValidationError);
  assert.throws(
    () => validate(registry, { text: 'hi', createdAt: 'yesterday' }, 'app.bsky.feed.post'),
    (error) => error instanceof ValidationError && error.issues.some((issue) => issue.path === 'createdAt'),
  );
  assert.throws(
    () => validate(registry, { text: 'a'.repeat(301), createdAt: '2024-01-15T12:30:00.000Z' }, 'app.bsky.feed.post'),
    ValidationError,
  );
  validate(registry, {
    repo: 'did:plc:abcdefghijklmnopqrstuv',
    writes: [{ $type: 'com.atproto.repo.applyWrites#delete', collection: 'app.bsky.feed.post', rkey: 'abc' }],
  }, 'com.atproto.repo.applyWrites');
  assert.throws(() => validate(registry, {
    repo: 'did:plc:abcdefghijklmnopqrstuv',
    writes: [{ $type: 'com.example.nope', collection: 'app.bsky.feed.post', rkey: 'abc' }],
  }, 'com.atproto.repo.applyWrites'), ValidationError);
  for (const doc of docs) {
    const main = doc.defs?.main;
    if (main?.type !== 'record') continue;
    try {
      validate(registry, {}, doc.id);
    } catch (error) {
      assert.ok(error instanceof ValidationError, doc.id);
    }
  }
});

test('the app still owns sessions, methods, and public record urls', () => {
  const api = readFileSync(path.join(root, 'js', 'api.js'), 'utf8');
  assert.match(api, /options\.method \|\| \(options\.body !== undefined \|\| options\.blob \? 'POST' : 'GET'\)/);
  assert.match(api, /new URL\('\/xrpc\/com\.atproto\.repo\.getRecord'/);
  assert.match(api, /app\.bsky\.notification\.putPreferencesV2/);
  assert.match(api, /navigator\.language/);
  assert.match(api, /Could not find this account’s server\./);
});
