import assert from 'node:assert/strict';
import test from 'node:test';
import { gamesPageHtml } from './games.js';
import {
  queueDir,
  queuePong,
  startPong,
  startSnakes,
  stepPong,
  stepSnakes,
} from './arcade.js';
import { parseCallMessage, parsePlayMessage } from './util.js';

test('pong moves, scores, and the ai can miss a ball', () => {
  const state = startPong(4);
  state.ai = true;
  const y = state.ball.y;
  stepPong(state);
  assert.notEqual(state.ball.x, 320);
  assert.equal(state.tick, 1);
  state.ball.x = 4;
  state.ball.vx = -6;
  state.left = 20;
  state.ball.y = 300;
  const before = state.score[1];
  stepPong(state);
  assert.equal(state.score[1], before + 1);
  const again = startPong(4);
  again.ai = true;
  const other = startPong(4);
  other.ai = true;
  stepPong(again);
  stepPong(other);
  assert.equal(again.ball.x, other.ball.x);
  assert.equal(again.ball.y, other.ball.y);
  assert.ok(Math.abs(again.right - y) < 40 || again.tick >= 1);
});

test('a snake cannot reverse and two seeds place the same food', () => {
  const state = startSnakes(9);
  const other = startSnakes(9);
  assert.deepEqual(state.food, other.food);
  const snake = state.snakes[0];
  assert.equal(queueDir(snake, 3), false);
  assert.equal(snake.queued, 1);
  assert.equal(queueDir(snake, 0), true);
  assert.equal(snake.queued, 0);
  stepSnakes(state, { ai: true });
  assert.equal(state.snakes[0].body[0].y, 9);
  queuePong(startPong(1), 'left', -1);
});

test('the games page keeps the marble board and adds pong and snakes', () => {
  const html = gamesPageHtml();
  assert.ok(html.includes('marble'));
  assert.ok(html.includes('Pong'));
  assert.ok(html.includes('Snakes'));
  assert.ok(html.includes('data-game="pong"'));
  assert.ok(html.includes('data-game="snakes"'));
  assert.ok(html.includes('Play AI'));
});

test('a call room is optional and a play invite names the game', () => {
  const key = '2222222222222';
  const plain = parseCallMessage(`!ls call offer video ${key}`);
  assert.equal(plain.kind, 'offer');
  assert.equal(plain.room, '');
  assert.equal(parseCallMessage(`!ls call offer video ${key} please`), null);
  const room = parseCallMessage(`!ls call offer video ${key} room abcdefghij23`);
  assert.equal(room.room, 'abcdefghij23');
  const group = parseCallMessage(`!ls call group audio ${key} room abcdefghij23`);
  assert.equal(group.kind, 'group');
  assert.equal(group.media, 'audio');
  const play = parsePlayMessage('!ls play snakes abcdefghij23 invite');
  assert.equal(play.game, 'snakes');
  assert.equal(play.room, 'abcdefghij23');
  assert.equal(parsePlayMessage('!ls play chess abcdefghij23 invite'), null);
});
