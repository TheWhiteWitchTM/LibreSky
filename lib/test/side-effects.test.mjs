import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let fetches = 0;
let storage = 0;

globalThis.fetch = () => {
  fetches += 1;
  return Promise.reject(new Error('fetch'));
};

for (const name of ['localStorage', 'sessionStorage']) {
  const store = new Proxy({}, {
    get() {
      storage += 1;
      return () => null;
    },
  });
  Object.defineProperty(globalThis, name, {
    configurable: true,
    get() {
      storage += 1;
      return store;
    },
  });
}

test('the protocol bundles do not touch the host when imported', async () => {
  const index = await import('../dist/index.js');
  const lexicons = await import('../dist/lexicons.js');
  assert.equal(fetches, 0);
  assert.equal(storage, 0);
  assert.equal(typeof index.BskyAgent, 'function');
  assert.equal(index.AppBskyFeedPost, undefined);
  assert.equal(typeof lexicons.AppBskyFeedPost, 'function');
  new index.DidDocument({ alsoKnownAs: [] });
  index.buildQuery({ limit: 10 });
  index.nextTid();
  new lexicons.AppBskyFeedPost({ text: 'hi', createdAt: '2024-01-15T12:30:00.000Z' }).toJSON();
  assert.equal(fetches, 0);
  assert.equal(storage, 0);

  for (const file of ['dist/index.js', 'dist/lexicons.js']) {
    const source = readFileSync(path.join(root, file), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    assert.equal(/localStorage|sessionStorage/.test(source), false, file);
    assert.equal(/\bdocument\./.test(source), false, file);
    assert.equal(/\bwindow\./.test(source), false, file);
  }
});
