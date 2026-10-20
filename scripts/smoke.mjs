import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { feedHtml, resetPosts } from '../js/render.js';
import { richText } from '../js/util.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const text = 'Hello @jay.bsky.team';
const encoder = new TextEncoder();
const at = text.indexOf('@');
const html = richText(text, [{
  index: { byteStart: encoder.encode(text.slice(0, at)).length, byteEnd: encoder.encode(text).length },
  features: [{ $type: 'app.bsky.richtext.facet#mention', did: 'did:plc:test' }],
}]);
assert.match(html, /href="#\/profile\/did%3Aplc%3Atest"/);
assert.doesNotMatch(html, /<script/i);

const feedUrl = 'https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed?feed='
  + encodeURIComponent('at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot')
  + '&limit=5';
const payload = await fetch(feedUrl).then((res) => {
  if (!res.ok) throw new Error(`Discover feed returned ${res.status}`);
  return res.json();
});
assert.ok(payload.feed?.length, 'Discover returned no posts');
resetPosts();
const rendered = feedHtml(payload.feed);
assert.match(rendered, /class="post/);
assert.match(rendered, /class="action like"/);
assert.match(rendered, /class="action repost"/);
assert.match(rendered, /class="name"/);
assert.doesNotMatch(rendered, /<script/i);
const handle = payload.feed[0].post.author.handle;
assert.match(rendered, new RegExp(handle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

const metadata = JSON.parse(await readFile(path.join(root, 'client-metadata.json'), 'utf8'));
assert.equal(metadata.client_name, 'LibreSky');
assert.equal(metadata.client_id, 'https://thewhitewitchtm.github.io/LibreSky/client-metadata.json');
assert.equal(metadata.dpop_bound_access_tokens, true);
assert.match(metadata.scope, /atproto/);
assert.match(metadata.scope, /transition:generic/);
assert.ok(metadata.redirect_uris.every((uri) => uri.startsWith('https://')));

const banned = [/grok/i, /ollama/i, /\belectron\b/i, /emoji-engine/i, /white witch/i, /modelfile/i, /\bretro\b/i];
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'vendor' || entry.name === '.git' || entry.name === 'smoke.mjs') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (/\.(html|css|js|mjs|md|json|svg)$/.test(entry.name)) files.push(full);
  }
  return files;
}
for (const file of await walk(root)) {
  const body = await readFile(file, 'utf8');
  for (const pattern of banned) {
    assert.doesNotMatch(body, pattern, `${path.relative(root, file)} matches ${pattern}`);
  }
}

const index = await readFile(path.join(root, 'index.html'), 'utf8');
assert.match(index, /Sign in with Bluesky/);
assert.match(index, /js\/app\.js/);
assert.doesNotMatch(index, /ai\.js|styles\.css|grok-sidebar/);

console.log(`smoke ok (${payload.feed.length} live posts, first @${handle})`);
