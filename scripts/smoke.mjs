import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AI_PROVIDERS, activeAi, adoptLocalFromCloud, aiFromPreference, aiPreference, aiReady, aiSource, chatExtras, claimLegacyAi, clearAi, clearLocalAi, cloudProviders, draftRewriteMessages, fallbackAi, fitDraft, listRemoteAi, loadAi, loadLocalAi, localModelNames, localProbes, localRuntimeName, prepareAi, removeRemoteAi, replyText, resolveAi, responsesBody, rewriteLocalUrl, saveAi, saveLocalAi, setActiveRemote, setAiSource } from '../js/ai.js';
import { actorHtml, assistantHtml, callConvoHtml, callRequestHtml, callStartHtml, callToolsHtml, chatHeaderHtml, collectionCardHtml, convoHtml, feedHtml, hoverCardHtml, joinRequestHtml, linkPreviewHtml, messageHtml, notificationSubjects, notificationsHtml, packHtml, postHtml, profileHtml, requestEntryHtml, requestPeople, resetPosts, speechText, trendsHtml } from '../js/render.js';
import { applySavedFeeds, facetsFor, inspectLink, savedFeedItems } from '../js/api.js';
import { accountGone, aiTag, applyShortLinks, assembleCallSdp, bskyPostParts, caretToken, caretWord, convoUnread, firstUrl, followCleanupMatch, followSpam, forceStyles, graphemeLength, messagesForConvo, normalizeConvoItem, normalizeSentMessage, omitTrailingPostLink, ownUnread, pageCard as pageSummary, parseCallMessage, partitionConvos, replyTargets, richText, shouldFollowBack, styleFlags, tagFromQuery, toShortUrl, toggleStyle, trailingUrl, trimLink, withoutTrailingUrl, xStatusParts } from '../js/util.js';
import { emojiGroups, flagEmoji } from '../js/emoji.js';
import { postInLanguages } from '../js/lang.js';
import { callIsRequest, callMayRing, defaultSearchTabs, goldFeedGate, homeAllows, normalizeSearchTabs, SEARCH_LINKS, SEARCH_POSTS, searchAllows, settleSearchTabs, sortThreadReplies } from '../js/prefs.js';
import { activeDid, forgetAccount, getPasswordBook, listAccounts, loadDraft, saveAccount, saveDraft, setActiveDid, setPassword, setSoundPrefs, soundPrefs } from '../js/session.js';
import { formatCallClock, setKindEnabled } from '../js/call.js';
import { completeWord, learnedWordList, rememberWords, typoWords } from '../js/words.js';

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
const libreTag = richText('#LibreSky', null, { links: false, breaks: false });
assert.match(libreTag, /<span class="facet tag">#LibreSky<\/span>/);
const emojiTag = richText('😀#LibreSky', null, { links: false, breaks: false });
assert.match(emojiTag, /<span class="facet tag">#LibreSky<\/span>/);
assert.equal(tagFromQuery('LibreSky'), 'LibreSky');
assert.equal(tagFromQuery('123'), '');
assert.equal(tagFromQuery(''), '');
assert.deepEqual(caretToken('😀#LibreSky', '😀#LibreSky'.length), { sigil: '#', query: 'LibreSky', start: '😀'.length });
const boldA = toggleStyle('A', 0, 1, 'bold');
assert.equal(boldA.text, '\u{1D5D4}');
assert.equal(toggleStyle('a', 0, 1, 'italic').text, '\u{1D622}');
assert.equal(toggleStyle('A', 0, 1, 'mono').text, '\u{1D670}');
assert.equal(toggleStyle(boldA.text, 0, boldA.text.length, 'italic').text, '\u{1D63C}');
assert.equal(toggleStyle(boldA.text, 0, boldA.text.length, 'bold').text, 'A');
assert.equal(toggleStyle('A', 0, 1, 'strike').text, 'A\u0336');
assert.equal(forceStyles('Ab', 0, 2, ['bold', 'italic']).text, '\u{1D63C}\u{1D657}');
assert.equal(styleFlags(boldA.text, 0, boldA.text.length).bold, true);
assert.equal(styleFlags(boldA.text, 0, boldA.text.length).italic, false);
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
assert.equal(prepareAi({ provider: 'grok', apiKey: 'Bearer "xai-test-key-123"' }).apiKey, 'xai-test-key-123');
const grokBody = responsesBody(grokAccount, [
  { role: 'system', content: 'Be brief.' },
  { role: 'user', content: 'hello' },
]);
assert.equal(grokBody.model, 'grok-4.7');
assert.equal(grokBody.store, false);
assert.equal(grokBody.reasoning.effort, 'low');
assert.equal(grokBody.max_output_tokens > 800, true);
assert.equal(grokBody.input[0].role, 'system');
const draftAsk = draftRewriteMessages('  night bus  ');
assert.equal(draftAsk[0].role, 'system');
assert.equal(draftAsk[1].content, 'night bus');
assert.equal(fitDraft('  "Hello there."  '), 'Hello there.');
assert.equal(fitDraft('Here is the post: Night bus'), 'Night bus');
assert.equal(fitDraft('```\nKeep the line\n```'), 'Keep the line');
assert.equal(fitDraft(''), '');
assert.equal([...fitDraft('a'.repeat(340))].length <= 300, true);
assert.equal(formatCallClock(0), '0:00');
assert.equal(formatCallClock(59000), '0:59');
assert.equal(formatCallClock(60000), '1:00');
assert.equal(formatCallClock(3600000), '1:00:00');
assert.equal(formatCallClock(-5), '0:00');
const mutedTrack = { kind: 'audio', enabled: true };
const cameraTrack = { kind: 'video', enabled: true };
const callStream = { getTracks: () => [mutedTrack, cameraTrack] };
assert.equal(setKindEnabled(callStream, 'audio', false), true);
assert.equal(mutedTrack.enabled, false);
assert.equal(cameraTrack.enabled, true);
assert.equal(setKindEnabled(callStream, 'video', false), true);
assert.equal(cameraTrack.enabled, false);
assert.equal(setKindEnabled({ getTracks: () => [] }, 'audio', true), false);
assert.equal(grokBody.input[1].content, 'hello');
const deepseekAccount = prepareAi({ provider: 'deepseek', model: 'deepseek-v4-pro', base: 'https://evil.example/v1', apiKey: 'sk-deepseek-test-key' });
assert.equal(deepseekAccount.model, 'deepseek-v4-pro');
assert.equal(deepseekAccount.base, 'https://api.deepseek.com');
assert.equal(deepseekAccount.kind, 'chat');
assert.deepEqual(chatExtras(deepseekAccount), { max_tokens: 800, thinking: { type: 'disabled' } });
assert.equal(chatExtras({ provider: 'openai' }).max_completion_tokens, 2000);
assert.equal(replyText({ choices: [{ message: { content: '', reasoning_content: 'because' } }] }), 'because');
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
assert.equal(replyText({ message: { role: 'assistant', content: ' from ollama ' } }), 'from ollama');
const sentDirect = normalizeSentMessage({ id: 'm1', text: 'hi', sender: { did: 'did:me' } }, 'hi', 'did:me');
assert.equal(sentDirect.id, 'm1');
assert.equal(sentDirect.text, 'hi');
assert.equal(normalizeSentMessage({ sent: { id: 'm2', text: 'yo', sender: { did: 'did:me' } } }, 'yo', 'did:me').id, 'm2');
assert.equal(normalizeSentMessage(null, 'fallback', 'did:me').text, 'fallback');
assert.match(messageHtml(sentDirect, 'did:me'), /data-id="m1"/);
assert.ok(flagEmoji().length >= 200);
assert.ok(flagEmoji().some(([char, name]) => char === '🇩🇪' && name.includes('germany')));
assert.ok(flagEmoji().some(([char, name]) => char === '🇺🇦' && name.includes('ukraine')));
assert.ok(flagEmoji('germany').some(([char]) => char === '🇩🇪'));
assert.ok(flagEmoji('usa').some(([char]) => char === '🇺🇸'));
assert.equal(flagEmoji('no-such-flag').length, 0);
assert.ok(emojiGroups().some(([, list]) => list.some(([char]) => char === '🫠')));
assert.ok(emojiGroups().some(([, list]) => list.some(([char]) => char === '😺')));
assert.ok(emojiGroups('cat').some(([, list]) => list.some(([char]) => char === '😺')));
assert.ok(cloudProviders().every((item) => !item.local));
assert.ok(AI_PROVIDERS.some((item) => item.local));
assert.equal(rewriteLocalUrl('http://127.0.0.1:11434/v1/models'), 'http://127.0.0.1:11434/v1/models');
assert.equal(replyText({ candidates: [{ content: { parts: [{ thought: true, text: 'hmm' }, { text: 'yes' }] } }] }), 'yes');
assert.throws(() => replyText({ error: { message: 'bad key' } }), /bad key/);
assert.throws(() => replyText({ status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' }, output: [] }), /reply limit/);
assert.equal(replyText({ content: [{ type: 'text', text: 'claude' }] }), 'claude');
const free = fallbackAi();
assert.equal(free.provider, 'pollinations');
assert.equal(free.kind, 'pollinations');
assert.equal(free.apiKey, '');
assert.equal(prepareAi({ provider: 'pollinations' }).kind, 'pollinations');
assert.equal(prepareAi({ provider: 'pollinations' }).apiKey, '');
assert.equal(resolveAi(null).provider, 'pollinations');
assert.equal(aiReady(null), true);
assert.equal(AI_PROVIDERS[0].id, 'grok');
assert.ok(AI_PROVIDERS.every((item) => item.id === 'custom' || item.local || item.keyUrl));
const localServer = prepareAi({ provider: 'local', model: 'llama3.2' });
assert.equal(localServer.provider, 'local');
assert.equal(localServer.kind, 'chat');
assert.equal(localServer.apiKey, '');
assert.equal(localServer.base, 'http://127.0.0.1:11434/v1');
assert.equal(prepareAi({ provider: 'local', model: 'llama3.2', base: 'http://127.0.0.1:1234/v1', apiKey: 'local-key-1234' }).base, 'http://127.0.0.1:1234/v1');
assert.equal(prepareAi({ provider: 'local', model: 'llama3.2', api: 'ollama' }).api, 'ollama');
assert.throws(() => prepareAi({ provider: 'local' }), /model/);
assert.deepEqual(localModelNames({ models: [{ name: 'alpha' }, { name: 'alpha' }, { id: 'beta' }] }), ['alpha', 'beta']);
assert.deepEqual(localModelNames({ data: [{ id: 'gamma' }] }), ['gamma']);
assert.equal(localRuntimeName('http://127.0.0.1:11434/v1', 'ollama'), 'Ollama');
assert.equal(localRuntimeName('http://127.0.0.1:1234/v1', 'openai'), 'LM Studio');
assert.equal(localRuntimeName('http://127.0.0.1:9/v1', '', 'Desk'), 'Desk');
assert.equal(prepareAi({ provider: 'local', model: 'llama3.2' }).runtime, 'Ollama');
assert.equal(localProbes()[0].base, 'http://127.0.0.1:11434/v1');
assert.equal(localProbes()[0].tags, 'http://127.0.0.1:11434/api/tags');
assert.ok(localProbes().some((item) => item.base === 'http://127.0.0.1:47320/v1'));
assert.equal(localProbes('http://127.0.0.1:9/v1')[0].base, 'http://127.0.0.1:9/v1');
assert.ok(localProbes('http://127.0.0.1:11434/v1').some((item) => item.base === 'http://127.0.0.1:11434/v1'));
const groqAccount = prepareAi({ provider: 'groq', apiKey: 'gsk-test-key-1234' });
assert.equal(groqAccount.base, 'https://api.groq.com/openai/v1');
assert.equal(groqAccount.kind, 'chat');
assert.equal(prepareAi({ provider: 'openrouter', apiKey: 'sk-or-test-key-1' }).model, 'openrouter/auto');
assert.equal(prepareAi({ provider: 'together', apiKey: 'together-test-key' }).model.includes('/'), true);
const claudeAccount = prepareAi({ provider: 'anthropic', apiKey: 'sk-ant-test-key' });
assert.equal(claudeAccount.kind, 'anthropic');
assert.equal(claudeAccount.base, 'https://api.anthropic.com');
assert.throws(() => prepareAi({ provider: 'grok' }), /API key/);
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
assert.match(notesHtml, /data-act="account-card"/);
assert.match(notesHtml, /href="#\/profile\/a\.bsky\.social"/);
const mediaNotes = [
  {
    reason: 'like',
    author: { did: 'did:c', handle: 'c.bsky.social', displayName: 'Cara' },
    reasonSubject: 'at://did:x/app.bsky.feed.post/pic',
    indexedAt: '2026-10-20T00:02:00.000Z',
    isRead: true,
  },
  {
    reason: 'reply',
    uri: 'at://did:d/app.bsky.feed.post/reply2',
    author: { did: 'did:d', handle: 'd.bsky.social', displayName: 'Dee' },
    reasonSubject: 'at://did:x/app.bsky.feed.post/1',
    record: { text: 'see this', embed: { $type: 'app.bsky.embed.external' } },
    indexedAt: '2026-10-20T00:03:00.000Z',
    isRead: true,
  },
  {
    reason: 'repost',
    author: { did: 'did:e', handle: 'e.bsky.social', displayName: 'Eve' },
    reasonSubject: 'at://did:x/app.bsky.feed.post/clip',
    indexedAt: '2026-10-20T00:04:00.000Z',
    isRead: true,
  },
];
const mediaHtml = notificationsHtml(mediaNotes, new Map([
  ['at://did:x/app.bsky.feed.post/pic', {
    uri: 'at://did:x/app.bsky.feed.post/pic',
    author: { handle: 'me.bsky.social' },
    record: { text: 'photo' },
    embed: {
      $type: 'app.bsky.embed.images#view',
      images: [
        { thumb: 'https://cdn.example/a.jpg', fullsize: 'https://cdn.example/a-full.jpg', alt: 'A cat' },
        { thumb: 'https://cdn.example/b.jpg', fullsize: 'https://cdn.example/b-full.jpg', alt: 'A dog' },
      ],
    },
  }],
  ['at://did:d/app.bsky.feed.post/reply2', {
    uri: 'at://did:d/app.bsky.feed.post/reply2',
    author: { handle: 'd.bsky.social' },
    record: { text: 'see this' },
    embed: {
      $type: 'app.bsky.embed.external#view',
      external: { uri: 'https://example.com/story', title: 'A story', description: 'Words', thumb: 'https://cdn.example/card.jpg' },
    },
  }],
  ['at://did:x/app.bsky.feed.post/clip', {
    uri: 'at://did:x/app.bsky.feed.post/clip',
    author: { handle: 'me.bsky.social' },
    record: { text: 'clip' },
    embed: { $type: 'app.bsky.embed.video#view', thumbnail: 'https://cdn.example/clip.jpg', alt: 'A clip' },
  }],
]));
assert.match(mediaHtml, /class="note-shot"/);
assert.match(mediaHtml, /A cat/);
assert.match(mediaHtml, /A dog/);
assert.match(mediaHtml, /class="note-link"/);
assert.match(mediaHtml, /example\.com/);
assert.match(mediaHtml, /A story/);
assert.match(mediaHtml, /note-shot is-play/);
assert.match(mediaHtml, /cdn\.example\/clip\.jpg/);
assert.doesNotMatch(notificationsHtml([{
  reason: 'like',
  author: { handle: 'c.bsky.social', displayName: 'Cara' },
  reasonSubject: 'at://did:x/app.bsky.feed.post/bad',
  indexedAt: '2026-10-20T00:00:00.000Z',
}], new Map([['at://did:x/app.bsky.feed.post/bad', {
  embed: { $type: 'app.bsky.embed.external#view', external: { uri: 'javascript:alert(1)', title: 'Bad' } },
  record: { text: 'x' },
}]])), /javascript:/);
const wanted = notificationSubjects(mediaNotes);
assert.ok(wanted.includes('at://did:d/app.bsky.feed.post/reply2'));
assert.ok(wanted.includes('at://did:x/app.bsky.feed.post/pic'));
assert.equal(notificationSubjects([{
  reason: 'reply',
  uri: 'at://did:d/app.bsky.feed.post/plain',
  reasonSubject: 'at://did:x/app.bsky.feed.post/1',
  record: { text: 'just words' },
}]).includes('at://did:d/app.bsky.feed.post/plain'), false);

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
assert.match(shared, /data-act="account-card"/);
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
const aiKey = 'test-key-12345678';
localStorage.setItem('libresky.ai', JSON.stringify({
  provider: 'gemini',
  model: 'gemini-3.8-flash',
  apiKey: aiKey,
}));
setPassword({ accessJwt: 'jwt', refreshJwt: 'refresh', did: 'did:plc:one', handle: 'one.bsky.social', pds: 'https://bsky.social' });
assert.equal(claimLegacyAi('did:plc:one').apiKey, aiKey);
assert.equal(localStorage.getItem('libresky.ai'), null);
assert.equal(localStorage.getItem('libresky.aiAccounts'), null);
assert.equal(loadAi().provider, 'gemini');
const storedAi = aiPreference(loadAi());
assert.equal(storedAi.$type, 'app.bsky.actor.defs#libreskyAi');
assert.equal(storedAi.apiKey, aiKey);
assert.equal(aiFromPreference(storedAi).model, 'gemini-3.8-flash');
saveDraft('draft for one');
rememberWords('LibreSky');
assert.equal(loadDraft(), 'draft for one');
assert.ok(learnedWordList().some((word) => word.toLowerCase() === 'libresky'));
setPassword({ accessJwt: 'jwt', refreshJwt: 'refresh', did: 'did:plc:two', handle: 'two.bsky.social', pds: 'https://bsky.social' });
assert.equal(loadAi(), null);
assert.equal(loadDraft(), '');
assert.deepEqual(learnedWordList(), []);
saveAi({ provider: 'gemini', apiKey: 'other-key-12345678' });
assert.equal(loadAi().apiKey, 'other-key-12345678');
assert.equal(localStorage.getItem('libresky.aiAccounts'), null);
clearAi();
assert.equal(loadAi(), null);
setPassword({ accessJwt: 'jwt', refreshJwt: 'refresh', did: 'did:plc:one', handle: 'one.bsky.social', pds: 'https://bsky.social' });
assert.equal(loadAi().apiKey, aiKey);
assert.equal(listRemoteAi().length, 1);
const addedRemote = saveAi({ provider: 'groq', apiKey: 'gsk-test-key-1234' });
assert.equal(listRemoteAi().length, 2);
assert.equal(loadAi().provider, 'groq');
const geminiRemote = listRemoteAi().find((item) => item.provider === 'gemini');
assert.equal(setActiveRemote(geminiRemote.id).provider, 'gemini');
assert.equal(loadAi().apiKey, aiKey);
const packedRemotes = aiPreference(loadAi());
assert.equal(packedRemotes.remotes.length, 2);
assert.equal(aiFromPreference(packedRemotes).remotes.length, 2);
removeRemoteAi(addedRemote.id);
assert.equal(listRemoteAi().length, 1);
assert.equal(loadAi().provider, 'gemini');
saveLocalAi({ provider: 'local', model: 'llama3.2' });
assert.equal(loadLocalAi().provider, 'local');
assert.equal(loadLocalAi().model, 'llama3.2');
assert.equal(aiPreference(loadLocalAi()), null);
setAiSource('local');
assert.equal(aiSource(), 'local');
assert.equal(activeAi().provider, 'local');
assert.equal(activeAi().model, 'llama3.2');
setAiSource('account');
assert.equal(activeAi().provider, 'gemini');
clearLocalAi();
assert.equal(loadLocalAi(), null);
assert.equal(adoptLocalFromCloud({ provider: 'local', model: 'phi3', base: 'http://127.0.0.1:11434/v1' }), true);
assert.equal(loadLocalAi().model, 'phi3');
clearLocalAi();
assert.equal(loadDraft(), 'draft for one');
assert.ok(learnedWordList().some((word) => word.toLowerCase() === 'libresky'));
setPassword(null);
assert.equal(getPasswordBook('did:plc:one').handle, 'one.bsky.social');
assert.equal(getPasswordBook('did:plc:two').handle, 'two.bsky.social');
setActiveDid('did:keep');
saveAccount({ kind: 'password', did: 'did:plc:two', handle: 'two.bsky.social', displayName: 'Two', avatar: '', session: getPasswordBook('did:plc:two') }, { activate: false });
setPassword({ accessJwt: 'new', refreshJwt: 'new', did: 'did:plc:two', handle: 'two.bsky.social', pds: 'https://bsky.social' });
assert.equal(activeDid(), 'did:keep');
assert.equal(listAccounts().find((item) => item.did === 'did:plc:two').session.accessJwt, 'new');
setActiveDid('did:plc:two');
for (let i = 0; i < 10; i += 1) {
  saveAccount({ kind: 'oauth', did: `did:plc:extra${i}`, handle: `extra${i}.bsky.social`, displayName: '', avatar: '' }, { activate: false });
}
assert.equal(activeDid(), 'did:plc:two');
assert.equal(listAccounts().length, 8);
assert.equal(listAccounts().some((item) => item.did === 'did:plc:two'), true);
forgetAccount('did:plc:one');
assert.equal(getPasswordBook('did:plc:one'), null);
assert.equal(getPasswordBook('did:plc:two').accessJwt, 'new');
setPassword(null);
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
assert.equal(toShortUrl('https://bsky.app'), 'bsky.app');
assert.equal(toShortUrl('https://bsky.app/'), 'bsky.app');
assert.equal(toShortUrl('https://bsky.app/about'), 'bsky.app/about');
assert.equal(toShortUrl('https://www.example.com/about'), 'www.example.com/about');
assert.equal(toShortUrl('https://example.com:8080/a'), 'example.com:8080/a');
assert.equal(toShortUrl('https://ex.com/12345678901234'), 'ex.com/12345678901234');
assert.equal(toShortUrl('https://ex.com/123456789012345'), 'ex.com/123456789012...');
assert.equal(toShortUrl('https://docs.bsky.app/docs/advanced-guides/rate-limits'), 'docs.bsky.app/docs/advance...');
assert.equal(toShortUrl('https://['), 'https://[');
const longUrl = 'https://docs.bsky.app/docs/advanced-guides/rate-limits';
assert.equal(trailingUrl(`Hello\n${longUrl}`), longUrl);
assert.equal(trailingUrl(`Hello\n${longUrl}.`), longUrl);
assert.equal(trailingUrl(`${longUrl}\n\n`), longUrl);
assert.equal(trailingUrl(`see ${longUrl}`), '');
assert.equal(trailingUrl(`${longUrl} ${longUrl}`), '');
assert.equal(trailingUrl(`https://a.example\nhttps://b.example`), 'https://b.example');
assert.equal(trailingUrl('https://example.com/a👍'), '');
assert.equal(withoutTrailingUrl(`Hello\n${longUrl}`), 'Hello');
assert.equal(withoutTrailingUrl(`https://a.example\nmore\nhttps://b.example`), 'https://a.example\nmore');
assert.equal(withoutTrailingUrl(`see ${longUrl}`), `see ${longUrl}`);
assert.equal(withoutTrailingUrl(longUrl), '');
const shortened = applyShortLinks(`Look ${longUrl}.`);
assert.equal(shortened.text, 'Look docs.bsky.app/docs/advance....');
assert.equal(shortened.links.length, 1);
assert.equal(shortened.links[0].features[0].uri, longUrl);
assert.equal(shortened.links[0].index.byteStart, new TextEncoder().encode('Look ').length);
assert.equal(shortened.links[0].index.byteEnd, new TextEncoder().encode('Look docs.bsky.app/docs/advance...').length);
assert.equal(applyShortLinks(shortened.text).links.length, 0);
assert.equal(applyShortLinks(shortened.text).text, shortened.text);
assert.equal(applyShortLinks('see https://[').links.length, 0);
assert.equal(graphemeLength(applyShortLinks(withoutTrailingUrl(`Hello\n${longUrl}`)).text), 5);
assert.equal(graphemeLength(applyShortLinks(`Hello ${longUrl}`).text), graphemeLength('Hello docs.bsky.app/docs/advance...'));
const nearLimit = `${'A'.repeat(280)}\n${longUrl}`;
assert.equal(omitTrailingPostLink(nearLimit, {}), true);
assert.equal(graphemeLength(applyShortLinks(withoutTrailingUrl(nearLimit)).text), 280);
assert.equal(omitTrailingPostLink(nearLimit, { images: true }), false);
assert.equal(omitTrailingPostLink(nearLimit, { video: true }), false);
assert.equal(omitTrailingPostLink(nearLimit, { gif: true }), false);
assert.equal(omitTrailingPostLink(nearLimit, { images: true, card: 'external' }), false);
assert.equal(omitTrailingPostLink(nearLimit, { video: true, card: 'quote' }), true);
assert.equal(omitTrailingPostLink(nearLimit, { images: true, card: 'quote' }), true);
assert.equal(omitTrailingPostLink(nearLimit, { dismissed: true }), false);
assert.equal(omitTrailingPostLink(nearLimit, { missed: true }), false);
assert.equal(omitTrailingPostLink(nearLimit, { quote: true }), false);
const keptMedia = applyShortLinks(nearLimit).text;
assert.equal(graphemeLength(keptMedia) > 300, true);
assert.equal(graphemeLength(applyShortLinks(`${'A'.repeat(250)}\n${longUrl}`).text) <= 300, true);
const keptPunct = applyShortLinks('Look https://example.com/path.');
assert.equal(keptPunct.text, 'Look example.com/path.');
assert.equal(keptPunct.links[0].features[0].uri, 'https://example.com/path');
const emojiLink = richText('https://example.com/a👍', null, { links: false, breaks: false });
assert.match(emojiLink, /facet link">https:\/\/example.com\/a</);
assert.match(emojiLink, /👍/);
assert.doesNotMatch(emojiLink, /facet link">https:\/\/example.com\/a👍/);
const plainLink = await facetsFor('Look https://example.com/path.');
assert.equal(plainLink[0].features[0].uri, 'https://example.com/path');
const emojiFacet = await facetsFor('Go https://example.com/a👍 now');
assert.equal(emojiFacet[0].features[0].uri, 'https://example.com/a');
const newTag = await facetsFor('#LibreSky');
assert.equal(newTag.length, 1);
assert.equal(newTag[0].features[0].$type, 'app.bsky.richtext.facet#tag');
assert.equal(newTag[0].features[0].tag, 'LibreSky');
assert.equal(newTag[0].index.byteStart, 0);
assert.equal((await facetsFor('#123')).length, 0);
assert.equal((await facetsFor('＃LibreSky'))[0].features[0].tag, 'LibreSky');
assert.equal((await facetsFor('$aapl'))[0].features[0].tag, '$AAPL');
const emojiHash = await facetsFor('😀#LibreSky');
assert.equal(emojiHash[0].features[0].tag, 'LibreSky');
assert.equal(emojiHash[0].index.byteStart, new TextEncoder().encode('😀').length);
assert.equal((await facetsFor('#1a'))[0].features[0].tag, '1a');
const homeHtml = `<title>The White Witch™</title>
<img src="/assets/images/banner.jpg" alt="The White Witch banner">
<img src="https://thewhitewitchtm.github.io/whitewitch/assets/images/og.jpg" alt="" width="1200" height="630">
<img src="https://thewhitewitchtm.github.io/emojigames/assets/images/preview.jpg" alt="" width="1200" height="630">`;
assert.equal(pageSummary(homeHtml, 'https://thewhitewitchtm.github.io/').image, 'https://thewhitewitchtm.github.io/whitewitch/assets/images/og.jpg');
assert.equal(pageSummary('<meta property="og:image" content="/cover.jpg"><img src="https://cdn.example/other.jpg" width="1200" height="630">', 'https://example.com/posts/1').image, 'https://example.com/cover.jpg');

const cleanupNow = Date.parse('2026-10-21T12:00:00Z');
const cleanupDay = 24 * 60 * 60 * 1000;
const quietFollow = { handle: 'quiet.bsky.social', displayName: 'Quiet', followers: 12, mutual: false, replyAt: 0 };
const starFollow = { handle: 'star.bsky.social', displayName: 'Star', followers: 20000, mutual: true, replyAt: cleanupNow - 2 * cleanupDay };
const palFollow = { handle: 'pal.bsky.social', displayName: 'Pal', followers: 400, mutual: true, replyAt: cleanupNow - 40 * cleanupDay };
assert.equal(followCleanupMatch(quietFollow, { popularity: 'under-100', mutual: 'no', reply: 'none', replyReady: true }, cleanupNow), true);
assert.equal(followCleanupMatch(quietFollow, { reply: 'none' }, cleanupNow), false);
assert.equal(followCleanupMatch({ ...quietFollow, followers: 100 }, { popularity: 'under-100' }, cleanupNow), false);
assert.equal(followCleanupMatch(starFollow, { popularity: 'under-100' }, cleanupNow), false);
assert.equal(followCleanupMatch(starFollow, { popularity: 'over-10k', mutual: 'yes' }, cleanupNow), true);
assert.equal(followCleanupMatch(palFollow, { popularity: 'under-1k', reply: '30' }, cleanupNow), true);
assert.equal(followCleanupMatch(palFollow, { reply: '90' }, cleanupNow), false);
assert.equal(followCleanupMatch(starFollow, { reply: '30' }, cleanupNow), false);
assert.equal(followCleanupMatch(quietFollow, { reply: '365', replyReady: true }, cleanupNow), true);
assert.equal(followCleanupMatch(starFollow, { q: '@Star' }, cleanupNow), true);
assert.equal(followCleanupMatch(starFollow, { q: 'quiet' }, cleanupNow), false);
const spamFollow = {
  handle: 'xq7k2m9p4t.bsky.social',
  displayName: '',
  description: 'follow back f4f',
  avatar: '',
  followers: 2,
  follows: 1800,
  posts: 0,
  createdAt: cleanupNow - 2 * cleanupDay,
  mutual: false,
  replyAt: 0,
  followedAt: cleanupNow - cleanupDay,
};
const neighbor = {
  did: 'did:neighbor',
  handle: 'neighbor.bsky.social',
  displayName: 'Neighbor',
  description: 'I post about birds.',
  avatar: 'https://example.com/a.jpg',
  followers: 80,
  follows: 40,
  posts: 120,
  createdAt: cleanupNow - 400 * cleanupDay,
  mutual: true,
  followedAt: cleanupNow - 20 * cleanupDay,
};
const bareFollow = { handle: 'bare.bsky.social', displayName: 'Bare', description: '', avatar: '', followers: 4, posts: 1, mutual: false, followedAt: cleanupNow - 3 * cleanupDay };
assert.equal(followSpam(spamFollow, cleanupNow).likely, true);
assert.equal(followSpam(neighbor, cleanupNow).likely, false);
assert.equal(followSpam(bareFollow, cleanupNow).bare, true);
assert.equal(followSpam(bareFollow, cleanupNow).likely, false);
assert.equal(followCleanupMatch(spamFollow, { spam: 'likely' }, cleanupNow), true);
assert.equal(followCleanupMatch(neighbor, { spam: 'likely' }, cleanupNow), false);
assert.equal(followCleanupMatch(bareFollow, { spam: 'bare' }, cleanupNow), true);
assert.equal(followCleanupMatch(spamFollow, { spam: 'accident' }, cleanupNow), true);
assert.equal(followCleanupMatch({ ...spamFollow, mutual: true }, { spam: 'accident' }, cleanupNow), false);
assert.equal(followCleanupMatch(spamFollow, { recent: '7', datesReady: true }, cleanupNow), true);
assert.equal(followCleanupMatch(neighbor, { recent: '7', datesReady: true }, cleanupNow), false);
assert.equal(followCleanupMatch({ ...spamFollow, followedAt: 0 }, { recent: '7' }, cleanupNow), false);
assert.equal(shouldFollowBack(spamFollow, { skipSpam: true, now: cleanupNow }).yes, false);
assert.equal(shouldFollowBack(neighbor, { skipSpam: true, now: cleanupNow }).yes, true);
assert.equal(shouldFollowBack({ ...neighbor, followingUri: 'at://did/app.bsky.graph.follow/1' }, { now: cleanupNow }).yes, false);
assert.equal(shouldFollowBack(neighbor, { held: true, now: cleanupNow }).reason, 'You unfollowed them');
const replyHits = replyTargets({
  post: {
    indexedAt: '2026-10-01T00:00:00.000Z',
    record: {
      reply: {
        parent: { uri: 'at://did:parent/app.bsky.feed.post/a' },
        root: { uri: 'at://did:root/app.bsky.feed.post/b' },
      },
    },
  },
  reply: {
    parent: { uri: 'at://did:parent/app.bsky.feed.post/a', author: { did: 'did:parent' } },
    root: { notFound: true, uri: 'at://did:root/app.bsky.feed.post/b' },
  },
}, 'did:me');
assert.deepEqual(replyHits.map((item) => item.did).sort(), ['did:parent', 'did:root']);
assert.equal(replyHits[0].at, Date.parse('2026-10-01T00:00:00.000Z'));
assert.equal(replyTargets({
  post: {
    record: {
      createdAt: '2026-10-01T00:00:00.000Z',
      reply: {
        parent: { uri: 'at://did:me/app.bsky.feed.post/a' },
        root: { uri: 'at://did:me/app.bsky.feed.post/a' },
      },
    },
  },
}, 'did:me').length, 0);
assert.equal(replyTargets({ post: { record: { text: 'hi', createdAt: '2026-10-01T00:00:00.000Z' } } }, 'did:me').length, 0);

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
assert.match(rendered, /data-act="account-card"/);
assert.doesNotMatch(rendered, /<a class="avatar-link"/);
const videoPost = postHtml({
  post: {
    uri: 'at://did:x/app.bsky.feed.post/v',
    cid: 'cid',
    author: { did: 'did:x', handle: 'me.bsky.social' },
    record: { text: 'clip', createdAt: '2026-10-21T11:31:16.741Z' },
    embed: {
      $type: 'app.bsky.embed.video#view',
      playlist: 'https://video.bsky.app/watch/did%3Aplc%3Aexample/bafkrei/playlist.m3u8',
      thumbnail: 'https://video.bsky.app/watch/did%3Aplc%3Aexample/bafkrei/thumbnail.jpg',
      alt: 'A portrait clip',
      aspectRatio: { width: 720, height: 1280 },
    },
  },
});
assert.match(videoPost, /class="video"/);
assert.match(videoPost, /--vw:720;--vh:1280/);
assert.match(videoPost, /playlist\.m3u8/);
assert.match(videoPost, /alt="A portrait clip"/);
const tallVideo = postHtml({
  post: {
    uri: 'at://did:x/app.bsky.feed.post/tall',
    cid: 'cid',
    author: { did: 'did:x', handle: 'me.bsky.social' },
    record: { text: 'tall', createdAt: '2026-10-21T11:31:16.741Z' },
    embed: {
      $type: 'app.bsky.embed.video#view',
      playlist: 'https://video.bsky.app/watch/did%3Aplc%3Aexample/bafkrei/playlist.m3u8',
      aspectRatio: { width: 100, height: 400 },
    },
  },
});
assert.match(tallVideo, /--vw:200;--vh:400/);
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
const grokAllowed = new Set(['js/ai.js', 'js/app.js', 'README.md', 'CHANGES.md']);
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
assert.match(index, /id="call-mute"/);
assert.match(index, /id="call-camera"/);
assert.match(index, /id="call-clock"/);
assert.match(index, /data-act="compose-ai"/);
assert.match(index, /data-act="use-ai-draft"/);
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
assert.match(appSource, /id="chat-mic"/);
assert.match(appSource, /class="chat-thread"/);
assert.match(appSource, /pinChatEnd/);
assert.match(appSource, /dictateLimit\(field\)/);
const appCss = await readFile(path.join(root, 'css/app.css'), 'utf8');
assert.match(appCss, /\.chat-thread > \.messages/);
assert.match(await readFile(path.join(root, 'js/icons.js'), 'utf8'), /mic:/);
assert.match(appSource, /data-act="follow-back"/);
assert.doesNotMatch(appSource.slice(appSource.indexOf('async function followAllBack'), appSource.indexOf('async function markEveryChatRead')), /confirm\(/);
assert.match(appSource, /id="new-chat"/);
assert.match(appSource, /id="new-chat-handle"/);
assert.doesNotMatch(appSource.slice(appSource.indexOf('async function newChat'), appSource.indexOf('let lightbox')), /prompt\(/);
assert.match(appSource, /data-act="ai-find"/);
assert.match(appSource, /data-act="flags"/);
assert.match(appSource, /id="ai-local-form"/);
assert.match(appSource, /data-act="ai-settings"/);
assert.match(appSource, /class="ai-model-pop"/);
assert.doesNotMatch(appSource, /data-act="ai-setup"/);
assert.match(appSource, /normalizeSentMessage/);
assert.match(index, /data-act="flags"/);
assert.match(await readFile(path.join(root, 'js/ai.js'), 'utf8'), /libresky\.localAi/);
assert.match(await readFile(path.join(root, 'desktop/main.cjs'), 'utf8'), /\/local-ai\//);
assert.match(index, /id="head-support"/);
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
assert.match(index, /id="head-config"/);
assert.match(index, /aria-label="Page config"/);
assert.doesNotMatch(index, /class="head-post"[\s\S]{0,240}<span>Post<\/span>/);
assert.match(index, /id="to-top"[^>]*hidden/);
assert.match(appSource, /function syncToTop/);
assert.match(appSource, /y > TOP_AFTER && !freshPopupOpen\(\)/);
const searchView = appSource.slice(appSource.indexOf('async function showSearch'), appSource.indexOf('async function paintExplore'));
assert.doesNotMatch(searchView, /sortHtml|search-sort|search-controls/);
assert.match(appSource, /data-sort="latest"/);
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
assert.match(appSource, /openSettings\('notifications'\)/);
assert.match(appSource, /openSettings\('ai'\)/);
assert.match(appSource, /openSettingsForPage/);
assert.match(appSource, /loginForAppPasswords/);
assert.match(await readFile(path.join(root, 'js/api.js'), 'utf8'), /app\.bsky\.notification\.putPreferencesV2/);
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
assert.match(index, /data-nav="messages"[\s\S]*data-nav="calls"[\s\S]*data-nav="bookmarks"[\s\S]*data-nav="profile"[\s\S]*data-nav="ai"[\s\S]*id="more-btn"/);
assert.match(index, /id="searches"/);
assert.match(appSource, /Save this search/);
assert.match(appSource, /edit-searches/);
const paintSearch = appSource.slice(appSource.indexOf('function paintSearchTabs'), appSource.indexOf('function searchPageHtml'));
assert.match(paintSearch, /menuAct: 'search-menu'/);
const searchPageFn = appSource.slice(appSource.indexOf('function searchPageHtml'), appSource.indexOf('function preferLive'));
assert.doesNotMatch(searchPageFn, /search-menu/);
const savedTabs = normalizeSearchTabs([
  { kind: 'term', id: 'abcd12', label: '  Cats  ', q: '  cats ' },
  { kind: 'topic', id: 'news' },
  { kind: 'topic', id: 'nope' },
  { kind: 'term', q: 'cats', label: 'Dup' },
  { kind: 'term', q: '   ', label: 'Empty' },
  { kind: 'topic', id: 'foryou' },
]);
assert.equal(savedTabs[0].id, 'foryou');
assert.equal(savedTabs[1].kind, 'term');
assert.equal(savedTabs[1].q, 'cats');
assert.equal(savedTabs[1].label, 'Cats');
assert.equal(savedTabs[2].id, 'news');
assert.equal(savedTabs.length, 3);
const shelf = normalizeSearchTabs([
  { kind: 'posts', id: 'ukraine' },
  { kind: 'posts', id: 'nope' },
  { kind: 'link', id: 'sociallydead' },
  { kind: 'link', id: 'evil' },
  { kind: 'posts', id: 'ukraine' },
  { kind: 'topic', id: 'news' },
]);
assert.deepEqual(shelf.map((item) => `${item.kind}:${item.id}`), ['topic:foryou', 'posts:ukraine', 'link:sociallydead', 'topic:news']);
const defaults = defaultSearchTabs();
assert.equal(defaults[0].id, 'foryou');
assert.deepEqual(defaults[1], { kind: 'posts', id: 'ukraine' });
assert.equal(defaults.at(-1).kind, 'link');
assert.equal(defaults.at(-1).id, 'sociallydead');
assert.equal(SEARCH_POSTS.find((item) => item.id === 'ukraine').q, 'Ukraine OR Україна');
assert.equal(SEARCH_LINKS.find((item) => item.id === 'sociallydead').href, 'https://thewhitewitchtm.github.io/sociallydead/');
const migrated = settleSearchTabs({ tabs: [{ kind: 'topic', id: 'news' }] });
assert.equal(migrated.rev, 2);
assert.equal(migrated.tabs[1].id, 'ukraine');
assert.equal(migrated.tabs.at(-1).id, 'sociallydead');
const keptOff = settleSearchTabs({ rev: 2, tabs: [{ kind: 'topic', id: 'news' }] });
assert.deepEqual(keptOff.tabs.map((item) => item.id), ['foryou', 'news']);
assert.match(appSource, /tab-flag/);
assert.match(appSource, /opens in a new tab/);
assert.match(appSource, /search-posts/);
assert.match(index, /id="more-btn"[\s\S]*?<path fill="currentColor" d="M12 2\.75a9\.25/);
assert.match(appSource, /nav: 'calls'/);
assert.doesNotMatch(appSource, /paintCallTools/);
const moreMenu = appSource.slice(appSource.indexOf('const MORE_LINKS'), appSource.indexOf('function openMoreMenu'));
assert.match(moreMenu, /go-lists/);
assert.doesNotMatch(moreMenu, /go-bookmarks|go-ai|go-calls|go-downloads/);
assert.doesNotMatch(appSource, /Coming soon/);
assert.match(appSource, /@ai and @si/);
assert.match(appSource, /id="ai-form"/);
assert.match(appSource, /ai-key-list/);
assert.match(appSource, /free public model/);
assert.match(appSource, /messagesForConvo/);
assert.match(appSource, /id="chat-text" rows="1"/);
const chatAt = appSource.indexOf('id="chat-form"');
const chatForm = appSource.slice(chatAt, appSource.indexOf('clearChatCallChrome()', chatAt));
assert.ok(chatForm.length > 40);
assert.doesNotMatch(chatForm, /chat-hint|Enter adds a line|Shift\+Enter sends\./);
assert.doesNotMatch(chatForm, /call-audio|call-video|Voice call|Video call/);
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
assert.match(index, /data-style="bold"/);
assert.match(index, /data-style="italic"/);
assert.match(index, /data-style="strike"/);
assert.match(index, /data-style="mono"/);
assert.match(index, /data-act="emoji"[^>]*aria-expanded="false"/);
assert.match(appSource, /id="chat-picker"/);
assert.match(appSource, /\['mono', 'M', 'Monospace'\]/);
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
assert.equal(requestEntryHtml(0), '');
assert.equal(requestEntryHtml(0, []), '');
assert.match(requestEntryHtml(2), /Message requests/);
assert.match(requestEntryHtml(2), /#\/messages\/requests/);
assert.match(requestEntryHtml(2), /did not load/);
assert.doesNotMatch(requestEntryHtml(0), /data-initial="R"/);
const adaRequest = requestEntryHtml(1, [{ name: 'Ada', avatar: '' }]);
assert.match(adaRequest, /Ada is waiting/);
assert.match(adaRequest, /data-initial="A"/);
assert.match(adaRequest, /#\/messages\/requests/);
const keptRequest = partitionConvos({
  accepted: { convos: [{ id: 'a', status: 'accepted' }, { id: 'r', status: 'request', members: [{ did: 'did:them', displayName: 'Ada' }] }] },
  legacyRequests: { convos: [] },
  requestItems: [],
});
assert.deepEqual(keptRequest.main.map((convo) => convo.id), ['a']);
assert.equal(keptRequest.requests[0].id, 'r');
const freshRequest = partitionConvos({
  accepted: { convos: [{ id: 'a', status: 'accepted' }] },
  legacyRequests: { convos: [] },
  requestItems: [{ id: 'req', status: 'request', members: [{ did: 'did:them', displayName: 'Ada' }] }],
});
assert.equal(freshRequest.requests[0].id, 'req');
assert.equal(freshRequest.main.length, 1);
const echoed = partitionConvos({
  accepted: { convos: [{ id: 'a', status: 'accepted' }, { id: 'b', status: 'accepted' }] },
  legacyRequests: { convos: [{ id: 'a', status: 'accepted' }, { id: 'b', status: 'accepted' }] },
  requestItems: null,
});
assert.equal(echoed.requests.length, 0);
assert.equal(echoed.main.length, 2);
const joined = partitionConvos({
  accepted: { convos: [] },
  legacyRequests: null,
  requestItems: [{ $type: 'chat.bsky.group.defs#joinRequestConvoView', convoId: 'g1', name: 'Club', owner: { did: 'did:o', displayName: 'Owner' } }],
});
assert.equal(joined.requests.length, 0);
assert.equal(joined.joins[0].convoId, 'g1');
assert.match(joinRequestHtml(joined.joins[0]), /data-act="withdraw-join"/);
assert.match(joinRequestHtml(joined.joins[0]), /Club/);
const nestedRequest = partitionConvos({
  accepted: { convos: [] },
  legacyRequests: { convos: [] },
  requestItems: [{ convo: { id: 'wrap', status: 'request', members: [{ did: 'did:them', displayName: 'Ada' }], lastMessage: { text: 'hi', sender: { did: 'did:them' } } } }],
});
assert.equal(nestedRequest.requests[0].id, 'wrap');
assert.equal(nestedRequest.requests[0].lastMessage.text, 'hi');
assert.equal(normalizeConvoItem({ convoId: 'x1', members: [{ did: 'did:them' }] }).id, 'x1');
assert.deepEqual(messagesForConvo({ messages: [{ text: 'new' }, { text: 'old' }] }, { lastMessage: { text: 'preview' } }).map((row) => row.text), ['old', 'new']);
assert.equal(messagesForConvo({ messages: [] }, { lastMessage: { text: 'preview' } })[0].text, 'preview');
assert.match(messageHtml({ $type: 'chat.bsky.convo.defs#systemMessageView', id: 's1', message: { text: 'Joined the group' } }, 'did:me'), /Joined the group/);
assert.match(messageHtml({ text: 'hello from a request', sender: { did: 'did:them' } }, 'did:me'), /hello from a request/);
const faces = requestPeople(freshRequest.requests, joined.joins, 'did:me');
assert.equal(faces[0].name, 'Ada');
assert.equal(faces[1].name, 'Club');
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
assert.match(appSource, /const banner = homeLead\(''\)/);
assert.doesNotMatch(appSource, /homeLead\(homePrompt\(\)\)/);
assert.doesNotMatch(appSource, /postingTarget/);
assert.doesNotMatch(appSource, /prompt-note/);
assert.match(appSource, /<span>What's up\?<\/span>/);
assert.match(appSource, /function paintHomeCompose/);
const homeChrome = appSource.slice(appSource.indexOf('function paintHomeChrome'), appSource.indexOf('async function loadHomeLanes'));
assert.match(homeChrome, /compose: true/);
const column = index.slice(index.indexOf('<main class="center"'), index.indexOf('id="fresh"'));
const composeAt = column.indexOf('id="home-compose"');
const headAt = column.indexOf('class="sticky-head"');
const tabsAt = column.indexOf('id="tabs"');
assert.ok(composeAt !== -1 && composeAt < headAt && headAt < tabsAt);
assert.equal(column.slice(headAt, tabsAt).includes('id="home-compose"'), false);
assert.match(appCss, /\.sticky-head:has\(#tabs\[hidden\]\)/);
assert.doesNotMatch(appCss, /#home-compose:not\(\[hidden\]\)/);
const goldAuthor = (did, status) => ({ did, verification: status ? { verifiedStatus: status } : {} });
const goldFeed = (statuses) => statuses.map((status, index) => ({ post: { author: goldAuthor(`did:${index}`, status) } }));
assert.equal(goldFeedGate(goldFeed(['valid', 'valid', 'valid'])), null);
assert.ok(goldFeedGate(goldFeed([...Array(24).fill('valid'), 'none', 'none', 'none'])));
assert.equal(goldFeedGate(goldFeed([...Array(6).fill('valid'), ...Array(23).fill('none')])), null);
assert.equal(goldFeedGate([
  { post: { author: goldAuthor('did:poster', 'valid') }, reason: { by: goldAuthor('did:reposter', 'none') } },
  { post: { author: goldAuthor('did:other', 'none') } },
  ...Array.from({ length: 7 }, (_, index) => ({ post: { author: goldAuthor(`did:gold${index}`, 'valid') } })),
]), null);
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
assert.match(started, /hidden/);
assert.match(started, /data-id="m1"/);
assert.doesNotMatch(started, /msg-header|Started a voice call|Voice|Video|class="bubble|data-act="call-accept"|example\.com/);
const incoming = messageHtml({ id: 'm9', text: 'new from them', sender: { did: 'did:them' } }, 'did:me', { fresh: true });
assert.match(incoming, /class="bubble fresh"/);
assert.doesNotMatch(incoming, /bubble mine/);
const liveVideo = messageHtml({
  id: 'm10',
  text: 'Started a video call https://example.com/#/c/2222222222222',
  sender: { did: 'did:them' },
}, 'did:me', { liveRkey: '2222222222222', convoId: 'room', peerDid: 'did:them' });
assert.match(liveVideo, /hidden/);
assert.doesNotMatch(liveVideo, /msg-header|Started a video call|Voice|Video|data-act="call-accept"|data-act="call-decline"|example\.com/);
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
assert.equal((quietCalls.match(/Ada/g) || []).length, 2);
assert.match(quietCalls, />Ada</);
assert.doesNotMatch(quietCalls, /chat-title-handle|class="handle"|@ada\.bsky\.social|<strong>/);
const handleOnly = chatHeaderHtml({ did: 'did:x', handle: 'ada.bsky.social' });
assert.match(handleOnly, />ada</);
assert.doesNotMatch(handleOnly, />ada\.bsky\.social</);
assert.doesNotMatch(handleOnly, /chat-title-handle|class="handle"|@ada/);
const handleAsName = chatHeaderHtml({ did: 'did:x', handle: 'ada.bsky.social', displayName: '@ada.bsky.social' });
assert.match(handleAsName, />ada</);
assert.doesNotMatch(handleAsName, />@?ada\.bsky\.social</);
assert.doesNotMatch(quietCalls, /class="call-pair"/);
assert.doesNotMatch(quietCalls, /data-act="call-audio"/);
assert.doesNotMatch(quietCalls, /data-act="call-video"/);
assert.doesNotMatch(quietCalls, /Voice/);
assert.doesNotMatch(quietCalls, /Video/);
assert.match(quietCalls, /data-act="account-card"/);
assert.match(quietCalls, /href="#\/profile\/ada\.bsky\.social"/);
const personRow = actorHtml({
  did: 'did:ada',
  handle: 'ada.bsky.social',
  displayName: 'Ada',
  description: 'Cats and clouds',
}, { follow: true, self: 'did:me' });
const personLink = personRow.match(/<a class="person-link"[\s\S]*?<\/a>/);
assert.ok(personLink);
assert.doesNotMatch(personLink[0], /data-act="follow"/);
assert.doesNotMatch(personLink[0], /data-act="account-card"/);
assert.match(personRow, /data-act="account-card"/);
assert.match(personRow, /data-act="follow"/);
assert.match(appSource, /function avatarHoverTarget/);
assert.match(appSource, /document.addEventListener\('pointerover', scheduleHover\)/);
assert.doesNotMatch(appSource, /closest\?\.\('a\[href\^="#\/profile\/"\]'\)/);
const card = hoverCardHtml({ did: 'did:ada', handle: 'ada.bsky.social', displayName: 'Ada', description: 'Hello', followersCount: 3, followsCount: 1 }, 'did:me');
assert.match(card, /data-act="follow"/);
assert.match(card, /Hello/);
assert.doesNotMatch(hoverCardHtml({ did: 'did:me', handle: 'me.bsky.social' }, 'did:me'), /data-act="follow"/);
const goneCalls = chatHeaderHtml({ did: 'did:gone', handle: 'handle.invalid' });
assert.match(goneCalls, /Deleted account/);
assert.doesNotMatch(goneCalls, /call-btn/);
assert.doesNotMatch(goneCalls, /chat-title-handle|class="handle"/);
assert.match(appSource, /function paintChatTitle/);
assert.match(appSource, /fillChatTitle\(cachedOther, token\)/);
assert.match(appSource, /fillChatTitle\(other, token\)/);
assert.match(appSource, /chatTitleNeedsProfile/);
assert.match(appCss, /\.page-icon \.avatar \{ width: 26px; height: 26px; \}/);
assert.doesNotMatch(appCss, /person-title|chat-title-handle/);
const packRow = packHtml({
  uri: 'at://did:example/app.bsky.graph.starterpack/abc',
  record: { name: 'Cats', description: 'meow' },
  creator: { handle: 'ada.bsky.social', displayName: 'Ada' },
  list: { listItemCount: 3 },
});
assert.match(packRow, /Cats/);
assert.match(packRow, /#\/pack\//);

console.log(`smoke ok (${payload.feed.length} live posts, first @${handle})`);
