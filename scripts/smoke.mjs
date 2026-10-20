import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareAi, replyText } from '../js/ai.js';
import { assistantHtml, callConvoHtml, callRequestHtml, callStartHtml, callToolsHtml, chatHeaderHtml, collectionCardHtml, convoHtml, feedHtml, hoverCardHtml, linkPreviewHtml, messageHtml, notificationsHtml, packHtml, postHtml, profileHtml, requestEntryHtml, resetPosts, speechText, trendsHtml } from '../js/render.js';
import { applySavedFeeds, facetsFor, inspectLink, savedFeedItems } from '../js/api.js';
import { accountGone, aiTag, assembleCallSdp, bskyPostParts, caretToken, caretWord, convoUnread, firstUrl, ownUnread, pageCard as pageSummary, parseCallMessage, richText, trimLink, xStatusParts } from '../js/util.js';
import { postInLanguages } from '../js/lang.js';
import { callIsRequest, callMayRing, homeAllows, searchAllows, sortThreadReplies } from '../js/prefs.js';
import { setSoundPrefs, soundPrefs } from '../js/session.js';
import { completeWord, typoWords } from '../js/words.js';

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
const composerAi = richText('Hey @ai.', null, { links: false, breaks: false });
assert.match(composerAi, /<span class="facet ai">@ai</);
assert.doesNotMatch(composerAi, /<a /);
const taggedLine = richText('Ask @AI and @jay.bsky.team');
assert.match(taggedLine, /class="facet ai"/);
assert.match(taggedLine, /href="#\/ai"/);
assert.match(taggedLine, /class="facet mention"/);
assert.doesNotMatch(richText('@aim and @ai.bsky.social'), /facet ai/);
assert.match(richText('@ai.bsky.social'), /facet mention/);
assert.equal(aiTag('hey @si'), true);
assert.equal(aiTag('@AI please'), true);
assert.equal(aiTag('a@ai.com'), false);
assert.equal(aiTag('@aim'), false);
const grokAccount = prepareAi({ provider: 'grok', base: 'https://evil.example/v1', apiKey: 'xai-test-key-123' });
assert.equal(grokAccount.model, 'grok-4.7');
assert.equal(grokAccount.base, 'https://api.x.ai/v1');
assert.equal(grokAccount.kind, 'responses');
const localAccount = prepareAi({ provider: 'custom', model: 'llama', base: 'http://127.0.0.1:11434/v1/chat/completions', apiKey: 'local-key-1234' });
assert.equal(localAccount.base, 'http://127.0.0.1:11434/v1');
try {
  prepareAi({ provider: 'custom', model: 'm', base: 'http://evil.example/v1', apiKey: 'super-secret-key' });
  assert.fail('plain http should be refused');
} catch (error) {
  assert.match(error.message, /https/);
  assert.equal(error.message.includes('super-secret-key'), false);
}
assert.equal(replyText({ output_text: ' hello ' }), 'hello');
assert.equal(replyText({
  output: [
    { type: 'reasoning', content: [{ type: 'output_text', text: 'think' }] },
    { type: 'message', content: [{ type: 'output_text', text: 'done' }] },
  ],
}), 'done');
assert.equal(replyText({ choices: [{ message: { content: 'ok' } }] }), 'ok');
assert.equal(replyText({ candidates: [{ content: { parts: [{ thought: true, text: 'hmm' }, { text: 'yes' }] } }] }), 'yes');
assert.throws(() => replyText({ error: { message: 'bad key' } }), /bad key/);
const assist = assistantHtml('Hello @ai', { id: '1', actions: true, kicker: 'Not sent · your account' });
assert.match(assist, /Not sent/);
assert.match(assist, /data-act="send-ai"/);
assert.match(assist, /facet ai/);
assert.doesNotMatch(assist, /<script/i);
const taggedChat = messageHtml({ text: 'ping @ai', sender: { did: 'did:me' } }, 'did:me');
assert.match(taggedChat, /href="#\/ai"/);
assert.doesNotMatch(taggedChat, /profile\/ai/);

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
const spoken = notificationsHtml([
  {
    reason: 'reply',
    uri: 'at://did:d/app.bsky.feed.post/reply',
    author: { did: 'did:d', handle: 'd.bsky.social', displayName: 'Dee' },
    reasonSubject: 'at://did:x/app.bsky.feed.post/1',
    record: { text: 'I agree with this' },
    indexedAt: '2026-10-20T00:03:00.000Z',
    isRead: false,
  },
  {
    reason: 'mention',
    uri: 'at://did:d/app.bsky.feed.post/mention',
    author: { did: 'did:d', handle: 'd.bsky.social', displayName: 'Dee' },
    reasonSubject: 'at://did:x/app.bsky.feed.post/1',
    record: { text: 'hey look at this' },
    indexedAt: '2026-10-20T00:04:00.000Z',
    isRead: true,
  },
], new Map([['at://did:x/app.bsky.feed.post/1', { uri: 'at://did:x/app.bsky.feed.post/1', author: { handle: 'me.bsky.social' }, record: { text: 'hello #team' } }]]));
assert.match(spoken, /I agree with this/);
assert.match(spoken, /hey look at this/);
assert.match(spoken, /class="said"/);
assert.match(spoken, /Your post/);
assert.match(spoken, /hello/);
assert.match(spoken, /class="facet tag"/);
assert.match(spoken, /note-kicker">Related post/);
assert.match(spoken, /data-href="#\/profile\/d\.bsky\.social\/post\/reply"/);
assert.match(notesHtml, /data-href=/);

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
assert.match(shared, /data-href=/);
assert.doesNotMatch(shared, /<a class="quote"/);
const attachedPost = postHtml({
  post: {
    uri: 'at://did:plc:abc/app.bsky.feed.post/2',
    cid: 'cid',
    author: { did: 'did:plc:abc', handle: 'ada.bsky.social', displayName: 'Ada' },
    record: { text: 'Look', createdAt: '2026-10-20T00:00:00.000Z' },
    indexedAt: '2026-10-20T00:00:00.000Z',
    embed: {
      $type: 'app.bsky.embed.record#view',
      record: {
        $type: 'app.bsky.feed.defs#generatorView',
        uri: 'at://did:plc:abc/app.bsky.feed.generator/science',
        cid: 'bafyfeed',
        displayName: 'Science',
        description: 'Papers and notes',
        likeCount: 12,
        creator: { did: 'did:plc:abc', handle: 'ada.bsky.social', displayName: 'Ada' },
      },
    },
  },
});
assert.match(attachedPost, /class="collection"/);
assert.match(attachedPost, /href="#\/feed\//);
assert.match(attachedPost, /Science/);
assert.match(attachedPost, /Feed · @ada.bsky.social/);
assert.doesNotMatch(attachedPost, /class="quote"/);
const listCard = collectionCardHtml({
  uri: 'at://did:plc:abc/app.bsky.graph.list/one',
  cid: 'bafylist',
  name: 'Reporters',
  purpose: 'app.bsky.graph.defs#curatelist',
  listItemCount: 4,
  creator: { handle: 'ada.bsky.social' },
}, { button: true });
assert.match(listCard, /data-act="attach-pick"/);
assert.match(listCard, /Reporters/);
assert.match(listCard, /List · @ada.bsky.social · 4 people/);
const packCard = collectionCardHtml({
  $type: 'app.bsky.graph.defs#starterPackViewBasic',
  uri: 'at://did:plc:abc/app.bsky.graph.starterpack/one',
  cid: 'bafypack',
  record: { name: 'Newsroom', description: 'People to follow' },
  listItemCount: 9,
  creator: { handle: 'ada.bsky.social', displayName: 'Ada' },
});
assert.match(packCard, /href="#\/pack\//);
assert.match(packCard, /Newsroom/);
assert.match(packCard, /Starter pack/);
const memory = new Map();
globalThis.localStorage = {
  getItem(key) { return memory.has(key) ? memory.get(key) : null; },
  setItem(key, value) { memory.set(key, String(value)); },
  removeItem(key) { memory.delete(key); },
};
assert.equal(soundPrefs().posts, false);
assert.equal(soundPrefs().chat, true);
assert.equal(soundPrefs().volume.chat, 70);
setSoundPrefs({ posts: true, volume: { notifications: 25 } });
assert.equal(soundPrefs().posts, true);
assert.equal(soundPrefs().notifications, true);
assert.equal(soundPrefs().volume.notifications, 25);
assert.equal(soundPrefs().volume.chat, 70);
const aloud = speechText({
  author: { displayName: 'Ada' },
  record: { text: 'Look' },
  embed: { $type: 'app.bsky.embed.images#view', images: [{ alt: 'A blue door' }] },
});
assert.match(aloud, /Ada/);
assert.match(aloud, /Look/);
assert.match(aloud, /A blue door/);
const homeReply = {
  post: { author: { did: 'did:pal' }, record: { reply: { parent: { uri: 'at://did:stranger/app.bsky.feed.post/1' } } } },
  reply: { parent: { author: { did: 'did:stranger' } } },
};
assert.equal(homeAllows(homeReply, { hideRepliesByUnfollowed: true, hideReplies: false, hideReposts: false, hideQuotePosts: false }, 'did:me'), false);
assert.equal(homeAllows({ post: { author: { did: 'did:pal' }, record: {} }, reason: { $type: 'app.bsky.feed.defs#reasonRepost' } }, { hideReposts: true }, 'did:me'), false);
assert.equal(searchAllows({ record: { reply: {} } }, { hideReplies: true }, {}), false);
assert.equal(searchAllows({ record: { text: 'hi' }, author: { did: 'did:pal', viewer: { following: 'at://follow' } } }, { following: true }, { did: 'did:me' }), true);
const ordered = sortThreadReplies([
  { post: { likeCount: 1, record: { createdAt: '2026-10-20T00:00:00.000Z' } } },
  { post: { likeCount: 9, record: { createdAt: '2026-10-20T01:00:00.000Z' } } },
], { sort: 'most-likes', prioritizeFollowedUsers: false }, 'did:me');
assert.equal(ordered[0].post.likeCount, 9);
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
assert.equal(trimLink('https://example.com/a.'), 'https://example.com/a');
assert.equal(trimLink('https://en.wikipedia.org/wiki/Foo_(bar)'), 'https://en.wikipedia.org/wiki/Foo_(bar)');
assert.equal(firstUrl('see (https://example.com/a).'), 'https://example.com/a');
assert.equal(firstUrl('https://example.com/a👍 more'), 'https://example.com/a');
const emojiLink = richText('https://example.com/a👍', null, { links: false, breaks: false });
assert.match(emojiLink, /facet link">https:\/\/example.com\/a</);
assert.match(emojiLink, /👍/);
assert.doesNotMatch(emojiLink, /facet link">https:\/\/example.com\/a👍/);
const plainLink = await facetsFor('Look https://example.com/path.');
assert.equal(plainLink[0].features[0].uri, 'https://example.com/path');
const emojiFacet = await facetsFor('Go https://example.com/a👍 now');
assert.equal(emojiFacet[0].features[0].uri, 'https://example.com/a');
const homeHtml = `<title>The White Witch™</title>
<img src="/assets/images/banner.jpg" alt="The White Witch banner">
<img src="https://thewhitewitchtm.github.io/whitewitch/assets/images/og.jpg" alt="" width="1200" height="630">
<img src="https://thewhitewitchtm.github.io/emojigames/assets/images/preview.jpg" alt="" width="1200" height="630">`;
assert.equal(pageSummary(homeHtml, 'https://thewhitewitchtm.github.io/').image, 'https://thewhitewitchtm.github.io/whitewitch/assets/images/og.jpg');
assert.equal(pageSummary('<meta property="og:image" content="/cover.jpg"><img src="https://cdn.example/other.jpg" width="1200" height="630">', 'https://example.com/posts/1').image, 'https://example.com/cover.jpg');

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
const savedPost = postHtml({
  post: {
    uri: 'at://did:x/app.bsky.feed.post/1',
    cid: 'cid',
    author: { did: 'did:x', handle: 'me.bsky.social' },
    record: { text: 'saved', createdAt: '2026-10-20T00:00:00.000Z' },
  },
}, { bookmarkRemove: true });
assert.match(savedPost, /data-act="remove-bookmark"/);
assert.match(savedPost, /class="danger mini"/);
const goneChat = convoHtml({
  id: 'c1',
  members: [
    { did: 'did:gone', displayName: 'Deleted account' },
    { did: 'did:me', handle: 'me.bsky.social', displayName: 'Me' },
  ],
}, 'did:me');
assert.match(goneChat, /data-act="leave-convo"/);
assert.match(goneChat, /class="danger mini"/);
const madeTrend = trendsHtml([{
  displayName: 'Steam <Next>',
  description: 'Players share demos.',
  link: '/profile/did:plc:abc/feed/d3c1bec66421',
  postCount: 190109,
  status: 'hot',
  category: 'entertainment',
  actors: [{ displayName: 'Ada', handle: 'ada.bsky.social', avatar: 'https://cdn.example/a.jpg' }],
}]);
assert.match(madeTrend, /Steam &lt;Next&gt;/);
assert.match(madeTrend, /#\/search\/Steam%20%3CNext%3E/);
assert.match(madeTrend, /190K posts · Entertainment · Hot/);
assert.match(madeTrend, /class="section-mark"/);
assert.match(madeTrend, /class="trend-desc"/);
assert.match(madeTrend, /class="trend-copy"/);
assert.doesNotMatch(madeTrend, /class="trend-rank"/);
assert.doesNotMatch(madeTrend, /Trending/);
assert.doesNotMatch(madeTrend, /#\/feed\//);
assert.doesNotMatch(madeTrend, /<script/i);
const coolingTrend = trendsHtml([{
  displayName: 'Alberta',
  link: '/profile/did:plc:abc/feed/cool1',
  postCount: 40,
  status: 'cooling',
  category: 'politics',
}]);
assert.match(coolingTrend, /#\/search\/Alberta/);
assert.match(coolingTrend, /40 posts · Politics/);
assert.match(coolingTrend, /class="section-mark"/);
assert.doesNotMatch(coolingTrend, /Trending/);
const compactTrend = trendsHtml([{
  displayName: 'Cats',
  description: 'Should stay off the rail.',
  link: 'nope',
  postCount: 12,
  category: 'culture',
}], { compact: true });
assert.match(compactTrend, /#\/search\/Cats/);
assert.match(compactTrend, /12 posts · Culture/);
assert.doesNotMatch(compactTrend, /trend-desc/);
assert.doesNotMatch(compactTrend, /Should stay/);
assert.doesNotMatch(compactTrend, /Trending/);
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
const homeCard = await inspectLink('https://thewhitewitchtm.github.io/');
assert.equal(homeCard?.kind, 'external');
assert.match(homeCard.title, /White Witch/);
assert.match(homeCard.image, /\/og\.jpg|\/banner\.jpg/, 'homepage link preview is missing its image');
assert.match(linkPreviewHtml(homeCard), /<img [^>]*og\.jpg|banner\.jpg/);

const metadata = JSON.parse(await readFile(path.join(root, 'client-metadata.json'), 'utf8'));
assert.equal(metadata.client_name, 'LibreSky');
assert.equal(metadata.client_id, 'https://thewhitewitchtm.github.io/LibreSky/client-metadata.json');
assert.equal(metadata.dpop_bound_access_tokens, true);
assert.match(metadata.scope, /atproto/);
assert.match(metadata.scope, /transition:generic/);
assert.ok(metadata.redirect_uris.every((uri) => uri.startsWith('https://')));

const banned = [/ollama/i, /\belectron\b/i, /emoji-engine/i, /white witch/i, /modelfile/i, /\bretro\b/i];
const grokAllowed = new Set(['js/ai.js', 'js/app.js', 'README.md']);
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'vendor' || entry.name === '.git' || entry.name === 'smoke.mjs' || entry.name === 'desktop' || entry.name === 'download') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name !== 'pack-desktop.mjs' && /\.(html|css|js|mjs|md|json|svg)$/.test(entry.name)) files.push(full);
  }
  return files;
}
for (const file of await walk(root)) {
  const body = await readFile(file, 'utf8');
  const name = path.relative(root, file);
  for (const pattern of banned) {
    assert.doesNotMatch(body, pattern, `${name} matches ${pattern}`);
  }
  if (!grokAllowed.has(name)) assert.doesNotMatch(body, /grok/i, `${name} matches /grok/i`);
}

const index = await readFile(path.join(root, 'index.html'), 'utf8');
assert.match(index, /Sign in with Bluesky/);
assert.match(index, /Create a Bluesky account/);
assert.match(index, /stay signed in/);
assert.match(index, /js\/app\.js/);
assert.match(index, /property="og:image"/);
assert.match(index, /property="og:image:type" content="image\/png"/);
assert.match(index, /name="twitter:card" content="summary_large_image"/);
assert.match(index, /name="twitter:site" content="@TheWhiteWitchTM"/);
assert.match(index, /rel="canonical"/);
assert.match(index, /G-13S6Z9KCX9/);
assert.match(index, /assets\/banner.png/);
assert.match(index, /id="incoming-call"/);
assert.match(index, /id="call-title"/);
assert.match(index, /id="manage-form"/);
assert.match(index, /id="app-menu-btn"/);
assert.match(index, /data-tip="Menu"/);
assert.match(index, /Support development/);
assert.match(index, /id="menu-downloads"/);
assert.doesNotMatch(index, /Buy me a coffee/);
const trendPayload = await fetch('https://public.api.bsky.app/xrpc/app.bsky.unspecced.getTrends?limit=8').then((res) => {
  if (!res.ok) throw new Error(`Trends returned ${res.status}`);
  return res.json();
});
assert.ok(trendPayload.trends?.length, 'Trends returned nothing');
const liveTrends = trendsHtml(trendPayload.trends);
assert.match(liveTrends, /class="trend"/);
assert.match(liveTrends, /#\/search\//);
assert.match(liveTrends, /class="section-mark"/);
assert.doesNotMatch(liveTrends, / · Trending/);
assert.doesNotMatch(liveTrends, /<script/i);
const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
assert.match(robots, /Sitemap: https:\/\/thewhitewitchtm\.github\.io\/LibreSky\/sitemap\.xml/);
assert.match(sitemap, /https:\/\/thewhitewitchtm\.github\.io\/LibreSky\//);
const appSource = await readFile(path.join(root, 'js/app.js'), 'utf8');
assert.match(appSource, /https:\/\/www\.paypal\.com\/ncp\/payment\/4P85EQRES3RGU/);
assert.match(appSource, /data-act="desktop-download"/);
assert.doesNotMatch(appSource, /href="\.\/download\//);
const desktopManifest = JSON.parse(await readFile(path.join(root, 'download/manifest.json'), 'utf8'));
const expectedZips = ['LibreSky-linux-x64.zip', 'LibreSky-windows-x64.zip', 'LibreSky-mac-x64.zip'];
for (const zipName of expectedZips) {
  const parts = desktopManifest.files?.[zipName];
  assert.ok(parts?.length, `${zipName} has no download pieces`);
  for (const part of parts) {
    assert.match(part.name, /\.zip\.\d+$/);
    const size = (await stat(path.join(root, 'download', part.name))).size;
    assert.equal(size, part.size, part.name);
    assert.ok(size < 50_000_000, `${part.name} is too large to push to GitHub`);
  }
}
assert.match(appSource, /<textarea id="chat-text"/);
assert.match(appSource, /data-act="follow-back"/);
assert.match(appSource, /callStartHtml\(\)/);
assert.match(appSource, /listRecords\('app\.bsky\.graph\.follow'/);
const domainProfile = profileHtml({ handle: 'app.sociallydead.me', displayName: 'sociallydead.me', did: 'did:plc:test' });
assert.match(domainProfile, /aria-label="Verified domain"/);
assert.match(domainProfile, /class="verified domain"/);
assert.doesNotMatch(domainProfile, /verified official/);
const plainProfile = profileHtml({ handle: 'ada.bsky.social', displayName: 'Ada', did: 'did:plc:ada' });
assert.doesNotMatch(plainProfile, /verified/);
const badgeProfile = profileHtml({
  handle: 'ada.bsky.social',
  displayName: 'Ada',
  did: 'did:plc:ada',
  verification: { verifiedStatus: 'valid' },
});
assert.match(badgeProfile, /aria-label="Verified"/);
assert.match(badgeProfile, /class="verified official"/);
assert.doesNotMatch(badgeProfile, /Verified domain/);
const bothProfile = profileHtml({
  handle: 'app.sociallydead.me',
  displayName: 'Both',
  did: 'did:plc:both',
  verification: { verifiedStatus: 'valid' },
});
assert.match(bothProfile, /class="verified official"/);
assert.match(bothProfile, /class="verified domain"/);
const invalidProfile = profileHtml({ handle: 'handle.invalid', displayName: 'Gone', did: 'did:plc:gone' });
assert.doesNotMatch(invalidProfile, /verified/);
assert.match(appSource, /soundRow\('chat', 'New chat messages'/);
assert.match(appSource, /soundRow\('notifications', 'New notifications'/);
assert.match(appSource, /soundRow\('posts', 'New posts on Home'/);
assert.match(appSource, /data-volume="\$\{key\}"/);
assert.match(index, /class="head-post"/);
assert.match(index, /id="tune"/);
assert.match(appSource, /playSound\('call'\)/);
assert.match(appSource, /data-act="chat-read"/);
assert.match(appSource, /data-act="chat-cleanup"/);
assert.match(appSource, /'list-delete'/);
assert.match(appSource, /'feed-remove'/);
assert.match(appSource, /id: 'delete', label: 'Delete', danger: true/);
assert.match(appSource, /id: 'unbookmark', label: 'Remove bookmark', danger: true/);
assert.match(appSource, /bookmarks-cleanup/);
assert.equal(accountGone({ did: 'did:x', handle: 'handle.invalid' }), true);
assert.equal(accountGone({ did: 'did:x', handle: 'ada.bsky.social', displayName: 'Ada' }), false);
assert.equal(accountGone(null), false);
const deletedChat = convoHtml({
  id: 'abc',
  unreadCount: 2,
  members: [{ did: 'did:me', handle: 'me.bsky.social' }, { did: 'did:gone', handle: 'handle.invalid' }],
  lastMessage: { text: 'hi' },
}, 'did:me');
assert.match(deletedChat, /Deleted account/);
assert.match(deletedChat, /data-act="leave-convo"/);
assert.match(deletedChat, /data-convo="abc"/);
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
assert.equal(feedItems[0].pinned, true);
assert.equal(feedItems[1].type, 'list');
const writtenFeeds = applySavedFeeds(feedPrefs, feedItems.filter((item) => item.type !== 'list').map((item) => ({ ...item, pinned: false })));
const savedV2 = writtenFeeds.find((pref) => pref.$type === 'app.bsky.actor.defs#savedFeedsPrefV2');
assert.equal(savedV2.items.length, 1);
assert.equal(savedV2.items[0].pinned, false);
assert.match(savedV2.items[0].id, /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/);
const savedV1 = writtenFeeds.find((pref) => pref.$type === 'app.bsky.actor.defs#savedFeedsPref');
assert.deepEqual(savedV1.pinned, []);
assert.deepEqual(savedV1.saved, ['at://did:example/app.bsky.feed.generator/hot']);
assert.equal(writtenFeeds.find((pref) => pref.$type === 'app.bsky.actor.defs#adultContentPref').enabled, true);
assert.match(index, /id="profile-banner"/);
assert.match(index, /id="compose-link"/);
assert.match(index, /id="compose-leave"/);
assert.match(index, /id="compose-save-draft"/);
assert.match(index, /Save as draft/);
assert.match(index, /class="skip"/);
assert.match(appSource, /data-settings-tab/);
assert.match(appSource, /contrast-dark/);
assert.match(appSource, /requestCloseComposer/);
assert.doesNotMatch(index, /ai\.js|styles\.css|grok-sidebar/);
assert.match(index, /id="more-btn"/);
assert.match(index, /id="menu-help"/);
assert.match(index, /id="menu-config"/);
assert.match(index, /id="menu-support"/);
assert.match(index, /id="help"/);
assert.match(index, /id="lanes"/);
assert.match(index, /class="oss"/);
assert.match(index, /Open source/);
assert.match(index, /github.com\/TheWhiteWitchTM\/LibreSky/);
assert.doesNotMatch(index, /id="more-head"/);
assert.doesNotMatch(index, /id="title-tools"/);
assert.match(index, /data-nav="ai"/);
assert.match(index, /href="#\/ai"/);
assert.match(index, /data-nav="bookmarks"[\s\S]*data-nav="calls"[\s\S]*data-nav="ai"[\s\S]*id="more-btn"/);
assert.match(index, /id="more-btn"[\s\S]*?<path fill="currentColor" d="M12 2\.75a9\.25/);
assert.match(appSource, /nav: 'calls'/);
assert.doesNotMatch(appSource, /paintCallTools/);
const moreMenu = appSource.slice(appSource.indexOf('const MORE_LINKS'), appSource.indexOf('function openMoreMenu'));
assert.match(moreMenu, /go-lists/);
assert.doesNotMatch(moreMenu, /go-bookmarks|go-ai|go-calls|go-downloads/);
assert.doesNotMatch(appSource, /Coming soon/);
assert.match(appSource, /@ai and @si/);
assert.match(appSource, /id="ai-form"/);
assert.match(appSource, /rows="3"/);
assert.match(index, /libresky\.ai/);
assert.match(await readFile(path.join(root, 'js/ai.js'), 'utf8'), /libresky\.ai/);
assert.doesNotMatch(index, /nav-pill/);
assert.match(index, /id="about"/);
assert.match(index, /id="legal-privacy"/);
assert.match(index, /id="legal-terms"/);
assert.match(index, /id="call"/);
assert.match(appSource, /Edit tabs/);
assert.match(appSource, /class="tab-arrow/);
assert.match(appSource, /profile-menu/);
assert.match(appSource, /message-profile/);
assert.match(index, /popover="manual"/);
assert.match(index, /libresky\.passwordSession/);
assert.match(index, /libresky\.mutedWords/);
assert.match(index, /libresky\.draft/);
assert.match(appSource, /#\/packs/);
assert.match(appSource, /Starter packs/);
assert.match(moreMenu, /go-packs/);
assert.doesNotMatch(appSource, /pack-entry/);
assert.match(appSource, /id: 'message-profile'/);
assert.match(appSource, /ownUnread/);
const partial = richText('@jay #town');
assert.match(partial, /class="facet mention"/);
assert.match(partial, /class="facet tag"/);
const covered = 'Hi @jay.bsky.team';
const atByte = new TextEncoder().encode(covered.slice(0, covered.indexOf('@'))).length;
const kept = richText(covered, [{
  index: { byteStart: atByte, byteEnd: new TextEncoder().encode(covered).length },
  features: [{ $type: 'com.example.note' }],
}]);
assert.match(kept, /class="facet mention"/);
assert.equal(convoUnread({ unreadCount: '1', lastMessage: { sender: { did: 'did:me' } } }, 'did:me'), 0);
assert.equal(convoUnread({ unreadCount: '2', muted: true, lastMessage: { sender: { did: 'did:them' } } }, 'did:me'), 0);
assert.equal(convoUnread({ unreadCount: '2', lastMessage: { sender: 'did:them' } }, 'did:me'), 2);
assert.equal(ownUnread({ unreadCount: '1', lastMessage: { sender: { did: 'did:me' } } }, 'did:me'), true);
assert.equal(ownUnread({ unreadCount: '1', muted: true, lastMessage: { sender: { did: 'did:me' } } }, 'did:me'), false);
assert.equal(ownUnread({ unreadCount: 3, lastMessage: { sender: { did: 'did:them' } } }, 'did:me'), false);
const ownChat = convoHtml({
  id: 'mine',
  unreadCount: '1',
  members: [{ did: 'did:me', handle: 'me.bsky.social' }, { did: 'did:you', handle: 'you.bsky.social', displayName: 'You' }],
  lastMessage: { text: 'hello from me', sender: { did: 'did:me' } },
}, 'did:me');
assert.doesNotMatch(ownChat, /class="pill"/);
const requestChat = convoHtml({
  id: 'req',
  status: 'request',
  members: [{ did: 'did:me' }, { did: 'did:them', handle: 'them.bsky.social', displayName: 'Them' }],
  lastMessage: { text: 'hello', sender: { did: 'did:them' } },
}, 'did:me', { request: true });
assert.match(requestChat, /data-act="accept-convo"/);
assert.match(requestChat, /data-act="decline-convo"/);
assert.match(requestEntryHtml(2), /Message requests/);
assert.match(requestEntryHtml(2), /#\/messages\/requests/);
const callRequest = callRequestHtml({ media: 'video', name: 'Ada', rkey: 'abc', convoId: 'c1', peerDid: 'did:ada' });
assert.match(callRequest, /data-act="call-accept"/);
assert.match(callRequest, /Video call request/);
assert.equal(callMayRing({ allow: 'none', followed: true, accepted: true }), false);
assert.equal(callMayRing({ allow: 'following', followed: true }), true);
assert.equal(callMayRing({ allow: 'following', followed: false, accepted: true }), false);
assert.equal(callMayRing({ allow: 'all', followed: false, accepted: true }), true);
assert.equal(callMayRing({ allow: 'all', followed: false, accepted: false }), false);
assert.equal(callIsRequest({ allow: 'all', followed: false, accepted: false }), true);
assert.equal(callIsRequest({ allow: 'all', followed: true, accepted: false }), false);
assert.equal(callIsRequest({ allow: 'following', followed: false, accepted: false }), false);
assert.equal(callIsRequest({ allow: 'none', followed: false, accepted: false }), false);
assert.deepEqual(caretToken('hi @ja', 6), { sigil: '@', query: 'ja', start: 3 });
assert.equal(caretToken('hi @jay ', 8), null);
assert.deepEqual(caretWord('Say lang', 8), { query: 'lang', start: 4 });
assert.equal(caretWord('Say language', 7), null);
assert.equal(caretWord('see https://example', 18), null);
assert.ok(completeWord('lang', ['en']).includes('language'));
assert.deepEqual(typoWords('Say teh now', ['en'], null), ['teh']);
assert.deepEqual(typoWords('Say teh', ['en'], 7), ['teh']);
assert.deepEqual(typoWords('The weather is nice today', ['en'], null), []);
assert.ok(typoWords('Say lang', ['en'], 8).length === 0);
assert.match(richText('Say teh now', null, { links: false, breaks: false, typos: new Set(['teh']) }), /<span class="typo">teh<\/span>/);
assert.match(index, /class="login-name">LibreSky/);
assert.match(index, /Browse without signing in/);
assert.match(appSource, /id="ai-inline"/);
assert.match(appSource, /classList.toggle\('warn'/);
assert.match(appSource, /toggleMenu\(anchor, items\)/);
assert.equal(postInLanguages({ record: { langs: ['en-US'] } }, ['en']), true);
assert.equal(postInLanguages({ record: { langs: ['ja'] } }, ['en']), false);
assert.equal(postInLanguages({ record: {} }, ['en']), false);
assert.equal(postInLanguages({ record: { langs: ['ja'] } }, []), true);
const callText = parseCallMessage('Started a voice call https://thewhitewitchtm.github.io/LibreSky/#/c/2222222222222');
assert.equal(callText.kind, 'offer');
assert.equal(callText.media, 'audio');
assert.equal(callText.rkey, '2222222222222');
assert.equal(parseCallMessage('Declined the call').kind, 'decline');
assert.equal(parseCallMessage('hello'), null);
const sdp = 'v=0\r\no=- 1 1 IN IP4 127.0.0.1\r\n';
const sdpBytes = new TextEncoder().encode(sdp);
let sdpBinary = '';
sdpBytes.forEach((byte) => { sdpBinary += String.fromCharCode(byte); });
const packed = btoa(sdpBinary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
assert.equal(assembleCallSdp([
  { text: `Call data 2222222222222 1/1 ${packed}`, sender: { did: 'did:peer' } },
], '2222222222222', 'did:peer'), sdp);
assert.equal(assembleCallSdp([
  { text: `Call data 2222222222222 1/1 ${packed}`, sender: { did: 'did:peer' } },
], '2222222222222', 'did:other'), '');
const started = messageHtml({ id: 'm1', text: 'Started a voice call https://example.com/#/c/2222222222222', sender: { did: 'did:them' } }, 'did:me');
assert.match(started, /msg-header/);
assert.match(started, /Started a voice call/);
assert.match(started, /msg-header audio/);
assert.doesNotMatch(started, /class="bubble/);
assert.doesNotMatch(started, /data-act="call-accept"/);
assert.doesNotMatch(started, /example\.com/);
const incoming = messageHtml({ id: 'm9', text: 'new from them', sender: { did: 'did:them' } }, 'did:me', { fresh: true });
assert.match(incoming, /class="bubble fresh"/);
assert.doesNotMatch(incoming, /bubble mine/);
const liveVideo = messageHtml({
  id: 'm10',
  text: 'Started a video call https://example.com/#/c/2222222222222',
  sender: { did: 'did:them' },
}, 'did:me', { liveRkey: '2222222222222', convoId: 'room', peerDid: 'did:them' });
assert.match(liveVideo, /msg-header video/);
assert.match(liveVideo, /Started a video call/);
assert.match(liveVideo, /data-act="call-accept"/);
assert.match(liveVideo, /data-act="call-decline"/);
assert.match(liveVideo, /data-media="video"/);
assert.match(liveVideo, /data-convo="room"/);
assert.doesNotMatch(liveVideo, /example\.com/);
const callRow = callConvoHtml({
  id: 'room',
  unreadCount: 2,
  members: [{ did: 'did:me', handle: 'me.bsky.social' }, { did: 'did:you', handle: 'you.bsky.social', displayName: 'You' }],
  lastMessage: { text: 'new from you', sender: { did: 'did:you' } },
}, 'did:me');
assert.match(callRow, /data-act="call-audio"/);
assert.match(callRow, /data-act="call-video"/);
assert.match(callRow, /class="pill"/);
assert.match(callRow, /new from you/);
assert.match(callRow, /#\/messages\/room/);
assert.match(callStartHtml(), /id="call-start"/);
assert.match(callStartHtml(), /data-media="audio"/);
assert.match(callStartHtml(), /data-media="video"/);
assert.doesNotMatch(callStartHtml(), /class="primary/);
const chunk = messageHtml({ id: 'm2', text: `Call data 2222222222222 1/1 ${packed}`, sender: { did: 'did:them' } }, 'did:me');
assert.match(chunk, /hidden/);
assert.doesNotMatch(chunk, /Call data/);
const pinnedPost = postHtml({
  post: {
    uri: 'at://did:example/app.bsky.feed.post/abc',
    cid: 'bafyreiabc',
    author: { did: 'did:example', handle: 'ada.bsky.social', displayName: 'Ada' },
    record: { text: 'Pinned hello', createdAt: '2026-10-20T00:00:00.000Z' },
    indexedAt: '2026-10-20T00:00:00.000Z',
  },
}, { pinned: true });
assert.match(pinnedPost, /class="pinned-label"/);
assert.match(pinnedPost, /Pinned/);
const liveCalls = callToolsHtml('did:x');
assert.match(liveCalls, /data-act="call-audio"/);
assert.match(liveCalls, /data-act="call-video"/);
assert.match(liveCalls, /Voice/);
assert.match(liveCalls, /Video/);
assert.match(liveCalls, /class="call-pair"/);
assert.doesNotMatch(liveCalls, /call-btn video/);
assert.doesNotMatch(liveCalls, /calls-page/);
assert.doesNotMatch(liveCalls, /aria-disabled/);
const quietCalls = chatHeaderHtml({ did: 'did:x', handle: 'ada.bsky.social', displayName: 'Ada' });
assert.match(quietCalls, /chat-head/);
assert.match(quietCalls, /Ada/);
assert.match(quietCalls, /class="call-pair"/);
const card = hoverCardHtml({ did: 'did:ada', handle: 'ada.bsky.social', displayName: 'Ada', description: 'Hello', followersCount: 3, followsCount: 1 }, 'did:me');
assert.match(card, /data-act="follow"/);
assert.match(card, /Hello/);
assert.doesNotMatch(hoverCardHtml({ did: 'did:me', handle: 'me.bsky.social' }, 'did:me'), /data-act="follow"/);
const goneCalls = chatHeaderHtml({ did: 'did:gone', handle: 'handle.invalid' });
assert.match(goneCalls, /Deleted account/);
assert.doesNotMatch(goneCalls, /call-btn/);
const packRow = packHtml({
  uri: 'at://did:example/app.bsky.graph.starterpack/abc',
  record: { name: 'Cats', description: 'meow' },
  creator: { handle: 'ada.bsky.social', displayName: 'Ada' },
  list: { listItemCount: 3 },
});
assert.match(packRow, /Cats/);
assert.match(packRow, /#\/pack\//);

console.log(`smoke ok (${payload.feed.length} live posts, first @${handle})`);
