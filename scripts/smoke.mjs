import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { feedHtml, messageHtml, notificationsHtml, profileHtml, resetPosts } from '../js/render.js';
import { inspectLink } from '../js/api.js';
import { bskyPostParts, richText, xStatusParts } from '../js/util.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const text = 'Hello @jay.bsky.team';
const encoder = new TextEncoder();
const at = text.indexOf('@');
const html = richText(text, [{
  index: { byteStart: encoder.encode(text.slice(0, at)).length, byteEnd: encoder.encode(text).length },
  features: [{ $type: 'app.bsky.richtext.facet#mention', did: 'did:plc:test' }],
}]);
assert.match(html, /href="#\/profile\/did%3Aplc%3Atest"/);
assert.match(html, /class="facet mention"/);
assert.doesNotMatch(html, /<script/i);

const plain = richText('Hi @jay.bsky.team #Bluesky https://bsky.app/profile/jay.bsky.team');
assert.match(plain, /class="facet mention"/);
assert.match(plain, /class="facet tag"/);
assert.match(plain, /class="facet link"/);
assert.match(plain, /href="#\/profile\/jay.bsky.team"/);
assert.match(plain, /href="#\/search\/%23Bluesky"/);
const composer = richText('Hey @jay.bsky.team', null, { links: false, breaks: false });
assert.match(composer, /<span class="facet mention">/);
assert.doesNotMatch(composer, /<a /);

const notes = [
  { reason: 'follow', author: { did: 'did:a', handle: 'a.bsky.social', displayName: 'Ada' }, indexedAt: '2026-10-20T00:00:00.000Z', isRead: false },
  { reason: 'follow', author: { did: 'did:b', handle: 'b.bsky.social', displayName: 'Bea' }, indexedAt: '2026-10-20T00:01:00.000Z', isRead: true },
  { reason: 'like', author: { did: 'did:c', handle: 'c.bsky.social', displayName: 'Cara' }, reasonSubject: 'at://did:x/app.bsky.feed.post/1', indexedAt: '2026-10-20T00:02:00.000Z', isRead: true },
  { reason: 'reply', author: { did: 'did:d', handle: 'd.bsky.social', displayName: 'Dee' }, indexedAt: '2026-10-20T00:03:00.000Z', isRead: true },
  { reason: 'like', author: { did: 'did:e', handle: 'e.bsky.social', displayName: 'Eve' }, reasonSubject: 'at://did:x/app.bsky.feed.post/1', indexedAt: '2026-10-20T00:04:00.000Z', isRead: true },
  { reason: 'follow', author: { did: 'did:f', handle: 'f.bsky.social', displayName: 'Fay' }, indexedAt: '2026-10-20T00:05:00.000Z', isRead: true },
  { reason: 'follow', author: { did: 'did:g', handle: 'g.bsky.social', displayName: 'Gus' }, indexedAt: '2026-10-20T00:06:00.000Z', isRead: true },
];
const notesHtml = notificationsHtml(notes, new Map([['at://did:x/app.bsky.feed.post/1', { uri: 'at://did:x/app.bsky.feed.post/1', author: { handle: 'me.bsky.social' }, record: { text: 'hello #team @me.bsky.social' } }]]));
assert.equal((notesHtml.match(/followed you/g) || []).length, 1);
assert.match(notesHtml, /Ada/);
assert.match(notesHtml, /and 2 others/);
assert.equal((notesHtml.match(/liked your post/g) || []).length, 1);
assert.match(notesHtml, /Cara/);
assert.match(notesHtml, /Eve/);
assert.match(notesHtml, /class="facet tag"/);
assert.match(notesHtml, /replied to you/);

const mine = messageHtml({ text: 'hello @jay.bsky.social', sender: { did: 'did:me' } }, 'did:me');
assert.match(mine, /class="bubble mine"/);
assert.match(mine, /facet mention/);
assert.doesNotMatch(mine, /class="post/);
const shared = messageHtml({
  text: '',
  sender: { did: 'did:me' },
  embed: {
    $type: 'app.bsky.embed.record#view',
    record: {
      $type: 'app.bsky.embed.record#viewRecord',
      uri: 'at://did:plc:abc/app.bsky.feed.post/1',
      author: { handle: 'jay.bsky.social', displayName: 'Jay' },
      value: { text: 'a shared post' },
    },
  },
}, 'did:me');
assert.match(shared, /a shared post/);
assert.match(shared, /class="quote"/);
assert.doesNotMatch(shared, /class="post /);

const headed = profileHtml({
  handle: 'me.bsky.social',
  displayName: 'Me',
  banner: 'https://cdn.example/banner.jpg',
  followersCount: 1,
  followsCount: 2,
  postsCount: 3,
});
assert.match(headed, /class="banner"/);
assert.match(headed, /src="https:\/\/cdn.example\/banner.jpg"/);
assert.equal(bskyPostParts('https://bsky.app/profile/jay.bsky.team/post/abc123')?.rkey, 'abc123');
assert.equal(xStatusParts('https://x.com/jack/status/20')?.id, '20');

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
assert.match(rendered, /data-act="share"/);
assert.match(rendered, /class="action-group like/);
assert.match(rendered, /class="name"/);
assert.doesNotMatch(rendered, /<script/i);
const handle = payload.feed[0].post.author.handle;
assert.match(rendered, new RegExp(handle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
const sample = payload.feed[0].post;
const sampleUrl = `https://bsky.app/profile/${sample.author.handle}/post/${sample.uri.split('/').pop()}`;
const quoteCard = await inspectLink(sampleUrl);
assert.equal(quoteCard?.kind, 'quote');
assert.equal(quoteCard.post.uri, sample.uri);
const pageCard = await inspectLink('https://www.theverge.com/');
assert.equal(pageCard?.kind, 'external');
assert.ok(pageCard.title);
assert.ok(pageCard.image, 'link preview is missing its image');
const tweetCard = await inspectLink('https://x.com/jack/status/20');
assert.equal(tweetCard?.kind, 'external');
assert.match(tweetCard.description, /twttr/i);
assert.ok(tweetCard.title);

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
assert.match(index, /Create a Bluesky account/);
assert.match(index, /stay signed in/);
assert.match(index, /js\/app\.js/);
assert.match(index, /property="og:image"/);
assert.match(index, /name="twitter:card" content="summary_large_image"/);
assert.match(index, /assets\/banner.png/);
assert.match(index, /id="profile-banner"/);
assert.match(index, /id="compose-link"/);
assert.doesNotMatch(index, /ai\.js|styles\.css|grok-sidebar/);

console.log(`smoke ok (${payload.feed.length} live posts, first @${handle})`);
