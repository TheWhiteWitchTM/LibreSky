import assert from 'node:assert/strict';
import test from 'node:test';
import {
  groupInfo,
  joinCodeFromText,
  liveStatusActive,
  liveUriAllowed,
  livestreamView,
  followBackDue,
  needsFollowBack,
  notesHaveFollowBack,
  streamPlayer,
  systemMessageLine,
} from './util.js';

test('follow back is only for people you do not already follow', () => {
  const self = 'did:plc:me';
  assert.equal(needsFollowBack({ did: 'did:plc:a', viewer: {} }, self), true);
  assert.equal(needsFollowBack({ did: 'did:plc:a', viewer: { following: 'at://follow' } }, self), false);
  assert.equal(needsFollowBack({ did: 'did:plc:a', viewer: { blocking: 'at://block' } }, self), false);
  assert.equal(needsFollowBack({ did: self, viewer: {} }, self), false);
  assert.equal(needsFollowBack({ did: 'did:plc:a' }, self), false);
  const notes = [
    { reason: 'like', author: { did: 'did:plc:a', viewer: {} } },
    { reason: 'follow', author: { did: 'did:plc:b', viewer: { following: 'at://x' } } },
  ];
  assert.equal(notesHaveFollowBack(notes, self), false);
  notes.push({ reason: 'follow', author: { did: 'did:plc:c', viewer: {} } });
  assert.equal(notesHaveFollowBack(notes, self), true);
  const actor = { did: 'did:plc:c', viewer: {} };
  assert.equal(followBackDue(actor, self, null), true);
  assert.equal(followBackDue(actor, self, new Set(['did:plc:c'])), false);
  assert.equal(followBackDue({ did: 'did:plc:c', viewer: { following: 'at://x' } }, self, null), false);
  assert.equal(followBackDue({ did: 'did:plc:c' }, self, null), false);
});

test('a live badge stays up until it expires and only for a stream host', () => {
  const now = Date.parse('2026-11-22T12:00:00.000Z');
  const live = {
    status: 'app.bsky.actor.status#live',
    isActive: true,
    expiresAt: '2026-11-22T13:00:00.000Z',
    embed: { external: { uri: 'https://twitch.tv/mira' } },
  };
  assert.equal(liveStatusActive(live, now), true);
  assert.equal(liveStatusActive({ ...live, expiresAt: '2026-11-22T11:00:00.000Z' }, now), false);
  assert.equal(liveStatusActive({ ...live, isActive: false }, now), false);
  assert.equal(liveUriAllowed('https://www.twitch.tv/mira'), true);
  assert.equal(liveUriAllowed('https://youtu.be/abc'), true);
  assert.equal(liveUriAllowed('https://example.com/live'), false);
  assert.equal(liveUriAllowed('https://streams.example.com/x', ['example.com']), true);
});

test('twitch and youtube open in a player', () => {
  const twitch = streamPlayer('https://twitch.tv/mira', 'libresky.example');
  assert.equal(twitch.kind, 'frame');
  assert.match(twitch.frame, /channel=mira/);
  assert.match(twitch.frame, /parent=libresky\.example/);
  const youtube = streamPlayer('https://www.youtube.com/watch?v=abc123', 'localhost');
  assert.equal(youtube.kind, 'frame');
  assert.match(youtube.frame, /embed\/abc123/);
  assert.equal(streamPlayer('https://stream.place/mira').kind, 'link');
});

test('group chats are named separately from direct chats', () => {
  assert.equal(groupInfo({ kind: { $type: 'chat.bsky.convo.defs#directConvo' } }), null);
  const group = groupInfo({ kind: { $type: 'chat.bsky.convo.defs#groupConvo', name: 'Night' } });
  assert.equal(group.name, 'Night');
});

test('group system lines and join codes', () => {
  const names = (did) => ({ 'did:plc:a': 'Ada', 'did:plc:b': 'Bea' }[did]);
  const line = systemMessageLine({
    $type: 'chat.bsky.convo.defs#systemMessageDataAddMember',
    addedBy: { did: 'did:plc:a' },
    member: { did: 'did:plc:b' },
  }, names);
  assert.equal(line, 'Ada added Bea');
  assert.equal(joinCodeFromText('https://bsky.app/messages/join/abc_123'), 'abc_123');
  assert.equal(joinCodeFromText('https://libresky.example/#/join/abc_123'), 'abc_123');
  assert.equal(joinCodeFromText('https://example.com/post/1'), '');
});

test('a livestream embed is not a plain link card', () => {
  const stream = livestreamView({
    $type: 'app.bsky.embed.external#view',
    external: {
      $type: 'app.bsky.embed.external#viewLivestream',
      uri: 'https://stream.place/mira',
      title: 'On air',
      description: '',
      active: true,
    },
  });
  assert.equal(stream.active, true);
  assert.equal(livestreamView({
    $type: 'app.bsky.embed.external#view',
    external: { uri: 'https://example.com', title: 'Site', description: '' },
  }), null);
});
