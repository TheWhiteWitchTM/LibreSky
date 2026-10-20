import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareAi, replyText } from '../js/ai.js';
import { assistantHtml, callConvoHtml, callToolsHtml, chatHeaderHtml, convoHtml, feedHtml, linkPreviewHtml, messageHtml, notificationsHtml, packHtml, postHtml, profileHtml, resetPosts, trendsHtml } from '../js/render.js';
import { applySavedFeeds, facetsFor, inspectLink, savedFeedItems } from '../js/api.js';
import { accountGone, aiTag, assembleCallSdp, bskyPostParts, caretToken, convoUnread, firstUrl, ownUnread, pageCard as pageSummary, parseCallMessage, richText, trimLink, xStatusParts } from '../js/util.js';

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
assert.equal(trimLink('https://example.com/a.'), 'https://example.com/a');
assert.equal(trimLink('https://en.wikipedia.org/wiki/Foo_(bar)'), 'https://en.wikipedia.org/wiki/Foo_(bar)');
assert.equal(firstUrl('see (https://example.com/a).'), 'https://example.com/a');
const plainLink = await facetsFor('Look https://example.com/path.');
assert.equal(plainLink[0].features[0].uri, 'https://example.com/path');
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
assert.match(madeTrend, /class="trend-rank">1\.</);
assert.match(madeTrend, /Entertainment · Hot/);
assert.match(madeTrend, /190K posts/);
assert.match(madeTrend, /#\/feed\/at%3A%2F%2Fdid%3Aplc%3Aabc%2Fapp\.bsky\.feed\.generator%2Fd3c1bec66421/);
assert.match(madeTrend, /class="trend-desc"/);
assert.doesNotMatch(madeTrend, /<script/i);
const coolingTrend = trendsHtml([{
  displayName: 'Alberta',
  link: '/profile/did:plc:abc/feed/cool1',
  postCount: 40,
  status: 'cooling',
  category: 'politics',
}]);
assert.match(coolingTrend, /trend-kicker">Politics</);
assert.doesNotMatch(coolingTrend, /Politics · Trending/);
const compactTrend = trendsHtml([{
  displayName: 'Cats',
  description: 'Should stay off the rail.',
  link: 'nope',
  postCount: 12,
  category: 'culture',
}], { compact: true });
assert.match(compactTrend, /#\/search\/Cats/);
assert.match(compactTrend, /Culture · Trending/);
assert.doesNotMatch(compactTrend, /trend-desc/);
assert.doesNotMatch(compactTrend, /Should stay/);
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
    if (entry.name === 'node_modules' || entry.name === 'vendor' || entry.name === '.git' || entry.name === 'smoke.mjs') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (/\.(html|css|js|mjs|md|json|svg)$/.test(entry.name)) files.push(full);
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
assert.match(index, /id="manage-form"/);
assert.match(index, /class="tip"/);
assert.match(index, /Buy me a coffee/);
assert.match(index, /https:\/\/www\.paypal\.com\/ncp\/payment\/4P85EQRES3RGU/);
const trendPayload = await fetch('https://public.api.bsky.app/xrpc/app.bsky.unspecced.getTrends?limit=8').then((res) => {
  if (!res.ok) throw new Error(`Trends returned ${res.status}`);
  return res.json();
});
assert.ok(trendPayload.trends?.length, 'Trends returned nothing');
const liveTrends = trendsHtml(trendPayload.trends);
assert.match(liveTrends, /class="trend"/);
assert.match(liveTrends, /#\/feed\//);
assert.doesNotMatch(liveTrends, /<script/i);
const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
assert.match(robots, /Sitemap: https:\/\/thewhitewitchtm\.github\.io\/LibreSky\/sitemap\.xml/);
assert.match(sitemap, /https:\/\/thewhitewitchtm\.github\.io\/LibreSky\//);
const appSource = await readFile(path.join(root, 'js/app.js'), 'utf8');
assert.match(appSource, /<textarea id="chat-text"/);
assert.match(appSource, /data-act="follow-back"/);
assert.match(appSource, /id="call-start"/);
assert.match(appSource, /listRecords\('app\.bsky\.graph\.follow'/);
const domainProfile = profileHtml({ handle: 'app.sociallydead.me', displayName: 'sociallydead.me', did: 'did:plc:test' });
assert.match(domainProfile, /aria-label="Verified domain"/);
const plainProfile = profileHtml({ handle: 'ada.bsky.social', displayName: 'Ada', did: 'did:plc:ada' });
assert.doesNotMatch(plainProfile, /verified/);
const badgeProfile = profileHtml({
  handle: 'ada.bsky.social',
  displayName: 'Ada',
  did: 'did:plc:ada',
  verification: { verifiedStatus: 'valid' },
});
assert.match(badgeProfile, /aria-label="Verified"/);
assert.doesNotMatch(badgeProfile, /Verified domain/);
const invalidProfile = profileHtml({ handle: 'handle.invalid', displayName: 'Gone', did: 'did:plc:gone' });
assert.doesNotMatch(invalidProfile, /verified/);
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
assert.doesNotMatch(index, /ai\.js|styles\.css|grok-sidebar/);
assert.match(index, /id="more-btn"/);
assert.match(index, /id="more-head"/);
assert.match(index, /data-nav="ai"/);
assert.match(index, /href="#\/ai"/);
assert.match(index, /data-nav="bookmarks"[\s\S]*data-nav="calls"[\s\S]*data-nav="ai"[\s\S]*id="more-btn"/);
assert.match(index, /id="more-btn"[\s\S]*?<path fill="currentColor" d="M12 2\.75a9\.25/);
assert.match(index, /id="more-head"[\s\S]*?<path fill="currentColor" d="M12 2\.75a9\.25/);
assert.match(appSource, /nav: 'calls'/);
assert.doesNotMatch(appSource, /paintCallTools/);
const moreMenu = appSource.slice(appSource.indexOf('const MORE_LINKS'), appSource.indexOf('function openMoreMenu'));
assert.match(moreMenu, /go-lists/);
assert.doesNotMatch(moreMenu, /go-bookmarks|go-ai|go-calls/);
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
assert.match(index, /id="title-tools"/);
assert.match(index, /popover="manual"/);
assert.match(index, /libresky\.passwordSession/);
assert.match(index, /libresky\.mutedWords/);
assert.match(index, /libresky\.draft/);
assert.match(appSource, /#\/packs/);
assert.match(appSource, /Starter packs/);
assert.match(appSource, /pack-entry/);
assert.match(appSource, /data-act="message-profile"/);
assert.doesNotMatch(appSource, /go-packs/);
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
assert.deepEqual(caretToken('hi @ja', 6), { sigil: '@', query: 'ja', start: 3 });
assert.equal(caretToken('hi @jay ', 8), null);
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
assert.doesNotMatch(started, /class="bubble/);
assert.doesNotMatch(started, /example\.com/);
const callRow = callConvoHtml({
  id: 'room',
  members: [{ did: 'did:me', handle: 'me.bsky.social' }, { did: 'did:you', handle: 'you.bsky.social', displayName: 'You' }],
}, 'did:me');
assert.match(callRow, /data-act="call-audio"/);
assert.match(callRow, /data-act="call-video"/);
assert.match(callRow, /#\/messages\/room/);
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
assert.match(liveCalls, /class="call-btn video"/);
assert.doesNotMatch(liveCalls, /calls-page/);
assert.doesNotMatch(liveCalls, /aria-disabled/);
const quietCalls = chatHeaderHtml({ did: 'did:x', handle: 'ada.bsky.social', displayName: 'Ada' });
assert.match(quietCalls, /chat-head/);
assert.match(quietCalls, /Ada/);
assert.doesNotMatch(quietCalls, /call-btn/);
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
