import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { AtUri, Nsid, RecordKey, ValidationError, nextTid } from '../../libbluesky/dist/index.js';
import {
  ARTICLE_COLLECTION,
  HIGHLIGHT_COLLECTION,
  LEXICON_COLLECTION,
  LEXICONS,
  LINKS_COLLECTION,
  LibreSkyData,
  articleExcerpt,
  kindForUrl,
  normalizeLink,
  presentLink,
  profileTabIds,
} from '../dist/index.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const POST = 'at://did:plc:writer/app.bsky.feed.post/3kpost';

function memoryPort(did) {
  const records = new Map();
  const save = (collection, rkey, record) => {
    const uri = `at://${did}/${collection}/${rkey}`;
    records.set(`${did}\n${collection}\n${rkey}`, { uri, cid: `cid-${rkey}`, value: record });
    return { uri, cid: `cid-${rkey}` };
  };
  return {
    did: () => did,
    async getRecord(repo, collection, rkey) {
      return records.get(`${repo}\n${collection}\n${rkey}`) || null;
    },
    async listRecords(repo, collection) {
      const prefix = `${repo}\n${collection}\n`;
      const found = [];
      for (const [id, record] of records) {
        if (id.startsWith(prefix)) found.push(record);
      }
      return { records: found };
    },
    async putRecord(collection, rkey, record) {
      return save(collection, rkey, record);
    },
    async createRecord(collection, record) {
      return save(collection, nextTid(), record);
    },
    async deleteRecord(uri) {
      const parts = AtUri.parts(uri);
      if (!parts) return;
      records.delete(`${parts.repo}\n${parts.collection}\n${parts.rkey}`);
    },
  };
}

test('the libre lexicons are public record shapes with valid ids', () => {
  assert.equal(LEXICONS.length, 3);
  for (const doc of LEXICONS) {
    assert.equal(doc.lexicon, 1);
    assert.equal(Nsid.isValid(doc.id), true, doc.id);
    assert.equal(RecordKey.isValid(doc.id), true, doc.id);
    assert.equal(doc.defs.main.type, 'record');
  }
  assert.deepEqual(LEXICONS.map((doc) => doc.id), [
    LINKS_COLLECTION,
    HIGHLIGHT_COLLECTION,
    ARTICLE_COLLECTION,
  ]);
});

test('links pick a kind from the address and stay on the toolbar model', () => {
  assert.equal(kindForUrl('https://x.com/ada'), 'x');
  assert.equal(kindForUrl('https://www.youtube.com/watch?v=1'), 'youtube');
  assert.equal(kindForUrl('https://example.com/about'), 'website');
  const link = normalizeLink({ url: 'https://github.com/ada', label: '  Code  ' });
  assert.equal(link.kind, 'github');
  assert.equal(link.label, 'Code');
  assert.equal(presentLink({ url: 'https://example.com/a', label: '', kind: 'website' }).label, 'example.com');
  assert.equal(presentLink(link).label, 'Code');
  assert.throws(() => normalizeLink({ url: 'javascript:alert(1)' }), ValidationError);
});

test('tabs follow what the profile published', () => {
  assert.deepEqual(profileTabIds({}), ['posts', 'replies', 'media', 'likes']);
  assert.deepEqual(profileTabIds({ highlights: 2, articles: 1 }), [
    'posts', 'replies', 'highlights', 'articles', 'media', 'likes',
  ]);
  assert.ok(profileTabIds({ current: 'articles' }).includes('articles'));
  assert.equal(articleExcerpt({ summary: '', text: 'a'.repeat(200) }).endsWith('…'), true);
});

test('another LibreSky reader sees the public shelf', async () => {
  const port = memoryPort('did:plc:writer');
  const writer = new LibreSkyData(port);
  const links = await writer.writeLinks([
    { url: 'https://x.com/ada', label: '', kind: '' },
    { url: 'https://ada.example/notes', label: 'Notes', kind: 'website' },
  ]);
  assert.equal(links[0].kind, 'x');
  const highlight = await writer.addHighlight({ uri: POST, cid: 'bafyreicharactercid' });
  const again = await writer.addHighlight({ uri: POST, cid: 'bafyreicharactercid' });
  assert.equal(again.uri, highlight.uri);
  const article = await writer.saveArticle({ title: 'Hello sky', text: 'The long version.', summary: 'Short' });
  assert.equal(article.rkey.length > 0, true);

  const schema = await port.getRecord('did:plc:writer', LEXICON_COLLECTION, HIGHLIGHT_COLLECTION);
  assert.equal(schema.value.lexicon, 1);
  assert.equal(schema.value.id, HIGHLIGHT_COLLECTION);
  assert.equal(schema.value.defs.main.key, 'tid');

  const reader = new LibreSkyData(port);
  const shelf = await reader.readShelf('did:plc:writer');
  assert.equal(shelf.links.length, 2);
  assert.equal(presentLink(shelf.links[0]).label, 'X');
  assert.equal(presentLink(shelf.links[1]).label, 'Notes');
  assert.equal(shelf.highlights.length, 1);
  assert.equal(shelf.highlights[0].subjectUri, POST);
  assert.equal(shelf.articles[0].title, 'Hello sky');
  assert.equal(shelf.articles[0].summary, 'Short');
  const open = await reader.readArticle('did:plc:writer', shelf.articles[0].rkey);
  assert.equal(open.text, 'The long version.');

  const edited = await writer.saveArticle({
    uri: article.uri,
    title: 'Hello again',
    text: 'Rewritten.',
    summary: '',
    createdAt: article.createdAt,
  });
  assert.equal(edited.title, 'Hello again');
  assert.equal(edited.createdAt, article.createdAt);
  assert.equal((await reader.listArticles('did:plc:writer')).length, 1);

  await writer.removeHighlightPost(POST);
  await writer.writeLinks([]);
  await writer.deleteArticle(article.uri);
  const gone = await reader.readShelf('did:plc:writer');
  assert.deepEqual(gone, { links: [], highlights: [], articles: [] });
  const still = await port.getRecord('did:plc:writer', LEXICON_COLLECTION, ARTICLE_COLLECTION);
  assert.equal(still.value.id, ARTICLE_COLLECTION);
});

test('the bundle does not touch the host when imported', () => {
  const source = readFileSync(path.join(here, '..', 'dist', 'index.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  assert.equal(/localStorage|sessionStorage/.test(source), false);
  assert.equal(/\bdocument\./.test(source), false);
  assert.equal(/\bwindow\./.test(source), false);
  assert.match(source, /libbluesky\/dist\/index\.js/);
});
